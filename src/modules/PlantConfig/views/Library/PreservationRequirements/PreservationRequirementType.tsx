import { Breadcrumbs, ButtonSpacer, Container, FormFieldSpacer, InputContainer, SelectText } from './PreservationRequirements.style';
import { Button, TextField, Typography } from '@equinor/eds-core-react';
import PreservationIcon, { PreservationTypeIcon, preservationIconList } from '@procosys/components/PreservationIcon';
import React, { useEffect, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../../components/Select';

import EdsIcon from '../../../../../components/EdsIcon';
import { RequirementType } from './types';
import Spinner from '@procosys/components/Spinner';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { unsavedChangesConfirmationMessage, useDirtyContext } from '@procosys/core/DirtyContext';
import { usePlantConfigContext } from '@procosys/modules/PlantConfig/context/PlantConfigContext';
import { ButtonContainer, ButtonContainerLeft, ButtonContainerRight } from '../Library.style';

const voidIcon = <EdsIcon name='delete_forever' size={16} />;
const unvoidIcon = <EdsIcon name='restore_from_trash' size={16} />;
const deleteIcon = <EdsIcon name='delete_to_trash' size={16} />;
const addIcon = <EdsIcon name='add' size={16} />;
const moduleName = 'PreservationRequirementType';

type PreservationRequirementTypeProps = {
    requirementTypeId: number;
    setDirtyLibraryType: () => void;
    cancel: () => void;
    addNewRequirementDefinition: () => void;
};

const baseBreadcrumb = 'Library / Preservation requirements /';

const PreservationRequirementType = (props: PreservationRequirementTypeProps): JSX.Element => {

    const getInitialRequirementType = (): RequirementType => {
        return { id: -1, code: '', title: '', icon: '', isVoided: false, sortKey: -1, rowVersion: '', isInUse: false, requirementDefinitions: [] };
    };

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [requirementType, setRequirementType] = useState<RequirementType | null>(null);
    const [newRequirementType, setNewRequirementType] = useState<RequirementType>(getInitialRequirementType());
    const [isDirtyAndValid, setIsDirtyAndValid] = useState<boolean>(false);
    const [iconList, setIconList] = useState<SelectItem[]>([]);
    const { setDirtyStateFor, unsetDirtyStateFor } = useDirtyContext();

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

    const isDirty = (): boolean => {
        return JSON.stringify(requirementType) != JSON.stringify(newRequirementType);
    };

    const confirmDiscardingChangesIfExist = (): boolean => {
        return !isDirty() || confirm(unsavedChangesConfirmationMessage);
    };

    //Set dirty when forms is updated
    useEffect(() => {
        const hasUnsavedChanges = isDirty();

        if (requirementType == null || !hasUnsavedChanges) {
            setIsDirtyAndValid(false);
        } else {
            if (newRequirementType.code && newRequirementType.icon && newRequirementType.sortKey && newRequirementType.title) {
                setIsDirtyAndValid(true);
            } else {
                setIsDirtyAndValid(false);
            }

        }

        if (hasUnsavedChanges) {
            setDirtyStateFor(moduleName);
        } else {
            unsetDirtyStateFor(moduleName);
        }

        return (): void => {
            unsetDirtyStateFor(moduleName);
        };
    }, [newRequirementType, requirementType]);

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
            setNewRequirementType(getInitialRequirementType());
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
            showSnackbarNotification('Changes for requirement type are saved.', 5000);
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
                setIsLoading(false);
            }
        }
    };

    const cancelChanges = (): void => {
        if (confirmDiscardingChangesIfExist()) {
            setRequirementType(null);
            props.cancel();
        }
    };

    const initNewRequirementType = (): void => {
        if (confirmDiscardingChangesIfExist()) {
            setNewRequirementType(getInitialRequirementType());
        }
    };

    const initNewRequirementDefinition = (): void => {
        if (confirmDiscardingChangesIfExist()) {
            props.addNewRequirementDefinition();
        }
    };

    const voidRequirementType = async (): Promise<void> => {
        if (requirementType && confirmDiscardingChangesIfExist()) {
            setIsLoading(true);
            try {
                await preservationApiClient.voidRequirementType(requirementType.id, requirementType.rowVersion);
                getRequirementType(requirementType.id);
                props.setDirtyLibraryType();
                showSnackbarNotification('Requirement type is voided.', 5000);
            } catch (error) {
                console.error('Error occured when trying to void requirement type: ', error.message, error.data);
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
                <ButtonContainerLeft>
                    <Button variant='ghost' onClick={(): void => { initNewRequirementType(); }}>
                        {addIcon} New requirement type
                    </Button>
                    <Button variant='ghost' onClick={(): void => { initNewRequirementDefinition(); }}>
                        {addIcon} New requirement definition
                    </Button>
                </ButtonContainerLeft>
                <ButtonContainerRight>
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
                    <Button onClick={handleSave} disabled={newRequirementType.isVoided || !isDirtyAndValid}>
                        Save
                    </Button>
                </ButtonContainerRight>
            </ButtonContainer>

            <InputContainer style={{ marginTop: 'calc(var(--grid-unit) * 3)' }}>
                <FormFieldSpacer style={{ width: '100px' }}>
                    <TextField
                        id={'sortKey'}
                        label='SortKey'
                        value={newRequirementType.sortKey == -1 ? '' : newRequirementType.sortKey}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                            newRequirementType.sortKey = Number(e.target.value);
                            valueUpdated();
                        }}
                        placeholder="Write here"
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
                        placeholder="Write here"
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
                        placeholder="Write here"
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
