import React, { useState, useEffect } from 'react';
import { RequirementType, RequirementDefinition } from '../../../PlantConfig/views/Library/TagFunction/tabs/types';
import SelectInput, { SelectItem } from '@procosys/components/Select';
import PreservationIcon from '@procosys/components/PreservationIcon';
import { Button } from '@equinor/eds-core-react';
import { InputContainer, FormFieldSpacer, ActionContainer } from './RequirementsSelector.style';
import EdsIcon from '@procosys/components/EdsIcon';

interface SelectedRequirementResult {
    requirement: RequirementType;
    requirementDefinition: RequirementDefinition;
}

interface OnChangeRequirementData {
    requirementDefinitionId: number;
    intervalWeeks: number;
    requirementId?: number;
    requirementTypeTitle?: string;
    requirementDefinitionTitle?: string;
    editingRequirements?: boolean;
    isVoided?: boolean;
    rowVersion?: string;
}

type RequirementsSelectorProps = {
    requirementTypes: RequirementType[];
    onChange?: (listOfRequirements: OnChangeRequirementData[]) => Promise<void> | void;
    requirements: RequirementFormInput[];
    disableActions?: boolean;
}

interface RequirementFormInput {
    requirementDefinitionId: number | null;
    intervalWeeks: number | null;
    requirementId?: number;
    requirementTypeTitle?: string;
    requirementDefinitionTitle?: string;
    editingRequirements?: boolean;
    isVoided?: boolean;
    rowVersion?: string;
}

const validWeekIntervals = [1, 2, 4, 6, 8, 12, 16, 24, 52];

const RequirementsSelector = ({
    requirementTypes,
    onChange,
    requirements,
    disableActions = false }: RequirementsSelectorProps): JSX.Element => {

    const [localRequirements, setLocalRequirements] = useState<RequirementFormInput[]>([]);

    const [mappedRequirementTypes, setMappedRequirementTypes] = useState<SelectItem[]>([]);
    const [mappedIntervals] = useState<SelectItem[]>(() => {
        return validWeekIntervals.map(value => {
            return {
                text: `${value} weeks`,
                value: value
            };
        });
    });

    let hasNewPropsReq = false;
    useEffect(() => {
        const existingRequirements = requirements.map(req => (Object.assign({}, req)));
        setLocalRequirements(existingRequirements);
        hasNewPropsReq = true;
    }, [requirements]);

    useEffect(() => {
        if (hasNewPropsReq) {
            //To avoid running in a circle, we return here, if requirements where updated in previous useEffect.
            //Later: Should do some reqfactoring here. 
            return;
        }

        if (!onChange) return;
        // Check that everything is filled out

        const hasInvalidInputs = localRequirements.some(req => req.requirementDefinitionId === null || req.intervalWeeks === null);
        if (hasInvalidInputs) return;

        //Do we actually have a change to submit?
        let hasChanges = false;
        hasChanges = localRequirements.some((req) => {

            const hasMatchingRequirement = requirements.some(
                oldReq => {
                    return (oldReq.requirementDefinitionId === req.requirementDefinitionId
                        && oldReq.intervalWeeks === req.intervalWeeks && oldReq.isVoided === req.isVoided);
                });
            return !hasMatchingRequirement;
        }) || localRequirements.length !== requirements.length;

        if (hasChanges) {
            const filtered: OnChangeRequirementData[] = [];
            localRequirements.forEach(req => {
                filtered.push({
                    requirementDefinitionId: req.requirementDefinitionId as number,
                    intervalWeeks: req.intervalWeeks as number,
                    requirementId: req.requirementId,
                    requirementTypeTitle: req.requirementTypeTitle,
                    requirementDefinitionTitle: req.requirementDefinitionTitle,
                    editingRequirements: req.editingRequirements,
                    isVoided: req.isVoided,
                    rowVersion: req.rowVersion
                });
            });
            onChange(filtered);
        }
    }, [localRequirements]);

    useEffect(() => {
        const mapped: SelectItem[] = [];
        requirementTypes.forEach((itm: RequirementType) => {
            if (itm.requirementDefinitions.length > 0) {
                const withUserRequiredInput: SelectItem[] = [];
                const withoutUserRequiredInput: SelectItem[] = [];

                itm.requirementDefinitions.forEach((reqDef) => {

                    const data = {
                        text: reqDef.title,
                        value: reqDef.id
                    };
                    if (reqDef.needsUserInput) {
                        withUserRequiredInput.push(data);
                    } else {
                        withoutUserRequiredInput.push(data);
                    }
                });

                if (withUserRequiredInput.length) {
                    withUserRequiredInput.unshift({
                        title: true,
                        text: 'Requirements with required user input',
                        value: 'Requirements with required user input',
                    });
                }
                if (withoutUserRequiredInput.length) {
                    withoutUserRequiredInput.unshift({
                        title: true,
                        text: 'Mass update requirements',
                        value: 'Mass update requirements',
                    });
                }

                mapped.push({
                    text: itm.title,
                    value: itm.id,
                    icon: <PreservationIcon variant={itm.code} />,
                    children: withUserRequiredInput.concat(withoutUserRequiredInput)
                });
            }
        });
        setMappedRequirementTypes(mapped);
    }, [requirementTypes]);

    const getRequirementForValue = (reqDefValue: number | null = null): SelectedRequirementResult | null => {
        if (!reqDefValue) { return null; }
        let reqDefIndex = -1;
        const result = requirementTypes.find(el => {
            reqDefIndex = el.requirementDefinitions.findIndex(RD => RD.id === reqDefValue);
            if (reqDefIndex > -1) {
                return true;
            }
            return false;
        });
        if (result) {
            return {
                requirement: result,
                requirementDefinition: result.requirementDefinitions[reqDefIndex]
            };
        }
        return null;
    };

    const addRequirementInput = (): void => {
        setLocalRequirements(oldValue => {
            const newRequirement = {
                requirementDefinitionId: null,
                intervalWeeks: null
            };
            return [...oldValue, newRequirement];
        });
    };

    const setRequirement = (reqDefValue: number, index: number): void => {
        const newRequirement = getRequirementForValue(reqDefValue);
        setLocalRequirements((oldReq) => {
            const copy = [...oldReq];

            if (newRequirement) {
                copy[index].requirementDefinitionId = newRequirement.requirementDefinition.id;
                copy[index].intervalWeeks = newRequirement.requirementDefinition.defaultIntervalWeeks;
            }
            return copy;
        });
    };

    const setIntervalValue = (intervalValue: number, index: number): void => {
        setLocalRequirements((oldReq) => {
            const copy = [...oldReq];
            copy[index].intervalWeeks = intervalValue;
            return copy;
        });
    };

    const deleteRequirement = (index: number): void => {
        setLocalRequirements(oldReq => {
            const copy = [...oldReq];
            copy.splice(index, 1);
            return copy;
        });
    };

    const unvoidRequirement = (index: number): void => {
        setLocalRequirements(oldReq => {
            const copy = [...oldReq];
            copy[index].isVoided = false;
            return copy;
        });
    };

    const voidRequirement = (index: number): void => {
        setLocalRequirements(oldReq => {
            const copy = [...oldReq];
            copy[index].isVoided = true;
            return copy;
        });
    };

    const getDefaultInputText = (req: RequirementFormInput): string => {
        const value = mappedIntervals.find(el => el.value === req.intervalWeeks);
        if (!value) return 'Select';
        return value.text;
    };

    const getTitle = (req: RequirementFormInput): string => {
        return `${req.requirementTypeTitle} - ${req.requirementDefinitionTitle}`;
    };

    return (
        <>
            {localRequirements.map((requirement, index) => {
                const title = getTitle(requirement);
                const requirementForValue = requirement.requirementDefinitionTitle ? null : getRequirementForValue(requirement.requirementDefinitionId);
                return (
                    <React.Fragment key={`requirementInput_${index}`}>
                        <InputContainer key={`req_${index}`}>
                            <SelectInput
                                onChange={(value): void => setRequirement(value, index)}
                                data={mappedRequirementTypes}
                                label={'Requirement'}
                                disabled={requirement.editingRequirements}
                                isVoided={requirement.isVoided}
                            >
                                {requirement.requirementDefinitionTitle ? title :
                                    (requirementForValue) && (`${requirementForValue.requirement.title} - ${requirementForValue.requirementDefinition.title}`) || 'Select'}
                            </SelectInput>
                            <FormFieldSpacer>
                                <SelectInput
                                    onChange={(value): void => setIntervalValue(value, index)}
                                    data={mappedIntervals}
                                    disabled={!requirement.requirementDefinitionId || requirement.isVoided}
                                    label={'Interval'}
                                    isVoided={requirement.isVoided}
                                >
                                    {getDefaultInputText(requirement)}
                                </SelectInput>
                            </FormFieldSpacer>
                            <FormFieldSpacer>
                                {requirement.editingRequirements ?
                                    (requirement.isVoided ?
                                        <Button className='voidUnvoid' title="Unvoid" variant='ghost' style={{ marginTop: '12px' }} onClick={(): void => unvoidRequirement(index)}>
                                            <EdsIcon name='restore_from_trash' />
                                            Unvoid
                                        </Button>
                                        :
                                        <Button className='voidUnvoid' title="Void" variant='ghost' style={{ marginTop: '12px' }} onClick={(): void => voidRequirement(index)}>
                                            <EdsIcon name='delete_forever' />
                                            Void
                                        </Button>)
                                    :
                                    <Button disabled={disableActions} title="Delete" variant='ghost' style={{ marginTop: '12px' }} onClick={(): void => deleteRequirement(index)}>
                                        <EdsIcon name='delete_to_trash' />
                                    </Button>
                                }
                            </FormFieldSpacer>
                        </InputContainer>
                    </React.Fragment>
                );
            })}
            <ActionContainer>
                <Button variant='ghost' onClick={addRequirementInput} disabled={disableActions}>
                    <EdsIcon name='add'/> Add Requirement
                </Button>
            </ActionContainer>
        </>
    );
};

export default RequirementsSelector;
