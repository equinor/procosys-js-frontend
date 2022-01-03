import React, { useEffect, useRef, useState } from 'react';
import { PreservedTag, RequirementType } from '../types';
import { MainContainer } from './Shared components/Dialogs.style';
import { InputContainer } from './UpdateRequirementsDialog.style';
import { ProjectDetails } from '@procosys/modules/Preservation/types';
import { TextField } from '@equinor/eds-core-react';
import { Canceler } from 'axios';
import { usePreservationContext } from '@procosys/modules/Preservation/context/PreservationContext';
import { TagDetails } from '../TagFlyout/types';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import RequirementsSelector from '@procosys/modules/Preservation/components/RequirementsSelector/RequirementsSelector';
import { useDirtyContext } from '@procosys/core/DirtyContext';
import {
    ButtonContainer,
    Content,
    DialogContainer,
    Divider,
    Scrim,
    Title,
} from './RescheduleDialog.style';
import { Typography } from '@equinor/eds-core-react';
import { Button } from '@equinor/eds-core-react';
import Spinner from '@procosys/components/Spinner';

const moduleName = 'PreservationUpdateRequirementsDialog';

interface RequirementFormInput {
    requirementDefinitionId: number;
    intervalWeeks: number;
    requirementId?: number;
    requirementTypeTitle?: string;
    requirementDefinitionTitle?: string;
    editingRequirements?: boolean;
    isVoided?: boolean;
    isDeleted?: boolean;
    rowVersion?: string;
}

interface UpdateRequirementsDialogProps {
    tagId: string;
    open: boolean;
    onClose: () => void;
}

const UpdateRequirementsDialog = ({
    tagId,
    open,
    onClose,
}: UpdateRequirementsDialogProps): JSX.Element => {
    const { apiClient } = usePreservationContext();
    const [tag, setTag] = useState<TagDetails>();
    const [description, setDescription] = useState<string | null>(null);
    const [poTag, setPoTag] = useState<boolean>(false);
    const [rowVersion, setRowVersion] = useState<string>('');
    const [requirementTypes, setRequirementTypes] = useState<RequirementType[]>(
        []
    );
    const [requirements, setRequirements] = useState<RequirementFormInput[]>(
        []
    );
    const [originalRequirements, setOriginalRequirements] = useState<
        RequirementFormInput[]
    >([]);
    const [remarkOrStorageAreaEdited, setRemarkOrStorageAreaEdited] =
        useState<boolean>(false);
    const [
        requirementsOrDescriptionEdited,
        setRequirementsOrDescriptionEdited,
    ] = useState<boolean>(false);
    const [requirementsFetched, setRequirementsFetched] = useState(false);
    const [showSpinner, setShowSpinner] = useState<boolean>(false);
    const { setDirtyStateFor, unsetDirtyStateFor } = useDirtyContext();
    const storageAreaInputRef = useRef<HTMLInputElement>(null);
    const remarkInputRef = useRef<HTMLInputElement>(null);
    const dummyTagTypes = ['PreArea', 'SiteArea', 'PoArea'];

    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            if (tagId) {
                try {
                    const details = await apiClient.getTagDetails(
                        Number.parseInt(tagId),
                        (cancel: Canceler) => (requestCancellor = cancel)
                    );
                    setTag(details);
                    if (details.tagNo.substr(0, 4) == '#PO-') {
                        setPoTag(true);
                    }
                    setRowVersion(details.rowVersion);
                    setDescription(details.description);
                } catch (error) {
                    console.error(
                        'Get tag details failed: ',
                        error.message,
                        error.data
                    );
                    showSnackbarNotification(error.message);
                }
            }
        })();
        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    /** Update global and local dirty state */
    useEffect(() => {
        if (remarkOrStorageAreaEdited) {
            setDirtyStateFor(moduleName);
        } else {
            unsetDirtyStateFor(moduleName);
        }

        return (): void => {
            unsetDirtyStateFor(moduleName);
        };
    }, [remarkOrStorageAreaEdited, requirementsOrDescriptionEdited]);

    /**
     * Get Requirements
     */
    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            if (tagId) {
                try {
                    const response = await apiClient.getTagRequirements(
                        Number.parseInt(tagId),
                        true,
                        true,
                        (cancel: Canceler) => (requestCancellor = cancel)
                    );
                    const mappedResponse = response.map((itm) => {
                        return {
                            requirementDefinitionId: -1,
                            requirementId: itm.id,
                            intervalWeeks: itm.intervalWeeks,
                            requirementTypeTitle: itm.requirementType.title,
                            requirementDefinitionTitle:
                                itm.requirementDefinition.title,
                            editingRequirements: true,
                            isVoided: itm.isVoided,
                            isInUse: itm.isInUse,
                            rowVersion: itm.rowVersion,
                        };
                    });
                    setRequirements([...mappedResponse]);
                    setOriginalRequirements([...mappedResponse]);
                    setRequirementsFetched(true);
                } catch (error) {
                    console.error(
                        'Get requirement failed: ',
                        error.message,
                        error.data
                    );
                    showSnackbarNotification(error.message);
                }
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    /**
     * Get Requirement Types
     */
    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            if (tagId) {
                try {
                    const response = await apiClient.getRequirementTypes(
                        false,
                        (cancel: Canceler) => (requestCancellor = cancel)
                    );
                    setRequirementTypes(response);
                } catch (error) {
                    console.error(
                        'Get requirement types failed: ',
                        error.message,
                        error.data
                    );
                    showSnackbarNotification(error.message);
                }
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    /**
     * Check if any changes have been made to step requirements, or description
     */
    useEffect(() => {
        if (
            tag &&
            (JSON.stringify(requirements) !=
                JSON.stringify(originalRequirements) ||
                (description && description != tag.description))
        ) {
            setRequirementsOrDescriptionEdited(true);
        } else {
            setRequirementsOrDescriptionEdited(false);
        }
    }, [requirements, originalRequirements, description]);

    const remarkOrStorageAreaChange = (): void => {
        if (
            tag &&
            remarkInputRef.current &&
            storageAreaInputRef.current &&
            (remarkInputRef.current.value != tag.remark ||
                storageAreaInputRef.current.value != tag.storageArea)
        ) {
            setRemarkOrStorageAreaEdited(true);
        } else {
            setRemarkOrStorageAreaEdited(false);
        }
    };

    const save = async (): Promise<void> => {
        setShowSpinner(true);
        let currentRowVersion = rowVersion;
        if (remarkOrStorageAreaEdited) {
            try {
                currentRowVersion = await updateRemarkAndStorageArea();
            } catch (error) {
                setShowSpinner(false);
                throw 'error';
            }
        }
        if (requirementsOrDescriptionEdited) {
            try {
                await updateTagJourneyAndRequirements(currentRowVersion);
            } catch (error) {
                setShowSpinner(false);
                throw 'error';
            }
        }
        setShowSpinner(false);
        if (tag) {
            showSnackbarNotification(`Changes to ${tag.tagNo} have been saved`);
        }
        onClose();
    };

    return (
        <Scrim>
            <DialogContainer width={'80vw'}>
                <Title>
                    <Typography variant="h6">
                        Reschedule preservation
                    </Typography>
                </Title>
                <Divider />
                <Content>
                    <InputContainer style={{ maxWidth: '480px' }}>
                        <TextField
                            id={'Description'}
                            label="Tag description"
                            defaultValue={tag ? tag.description : ''}
                            disabled={
                                tag &&
                                tag.tagType &&
                                !dummyTagTypes.includes(tag.tagType)
                            }
                            placeholder={'Write here'}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ): void => setDescription(e.target.value)}
                        />
                    </InputContainer>
                    <InputContainer style={{ maxWidth: '480px' }}>
                        <TextField
                            id={'Remark'}
                            label="Remark for whole preservation journey"
                            defaultValue={tag ? tag.remark : ''}
                            inputRef={remarkInputRef}
                            placeholder={'Write here'}
                            meta="Optional"
                            onChange={remarkOrStorageAreaChange}
                            multiline="true"
                        />
                    </InputContainer>
                    <InputContainer style={{ maxWidth: '150px' }}>
                        <TextField
                            id={'StorageArea'}
                            label="Storage area"
                            defaultValue={tag ? tag.storageArea : ''}
                            inputRef={storageAreaInputRef}
                            placeholder="Write here"
                            meta="Optional"
                            onChange={remarkOrStorageAreaChange}
                        />
                    </InputContainer>
                    <h2>Update requirements</h2>
                    <RequirementsSelector
                        requirementTypes={requirementTypes}
                        requirements={requirements}
                        onChange={(newList): void => setRequirements(newList)}
                    />
                </Content>

                <ButtonContainer>
                    <Button onClick={onClose} variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        onClick={save}
                        color="primary"
                        disabled={!remarkOrStorageAreaEdited}
                    >
                        Save
                    </Button>
                    {showSpinner && <Spinner />}
                </ButtonContainer>
            </DialogContainer>
        </Scrim>
    );
};

export default UpdateRequirementsDialog;
