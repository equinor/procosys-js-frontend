import React, { useState, useEffect } from 'react';
import { usePlantConfigContext } from '@procosys/modules/PlantConfig/context/PlantConfigContext';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { Container, InputContainer, FormFieldSpacer, ButtonContainer, ButtonSpacer, SelectText, Breadcrumbs } from './PreservationRequirements.style';
import { TextField, Typography, Button } from '@equinor/eds-core-react';
import SelectInput, { SelectItem } from '../../../../../components/Select';
import Spinner from '@procosys/components/Spinner';
import PreservationIcon, { preservationIconList, PreservationTypeIcon } from '@procosys/components/PreservationIcon';
import EdsIcon from '../../../../../components/EdsIcon';
import { RequirementType } from './types';

const voidIcon = <EdsIcon name='delete_forever' size={16} />;
const unvoidIcon = <EdsIcon name='restore_from_trash' size={16} />;
const deleteIcon = <EdsIcon name='delete_to_trash' size={16} />;

type PreservationRequirementTypeProps = {
    requirementTypeId: number;
    setDirtyLibraryType: () => void;
    cancel: () => void;
};

const baseBreadcrumb = 'Library / Preservation Requirements /';

const PreservationRequirementType = (props: PreservationRequirementTypeProps): JSX.Element => {

    const createNewRequirementType = (): RequirementType => {
        return { id: -1, code: '', title: '', icon: '', isVoided: false, sortKey: -1, rowVersion: '', isInUse: false, requirementDefinitions: [] };
    };

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [requirementType, setRequirementType] = useState<RequirementType | null>(null);
    const [newRequirementType, setNewRequirementType] = useState<RequirementType>(createNewRequirementType());
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [iconList, setIconList] = useState<SelectItem[]>([]);

    const {
        preservationApiClient,
    } = usePlantConfigContext();

    //Create select items for icons
    useEffect((): void => {
        const items: SelectItem[] = [];
        preservationIconList.forEach((icon: PreservationTypeIcon) => {
            items.push({
                text: icon.title,
                value: icon.code,
                icon: <PreservationIcon variant={icon.code} />
            });
        });
        setIconList(items);
    }, []);

    //Set dirty when forms is updated
    useEffect(() => {
        if (JSON.stringify(requirementType) == JSON.stringify(newRequirementType)) {
            setIsDirty(false);
        } else {
            if (newRequirementType.code && newRequirementType.icon && newRequirementType.sortKey && newRequirementType.title) {
                setIsDirty(true);
            } else {
                setIsDirty(false);
            }
        }
    }, [newRequirementType]);

    const cloneRequirementType = (requirementType: RequirementType): RequirementType => {
        return JSON.parse(JSON.stringify(requirementType));
    };

    const getRequirementType = async (requirementTypeId: number): Promise<void> => {
        setIsLoading(true);
        try {
            await preservationApiClient.getRequirementType(requirementTypeId).then(
                (response) => {
                    setRequirementType(response);
                    setNewRequirementType(cloneRequirementType(response));
                }
            );
        } catch (error) {
            console.error('Get requirement type failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
        }
        setIsLoading(false);
    };

    useEffect((): void => {
        if (props.requirementTypeId > -1) {
            getRequirementType(props.requirementTypeId);
        } else {
            setNewRequirementType(createNewRequirementType());
        }
    }, [props.requirementTypeId]);

    const saveNew = async (): Promise<void> => {
        try {
            const requirementTypeId = await preservationApiClient.addRequirementType(newRequirementType.code, newRequirementType.title, newRequirementType.icon, newRequirementType.sortKey);
            getRequirementType(requirementTypeId);
            props.setDirtyLibraryType();
            showSnackbarNotification('New requirement type is saved.', 5000);
        } catch (error) {
            console.error('Add requirement type failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
        }
    };

    const saveUpdated = async (): Promise<void> => {
        try {
            await preservationApiClient.updateRequirementType(newRequirementType.id, newRequirementType.code, newRequirementType.title, newRequirementType.icon, newRequirementType.sortKey, newRequirementType.rowVersion);
            getRequirementType(newRequirementType.id);
            showSnackbarNotification('Changes for requirement type is saved.', 5000);
            props.setDirtyLibraryType();
        } catch (error) {
            console.error('Update requirement type failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
            getRequirementType(newRequirementType.id);
        }
    };

    const handleSave = (): void => {
        if (newRequirementType.id === -1) {
            saveNew();
        } else {
            saveUpdated();
        }
    };

    const deleteRequirementType = async (): Promise<void> => {
        if (newRequirementType) {
            setIsLoading(true);
            try {
                await preservationApiClient.deleteRequirementType(newRequirementType.id, newRequirementType.rowVersion);
                props.setDirtyLibraryType();
                props.cancel();
                showSnackbarNotification('Requirement type is deleted.', 5000);
            } catch (error) {
                console.error('Error occured when trying to delete requirement type: ', error.message, error.data);
                showSnackbarNotification(error.message, 5000);
            }
            setIsLoading(false);
        }
    };

    const cancelChanges = (): void => {
        if (isDirty && !confirm('Do you want to cancel changes without saving?')) {
            return;
        }
        setRequirementType(null);
        props.cancel();
    };

    const voidRequirementType = async (): Promise<void> => {
        if (requirementType) {
            setIsLoading(true);
            try {
                await preservationApiClient.voidRequirementType(requirementType.id, requirementType.rowVersion);
                getRequirementType(requirementType.id);
                props.setDirtyLibraryType();
                showSnackbarNotification('Requirement type is voided.', 5000);
            } catch (error) {
                console.error('Error occured when trying to requirement type: ', error.message, error.data);
                showSnackbarNotification(error.message, 5000);
            }
            setIsLoading(false);
        }
    };

    const unvoidRequirementType = async (): Promise<void> => {
        if (requirementType) {
            setIsLoading(true);
            try {
                await preservationApiClient.unvoidRequirementType(requirementType.id, requirementType.rowVersion);
                getRequirementType(requirementType.id);
                props.setDirtyLibraryType();
                showSnackbarNotification('Requirement type is unvoided.', 5000);
            } catch (error) {
                console.error('Error occured when trying to unvoid requirement type: ', error.message, error.data);
                showSnackbarNotification(error.message, 5000);
            }
            setIsLoading(false);
        }
    };

    const valueUpdated = (): void => {
        setNewRequirementType(cloneRequirementType(newRequirementType));
    };

    if (isLoading) {
        return (
            <Container>
                <Breadcrumbs>{baseBreadcrumb}</Breadcrumbs>
                <Spinner large />
            </Container>);
    }

    const getIconText = (): JSX.Element => {
        const icon = iconList.find((icon: SelectItem) => icon.value === newRequirementType.icon);

        if (icon) {
            return <SelectText>
                <PreservationIcon variant={icon.value} /> {icon.text}
            </SelectText>;
        }
        return <div>Select icon</div>;
    };

    return (
        <Container>
            <Breadcrumbs>{baseBreadcrumb} {newRequirementType.title}</Breadcrumbs>
            {newRequirementType.isVoided &&
                <Typography variant="caption" style={{ marginLeft: 'calc(var(--grid-unit) * 2)', fontWeight: 'bold' }}>Requirement type is voided</Typography>
            }
            <ButtonContainer>
                {newRequirementType.isVoided && newRequirementType.id != -1 &&
                    <>
                        <Button className='buttonIcon' variant="outlined" onClick={deleteRequirementType} disabled={newRequirementType.isInUse} title={newRequirementType.isInUse ? 'Requirement type that is in use cannot be deleted' : ''}>
                            {deleteIcon} Delete
                        </Button>
                        <ButtonSpacer />
                    </>
                }
                {newRequirementType.isVoided &&
                    <Button className='buttonIcon' variant="outlined" onClick={unvoidRequirementType}>
                        {unvoidIcon} Unvoid
                    </Button>
                }

                {!newRequirementType.isVoided && newRequirementType.id != -1 &&
                    < Button className='buttonIcon' variant="outlined" onClick={voidRequirementType}>
                        {voidIcon} Void
                    </Button>
                }
                <ButtonSpacer />
                <Button variant="outlined" onClick={cancelChanges} disabled={newRequirementType.isVoided}>
                    Cancel
                </Button>
                <ButtonSpacer />
                <Button onClick={handleSave} disabled={newRequirementType.isVoided || !isDirty}>
                    Save
                </Button>
            </ButtonContainer>

            <InputContainer>
                <FormFieldSpacer style={{ width: '100px' }}>
                    <TextField
                        id={'sortKey'}
                        label='SortKey'
                        value={newRequirementType.sortKey == -1 ? '' : newRequirementType.sortKey}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                            newRequirementType.sortKey = Number(e.target.value);
                            valueUpdated();
                        }}
                        placeholder="Write Here"
                        disabled={newRequirementType.isVoided}
                    />
                </FormFieldSpacer>

                <FormFieldSpacer style={{ width: '150px' }}>
                    <TextField
                        id={'code'}
                        label='Code for this type'
                        value={newRequirementType.code}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                            newRequirementType.code = e.target.value;
                            valueUpdated();
                        }}
                        placeholder="Write Here"
                        disabled={newRequirementType.isVoided}
                    />
                </FormFieldSpacer>
                <FormFieldSpacer style={{ width: '300px' }}>
                    <TextField
                        id={'title'}
                        label='Title for this type'
                        value={newRequirementType.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                            newRequirementType.title = e.target.value;
                            valueUpdated();
                        }}
                        placeholder="Write Here"
                        disabled={newRequirementType.isVoided}
                    />
                </FormFieldSpacer>
            </InputContainer>
            <InputContainer>
                <SelectInput
                    onChange={(value: string): void => {
                        newRequirementType.icon = value;
                        valueUpdated();
                    }}
                    data={iconList}
                    label={'Icon'}
                    disabled={newRequirementType.isVoided}
                >
                    {getIconText()}
                </SelectInput>
            </InputContainer>
        </Container >
    );
};

export default PreservationRequirementType;
