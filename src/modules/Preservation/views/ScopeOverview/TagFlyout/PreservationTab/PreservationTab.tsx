import {
    Container,
    Details,
    GridFirstRow,
    GridSecondRow,
    IconContainer,
    StyledButton,
    TagDetailsContainer,
    TagDetailsInputContainer,
    TextFieldContainer,
    TextFieldLabelReadOnly,
    TextFieldReadOnly,
} from './PreservationTab.style';
import React, { useEffect, useState } from 'react';
import {
    TagDetails,
    TagRequirement,
    TagRequirementRecordValues,
} from './../types';
import { TextField, Typography } from '@equinor/eds-core-react';
import Requirements from './Requirements';
import Spinner from '../../../../../../components/Spinner';
import { showSnackbarNotification } from './../../../../../../core/services/NotificationService';
import { usePreservationContext } from '../../../../context/PreservationContext';
import { useDirtyContext } from '@procosys/core/DirtyContext';
import { Check, Clear, EditOutlined } from '@mui/icons-material';

interface PreservationTabProps {
    tagDetails: TagDetails;
    refreshTagDetails: () => void;
    setDirty: () => void;
}

const moduleName = 'PreservationTagFlyoutPreservation';

const PreservationTab = ({
    tagDetails,
    refreshTagDetails,
    setDirty,
}: PreservationTabProps): JSX.Element => {
    const { apiClient } = usePreservationContext();

    const [tagRequirements, setTagRequirements] = useState<
        TagRequirement[] | null
    >(null);
    const [editingRemark, setEditingRemark] = useState<boolean>(false);
    const [editingStorageArea, setEditingStorageArea] =
        useState<boolean>(false);
    const [remark, setRemark] = useState<string>(tagDetails.remark);
    const [storageArea, setStorageArea] = useState<string>(
        tagDetails.storageArea
    );

    const { setDirtyStateFor, unsetDirtyStateFor } = useDirtyContext();

    const KEYCODE_ENTER = 13;

    const getTagRequirements = async (): Promise<void> => {
        try {
            const requirements = await apiClient.getTagRequirements(
                tagDetails.id
            );
            setTagRequirements(requirements);
        } catch (error) {
            console.error(`Get tag requirements failed: ${error.message}`);
            showSnackbarNotification(error.message, 5000, true);
        }
    };

    useEffect(() => {
        setTagRequirements(null); // force full refresh
        getTagRequirements();
    }, [tagDetails]);

    /** Update global dirty state */
    useEffect(() => {
        if (editingRemark || editingStorageArea) {
            setDirtyStateFor(moduleName);
        } else {
            unsetDirtyStateFor(moduleName);
        }

        return (): void => {
            unsetDirtyStateFor(moduleName);
        };
    }, [editingRemark, editingStorageArea]);

    const recordTagRequirementValues = async (
        values: TagRequirementRecordValues
    ): Promise<void> => {
        try {
            setTagRequirements(null); // trigger the spinner
            await apiClient.recordTagRequirementValues(tagDetails.id, values);

            setDirty();
            showSnackbarNotification('Requirement values saved', 5000, true);
        } catch (error) {
            console.error(
                `Record tag requirement values failed: ${error.message}`
            );
            showSnackbarNotification(error.message, 5000, true);
        } finally {
            // refresh tag details and requirements
            refreshTagDetails();
        }
    };

    const preserveRequirement = async (
        requirementId: number
    ): Promise<void> => {
        try {
            setTagRequirements(null); // trigger the spinner
            await apiClient.preserveSingleRequirement(
                tagDetails.id,
                requirementId
            );

            setDirty();
            showSnackbarNotification(
                'The requirement has been preserved.',
                5000,
                true
            );
        } catch (error) {
            console.error(`Preserve requirement failed: ${error.message}`);
            showSnackbarNotification(error.message, 5000, true);
        } finally {
            // refresh tag details and requirements
            refreshTagDetails();
        }
    };

    const isReadOnly = (): boolean =>
        tagDetails.status.toLowerCase() !== 'active' || tagDetails.isVoided;

    const getRequirementsSection = (tagId: number): JSX.Element => {
        if (tagRequirements === null) {
            return (
                <div style={{ margin: 'calc(var(--grid-unit) * 5) auto' }}>
                    <Spinner medium />
                </div>
            );
        }

        return (
            <Requirements
                tagId={tagId}
                requirements={tagRequirements}
                readonly={isReadOnly()}
                recordTagRequirementValues={recordTagRequirementValues}
                preserveRequirement={preserveRequirement}
                refreshRequirements={refreshTagDetails}
            />
        );
    };

    const saveRemarkAndStorageArea = async (
        remarkString: string,
        storageAreaString: string
    ): Promise<boolean> => {
        try {
            await apiClient.setRemarkAndStorageArea(
                tagDetails.id,
                remarkString,
                storageAreaString,
                tagDetails.rowVersion
            );
            return Promise.resolve(true);
        } catch (error) {
            console.error('Edit failed: ', error.message, error.data);
            showSnackbarNotification(error.message);
            return Promise.resolve(false);
        }
    };

    const saveRemark = (): void => {
        saveRemarkAndStorageArea(remark, storageArea).then((saveOk) => {
            if (saveOk == true) {
                setEditingRemark(false);
                refreshTagDetails();
            }
        });
        setDirty();
        setTagRequirements(null);
    };

    const cancelEditRemark = (): void => {
        setRemark(tagDetails.remark);
        setEditingRemark(false);
    };

    const saveStorageArea = (): void => {
        saveRemarkAndStorageArea(remark, storageArea).then((saveOk) => {
            if (saveOk) {
                setEditingStorageArea(false);
                refreshTagDetails();
            }
        });
    };

    const cancelEditStorageArea = (): void => {
        setStorageArea(tagDetails.storageArea);
        setEditingStorageArea(false);
    };

    return (
        <Container>
            <TagDetailsContainer>
                <Details>
                    <Typography variant="h6">
                        {tagDetails.description}
                    </Typography>
                    <div style={{ marginTop: 'calc(var(--grid-unit) * 2)' }}>
                        <GridFirstRow>
                            <Typography
                                variant="caption"
                                style={{ gridColumn: '1', gridRow: '1' }}
                            >
                                Journey
                            </Typography>
                            <Typography
                                variant="caption"
                                style={{ gridColumn: '2', gridRow: '1' }}
                            >
                                Mode
                            </Typography>
                            <Typography
                                variant="caption"
                                style={{ gridColumn: '3', gridRow: '1' }}
                            >
                                Resp.
                            </Typography>
                            <Typography
                                variant="body_long"
                                style={{ gridColumn: '1', gridRow: '2' }}
                            >
                                {tagDetails.journey.title}
                            </Typography>
                            <Typography
                                variant="body_long"
                                style={{ gridColumn: '2', gridRow: '2' }}
                            >
                                {tagDetails.mode.title}
                            </Typography>
                            <Typography
                                variant="body_long"
                                style={{ gridColumn: '3', gridRow: '2' }}
                            >
                                {tagDetails.responsible.code}
                            </Typography>
                        </GridFirstRow>
                    </div>
                    <div style={{ marginTop: 'var(--grid-unit)' }}>
                        <GridSecondRow>
                            <Typography
                                variant="caption"
                                style={{ gridColumn: '1', gridRow: '1' }}
                            >
                                Comm pkg
                            </Typography>
                            <Typography
                                variant="caption"
                                style={{ gridColumn: '2', gridRow: '1' }}
                            >
                                MC pkg
                            </Typography>
                            <Typography
                                variant="caption"
                                style={{ gridColumn: '3', gridRow: '1' }}
                            >
                                PO
                            </Typography>
                            <Typography
                                variant="caption"
                                style={{ gridColumn: '4', gridRow: '1' }}
                            >
                                Area
                            </Typography>
                            <Typography
                                variant="body_short"
                                style={{ gridColumn: '1', gridRow: '2' }}
                            >
                                {tagDetails.commPkgNo}
                            </Typography>
                            <Typography
                                variant="body_short"
                                style={{ gridColumn: '2', gridRow: '2' }}
                            >
                                {tagDetails.mcPkgNo}
                            </Typography>
                            <Typography
                                variant="body_short"
                                style={{ gridColumn: '3', gridRow: '2' }}
                            >
                                {tagDetails.calloffNo
                                    ? `${tagDetails.purchaseOrderNo}/${tagDetails.calloffNo}`
                                    : tagDetails.purchaseOrderNo}
                            </Typography>
                            <Typography
                                variant="body_short"
                                style={{ gridColumn: '4', gridRow: '2' }}
                            >
                                {tagDetails.areaCode}
                            </Typography>
                        </GridSecondRow>
                    </div>
                </Details>
            </TagDetailsContainer>
            <TagDetailsInputContainer>
                <TextFieldContainer>
                    {editingRemark ? (
                        <TextField
                            id="remark"
                            label="Remark"
                            value={remark ? remark : ''}
                            meta="Optional"
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ): void => {
                                setRemark(e.target.value);
                            }}
                            onKeyDown={(
                                e: React.KeyboardEvent<HTMLInputElement>
                            ): void => {
                                e.keyCode === KEYCODE_ENTER && saveRemark();
                            }}
                        />
                    ) : (
                        <div style={{ width: '100%' }}>
                            <TextFieldLabelReadOnly>
                                Remark
                            </TextFieldLabelReadOnly>
                            <TextFieldReadOnly data-testid="remarkReadOnly">
                                {remark}
                            </TextFieldReadOnly>
                        </div>
                    )}
                    {tagDetails.isVoided ? (
                        <></>
                    ) : editingRemark ? (
                        <IconContainer>
                            <StyledButton
                                data-testid="remarkClearIcon"
                                variant="ghost_icon"
                                onClick={cancelEditRemark}
                            >
                                <Clear fontSize="small" />
                            </StyledButton>
                            <StyledButton
                                data-testid="remarkCheckIcon"
                                variant="ghost_icon"
                                onClick={saveRemark}
                            >
                                <Check fontSize="small" />
                            </StyledButton>
                        </IconContainer>
                    ) : (
                        <IconContainer>
                            <StyledButton
                                data-testid="remarkEditIcon"
                                variant="ghost_icon"
                                onClick={(): void => setEditingRemark(true)}
                            >
                                <EditOutlined fontSize="small" />
                            </StyledButton>
                        </IconContainer>
                    )}
                </TextFieldContainer>
                <TextFieldContainer style={{ width: '55%' }}>
                    {editingStorageArea ? (
                        <TextField
                            id="storageArea"
                            label="Storage area"
                            defaultValue={tagDetails.storageArea}
                            meta="Optional"
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ): void => {
                                setStorageArea(e.target.value);
                            }}
                            onKeyDown={(
                                e: React.KeyboardEvent<HTMLInputElement>
                            ): void => {
                                e.keyCode === KEYCODE_ENTER &&
                                    saveStorageArea();
                            }}
                        />
                    ) : (
                        <div style={{ width: '100%' }}>
                            <TextFieldLabelReadOnly>
                                Storage area
                            </TextFieldLabelReadOnly>
                            <TextFieldReadOnly data-testid="storageAreaReadOnly">
                                {storageArea}
                            </TextFieldReadOnly>
                        </div>
                    )}
                    {tagDetails.isVoided ? (
                        <></>
                    ) : editingStorageArea ? (
                        <IconContainer>
                            <StyledButton
                                data-testid="storageAreaClearIcon"
                                variant="ghost_icon"
                                onClick={cancelEditStorageArea}
                            >
                                <Clear fontSize="small" />
                            </StyledButton>
                            <StyledButton
                                data-testid="storageAreaCheckIcon"
                                variant="ghost_icon"
                                onClick={saveStorageArea}
                            >
                                <Check fontSize="small" />
                            </StyledButton>
                        </IconContainer>
                    ) : (
                        <IconContainer>
                            <StyledButton
                                data-testid="storageAreaEditIcon"
                                variant="ghost_icon"
                                onClick={(): void =>
                                    setEditingStorageArea(true)
                                }
                            >
                                <EditOutlined fontSize="small" />
                            </StyledButton>
                        </IconContainer>
                    )}
                </TextFieldContainer>
            </TagDetailsInputContainer>
            {getRequirementsSection(tagDetails.id)}
        </Container>
    );
};

export default PreservationTab;
