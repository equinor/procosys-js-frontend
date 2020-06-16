import React, {useState, useEffect} from 'react';
import { RequirementType, RequirementDefinition } from '../../../PlantConfig/views/Library/TagFunction/tabs/types';
import SelectInput, { SelectItem } from '@procosys/components/Select';
import PreservationIcon from '@procosys/components/PreservationIcon';
import { Button } from '@equinor/eds-core-react';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { InputContainer, FormFieldSpacer, ButtonContent, ActionContainer } from './RequirementsSelector.style';
import { tokens } from '@equinor/eds-tokens';
import EdsIcon from '@procosys/components/EdsIcon';

interface SelectedRequirementResult {
    requirement: RequirementType;
    requirementDefinition: RequirementDefinition;
}

interface OnChangeRequirementData {
    requirementDefinitionId: number;
    intervalWeeks: number;
    requirementTypeTitle?: string;
    requirementDefinitionTitle?: string;
    editingRequirements?: boolean;
    isVoided?: boolean;
}

type RequirementsSelectorProps = {
    requirementTypes: RequirementType[];
    onChange?: (listOfRequirements: OnChangeRequirementData[]) => Promise<void> | void;
    requirements: RequirementFormInput[];
}

interface RequirementFormInput {
    requirementDefinitionId: number | null;
    intervalWeeks: number | null;
    requirementTypeTitle?: string;
    requirementDefinitionTitle?: string;
    editingRequirements?: boolean;
    isVoided?: boolean;
}

const validWeekIntervals = [1, 2, 4, 6, 8, 12, 16, 24, 52];

const RequirementsSelector = (props: RequirementsSelectorProps): JSX.Element => {

    const [requirements, setRequirements] = useState<RequirementFormInput[]>([]);

    const [mappedRequirementTypes, setMappedRequirementTypes] = useState<SelectItem[]>([]);
    const [mappedIntervals] = useState<SelectItem[]>(() => {
        return validWeekIntervals.map(value => {
            return {
                text: `${value} weeks`,
                value: value
            };
        });
    });

    useEffect(() => {
        const existingRequirements = props.requirements.map(req => (Object.assign({}, req)));
        setRequirements(existingRequirements);
    }, [props.requirements]);

    useEffect(() => {
        if (!props.onChange) return;

        // Check that everything is filled out
        const hasInvalidInputs = requirements.some(req => req.requirementDefinitionId === null || req.intervalWeeks === null);
        if (hasInvalidInputs) return;

        //Do we actually have a change to submit?
        let hasChanges = false;
        hasChanges = requirements.some((req) => {

            const hasMatchingRequirement = props.requirements.some(
                oldReq => {
                    return (oldReq.requirementDefinitionId === req.requirementDefinitionId
                        && oldReq.intervalWeeks === req.intervalWeeks);
                });
            return !hasMatchingRequirement;
        }) || requirements.length !== props.requirements.length;

        if (hasChanges) {
            const filtered: OnChangeRequirementData[] = [];
            requirements.forEach(req => {
                filtered.push({
                    requirementDefinitionId: req.requirementDefinitionId as number,
                    intervalWeeks: req.intervalWeeks as number,
                    requirementTypeTitle: req.requirementTypeTitle,
                    requirementDefinitionTitle: req.requirementDefinitionTitle,
                    editingRequirements: req.editingRequirements,
                    isVoided: req.isVoided
                });
            });
            props.onChange(filtered);
        }
    }, [requirements]);

    useEffect(() => {
        const mapped: SelectItem[] = [];
        props.requirementTypes.forEach((itm: RequirementType) => {
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
    }, [props.requirementTypes]);

    const getRequirementForValue = (reqDefValue: number | null = null): SelectedRequirementResult | null => {
        if (!reqDefValue) { return null; }
        let reqDefIndex = -1;
        const result = props.requirementTypes.find(el => {
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
        setRequirements(oldValue => {
            const newRequirement = {
                requirementDefinitionId: null,
                intervalWeeks: null
            };
            return [...oldValue, newRequirement];
        });
    };

    const setRequirement = (reqDefValue: number, index: number): void => {
        const newRequirement = getRequirementForValue(reqDefValue);
        setRequirements((oldReq) => {
            const copy = [...oldReq];
            
            if (newRequirement) {
                copy[index].requirementDefinitionId = newRequirement.requirementDefinition.id;
                copy[index].intervalWeeks = newRequirement.requirementDefinition.defaultIntervalWeeks;
            }
            return copy;
        });
    };

    const setIntervalValue = (intervalValue: number, index: number): void => {
        setRequirements((oldReq) => {
            const copy = [...oldReq];
            copy[index].intervalWeeks = intervalValue;
            return copy;
        });
    };

    const deleteRequirement = (index: number): void => {
        setRequirements(oldReq => {
            const copy = [...oldReq];
            copy.splice(index, 1);
            return copy;
        });
    };

    const unvoidRequirement = (index: number): void => {
        setRequirements(oldReq => {
            const copy = [...oldReq];
            copy[index].isVoided = false;
            return copy;
        });
    };

    const voidRequirement = (index: number): void => {
        setRequirements(oldReq => {
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
            {requirements.map((requirement, index) => {
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
                                { requirement.editingRequirements ? 
                                    ( requirement.isVoided ? 
                                        <Button className='requirementActionIcon' title="Unvoid" variant='ghost' style={{ marginTop: '12px' }} onClick={(): void => unvoidRequirement(index)}>
                                            <EdsIcon name='restore_from_trash' />
                                            Unvoid
                                        </Button>
                                        :
                                        <Button className='requirementActionIcon' title="Void" variant='ghost' style={{ marginTop: '12px' }} onClick={(): void => voidRequirement(index)}>
                                            <EdsIcon name='delete_forever' />
                                            Void
                                        </Button> )
                                    :
                                    <Button className='requirementActionIcon' title="Delete" variant='ghost' style={{ marginTop: '12px' }} onClick={(): void => deleteRequirement(index)}>
                                        <EdsIcon name='delete_to_trash' />
                                    </Button>
                                }
                            </FormFieldSpacer>
                        </InputContainer>
                    </React.Fragment>
                );
            })}
            <ActionContainer>
                <Button variant='ghost' onClick={addRequirementInput}>
                    <ButtonContent>
                        <AddOutlinedIcon htmlColor={tokens.colors.interactive.primary__resting.hex} /> Add Requirement
                    </ButtonContent>
                </Button>
            </ActionContainer>
        </>
    );
};

export default RequirementsSelector;
