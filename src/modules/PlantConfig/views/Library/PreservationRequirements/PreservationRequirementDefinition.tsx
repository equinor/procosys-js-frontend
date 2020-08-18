import React, { useState, useEffect } from 'react';
import { usePlantConfigContext } from '@procosys/modules/PlantConfig/context/PlantConfigContext';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { Container, InputContainer, FormFieldSpacer, ButtonContainer, ButtonSpacer, SelectText, IconContainer, FieldsContainer, FormHeader } from './PreservationRequirements.style';
import { TextField, Typography, Button } from '@equinor/eds-core-react';
import SelectInput, { SelectItem } from '../../../../../components/Select';
import Spinner from '@procosys/components/Spinner';
import PreservationIcon from '@procosys/components/PreservationIcon';
import EdsIcon from '@procosys/components/EdsIcon';
import Checkbox from './../../../../../components/Checkbox';

const addIcon = <EdsIcon name='add' size={16} />;
const upIcon = <EdsIcon name='arrow_up' size={16} />;
const downIcon = <EdsIcon name='arrow_down' size={16} />;
const deleteIcon = <EdsIcon name='delete_to_trash' size={16} />;
const voidIcon = <EdsIcon name='delete_forever' size={16} />;
const unvoidIcon = <EdsIcon name='restore_from_trash' size={16} />;

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
        rowVersion: string;
        fields: [{
            id: number;
            label: string;
            isVoided: boolean;
            sortKey: number;
            fieldType: string;
            unit: string;
            showPrevious: boolean;
            rowVersion: string;
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
    id: number | null;
    label: string;
    sortKey: number;
    fieldType: string;
    unit: string;
    showPrevious: boolean;
    isVoided: boolean;
    rowVersion: string | null;
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

    const [requirementDefinitionId, setRequirementDefinitionId] = useState<number>();
    const [requirementTypes, setRequirementTypes] = useState<RequirementType[]>([]);
    const [requirementTypeSelectItems, setRequirementTypeSelectItems] = useState<SelectItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [requirementDefinition, setRequirementDefinition] = useState<RequirementDefinitionItem | null>(null);
    const [newRequirementDefinition, setNewRequirementDefinition] = useState<RequirementDefinitionItem | null>(null);
    const [isDirtyAndValid, setIsDirtyAndValid] = useState<boolean>(false);
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
            const response = await preservationApiClient.getRequirementTypes(true);
            setRequirementTypes(response.data);
        } catch (error) {
            console.error('Get requirement types failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
        }
        setIsLoading(false);
    };

    //Get the requirement types initially
    useEffect(() => {
        getRequirementTypes();
    }, []);

    //Update requirement definition id
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

    const isDirty = (): boolean => {
        return JSON.stringify(requirementDefinition) !== JSON.stringify(newRequirementDefinition);
    };

    //Set dirty when forms is updated
    useEffect(() => {
        if (newRequirementDefinition === null) {
            return;
        }

        let fieldsAreValid = true;
        newRequirementDefinition.fields.forEach((field) => {
            if (!field.fieldType || !field.label || (field.fieldType === 'Number' && !field.unit)) {
                fieldsAreValid = false;
                return;
            }
        });
        if (!fieldsAreValid) {
            setIsDirtyAndValid(false);
            return;
        }

        if (!isDirty()) {
            setIsDirtyAndValid(false);
        } else if (newRequirementDefinition.sortKey != -1 && newRequirementDefinition.usage && newRequirementDefinition.requirementTypeId != -1
            && newRequirementDefinition.title && newRequirementDefinition.defaultIntervalWeeks != -1) {
            setIsDirtyAndValid(true);
        } else {
            setIsDirtyAndValid(false);
        }
    }, [newRequirementDefinition]);

    const cloneRequirementDefinition = (reqDef: RequirementDefinitionItem): RequirementDefinitionItem => {
        return JSON.parse(JSON.stringify(reqDef));
    };

    //Find and set the requirement definition
    useEffect((): void => {
        if (requirementTypes.length === 0) {
            return;
        }

        if (requirementDefinitionId && requirementDefinitionId > -1) {
            requirementTypes.forEach((reqType) => {
                const reqDef = reqType.requirementDefinitions.find((def) => def.id === requirementDefinitionId);
                if (reqDef) {
                    const requirementDef: RequirementDefinitionItem = {
                        ...reqDef,
                        icon: reqType.icon,
                        requirementTypeId: reqType.id,
                        requirementTypeTitle: reqType.title,
                    };
                    setRequirementDefinition(requirementDef);
                    setNewRequirementDefinition(cloneRequirementDefinition(requirementDef)); //must clone here! 
                }
            });
        } else {
            setNewRequirementDefinition({
                id: -1, title: '', icon: '', requirementTypeTitle: '', isVoided: false, sortKey: -1, requirementTypeId: -1, usage: '', defaultIntervalWeeks: - 1, rowVersion: '', fields: []
            });
            setRequirementDefinition({
                id: -1, title: '', icon: '', requirementTypeTitle: '', isVoided: false, sortKey: -1, requirementTypeId: -1, usage: '', defaultIntervalWeeks: - 1, rowVersion: '', fields: []
            });

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
                await getRequirementTypes();
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
                const newFields = newRequirementDefinition.fields.filter((field) => field.id == null);
                const updatedFields = newRequirementDefinition.fields.filter((field) => field.id != null);

                await preservationApiClient.updateRequirementDefinition(
                    newRequirementDefinition.requirementTypeId,
                    newRequirementDefinition.id,
                    newRequirementDefinition.title,
                    newRequirementDefinition.defaultIntervalWeeks,
                    newRequirementDefinition.usage,
                    newRequirementDefinition.sortKey,
                    newRequirementDefinition.rowVersion,
                    updatedFields,
                    newFields
                );

                getRequirementTypes();
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
        if (isDirty() && !confirm('Do you want to cancel changes without saving?')) {
            return;
        }
        setRequirementDefinition(null);
        props.cancel();
    };

    const voidRequirementDefinition = async (): Promise<void> => {
        if (newRequirementDefinition) {
            setIsLoading(true);
            try {
                await preservationApiClient.voidRequirementDefinition(newRequirementDefinition.requirementTypeId, newRequirementDefinition.id, newRequirementDefinition.rowVersion);
                getRequirementTypes();
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
        if (newRequirementDefinition) {
            setIsLoading(true);
            try {
                await preservationApiClient.unvoidRequirementDefinition(newRequirementDefinition.requirementTypeId, newRequirementDefinition.id, newRequirementDefinition.rowVersion);
                getRequirementTypes();
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
            let largestSortKey = 0;
            newRequirementDefinition.fields.forEach(field => largestSortKey = Math.max(field.sortKey, largestSortKey));
            largestSortKey++;
            newRequirementDefinition.fields.push({ id: null, isVoided: false, rowVersion: null, label: '', sortKey: largestSortKey, fieldType: '', unit: '', showPrevious: false });
            setNewRequirementDefinition(cloneRequirementDefinition(newRequirementDefinition));
        }
    };

    const moveFieldUp = (index: number): void => {
        if (newRequirementDefinition && index > 0) {
            const sortKeyTemp = newRequirementDefinition.fields[index].sortKey;
            newRequirementDefinition.fields[index].sortKey = newRequirementDefinition.fields[index - 1].sortKey;
            newRequirementDefinition.fields[index - 1].sortKey = sortKeyTemp;
            newRequirementDefinition.fields.sort((a, b) => a.sortKey > b.sortKey ? 1 : -1);
            setNewRequirementDefinition(cloneRequirementDefinition(newRequirementDefinition));
        }
    };

    const moveFieldDown = (index: number): void => {
        if (newRequirementDefinition && index + 1 < newRequirementDefinition.fields.length) {
            const sortKeyTemp = newRequirementDefinition.fields[index].sortKey;
            newRequirementDefinition.fields[index].sortKey = newRequirementDefinition.fields[index + 1].sortKey;
            newRequirementDefinition.fields[index + 1].sortKey = sortKeyTemp;
            newRequirementDefinition.fields.sort((a, b) => a.sortKey > b.sortKey ? 1 : -1);
            setNewRequirementDefinition(cloneRequirementDefinition(newRequirementDefinition));
        }
    };

    const deleteField = (index: number): void => {
        if (newRequirementDefinition) {
            newRequirementDefinition.fields.splice(index, 1);
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
        return <div>Select type</div>;
    };

    if (newRequirementDefinition === null) {
        return (<div></div>);
    }

    return (
        <Container>
            {newRequirementDefinition.isVoided &&
                <Typography variant='caption' style={{ marginLeft: 'calc(var(--grid-unit) * 2)', fontWeight: 'bold' }}>Requirement definition is voided</Typography>
            }
            <ButtonContainer>
                {newRequirementDefinition.isVoided &&
                    <Button className='buttonIcon' variant='outlined' onClick={unvoidRequirementDefinition}>
                        {unvoidIcon} Unvoid
                    </Button>
                }
                {!newRequirementDefinition.isVoided && newRequirementDefinition.id != -1 &&
                    < Button className='buttonIcon' variant='outlined' onClick={voidRequirementDefinition}>
                        {voidIcon} Void
                    </Button>
                }
                <ButtonSpacer />
                <Button variant='outlined' onClick={cancelChanges} disabled={newRequirementDefinition.isVoided}>
                    Cancel
                </Button>
                <ButtonSpacer />
                <Button onClick={handleSave} disabled={newRequirementDefinition.isVoided || !isDirtyAndValid}>
                    Save
                </Button>
            </ButtonContainer>
            <InputContainer>
                <FormFieldSpacer style={{ marginTop: '-3px', width: '100px' }}>
                    <TextField
                        id={'sortKey'}
                        label='SortKey'
                        value={newRequirementDefinition.sortKey == -1 ? '' : newRequirementDefinition.sortKey}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                            newRequirementDefinition.sortKey = Number(e.target.value);
                            setNewRequirementDefinition(cloneRequirementDefinition(newRequirementDefinition));
                        }}
                        placeholder='Write Here'
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
                        {newRequirementDefinition.usage && newRequirementDefinition.usage || 'Select usage'}
                    </SelectInput>
                </FormFieldSpacer>
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
            </InputContainer>
            <InputContainer>
                <FormFieldSpacer style={{ marginTop: '-3px', width: '300px' }}>
                    <TextField
                        id={'title'}
                        label='Title for this definition'
                        value={newRequirementDefinition.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                            newRequirementDefinition.title = e.target.value;
                            setNewRequirementDefinition(cloneRequirementDefinition(newRequirementDefinition));
                        }}
                        placeholder='Write Here'
                        disabled={newRequirementDefinition.isVoided}
                    />
                </FormFieldSpacer>
                <FormFieldSpacer>
                    <SelectInput
                        onChange={(value: number): void => {
                            newRequirementDefinition.defaultIntervalWeeks = value;
                            setNewRequirementDefinition(cloneRequirementDefinition(newRequirementDefinition));
                        }}
                        data={intervalSelectItems}
                        label={'Set default interval'}
                        disabled={newRequirementDefinition.isVoided}
                    >
                        {newRequirementDefinition.defaultIntervalWeeks > -1 && `${newRequirementDefinition.defaultIntervalWeeks} weeks` || 'Select interval'}
                    </SelectInput>
                </FormFieldSpacer>
            </InputContainer>
            <FormHeader>
                Add fields to this requirement definition (optional)
            </FormHeader>
            <FieldsContainer>
                {newRequirementDefinition.fields.map((field, index) => {
                    return (
                        <React.Fragment key={`field._${index}`}>
                            <FormFieldSpacer>
                                <div style={{ width: '100%' }}>
                                    <SelectInput
                                        onChange={(value: string): void => {
                                            field.fieldType = value;
                                            setNewRequirementDefinition(cloneRequirementDefinition(newRequirementDefinition));
                                        }}
                                        data={fieldTypesSelectItems}
                                        label={'Type'}
                                        disabled={newRequirementDefinition.isVoided || field.id != null || field.isVoided}
                                    >
                                        {field.fieldType && field.fieldType || 'Select field type'}
                                    </SelectInput>
                                </div>
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
                                    placeholder='Write Here'
                                    disabled={newRequirementDefinition.isVoided || field.isVoided}
                                />
                            </FormFieldSpacer>
                            {field.fieldType == 'Number' &&
                                <FormFieldSpacer style={{ width: '100px' }}>
                                    <TextField
                                        id={'unit'}
                                        label='Unit'
                                        value={field.unit}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                            field.unit = e.target.value;
                                            setNewRequirementDefinition(cloneRequirementDefinition(newRequirementDefinition));
                                        }}
                                        placeholder='Write Here'

                                        disabled={newRequirementDefinition.isVoided || field.isVoided}
                                    />

                                </FormFieldSpacer>
                            }
                            {field.fieldType != 'Number' &&
                                <div></div>
                            }
                            {field.fieldType == 'Number' &&
                                <div style={{ paddingLeft: 'calc(var(--grid-unit) * 2) ', paddingRight: 'calc(var(--grid-unit) * 2)', paddingBottom: 'calc(var(--grid-unit) + 6px)' }}>
                                    <Checkbox
                                        checked={field.showPrevious}
                                        disabled={newRequirementDefinition.isVoided || field.isVoided}
                                        onChange={(checked: boolean): void => {
                                            field.showPrevious = checked;
                                            setNewRequirementDefinition(cloneRequirementDefinition(newRequirementDefinition));
                                        }}
                                    >
                                        <Typography variant='body_long'>Show previous value</Typography>
                                    </Checkbox>
                                </div>
                            }
                            {field.fieldType != 'Number' &&
                                <div></div>
                            }
                            <FormFieldSpacer>
                                {
                                    <>
                                        <Button disabled={newRequirementDefinition.isVoided} variant='ghost' onClick={(): void => moveFieldUp(index)}>
                                            {upIcon}
                                        </Button>
                                        <Button disabled={newRequirementDefinition.isVoided} variant='ghost' onClick={(): void => moveFieldDown(index)}>
                                            {downIcon}
                                        </Button>
                                    </>
                                }
                                {(field.id == null) &&
                                    (<Button variant='ghost' title="Delete" onClick={(): void => deleteField(index)}>
                                        {deleteIcon}
                                    </Button>)
                                }
                                {(!field.isVoided && field.id != null) &&
                                    (<Button disabled={newRequirementDefinition.isVoided} className='voidUnvoid' variant='ghost'
                                        onClick={(): void => {
                                            field.isVoided = true;
                                            setNewRequirementDefinition(cloneRequirementDefinition(newRequirementDefinition));
                                        }}>
                                        {voidIcon} Void
                                    </Button>)
                                }

                                {(field.isVoided) &&
                                    (<Button disabled={newRequirementDefinition.isVoided} className='voidUnvoid' variant='ghost'
                                        onClick={(): void => {
                                            field.isVoided = false;
                                            setNewRequirementDefinition(cloneRequirementDefinition(newRequirementDefinition));

                                        }}>
                                        {unvoidIcon} Unvoid
                                    </Button>)
                                }
                            </FormFieldSpacer>

                        </React.Fragment>
                    );
                })}

            </FieldsContainer >
            <InputContainer>
                <IconContainer>
                    <Button variant='ghost' onClick={(): void => addField()}>
                        {addIcon} Add field
                    </Button>
                </IconContainer>
            </InputContainer>
        </Container >
    );
};

export default PreservationRequirementDefinition;
