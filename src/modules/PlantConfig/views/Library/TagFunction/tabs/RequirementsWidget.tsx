import React, {useState, useEffect} from 'react';
import { RequirementType, RequirementDefinition } from './types';
import SelectInput, { SelectItem } from '@procosys/components/Select';
import PreservationIcon from '@procosys/components/PreservationIcon';
import { Button } from '@equinor/eds-core-react';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { InputContainer, FormFieldSpacer, ButtonContent } from './RequirementsWidget.style';
import { tokens } from '@equinor/eds-tokens';

interface SelectedRequirementResult {
    requirement: RequirementType;
    requirementDefinition: RequirementDefinition;
}

interface OnChangeRequirementData {
    requirementDefinitionId: number;
    intervalWeeks: number;
}

type RequirementsWidgetProp = {
    requirementTypes: RequirementType[];
    onChange?: (listOfRequirements: OnChangeRequirementData[]) => Promise<void> | void;
    requirements: RequirementFormInput[];
}

interface RequirementFormInput {
    requirementDefinitionId: number | null;
    intervalWeeks: number | null;
}

const validWeekIntervals = [1, 2, 4, 6, 8, 12, 16, 24, 52];

const RequirementsWidget = (props: RequirementsWidgetProp): JSX.Element => {

    const [requirements, setRequirements] = useState<RequirementFormInput[]>(props.requirements);

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
        setRequirements(props.requirements);
    }, [props.requirements]);

    useEffect(() => {
        if (!props.onChange) return;
        // Check that everything is filled out
        const allInputsAreValid = !requirements.some(req => req.requirementDefinitionId === null || req.intervalWeeks === null);

        if (!allInputsAreValid) return;
        //Do we actually have a change to submit?
        const hasChanges = requirements.some((req) => props.requirements.indexOf(req) === -1) || requirements.length !== props.requirements.length;

        if (hasChanges) {
            const filtered: OnChangeRequirementData[] = [];
            requirements.forEach(req => {
                if (req.intervalWeeks !== null || req.requirementDefinitionId !== null) {
                    filtered.push({
                        requirementDefinitionId: req.requirementDefinitionId as number,
                        intervalWeeks: req.intervalWeeks as number
                    });
                }

            });
            props.onChange(filtered);
        }
    }, [requirements]);

    useEffect(() => {
        const mapped: SelectItem[] = [];
        props.requirementTypes.forEach((itm: RequirementType) => {
            if (itm.requirementDefinitions.length > 0) {
                mapped.push({
                    text: itm.title,
                    value: itm.id,
                    icon: <PreservationIcon variant={itm.code} />,
                    children: itm.requirementDefinitions.map((reqDef) => {
                        return {
                            text: reqDef.title,
                            value: reqDef.id
                        };
                    })
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

    const getDefaultInputText = (req: RequirementFormInput): string => {
        const value = mappedIntervals.find(el => el.value === req.intervalWeeks);
        if (!value) return 'Select';
        return value.text;
    };

    return (
        <>
            {requirements.map((requirement, index) => {
                const requirementForValue = getRequirementForValue(requirement.requirementDefinitionId);
                return (
                    <React.Fragment key={`requirementInput_${index}`}>
                        <InputContainer key={`req_${index}`}>
                            <SelectInput
                                onChange={(value): void => setRequirement(value, index)}
                                data={mappedRequirementTypes}
                                label={'Requirement'}
                            >
                                {(requirementForValue) && (`${requirementForValue.requirement.title} - ${requirementForValue.requirementDefinition.title}`) || 'Select'}
                            </SelectInput>
                            <FormFieldSpacer>
                                <SelectInput
                                    onChange={(value): void => setIntervalValue(value, index)}
                                    data={mappedIntervals}
                                    disabled={!requirement.requirementDefinitionId}
                                    label={'Interval'}
                                >
                                    {getDefaultInputText(requirement)}
                                </SelectInput>
                            </FormFieldSpacer>
                            <FormFieldSpacer>
                                <Button title="Delete" variant='ghost' style={{ marginTop: 'calc(var(--grid-unit)*2)' }} onClick={(): void => deleteRequirement(index)}>
                                    <DeleteOutlinedIcon />
                                </Button>
                            </FormFieldSpacer>
                        </InputContainer>
                    </React.Fragment>
                );
            })}
            <Button variant='ghost' onClick={addRequirementInput}>
                <ButtonContent>
                    <AddOutlinedIcon htmlColor={tokens.colors.interactive.primary__resting.hex} /> Add Requirement
                </ButtonContent>
            </Button>
        </>
    );
};

export default RequirementsWidget;
