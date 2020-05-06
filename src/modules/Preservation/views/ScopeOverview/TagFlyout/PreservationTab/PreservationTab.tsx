import React, { useState, useEffect, useRef } from 'react';
import { Container, TagDetailsContainer, Details, GridFirstRow, GridSecondRow, TagDetailsInputContainer, TextFieldContainer, StyledButton, IconContainer, StyledTextField } from './PreservationTab.style';
import { TextField, Typography } from '@equinor/eds-core-react';
import { TagDetails, TagRequirement, TagRequirementRecordValues } from './../types';
import Requirements from './Requirements';
import { usePreservationContext } from '../../../../context/PreservationContext';
import { showSnackbarNotification } from './../../../../../../core/services/NotificationService';
import Spinner from '../../../../../../components/Spinner';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

interface PreservationTabProps {
    tagDetails: TagDetails;
    refreshTagDetails: () => void;
    setDirty: () => void;
}

const PreservationTab = ({
    tagDetails,
    refreshTagDetails,
    setDirty
}: PreservationTabProps): JSX.Element => {
    const [tagRequirements, setTagRequirements] = useState<TagRequirement[] | null>(null);
    const { apiClient } = usePreservationContext();

    const [editingRemark, setEditingRemark] = useState<boolean>(false);
    const [editingStorageArea, setEditingStorageArea] = useState<boolean>(false);

    const [remark, setRemark] = useState<string>(tagDetails.remark);
    const remarkInputRef = useRef<HTMLInputElement>(null);
    const [storageArea, setStorageArea] = useState<string>(tagDetails.storageArea);
    const storageAreaInputRef = useRef<HTMLInputElement>(null);

    const KEYCODE_ENTER = 13;

    const getTagRequirements = async (): Promise<void> => {
        try {
            const requirements = await apiClient.getTagRequirements(tagDetails.id);
            setTagRequirements(requirements);
        }
        catch (error) {
            console.error(`Get TagRequirements failed: ${error.message}`);
            showSnackbarNotification(error.message, 5000, true);
        }
    };

    useEffect(() => {
        setTagRequirements(null); // force full refresh
        getTagRequirements();
    }, [tagDetails]);

    const recordTagRequirementValues = async (values: TagRequirementRecordValues): Promise<void> => {
        try {
            setTagRequirements(null); // trigger the spinner
            await apiClient.recordTagRequirementValues(tagDetails.id, values);

            setDirty();
            showSnackbarNotification('Requirement values saved', 5000, true);
        }
        catch (error) {
            console.error(`Record TagRequirement values failed: ${error.message}`);
            showSnackbarNotification(error.message, 5000, true);
        }
        finally {
            // refresh tag details and requirements
            refreshTagDetails();
        }
    };

    const preserveRequirement = async (requirementId: number): Promise<void> => {
        try {
            setTagRequirements(null); // trigger the spinner
            await apiClient.preserveSingleRequirement(tagDetails.id, requirementId);

            setDirty();
            showSnackbarNotification('The requirement has been preserved.', 5000, true);
        }
        catch (error) {
            console.error(`Preserve requirement failed: ${error.message}`);
            showSnackbarNotification(error.message, 5000, true);
        }
        finally {
            // refresh tag details and requirements
            refreshTagDetails();
        }
    };

    const isReadOnly = (): boolean => tagDetails.status.toLowerCase() !== 'active';

    const getRequirementsSection = (): JSX.Element => {
        if (tagRequirements === null) {
            return <div style={{margin: 'calc(var(--grid-unit) * 5) auto'}}><Spinner medium /></div>;
        }

        return (
            <Requirements
                requirements={tagRequirements}
                readonly={isReadOnly()}
                recordTagRequirementValues={recordTagRequirementValues}
                preserveRequirement={preserveRequirement}
            />
        );
    };

    const saveRemarkAndStorageArea = async (remarkString: string, storageAreaString: string): Promise<void> => {
        try {
            await apiClient.setRemarkAndStorageArea(tagDetails.id, remarkString, storageAreaString, tagDetails.rowVersion);
        } catch (error) {
            console.error('Edit failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message);
        }
        return Promise.resolve();
    };

    const saveRemark = (): void => {
        if(remarkInputRef.current) {
            setRemark(remarkInputRef.current.value);
            saveRemarkAndStorageArea(remarkInputRef.current.value, storageArea);
        } else {
            showSnackbarNotification('Something went wrong. Remark was not updated.');
        }
        setEditingRemark(false);
    };

    const cancelEditRemark = (): void => {
        if (remarkInputRef.current) {
            remarkInputRef.current.value = remark;
        }
        setEditingRemark(false);
    };

    const saveStorageArea = (): void => {
        if(storageAreaInputRef.current) {
            setStorageArea(storageAreaInputRef.current.value);
            saveRemarkAndStorageArea(remark, storageAreaInputRef.current.value);
        } else {
            showSnackbarNotification('Something went wrong. Storage area was not updated.');
        }
        setEditingStorageArea(false);
    };

    const cancelEditStorageArea = (): void => {
        if (storageAreaInputRef.current) {
            storageAreaInputRef.current.value = storageArea;
        }
        setEditingStorageArea(false);
    };

    return (
        <Container>
            <TagDetailsContainer>
                <Details>
                    <Typography variant='h6'>{tagDetails.description}</Typography>
                    <div style={{marginTop: 'calc(var(--grid-unit) * 2)'}}>
                        <GridFirstRow>
                            <Typography variant='caption' style={{gridColumn: '1', gridRow: '1'}}>Journey</Typography>
                            <Typography variant='caption' style={{gridColumn: '2', gridRow: '1'}}>Mode</Typography>
                            <Typography variant='caption' style={{gridColumn: '3', gridRow: '1'}}>Resp.</Typography>
                            <Typography variant='body_long' style={{gridColumn: '1', gridRow: '2'}}>{tagDetails.journeyTitle}</Typography>
                            <Typography variant='body_long' style={{gridColumn: '2', gridRow: '2'}}>{tagDetails.mode}</Typography>
                            <Typography variant='body_long' style={{gridColumn: '3', gridRow: '2'}}>{tagDetails.responsibleName}</Typography>
                        </GridFirstRow>
                    </div>
                    <div style={{marginTop: 'var(--grid-unit)'}}>
                        <GridSecondRow>
                            <Typography variant='caption' style={{gridColumn: '1', gridRow: '1'}}>Comm pkg</Typography>
                            <Typography variant='caption' style={{gridColumn: '2', gridRow: '1'}}>MC pkg</Typography>
                            <Typography variant='caption' style={{gridColumn: '3', gridRow: '1'}}>PO</Typography>
                            <Typography variant='caption' style={{gridColumn: '4', gridRow: '1'}}>Area</Typography>
                            <Typography variant='body_short' style={{gridColumn: '1', gridRow: '2'}}>{tagDetails.commPkgNo}</Typography>
                            <Typography variant='body_short' style={{gridColumn: '2', gridRow: '2'}}>{tagDetails.mcPkgNo}</Typography>
                            <Typography variant='body_short' style={{gridColumn: '3', gridRow: '2'}}>{tagDetails.purchaseOrderNo}</Typography>
                            <Typography variant='body_short' style={{gridColumn: '4', gridRow: '2'}}>{tagDetails.areaCode}</Typography>
                        </GridSecondRow>
                    </div>
                </Details>
            </TagDetailsContainer>
            <TagDetailsInputContainer>
                <TextFieldContainer>
                    <TextField
                        id='remark'
                        label='Remark'
                        defaultValue={tagDetails.remark}
                        inputRef={remarkInputRef}
                        disabled={!editingRemark}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
                            e.keyCode === KEYCODE_ENTER &&
                                saveRemark();
                        }}
                    />
                    { editingRemark ?
                        <IconContainer>
                            <StyledButton
                                data-testid="remarkClearIcon"
                                variant='ghost_icon'
                                onClick={cancelEditRemark}>
                                <ClearIcon fontSize='small'/>
                            </StyledButton>
                            <StyledButton
                                data-testid="remarkCheckIcon"
                                variant='ghost_icon'
                                onClick={saveRemark}>
                                <CheckIcon fontSize='small'/>
                            </StyledButton>
                        </IconContainer>
                        :
                        <IconContainer>
                            <StyledButton
                                data-testid="remarkEditIcon"
                                variant='ghost_icon'
                                onClick={(): void => setEditingRemark(true)}>
                                <EditOutlinedIcon fontSize='small'/>
                            </StyledButton>
                        </IconContainer>
                    }
                </TextFieldContainer>
                <TextFieldContainer>
                    <StyledTextField
                        id='storageArea'
                        label='Storage area'
                        defaultValue={tagDetails.storageArea}
                        inputRef={storageAreaInputRef}
                        disabled={!editingStorageArea}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
                            e.keyCode === KEYCODE_ENTER &&
                                saveStorageArea();
                        }}
                    />
                    { editingStorageArea ?
                        <IconContainer>
                            <StyledButton
                                data-testid="storageAreaClearIcon"
                                variant='ghost_icon'
                                onClick={cancelEditStorageArea}>
                                <ClearIcon fontSize='small'/>
                            </StyledButton>
                            <StyledButton
                                data-testid="storageAreaCheckIcon"
                                variant='ghost_icon'
                                onClick={saveStorageArea}>
                                <CheckIcon fontSize='small'/>
                            </StyledButton>
                        </IconContainer>
                        :
                        <IconContainer>
                            <StyledButton
                                data-testid="storageAreaEditIcon"
                                variant='ghost_icon'
                                onClick={(): void => setEditingStorageArea(true)}>
                                <EditOutlinedIcon fontSize='small'/>
                            </StyledButton>
                        </IconContainer>
                    }
                </TextFieldContainer>
            </TagDetailsInputContainer>
            {
                getRequirementsSection()
            }
        </Container>
    );
};

export default PreservationTab;
