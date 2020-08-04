import React, { useState, useEffect } from 'react';
import { usePlantConfigContext } from '@procosys/modules/PlantConfig/context/PlantConfigContext';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { Container, InputContainer, FormFieldSpacer, ButtonContainer, ButtonSpacer, SelectText, IconContainer } from './PreservationRequirements.style';
import { TextField, Typography, Button } from '@equinor/eds-core-react';
import SelectInput, { SelectItem } from '../../../../../components/Select';
import Spinner from '@procosys/components/Spinner';
import PreservationIcon from '@procosys/components/PreservationIcon';
import EdsIcon from '@procosys/components/EdsIcon';

const addIcon = <EdsIcon name='add' size={16} />;

interface RequirementType {
    id: number;
    code: string;
    title: string;
    isVoided: boolean;
    icon: string;
    sortKey: number;
    requirementDefinitions: [{
        id: number;
        title: string;
        isVoided: boolean;
        defaultIntervalWeeks: number;
        sortKey: number;
        usage: string;
        fields: [{
            id: number;
            label: string;
            isVoided: boolean;
            sortKey: number;
            fieldType: string;
            unit: string | null;
            showPrevious: boolean;
        }];
        needsUserInput: boolean;
    }];
    rowVersion: string;
}

interface RequirementDefinitionItem {
    id: number;
    title: string;
    requirementTypeId: number;
    requirementTypeTitle: string;
    usage: string;
    defaultIntervalWeeks: number;
    icon: string;
    isVoided: boolean;
    sortKey: number;
    rowVersion: string;
    fields: Field[];
}

interface Field {
    label: string;
    sortKey: number;
    fieldType: string;
    unit: string | null;
    showPrevious: boolean;
}


const validWeekIntervals = [1, 2, 4, 6, 8, 12, 16, 24, 52];

export interface RequirementUsageCode {
    code: string;
    title: string;
}

const requirementUsageSelectItems: Array<SelectItem> = [
    { value: 'ForAll', text: 'For all steps (default)' },
    { value: 'ForSuppliersOnly', text: 'For supplier steps only' },
    { value: 'ForOtherThanSuppliers', text: 'For other than supplier steps' },
];

const fieldTypesSelectItems: Array<SelectItem> = [
    { value: 'CheckBox', text: 'Checkbox' },
    { value: 'Number', text: 'Number' },
    { value: 'Info', text: 'Info' },
    { value: 'Attachment', text: 'Attachment' }
];

type PreservationRequirementDefinitionProps = {
    requirementDefinitionId: number;
    setDirtyLibraryType: () => void;
    cancel: () => void;
};

const PreservationRequirementDefinition = (props: PreservationRequirementDefinitionProps): JSX.Element => {

    const createNewRequirementDefinition = (): RequirementDefinitionItem => {
        return {
            id: -1, title: '', icon: '', requirementTypeTitle: '', isVoided: false, sortKey: -1, requirementTypeId: -1, usage: '', defaultIntervalWeeks: - 1, rowVersion: '', fields: []
        };
    };

    const [requirementDefinitionId, setRequirementDefinitionId] = useState<number>();
    const [requirementTypes, setRequirementTypes] = useState<RequirementType[]>([]);
    const [requirementTypeSelectItems, setRequirementTypeSelectItems] = useState<SelectItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [requirementDefinition, setRequirementDefinition] = useState<RequirementDefinitionItem | null>(null);
    const [newRequirementDefinition, setNewRequirementDefinition] = useState<RequirementDefinitionItem | null>(null);
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [intervalSelectItems] = useState<SelectItem[]>(() => {
        return validWeekIntervals.map(value => {
            return {
                text: `${value} weeks`,
                value: value
            };
        });
    });

    const {
        preservationApiClient,
    } = usePlantConfigContext();

    const getRequirementTypes = async (): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await preservationApiClient.getRequirementTypes(false);
            setRequirementTypes(response.data);
        } catch (error) {
            console.error('Get requirement types failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        getRequirementTypes();
    }, []);

    useEffect(() => {
        setRequirementDefinitionId(props.requirementDefinitionId);
    }, [props.requirementDefinitionId]);

    //Fetch req. types, and create select items
    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const items: SelectItem[] = [];
                requirementTypes.forEach(requirementType => {
                    items.push({
                        text: requirementType.title,
                        value: requirementType.id,
                        icon: <PreservationIcon variant={requirementType.icon} />
                    });
                });
                setRequirementTypeSelectItems(items);

            } catch (error) {
                console.error('Get requirement types failed: ', error.message, error.data);
                showSnackbarNotification(error.message, 5000);
            }
        })();
    }, [requirementTypes]);

    //Set dirty when forms is updated
    useEffect(() => {
        if (newRequirementDefinition === null) {
            return;
        }
        if (JSON.stringify(requirementDefinition) == JSON.stringify(newRequirementDefinition)) {
            setIsDirty(false);
        } else {
            if (newRequirementDefinition.requirementTypeId && newRequirementDefinition.sortKey && newRequirementDefinition.title) {
                setIsDirty(true);
            } else {
                setIsDirty(false);
            }
        }
    }, [newRequirementDefinition]);

    const cloneRequirementDefinition = (requirementDefinition: RequirementDefinitionItem): RequirementDefinitionItem => {
        return JSON.parse(JSON.stringify(requirementDefinition));
    };

    //Find and set the requirement definition
    useEffect((): void => {
        if (requirementTypes.length === 0) {
            return;
        }

        if (props.requirementDefinitionId > -1) {
            requirementTypes.forEach((reqType) => {
                const reqDef = reqType.requirementDefinitions.find((def) => def.id === props.requirementDefinitionId);
                if (reqDef) {
                    const requirementDef: RequirementDefinitionItem = {
                        ...reqDef,
                        icon: reqType.icon,
                        requirementTypeId: reqType.id,
                        requirementTypeTitle: reqType.title,
                        rowVersion: reqType.rowVersion
                    };
                    setRequirementDefinition(requirementDef);
                    setNewRequirementDefinition(requirementDef);
                }
            });
        } else {
            setNewRequirementDefinition(createNewRequirementDefinition());
        }
    }, [requirementDefinitionId, requirementTypes]);

    const saveNew = async (): Promise<void> => {
        if (newRequirementDefinition) {
            try {
                const requirementDefinitionId = await preservationApiClient.addRequirementDefinition(
                    newRequirementDefinition.requirementTypeId,
                    newRequirementDefinition.sortKey,
                    newRequirementDefinition.usage,
                    newRequirementDefinition.title,
                    newRequirementDefinition.defaultIntervalWeeks,
                    newRequirementDefinition.fields
                );
                setRequirementDefinitionId(requirementDefinitionId);
                props.setDirtyLibraryType();
                showSnackbarNotification('New requirement definition is saved.', 5000);
            } catch (error) {
                console.error('Add requirement definition failed: ', error.message, error.data);
                showSnackbarNotification(error.message, 5000);
            }
        }
    };

    const saveUpdated = async (): Promise<void> => {
        if (newRequirementDefinition) {
            try {
                await preservationApiClient.updateRequirementDefinition(
                    newRequirementDefinition.id,
                    newRequirementDefinition.requirementTypeId,
                    newRequirementDefinition.title,
                    newRequirementDefinition.defaultIntervalWeeks,
                    newRequirementDefinition.usage,
                    newRequirementDefinition.sortKey,
                    newRequirementDefinition.rowVersion,
                    newRequirementDefinition.fields);

                await getRequirementTypes();
                showSnackbarNotification('Changes for requirement definition is saved.', 5000);
                props.setDirtyLibraryType();
            } catch (error) {
                console.error('Update requirement definition failed: ', error.message, error.data);
                showSnackbarNotification(error.message, 5000);
            }
        }
    };

    const handleSave = (): void => {
        if (newRequirementDefinition && newRequirementDefinition.id === -1) {
            saveNew();
        } else {
            saveUpdated();
        }
    };

    const cancelChanges = (): void => {
        if (isDirty && !confirm('Do you want to cancel changes without saving?')) {
            return;
        }
        setRequirementDefinition(null);
        props.cancel();
    };

    const voidRequirementDefinition = async (): Promise<void> => {
        if (requirementDefinition) {
            setIsLoading(true);
            try {
                //          await preservationApiClient.voidRequirementType(requirementDefinition.id, requirementDefinition.rowVersion);
                //       getRequirementDefinition(requirementDefinition.id);
                props.setDirtyLibraryType();
                showSnackbarNotification('Requirement definition is voided.', 5000);
            } catch (error) {
                console.error('Error occured when trying to requirement definition: ', error.message, error.data);
                showSnackbarNotification(error.message, 5000);
            }
            setIsLoading(false);
        }
    };

    const unvoidRequirementDefinition = async (): Promise<void> => {
        if (requirementDefinition) {
            setIsLoading(true);
            try {
                //                await preservationApiClient.unvoidRequirementDefinition(requirementDefinition.id, requirementDefinition.rowVersion);
                //    getRequirementDefinition(requirementDefinition.id);
                props.setDirtyLibraryType();
                showSnackbarNotification('Requirement definition is unvoided.', 5000);
            } catch (error) {
                console.error('Error occured when trying to unvoid requirement definition: ', error.message, error.data);
                showSnackbarNotification(error.message, 5000);
            }
            setIsLoading(false);
        }
    };

    const addField = (): void => {
        if (newRequirementDefinition) {
            newRequirementDefinition.fields.push({ label: '', sortKey: -1, fieldType: '', unit: '', showPrevious: false });
            setNewRequirementDefinition(cloneRequirementDefinition(newRequirementDefinition));
        }
    };

    if (isLoading) {
        return <Spinner large />;
    }

    const getSelectedReqTypeText = (): JSX.Element => {

        if (newRequirementDefinition && newRequirementDefinition.requirementTypeId != -1) {
            return <SelectText>
                <PreservationIcon variant={newRequirementDefinition.icon} /> {newRequirementDefinition.requirementTypeTitle}
            </SelectText>;
        }
        return <div>Select requirement</div>;
    };

    if (newRequirementDefinition === null) {
        return (<div></div>);
    }

    return (
        <Container>
            {newRequirementDefinition.isVoided &&
                <Typography variant="caption" style={{ marginLeft: 'calc(var(--grid-unit) * 2)', fontWeight: 'bold' }}>Requirement definition is voided</Typography>
            }
            <ButtonContainer>
                {newRequirementDefinition.isVoided &&
                    <Button variant="outlined" onClick={unvoidRequirementDefinition}>
                        Unvoid
                    </Button>
                }

                {!newRequirementDefinition.isVoided &&
                    <Button variant="outlined" onClick={voidRequirementDefinition}>
                        Void
                    </Button>
                }
                <ButtonSpacer />
                <Button variant="outlined" onClick={cancelChanges} disabled={newRequirementDefinition.isVoided}>
                    Cancel
                </Button>
                <ButtonSpacer />
                <Button onClick={handleSave} disabled={newRequirementDefinition.isVoided || !isDirty}>
                    Save
                </Button>
            </ButtonContainer>

            <InputContainer>
                <FormFieldSpacer style={{ width: '100px' }}>
                    <TextField
                        id={'sortKey'}
                        label='SortKey'
                        value={newRequirementDefinition.sortKey == -1 ? '' : newRequirementDefinition.sortKey}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                            newRequirementDefinition.sortKey = Number(e.target.value);
                            setNewRequirementDefinition(cloneRequirementDefinition(newRequirementDefinition));
                        }}
                        placeholder="Write Here"
                        disabled={newRequirementDefinition.isVoided}
                    />
                </FormFieldSpacer>

                <FormFieldSpacer>
                    <SelectInput
                        onChange={(value: string): void => {
                            newRequirementDefinition.usage = value;
                            setNewRequirementDefinition(cloneRequirementDefinition(newRequirementDefinition));

                        }}
                        data={requirementUsageSelectItems}
                        label={'Select usage'}
                        disabled={newRequirementDefinition.isVoided}
                    >
                        {newRequirementDefinition.usage}
                    </SelectInput>
                </FormFieldSpacer>
            </InputContainer>
            <InputContainer>
                <FormFieldSpacer>
                    <SelectInput
                        onChange={(value: number): void => {
                            newRequirementDefinition.requirementTypeId = value;
                            const reqType = requirementTypes.find((type) => type.id === newRequirementDefinition.requirementTypeId);
                            if (reqType) {
                                newRequirementDefinition.icon = reqType.icon;
                                newRequirementDefinition.requirementTypeTitle = reqType.title;
                            }
                            setNewRequirementDefinition(cloneRequirementDefinition(newRequirementDefinition));

                        }}
                        data={requirementTypeSelectItems}
                        label={'Select Requirement Type'}
                        disabled={newRequirementDefinition.isVoided}
                    >
                        {getSelectedReqTypeText()}
                    </SelectInput>
                </FormFieldSpacer>
                <FormFieldSpacer style={{ width: '300px' }}>
                    <TextField
                        id={'title'}
                        label='Title for this type'
                        value={newRequirementDefinition.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                            newRequirementDefinition.title = e.target.value;
                            setNewRequirementDefinition(cloneRequirementDefinition(newRequirementDefinition));
                        }}
                        placeholder="Write Here"
                        disabled={newRequirementDefinition.isVoided}
                    />
                </FormFieldSpacer>
            </InputContainer>
            <InputContainer>
                <SelectInput
                    onChange={(value: number): void => {
                        newRequirementDefinition.defaultIntervalWeeks = value;
                        setNewRequirementDefinition(cloneRequirementDefinition(newRequirementDefinition));
                    }}
                    data={intervalSelectItems}
                    label={'Set default interval'}
                    disabled={newRequirementDefinition.isVoided}
                >
                    {newRequirementDefinition.defaultIntervalWeeks} Weeks
                </SelectInput>
            </InputContainer>


            {newRequirementDefinition.fields.map(field => {
                return (
                    <InputContainer key={field.label}>
                        <FormFieldSpacer>
                            <SelectInput
                                onChange={(value: string): void => {
                                    field.fieldType = value;
                                    setNewRequirementDefinition(cloneRequirementDefinition(newRequirementDefinition));
                                }}
                                data={fieldTypesSelectItems}
                                label={'Type'}
                                disabled={newRequirementDefinition.isVoided}
                            >
                                {field.fieldType}
                            </SelectInput>
                        </FormFieldSpacer>

                        <FormFieldSpacer style={{ width: '300px' }}>
                            <TextField
                                id={'label'}
                                label='Label'
                                value={field.label}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                    field.label = e.target.value;
                                    setNewRequirementDefinition(cloneRequirementDefinition(newRequirementDefinition));
                                }}
                                placeholder="Write Here"
                                disabled={newRequirementDefinition.isVoided}
                            />
                        </FormFieldSpacer>
                        <FormFieldSpacer style={{ width: '100px' }}>
                            <TextField
                                id={'unit'}
                                label='Unit'
                                value={field.unit}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                    field.unit = e.target.value;
                                    setNewRequirementDefinition(cloneRequirementDefinition(newRequirementDefinition));
                                }}
                                placeholder="Write Here"
                                disabled={newRequirementDefinition.isVoided}
                            />
                        </FormFieldSpacer>

                    </InputContainer>

                );
            })}

            <InputContainer>
                <IconContainer>
                    <Button variant='ghost' onClick={(): void => addField()}>
                        {addIcon} Add field
                    </Button>
                </IconContainer>
            </InputContainer>


        </Container>
    );
};

export default PreservationRequirementDefinition;
