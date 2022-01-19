import React, { useEffect, useRef, useState } from 'react';
import { RequirementType } from '../types';
import {
    ButtonContainer,
    ButtonSpacer,
    Content,
    DialogContainer,
    Divider,
    Scrim,
    Title,
} from './SharedCode/Dialogs.style';
import { TextField } from '@equinor/eds-core-react';
import { Canceler } from 'axios';
import { usePreservationContext } from '@procosys/modules/Preservation/context/PreservationContext';
import { TagDetails } from '../TagFlyout/types';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import RequirementsSelector from '@procosys/modules/Preservation/components/RequirementsSelector/RequirementsSelector';
import { useDirtyContext } from '@procosys/core/DirtyContext';
import { Typography } from '@equinor/eds-core-react';
import { Button } from '@equinor/eds-core-react';
import Spinner from '@procosys/components/Spinner';
import { ProCoSysApiError } from '@procosys/core/ProCoSysApiError';

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
    open: boolean;
    onClose: () => void;
    tagId?: number;
}
const UpdateRequirementsDialog = ({
    open,
    onClose,
    tagId,
}: UpdateRequirementsDialogProps): JSX.Element | null => {
    if (!open) {
        return null;
    }
    const { apiClient } = usePreservationContext();
    const [tag, setTag] = useState<TagDetails>();
    const [description, setDescription] = useState<string | null>(null);
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
    const [showSpinner, setShowSpinner] = useState<boolean>(false);
    const { setDirtyStateFor, unsetDirtyStateFor } = useDirtyContext();
    const storageAreaInputRef = useRef<HTMLInputElement>(null);
    const remarkInputRef = useRef<HTMLInputElement>(null);
    const dummyTagTypes = ['PreArea', 'SiteArea', 'PoArea'];
    const [validationErrorMessage, setValidationErrorMessage] = useState<
        string | null
    >();

    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            if (tagId) {
                try {
                    const details = await apiClient.getTagDetails(
                        tagId,
                        (cancel: Canceler) => (requestCancellor = cancel)
                    );
                    setTag(details);
                    setRowVersion(details.rowVersion);
                    setDescription(details.description);
                } catch (error) {
                    if (!(error instanceof ProCoSysApiError)) return;
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
        if (remarkOrStorageAreaEdited || requirementsOrDescriptionEdited) {
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
                        tagId,
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
                } catch (error) {
                    if (!(error instanceof ProCoSysApiError)) return;
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
                    if (!(error instanceof ProCoSysApiError)) return;
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
     * Check if any changes have been made to requirements, or description
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

    const updateRemarkAndStorageArea = async (): Promise<string> => {
        try {
            if (tag && remarkInputRef.current && storageAreaInputRef.current) {
                const updatedRowVersion =
                    await apiClient.setRemarkAndStorageArea(
                        tag.id,
                        remarkInputRef.current.value,
                        storageAreaInputRef.current.value,
                        rowVersion
                    );
                setRowVersion(updatedRowVersion);
                return updatedRowVersion;
            }
            return rowVersion;
        } catch (error) {
            if (error instanceof ProCoSysApiError) {
                handleErrorFromBackend(
                    error,
                    'Error updating remark and storage area'
                );
                throw error.message;
            }
            throw new Error();
        }
    };

    const handleErrorFromBackend = (
        error: ProCoSysApiError,
        errorMessageConsole: string
    ): void => {
        if (error.data && error.data.status == 400) {
            console.error(errorMessageConsole, error.message, error.data);
            setValidationErrorMessage(error.message);
            throw showSnackbarNotification(
                'Validation error. Changes are not saved.'
            );
        } else {
            console.error(errorMessageConsole, error.message, error.data);
            throw showSnackbarNotification(error.message);
        }
    };

    const updateRequirementsAndDescription = async (
        currentRowVersion: string
    ): Promise<void> => {
        try {
            if (tag && description) {
                let newRequirements: RequirementFormInput[] = [];
                const numberOfNewReq =
                    requirements.length - originalRequirements.length;
                if (requirements.length > originalRequirements.length) {
                    newRequirements = [...requirements.slice(-numberOfNewReq)];
                }
                const updatedRequirements = requirements
                    .slice(0, originalRequirements.length)
                    .map((req) => {
                        return {
                            requirementId: req.requirementId,
                            intervalWeeks: req.intervalWeeks,
                            isVoided: req.isVoided,
                            rowVersion: req.rowVersion,
                        };
                    });
                const deletedRequirements = requirements
                    .filter((req) => req.isVoided && req.isDeleted)
                    .map((req) => {
                        return {
                            requirementId: req.requirementId,
                            rowVersion: req.rowVersion,
                        };
                    });
                await apiClient.updateTagRequirements(
                    tag.id,
                    description,
                    currentRowVersion,
                    updatedRequirements,
                    newRequirements,
                    deletedRequirements
                );
            }
        } catch (error) {
            if (!(error instanceof ProCoSysApiError)) return;
            handleErrorFromBackend(
                error,
                'Error updating journey, step, requirements, or description'
            );
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
                await updateRequirementsAndDescription(currentRowVersion);
            } catch (error) {
                setShowSpinner(false);
                throw 'error';
            }
        }
        unsetDirtyStateFor(moduleName);
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
                    <Typography variant="h6">Update requirements</Typography>
                </Title>
                <Divider />
                <Content>
                    {validationErrorMessage && (
                        <Typography variant="caption">
                            {validationErrorMessage}
                        </Typography>
                    )}
                    <div style={{ maxWidth: '480px' }}>
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
                    </div>
                    <div style={{ maxWidth: '480px' }}>
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
                    </div>
                    <div style={{ maxWidth: '150px' }}>
                        <TextField
                            id={'StorageArea'}
                            label="Storage area"
                            defaultValue={tag ? tag.storageArea : ''}
                            inputRef={storageAreaInputRef}
                            placeholder="Write here"
                            meta="Optional"
                            onChange={remarkOrStorageAreaChange}
                        />
                    </div>
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
                    <ButtonSpacer />
                    <Button
                        onClick={save}
                        color="primary"
                        disabled={
                            !remarkOrStorageAreaEdited &&
                            !requirementsOrDescriptionEdited
                        }
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
