import { ButtonContainer, Container, InputContainer } from './SetTagProperties.style';
import { Journey, RequirementType, Step } from '../types';
import React, { useEffect, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../../components/Select';

import BatteryChargingFullOutlinedIcon from '@material-ui/icons/BatteryChargingFullOutlined';
import BearingIcon from '../../../../../assets/icons/Bearing';
import BuildOutlinedIcon from '@material-ui/icons/BuildOutlined';
import { Button } from '@equinor/eds-core-react';
import FlashOnOutlinedIcon from '@material-ui/icons/FlashOnOutlined';
import N2Icon from '../../../../../assets/icons/N2';
import PowerOutlinedIcon from '@material-ui/icons/PowerOutlined';
import PressureIcon from '../../../../../assets/icons/Pressure';
import RotateRightIcon from '@material-ui/icons/RotateRightOutlined';
import { TextField } from '@equinor/eds-core-react';
import ThermostatIcon from '../../../../../assets/icons/Thermostat';

type SetTagPropertiesProps = {
    nextStep: () => void;
    previousStep: () => void;
    journeys: Journey[];
    requirementTypes: RequirementType[];
};

const SetTagProperties = ({
    nextStep,
    previousStep,
    journeys = [],
    requirementTypes = [],
}: SetTagPropertiesProps): JSX.Element => {
    const [journey, setJourney] = useState(-1);
    const [step, setStep] = useState<number>(-1);
    const [requirements, setRequirements] = useState([]);
    const [formIsValid, setFormIsValid] = useState(false);

    const [mappedJourneys, setMappedJourneys] = useState<SelectItem[]>([]);
    const [mappedSteps, setMappedSteps] = useState<SelectItem[]>([]);
    const [mappedRequirements, setMappedRequirements] = useState<SelectItem[]>([]);

    /**
     * Form validation
     */
    useEffect(() => {
        if (journey > -1 && step > -1) {
            setFormIsValid(true);
            return;
        }
        setFormIsValid(false);
    }, [journey, step]);

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
                    children: itm.requirementDefinitions.map((child) => {
                        return {
                            text: child.title,
                            value: child.id
                        };
                    })
                });
            }
        });
        setMappedRequirements(mapped);
    }, [requirementTypes]);



    const setJourneyFromForm = (value: number): void => {
        setJourney(journeys.findIndex((pJourney: Journey) => pJourney.id === value));
    };

    const setStepFromForm = (value: number): void => {
        setStep(journeys[journey].steps.findIndex((pStep: Step) => pStep.id === value));
    };

    const setRequirement = (req: any): void => {
        console.log('Setting requirement', req);
    };

    if (journeys.length <= 0 || requirementTypes.length <= 0) {
        return (<Container>
            <div>
                Missing data
            </div>
            <ButtonContainer>
                <Button onClick={previousStep} variant="outlined">
                    Previous
                </Button>
            </ButtonContainer>
        </Container>);
    }

    return (
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
                        {(step > -1 && journeys[journey].steps[step].mode.title) || 'Select step'}
                    </SelectInput>
                </InputContainer>
                <InputContainer>
                    <TextField
                        id={'Remark'}
                        style={{ maxWidth: '480px' }}
                        label="Remark for whole preservation journey"
                        placeholder="Write Here"
                        helpertext="For example: Check according to predecure 123, or check specifications from supplier"
                    />
                </InputContainer>

                <h2>Requirements for all selected tags</h2>
                <InputContainer>
                    <SelectInput
                        onChange={setRequirement}
                        data={mappedRequirements}
                        label={'Preservation journey for all selected tags'}
                    >
                        {'Testing'}
                    </SelectInput>
                </InputContainer>
            </div>
            <ButtonContainer>
                <Button onClick={previousStep} variant="outlined">
                    Previous
                </Button>
                <Button
                    onClick={nextStep}
                    color="primary"
                    disabled={!formIsValid}
                >
                    Add to scope
                </Button>
            </ButtonContainer>
        </Container>
    );
};

export default SetTagProperties;
