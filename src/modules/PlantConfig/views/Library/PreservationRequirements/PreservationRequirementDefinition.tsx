import {
    Breadcrumbs,
    ButtonSpacer,
    Container,
    FieldsContainer,
    FormFieldSpacer,
    FormHeader,
    IconContainer,
    InputContainer,
    SelectText,
} from './PreservationRequirements.style';
import { Button, TextField, Typography } from '@equinor/eds-core-react';
import React, { useEffect, useMemo, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../../components/Select';

import { Canceler } from 'axios';
import Checkbox from './../../../../../components/Checkbox';
import EdsIcon from '@procosys/components/EdsIcon';
import PreservationIcon from '@procosys/components/PreservationIcon';
import { RequirementType } from './types';
import Spinner from '@procosys/components/Spinner';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { tokens } from '@equinor/eds-tokens';
import {
    unsavedChangesConfirmationMessage,
    useDirtyContext,
} from '@procosys/core/DirtyContext';
import { usePlantConfigContext } from '@procosys/modules/PlantConfig/context/PlantConfigContext';
import {
    ButtonContainer,
    ButtonContainerLeft,
    ButtonContainerRight,
} from '../Library.style';

const addIcon = <EdsIcon name="add" />;
const upIcon = <EdsIcon name="arrow_up" />;
const downIcon = <EdsIcon name="arrow_down" />;
const deleteIcon = <EdsIcon name="delete_to_trash" />;
const voidIcon = <EdsIcon name="delete_forever" />;
const unvoidIcon = <EdsIcon name="restore_from_trash" />;
const moduleName = 'PreservationRequirementDefinition';

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
    isInUse: boolean;
    rowVersion: string;
    fields: Field[];
    needsUserInput: boolean;
}

interface Field {
    id: number | null;
    label: string;
    sortKey: number;
    fieldType: string;
    unit: string;
    showPrevious: boolean;
    isVoided: boolean;
    isInUse: boolean;
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
    { value: 'Checkbox', text: 'Checkbox' },
    { value: 'Number', text: 'Number' },
    { value: 'Info', text: 'Info' },
    { value: 'Attachment', text: 'Attachment' },
];

type PreservationRequirementDefinitionProps = {
    requirementDefinitionId: number;
    setDirtyLibraryType: () => void;
    cancel: () => void;
    addNewRequirementType: () => void;
};

const PreservationRequirementDefinition = (
    props: PreservationRequirementDefinitionProps
): JSX.Element => {
    const { setDirtyStateFor, unsetDirtyStateFor } = useDirtyContext();
    const [requirementDefinitionId, setRequirementDefinitionId] =
        useState<number>();
    const [requirementTypes, setRequirementTypes] = useState<RequirementType[]>(
        []
    );
    const [requirementTypeSelectItems, setRequirementTypeSelectItems] =
        useState<SelectItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [requirementDefinition, setRequirementDefinition] =
        useState<RequirementDefinitionItem | null>(null);
    const [newRequirementDefinition, setNewRequirementDefinition] =
        useState<RequirementDefinitionItem | null>(null);
    const [isDirtyAndValid, setIsDirtyAndValid] = useState<boolean>(false);
    const [intervalSelectItems] = useState<SelectItem[]>(() => {
        return validWeekIntervals.map((value) => {
            return {
                text: `${value} weeks`,
                value: value,
            };
        });
    });
    const [titleError, setTitleError] = useState<string | null>(null);

    const createNewRequirementDefinition = (): RequirementDefinitionItem => {
        return {
            id: -1,
            title: '',
            icon: '',
            requirementTypeTitle: '',
            isInUse: false,
            isVoided: false,
            sortKey: -1,
            requirementTypeId: -1,
            usage: '',
            defaultIntervalWeeks: -1,
            rowVersion: '',
            fields: [],
            needsUserInput: false,
        };
    };

    const { preservationApiClient } = usePlantConfigContext();

    const getRequirementTypes = async (): Promise<void> => {
        setIsLoading(true);
        try {
            const response =
                await preservationApiClient.getRequirementTypes(true);
            setRequirementTypes(response);
        } catch (error) {
            console.error(
                'Get requirement types failed: ',
                error.message,
                error.data
            );
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
        if (requirementDefinition && requirementTypes) {
            try {
                const items: SelectItem[] = [];
                requirementTypes.forEach((requirementType) => {
                    if (
                        !requirementType.isVoided ||
                        requirementDefinition.requirementTypeId ===
                            requirementType.id
                    ) {
                        items.push({
                            text: requirementType.title,
                            value: requirementType.id,
                            icon: (
                                <PreservationIcon
                                    variant={requirementType.icon}
                                />
                            ),
                        });
                    }
                });
                setRequirementTypeSelectItems(items);
            } catch (error) {
                console.error(
                    'Get requirement types failed: ',
                    error.message,
                    error.data
                );
                showSnackbarNotification(error.message, 5000);
            }
        }
    }, [requirementTypes, requirementDefinition]);

    const isDirty = useMemo((): boolean => {
        return (
            JSON.stringify(requirementDefinition) !==
            JSON.stringify(newRequirementDefinition)
        );
    }, [requirementDefinition, newRequirementDefinition]);

    //Set dirty when forms is updated
    useEffect(() => {
        if (newRequirementDefinition === null) {
            return;
        }

        let fieldsAreValid = true;
        newRequirementDefinition.fields.forEach((field) => {
            if (
                !field.fieldType ||
                !field.label ||
                (field.fieldType === 'Number' && !field.unit)
            ) {
                fieldsAreValid = false;
                return;
            }
        });
        if (!fieldsAreValid) {
            setIsDirtyAndValid(false);
            return;
        }

        if (!isDirty) {
            setIsDirtyAndValid(false);
        } else if (
            newRequirementDefinition.sortKey != -1 &&
            newRequirementDefinition.usage &&
            newRequirementDefinition.requirementTypeId != -1 &&
            newRequirementDefinition.title &&
            newRequirementDefinition.defaultIntervalWeeks != -1
        ) {
            setIsDirtyAndValid(true);
        } else {
            setIsDirtyAndValid(false);
        }

        if (isDirty) {
            setDirtyStateFor(moduleName);
        } else {
            unsetDirtyStateFor(moduleName);
        }

        return (): void => {
            unsetDirtyStateFor(moduleName);
        };
    }, [newRequirementDefinition, requirementDefinition]);

    const cloneRequirementDefinition = (
        reqDef: RequirementDefinitionItem
    ): RequirementDefinitionItem => {
        return JSON.parse(JSON.stringify(reqDef));
    };

    //Find and set the requirement definition
    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            if (
                requirementTypes &&
                requirementTypes.length > 0 &&
                requirementDefinitionId &&
                requirementDefinitionId > -1
            ) {
                for (const reqType of requirementTypes) {
                    const reqDef = reqType.requirementDefinitions.find(
                        (def) => def.id === requirementDefinitionId
                    );
                    if (reqDef) {
                        try {
                            //Note: We need to fetch the single requirement type, to get the 'inUse' flag.
                            const singleReqType: RequirementType =
                                await preservationApiClient.getRequirementType(
                                    reqType.id,
                                    (cancel: Canceler) => {
                                        requestCancellor = cancel;
                                        console.log(
                                            'requestCancellor assigned',
                                            requestCancellor
                                        );
                                    }
                                );
                            const singleReqDef =
                                singleReqType.requirementDefinitions.find(
                                    (def) => def.id === requirementDefinitionId
                                );
                            if (singleReqDef) {
                                const requirementDef: RequirementDefinitionItem =
                                    {
                                        ...singleReqDef,
                                        icon: reqType.icon,
                                        requirementTypeId: reqType.id,
                                        requirementTypeTitle: reqType.title,
                                    };
                                setRequirementDefinition(requirementDef);
                                setNewRequirementDefinition(
                                    cloneRequirementDefinition(requirementDef)
                                ); //must clone here!
                            }
                        } catch (error) {
                            if (error.response) {
                                console.error(
                                    'Server responded with:',
                                    error.response.data
                                );
                                if (error.response.data.errors) {
                                    console.error(
                                        'Validation errors:',
                                        error.response.data.errors
                                    );
                                }
                            } else {
                                console.error(
                                    'Add requirement definition failed:',
                                    error.message
                                );
                            }
                            showSnackbarNotification(error.message, 5000);
                        }
                    }
                }
            } else {
                setNewRequirementDefinition(createNewRequirementDefinition());
                setRequirementDefinition(createNewRequirementDefinition());
            }
        })();
        return (): void => {
            if (requestCancellor) {
                console.log('Cancelling request', requestCancellor);
                // requestCancellor();
            }
        };
    }, [requirementDefinitionId, requirementTypes]);

    const saveNew = async (): Promise<void> => {
        if (newRequirementDefinition) {
            setIsLoading(true);
            try {
                const requirementDefinitionId =
                    await preservationApiClient.addRequirementDefinition(
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
                showSnackbarNotification(
                    'New requirement definition is saved.',
                    5000
                );
            } catch (error) {
                if (error.response) {
                    console.error('Full server response:', error.response);
                    console.error(
                        'Server responded with:',
                        error.response.data
                    );
                    if (error.response.data.errors) {
                        console.error(
                            'Validation errors:',
                            error.response.data.errors
                        );
                    }
                } else {
                    console.error(
                        'Add requirement definition failed:',
                        error.message
                    );
                }
                showSnackbarNotification(error.message, 5000);
            }
            setIsLoading(false);
        }
    };

    const saveUpdated = async (): Promise<void> => {
        if (newRequirementDefinition) {
            setIsLoading(true);
            try {
                const newFields = newRequirementDefinition.fields.filter(
                    (field) => field.id == null
                );
                const updatedFields = newRequirementDefinition.fields.filter(
                    (field) => field.id != null
                );

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

                await getRequirementTypes();
                showSnackbarNotification(
                    'Changes for requirement definition are saved.',
                    5000
                );
                props.setDirtyLibraryType();
            } catch (error) {
                console.error(
                    'Update requirement definition failed: ',
                    error.message,
                    error.data
                );
                showSnackbarNotification(error.message, 5000);
            }
            setIsLoading(false);
        }
    };

    const handleSave = (): void => {
        if (newRequirementDefinition && newRequirementDefinition.id === -1) {
            saveNew();
        } else {
            saveUpdated();
        }
    };

    const confirmDiscardingChangesIfExist = (): boolean => {
        return !isDirty || confirm(unsavedChangesConfirmationMessage);
    };

    const cancelChanges = (): void => {
        if (confirmDiscardingChangesIfExist()) {
            setRequirementDefinition(null);
            props.cancel();
        }
    };

    const initNewRequirementType = (): void => {
        if (confirmDiscardingChangesIfExist()) {
            props.addNewRequirementType();
        }
    };

    const initNewRequirementDefinition = (): void => {
        if (confirmDiscardingChangesIfExist()) {
            setNewRequirementDefinition(createNewRequirementDefinition());
        }
    };

    const voidRequirementDefinition = async (): Promise<void> => {
        if (newRequirementDefinition && confirmDiscardingChangesIfExist()) {
            setIsLoading(true);
            try {
                await preservationApiClient.voidRequirementDefinition(
                    newRequirementDefinition.requirementTypeId,
                    newRequirementDefinition.id,
                    newRequirementDefinition.rowVersion
                );
                getRequirementTypes();
                props.setDirtyLibraryType();
                showSnackbarNotification(
                    'Requirement definition is voided.',
                    5000
                );
            } catch (error) {
                console.error(
                    'Error occured when trying to void requirement definition: ',
                    error.message,
                    error.data
                );
                showSnackbarNotification(error.message, 5000);
            }
            setIsLoading(false);
        }
    };

    const deleteRequirementDefinition = async (): Promise<void> => {
        if (newRequirementDefinition) {
            setIsLoading(true);
            try {
                await preservationApiClient.deleteRequirementDefinition(
                    newRequirementDefinition.requirementTypeId,
                    newRequirementDefinition.id,
                    newRequirementDefinition.rowVersion
                );
                getRequirementTypes();
                props.setDirtyLibraryType();
                props.cancel();
                showSnackbarNotification(
                    'Requirement definition is deleted.',
                    5000
                );
            } catch (error) {
                console.error(
                    'Error occured when trying to delete requirement definition: ',
                    error.message,
                    error.data
                );
                showSnackbarNotification(error.message, 5000);
            }
            setIsLoading(false);
        }
    };

    const unvoidRequirementDefinition = async (): Promise<void> => {
        if (newRequirementDefinition) {
            setIsLoading(true);
            try {
                await preservationApiClient.unvoidRequirementDefinition(
                    newRequirementDefinition.requirementTypeId,
                    newRequirementDefinition.id,
                    newRequirementDefinition.rowVersion
                );
                getRequirementTypes();
                props.setDirtyLibraryType();
                showSnackbarNotification(
                    'Requirement definition is unvoided.',
                    5000
                );
            } catch (error) {
                console.error(
                    'Error occured when trying to unvoid requirement definition: ',
                    error.message,
                    error.data
                );
                showSnackbarNotification(error.message, 5000);
            }
            setIsLoading(false);
        }
    };

    const addField = (): void => {
        if (newRequirementDefinition) {
            let largestSortKey = 0;
            newRequirementDefinition.fields.forEach(
                (field) =>
                    (largestSortKey = Math.max(field.sortKey, largestSortKey))
            );
            largestSortKey++;
            newRequirementDefinition.fields.push({
                id: null,
                isVoided: false,
                rowVersion: null,
                label: '',
                sortKey: largestSortKey,
                isInUse: false,
                fieldType: '',
                unit: '',
                showPrevious: false,
            });
            setNewRequirementDefinition(
                cloneRequirementDefinition(newRequirementDefinition)
            );
        }
    };

    const moveFieldUp = (index: number): void => {
        if (newRequirementDefinition && index > 0) {
            const sortKeyTemp = newRequirementDefinition.fields[index].sortKey;
            newRequirementDefinition.fields[index].sortKey =
                newRequirementDefinition.fields[index - 1].sortKey;
            newRequirementDefinition.fields[index - 1].sortKey = sortKeyTemp;
            newRequirementDefinition.fields.sort((a, b) =>
                a.sortKey > b.sortKey ? 1 : -1
            );
            setNewRequirementDefinition(
                cloneRequirementDefinition(newRequirementDefinition)
            );
        }
    };

    const moveFieldDown = (index: number): void => {
        if (
            newRequirementDefinition &&
            index + 1 < newRequirementDefinition.fields.length
        ) {
            const sortKeyTemp = newRequirementDefinition.fields[index].sortKey;
            newRequirementDefinition.fields[index].sortKey =
                newRequirementDefinition.fields[index + 1].sortKey;
            newRequirementDefinition.fields[index + 1].sortKey = sortKeyTemp;
            newRequirementDefinition.fields.sort((a, b) =>
                a.sortKey > b.sortKey ? 1 : -1
            );
            setNewRequirementDefinition(
                cloneRequirementDefinition(newRequirementDefinition)
            );
        }
    };

    const deleteField = (index: number): void => {
        if (newRequirementDefinition) {
            newRequirementDefinition.fields.splice(index, 1);
            setNewRequirementDefinition(
                cloneRequirementDefinition(newRequirementDefinition)
            );
        }
    };

    const canDeleteReqDef = (): boolean => {
        if (newRequirementDefinition) {
            if (
                newRequirementDefinition.isInUse ||
                newRequirementDefinition.fields.some((field) => field.isInUse)
            ) {
                return false;
            }
        }
        return true;
    };

    const showDeleteFieldButton = (field: Field): boolean => {
        if (requirementDefinition) {
            const origField = requirementDefinition.fields.find(
                (f) => f.id == field.id
            );
            if (
                field.id == null ||
                (origField &&
                    origField.isVoided &&
                    field.isVoided &&
                    !field.isInUse)
            ) {
                return true;
            }
        }
        return false;
    };

    if (isLoading) {
        return (
            <Container>
                <Breadcrumbs>
                    {'Library / Preservation requirements /'}
                </Breadcrumbs>
                <Spinner large />
            </Container>
        );
    }

    const getSelectedReqTypeText = (): JSX.Element => {
        if (
            newRequirementDefinition &&
            newRequirementDefinition.requirementTypeId != -1
        ) {
            return (
                <SelectText>
                    <PreservationIcon variant={newRequirementDefinition.icon} />{' '}
                    {newRequirementDefinition.requirementTypeTitle}
                </SelectText>
            );
        }
        return <div>Select type</div>;
    };

    if (newRequirementDefinition === null) {
        return <div></div>;
    }

    const getBreadcrumb = (): string => {
        let breadcrumbString = 'Library / Preservation requirements / ';
        if (newRequirementDefinition.id == -1) {
            return breadcrumbString;
        }
        breadcrumbString +=
            newRequirementDefinition.requirementTypeTitle + ' / ';
        if (newRequirementDefinition.needsUserInput) {
            return (
                breadcrumbString +
                'Requirements with required user input / ' +
                newRequirementDefinition.title
            );
        } else {
            return (
                breadcrumbString +
                'Mass update requirements / ' +
                newRequirementDefinition.title
            );
        }
    };

    const validateTitle = (title: string): boolean => {
        const hasSpecialCharacters = /[^a-zA-Z0-9 ]/g.test(title);
        if (hasSpecialCharacters) {
            setTitleError('Title cannot contain special characters');
            return false;
        }
        setTitleError(null);
        return true;
    };

    return (
        <Container>
            <Breadcrumbs>{getBreadcrumb()}</Breadcrumbs>
            {newRequirementDefinition.isVoided && (
                <Typography
                    variant="caption"
                    style={{
                        marginLeft: 'calc(var(--grid-unit) * 2)',
                        fontWeight: 'bold',
                    }}
                >
                    Requirement definition is voided
                </Typography>
            )}
            <ButtonContainer>
                <ButtonContainerLeft>
                    <Button
                        variant="ghost"
                        onClick={(): void => {
                            initNewRequirementType();
                        }}
                    >
                        {addIcon} New requirement type
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={(): void => {
                            initNewRequirementDefinition();
                        }}
                    >
                        {addIcon} New requirement definition
                    </Button>
                </ButtonContainerLeft>
                <ButtonContainerRight>
                    {newRequirementDefinition.isVoided &&
                        newRequirementDefinition.id != -1 && (
                            <>
                                <Button
                                    variant="outlined"
                                    onClick={deleteRequirementDefinition}
                                    disabled={!canDeleteReqDef()}
                                    title={
                                        newRequirementDefinition.isInUse
                                            ? 'Requirement definition that is in use or has fields, cannot be deleted.'
                                            : ''
                                    }
                                >
                                    {deleteIcon} Delete
                                </Button>
                                <ButtonSpacer />
                            </>
                        )}
                    {newRequirementDefinition.isVoided && (
                        <Button
                            variant="outlined"
                            onClick={unvoidRequirementDefinition}
                        >
                            {unvoidIcon} Unvoid
                        </Button>
                    )}
                    {!newRequirementDefinition.isVoided &&
                        newRequirementDefinition.id != -1 && (
                            <Button
                                variant="outlined"
                                onClick={voidRequirementDefinition}
                            >
                                {voidIcon} Void
                            </Button>
                        )}
                    <ButtonSpacer />
                    <Button
                        variant="outlined"
                        onClick={cancelChanges}
                        disabled={newRequirementDefinition.isVoided}
                    >
                        Cancel
                    </Button>
                    <ButtonSpacer />
                    <Button
                        onClick={handleSave}
                        disabled={
                            newRequirementDefinition.isVoided ||
                            !isDirtyAndValid ||
                            titleError
                        }
                    >
                        Save
                    </Button>
                </ButtonContainerRight>
            </ButtonContainer>
            <InputContainer style={{ marginTop: 'calc(var(--grid-unit) * 3)' }}>
                <FormFieldSpacer style={{ marginTop: '-3px', width: '100px' }}>
                    <TextField
                        id={'sortKey'}
                        label="SortKey"
                        value={
                            newRequirementDefinition.sortKey == -1
                                ? ''
                                : newRequirementDefinition.sortKey
                        }
                        onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                        ): void => {
                            newRequirementDefinition.sortKey = Number(
                                e.target.value
                            );
                            setNewRequirementDefinition(
                                cloneRequirementDefinition(
                                    newRequirementDefinition
                                )
                            );
                        }}
                        placeholder="Write here"
                        disabled={newRequirementDefinition.isVoided}
                    />
                </FormFieldSpacer>
                <FormFieldSpacer>
                    <SelectInput
                        onChange={(value: string): void => {
                            newRequirementDefinition.usage = value;
                            setNewRequirementDefinition(
                                cloneRequirementDefinition(
                                    newRequirementDefinition
                                )
                            );
                        }}
                        data={requirementUsageSelectItems}
                        label={'Select usage'}
                        disabled={newRequirementDefinition.isVoided}
                    >
                        {(newRequirementDefinition.usage &&
                            newRequirementDefinition.usage) ||
                            'Select usage'}
                    </SelectInput>
                </FormFieldSpacer>
                <FormFieldSpacer>
                    <SelectInput
                        onChange={(value: number): void => {
                            newRequirementDefinition.requirementTypeId = value;
                            const reqType = requirementTypes.find(
                                (type) =>
                                    type.id ===
                                    newRequirementDefinition.requirementTypeId
                            );
                            if (reqType) {
                                newRequirementDefinition.icon = reqType.icon;
                                newRequirementDefinition.requirementTypeTitle =
                                    reqType.title;
                            }
                            setNewRequirementDefinition(
                                cloneRequirementDefinition(
                                    newRequirementDefinition
                                )
                            );
                        }}
                        data={requirementTypeSelectItems}
                        label={'Select requirement type'}
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
                        label="Title for this definition"
                        value={newRequirementDefinition.title}
                        onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                        ): void => {
                            const title = e.target.value;
                            newRequirementDefinition.title = title;
                            validateTitle(title);
                            setNewRequirementDefinition(
                                cloneRequirementDefinition(
                                    newRequirementDefinition
                                )
                            );
                        }}
                        placeholder="Write here"
                        disabled={newRequirementDefinition.isVoided}
                        variant={titleError ? 'error' : undefined}
                        helperText={titleError}
                    />
                </FormFieldSpacer>
                <FormFieldSpacer>
                    <SelectInput
                        onChange={(value: number): void => {
                            newRequirementDefinition.defaultIntervalWeeks =
                                value;
                            setNewRequirementDefinition(
                                cloneRequirementDefinition(
                                    newRequirementDefinition
                                )
                            );
                        }}
                        data={intervalSelectItems}
                        label={'Set default interval'}
                        disabled={newRequirementDefinition.isVoided}
                    >
                        {(newRequirementDefinition.defaultIntervalWeeks > -1 &&
                            `${newRequirementDefinition.defaultIntervalWeeks} weeks`) ||
                            'Select interval'}
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
                                            setNewRequirementDefinition(
                                                cloneRequirementDefinition(
                                                    newRequirementDefinition
                                                )
                                            );
                                        }}
                                        data={fieldTypesSelectItems}
                                        label={'Type'}
                                        disabled={
                                            newRequirementDefinition.isVoided ||
                                            field.id != null ||
                                            field.isVoided
                                        }
                                    >
                                        {(field.fieldType && field.fieldType) ||
                                            'Select field type'}
                                    </SelectInput>
                                </div>
                            </FormFieldSpacer>
                            <FormFieldSpacer style={{ width: '300px' }}>
                                <TextField
                                    id={`label_${index}`}
                                    label="Label"
                                    value={field.label}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ): void => {
                                        field.label = e.target.value;
                                        setNewRequirementDefinition(
                                            cloneRequirementDefinition(
                                                newRequirementDefinition
                                            )
                                        );
                                    }}
                                    placeholder="Write here"
                                    disabled={
                                        newRequirementDefinition.isVoided ||
                                        field.isVoided
                                    }
                                />
                            </FormFieldSpacer>
                            {field.fieldType == 'Number' && (
                                <FormFieldSpacer style={{ width: '100px' }}>
                                    <TextField
                                        id={`unit_${index}`}
                                        label="Unit"
                                        value={field.unit}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ): void => {
                                            field.unit = e.target.value;
                                            setNewRequirementDefinition(
                                                cloneRequirementDefinition(
                                                    newRequirementDefinition
                                                )
                                            );
                                        }}
                                        placeholder="Write here"
                                        disabled={
                                            newRequirementDefinition.isVoided ||
                                            field.isVoided
                                        }
                                    />
                                </FormFieldSpacer>
                            )}
                            {field.fieldType != 'Number' && <div></div>}
                            {field.fieldType == 'Number' && (
                                <div
                                    style={{
                                        paddingRight:
                                            'calc(var(--grid-unit) * 2)',
                                    }}
                                >
                                    <Checkbox
                                        checked={field.showPrevious}
                                        disabled={
                                            newRequirementDefinition.isVoided ||
                                            field.isVoided
                                        }
                                        onChange={(checked: boolean): void => {
                                            field.showPrevious = checked;
                                            setNewRequirementDefinition(
                                                cloneRequirementDefinition(
                                                    newRequirementDefinition
                                                )
                                            );
                                        }}
                                    >
                                        <Typography
                                            style={{
                                                color:
                                                    newRequirementDefinition.isVoided ||
                                                    field.isVoided
                                                        ? tokens.colors
                                                              .interactive
                                                              .disabled__text
                                                              .rgba
                                                        : '',
                                            }}
                                            variant="body_long"
                                        >
                                            Show previous value
                                        </Typography>
                                    </Checkbox>
                                </div>
                            )}
                            {field.fieldType != 'Number' && <div></div>}
                            <FormFieldSpacer>
                                {
                                    <>
                                        <Button
                                            disabled={
                                                newRequirementDefinition.isVoided
                                            }
                                            variant="ghost"
                                            onClick={(): void =>
                                                moveFieldUp(index)
                                            }
                                        >
                                            {upIcon}
                                        </Button>
                                        <Button
                                            disabled={
                                                newRequirementDefinition.isVoided
                                            }
                                            variant="ghost"
                                            onClick={(): void =>
                                                moveFieldDown(index)
                                            }
                                        >
                                            {downIcon}
                                        </Button>
                                    </>
                                }
                                {showDeleteFieldButton(field) && (
                                    <Button
                                        disabled={
                                            newRequirementDefinition.isVoided
                                        }
                                        variant="ghost"
                                        title="Delete"
                                        onClick={(): void => deleteField(index)}
                                    >
                                        {deleteIcon}
                                    </Button>
                                )}
                                {!field.isVoided && field.id != null && (
                                    <Button
                                        disabled={
                                            newRequirementDefinition.isVoided
                                        }
                                        variant="ghost"
                                        onClick={(): void => {
                                            field.isVoided = true;
                                            setNewRequirementDefinition(
                                                cloneRequirementDefinition(
                                                    newRequirementDefinition
                                                )
                                            );
                                        }}
                                    >
                                        {voidIcon} Void
                                    </Button>
                                )}
                                {field.isVoided && (
                                    <Button
                                        disabled={
                                            newRequirementDefinition.isVoided
                                        }
                                        variant="ghost"
                                        onClick={(): void => {
                                            field.isVoided = false;
                                            setNewRequirementDefinition(
                                                cloneRequirementDefinition(
                                                    newRequirementDefinition
                                                )
                                            );
                                        }}
                                    >
                                        {unvoidIcon} Unvoid
                                    </Button>
                                )}
                            </FormFieldSpacer>
                        </React.Fragment>
                    );
                })}
            </FieldsContainer>
            <InputContainer>
                <IconContainer>
                    <Button
                        disabled={newRequirementDefinition.isVoided}
                        variant="ghost"
                        onClick={(): void => addField()}
                    >
                        {addIcon} Add field
                    </Button>
                </IconContainer>
            </InputContainer>
        </Container>
    );
};

export default PreservationRequirementDefinition;
