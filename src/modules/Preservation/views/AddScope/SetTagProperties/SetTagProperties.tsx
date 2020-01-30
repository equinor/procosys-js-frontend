import { ButtonContainer, ButtonContent, Container, FormFieldSpacer, Header, InputContainer } from './SetTagProperties.style';
import { Journey, Requirement, RequirementDefinition, RequirementType, Step } from '../types';
import React, { useEffect, useRef, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../../components/Select';

import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import BatteryChargingFullOutlinedIcon from '@material-ui/icons/BatteryChargingFullOutlined';
import BearingIcon from '../../../../../assets/icons/Bearing';
import BuildOutlinedIcon from '@material-ui/icons/BuildOutlined';
import { Button } from '@equinor/eds-core-react';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import FlashOnOutlinedIcon from '@material-ui/icons/FlashOnOutlined';
import N2Icon from '../../../../../assets/icons/N2';
import PowerOutlinedIcon from '@material-ui/icons/PowerOutlined';
import PressureIcon from '../../../../../assets/icons/Pressure';
import RotateRightIcon from '@material-ui/icons/RotateRightOutlined';
import { TextField } from '@equinor/eds-core-react';
import ThermostatIcon from '../../../../../assets/icons/Thermostat';
import { tokens } from '@equinor/eds-tokens';
import { usePreservationContext } from '../../../context/PreservationContext';

type SetTagPropertiesProps = {
    submitForm: (stepId: number, requirements: Requirement[], remark: string | null) => void;
    previousStep: () => void;
    journeys: Journey[];
    requirementTypes: RequirementType[];
};

interface RequirementFormInput {
    requirementDefinitionId: number | null;
    intervalWeeks: number | null;
}

interface SelectedRequirementResult {
    requirement: RequirementType;
    requirementDefinition: RequirementDefinition;
}

const validWeekIntervals = [1, 2, 4, 6, 8, 12, 16, 24, 52];

const SetTagProperties = ({
    submitForm,
    previousStep,
    journeys = [],
    requirementTypes = [],
}: SetTagPropertiesProps): JSX.Element => {
    const { project } = usePreservationContext();

    const [journey, setJourney] = useState(-1);
    const [step, setStep] = useState<Step>();
    const [requirements, setRequirements] = useState<RequirementFormInput[]>([]);
    const remarkInputRef = useRef<HTMLInputElement>(null);
    const [formIsValid, setFormIsValid] = useState(false);

    const [mappedJourneys, setMappedJourneys] = useState<SelectItem[]>([]);
    const [mappedSteps, setMappedSteps] = useState<SelectItem[]>([]);
    const [mappedRequirements, setMappedRequirements] = useState<SelectItem[]>([]);
    const [mappedIntervals] = useState<SelectItem[]>(() => {
        return validWeekIntervals.map(value => {
            return {
                text: `${value} weeks`,
                value: value
            };
        });
    });

    /**
     * Form validation
     */
    useEffect(() => {
        if (journey > -1 && step && requirements.length > 0) {
            const hasAllPropertiesSet = (req: RequirementFormInput): boolean => {
                return req.intervalWeeks != null && req.requirementDefinitionId != null;
            };
            const requirementsIsValid = requirements.every(hasAllPropertiesSet);

            setFormIsValid(requirementsIsValid);
            return;
        }
        setFormIsValid(false);
    }, [journey, step, requirements]);

    /**
     * Map journeys into menu elements
     */
    useEffect(() => {
        const mapped = journeys.map((itm: Journey) => {
            return {
                text: itm.title,
                value: itm.id
            };
        });
        setMappedJourneys(mapped);
    }, [journeys]);

    /**
     * Map Journey steps into menu elements
     */
    useEffect(() => {
        if (journeys.length > 0 && journeys[journey]) {
            const mapped = journeys[journey].steps.map((itm: Step) => {
                return {
                    text: itm.mode.title,
                    value: itm.id
                };
            });
            setMappedSteps(mapped);
        }
    }, [journey]);

    const getIconForRequirement = (code: string): JSX.Element | null => {
        switch (code.toLowerCase()) {
            case 'rotation':
                return <RotateRightIcon />;
            case 'ir test':
                return <FlashOnOutlinedIcon />;
            case 'oil level':
                return <PressureIcon />;
            case 'heating':
                return <ThermostatIcon />;
            case 'powered':
                return <PowerOutlinedIcon />;
            case 'vci':
                return <BuildOutlinedIcon />;
            case 'nitrogen':
                return <N2Icon />;
            case 'grease':
                return <BearingIcon />;
            case 'charging':
                return <BatteryChargingFullOutlinedIcon />;
            default:
                return null;
        }
    };

    /**
     * Map Requirements into menu elements
     */
    useEffect(() => {
        const mapped: SelectItem[] = [];
        requirementTypes.forEach((itm: RequirementType) => {
            if (itm.requirementDefinitions.length > 0) {
                mapped.push({
                    text: itm.title,
                    value: itm.id,
                    icon: getIconForRequirement(itm.code),
                    children: itm.requirementDefinitions.map((reqDef) => {
                        return {
                            text: reqDef.title,
                            value: reqDef.id
                        };
                    })
                });
            }
        });
        setMappedRequirements(mapped);
    }, [requirementTypes]);

    const submit = (): void => {
        const remarkValue = remarkInputRef.current?.value || null;
        const requirementsMappedForApi: Requirement[] = [];
        requirements.forEach((req) => {
            if (req.intervalWeeks != null && req.requirementDefinitionId != null) {
                requirementsMappedForApi.push({
                    requirementDefinitionId: req.requirementDefinitionId,
                    intervalWeeks: req.intervalWeeks
                });
            }
        });
        if (step && requirementsMappedForApi.length > 0) {
            submitForm(step.id, requirementsMappedForApi, remarkValue);
        }

    };


    const setJourneyFromForm = (value: number): void => {
        setJourney(journeys.findIndex((pJourney: Journey) => pJourney.id === value));
    };

    const setStepFromForm = (stepId: number): void => {
        const step = journeys[journey].steps.find((pStep: Step) => pStep.id === stepId);
        setStep(step);
    };

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

    if (journeys.length <= 0 || requirementTypes.length <= 0) {
        return (
            <div>
                <Header>
                    <h1>Add preservation scope</h1>
                    <div>{project.description}</div>
                </Header>
                <Container>
                    <div>
                        Missing data
                    </div>
                    <ButtonContainer>
                        <Button onClick={previousStep} variant="outlined">
                            Previous
                        </Button>
                    </ButtonContainer>
                </Container>
            </div>
        );
    }

    return (
        <div>
            <Header>
                <h1>Add preservation scope</h1>
                <div>{project.description}</div>
            </Header>
            <Container>
                <div>
                    <InputContainer>
                        <SelectInput
                            onChange={setJourneyFromForm}
                            data={mappedJourneys}
                            label={'Preservation journey for all selected tags'}
                        >
                            {(journey > -1 && journeys[journey].title) || 'Select journey'}
                        </SelectInput>
                    </InputContainer>
                    <InputContainer>
                        <SelectInput
                            onChange={setStepFromForm}
                            data={mappedSteps}
                            disabled={mappedSteps.length <= 0}
                            label={'Preservation step'}
                        >
                            {(step && step.mode.title) || 'Select step'}
                        </SelectInput>
                    </InputContainer>
                    <InputContainer>
                        <TextField
                            id={'Remark'} ø
                            style={{ maxWidth: '480px' }}
                            label="Remark for whole preservation journey"
                            inputRef={remarkInputRef}
                            placeholder="Write Here"
                            helpertext="For example: Check according to predecure 123, or check specifications from supplier"
                        />
                    </InputContainer>

                    <h2>Requirements for all selected tags</h2>
                    {requirements.map((requirement, index) => {
                        const requirementForValue = getRequirementForValue(requirement.requirementDefinitionId);
                        return (
                            <React.Fragment key={`requirementInput_${index}`}>
                                <InputContainer key={`req_${index}`}>
                                    <SelectInput
                                        onChange={(value): void => setRequirement(value, index)}
                                        data={mappedRequirements}
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
                                            {mappedIntervals.find(el => el.value === requirement.intervalWeeks)?.text || 'Select'}
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
                </div>
                <ButtonContainer>
                    <Button onClick={previousStep} variant="outlined">
                        Previous
                    </Button>
                    <Button
                        onClick={submit}
                        color="primary"
                        disabled={!formIsValid}
                    >
                        Add to scope
                    </Button>
                </ButtonContainer>
            </Container>
        </div>

    );
};

export default SetTagProperties;
