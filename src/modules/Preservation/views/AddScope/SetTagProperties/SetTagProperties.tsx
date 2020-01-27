import { ButtonContainer, Container, InputContainer } from './SetTagProperties.style';
import { Journey, Step } from '../types';
import React, { useEffect, useState } from 'react';

import { Button } from '@equinor/eds-core-react';
import SelectInput from '../../../../../components/Select';
import { TextField } from '@equinor/eds-core-react';

type SetTagPropertiesProps = {
    nextStep: () => void;
    previousStep: () => void;
    journeys: Journey[];
};

interface Option {
    text: string;
    value: any;
}

const SetTagProperties = ({
    nextStep,
    previousStep,
    journeys = [],
}: SetTagPropertiesProps): JSX.Element => {
    const [journey, setJourney] = useState(-1);
    const [step, setStep] = useState<number>(-1);
    const [formIsValid, setFormIsValid] = useState(false);

    const [mappedJourneys, setMappedJourneys] = useState<Option[]>([]);
    const [mappedSteps, setMappedSteps] = useState<Option[]>([]);

    useEffect(() => {
        if (journey > -1 && step > -1) {
            setFormIsValid(true);
            return;
        }
        setFormIsValid(false);
    }, [journey, step]);

    useEffect(() => {
        const mapped = journeys.map((itm: Journey) => {
            return {
                text: itm.title,
                value: itm.id
            };
        });
        setMappedJourneys(mapped);
    }, [journeys]);

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

    const setJourneyFromForm = (value: number): void => {
        setJourney(journeys.findIndex((pJourney: Journey) => pJourney.id === value));
    };

    const setStepFromForm = (value: number): void => {
        setStep(journeys[journey].steps.findIndex((pStep: Step) => pStep.id === value));
    };

    const setRequirement = (req: any): void => {
        console.log('Setting requirement', req);
    };

    if (journeys.length <= 0) {
        return (<Container>
            <div>
                Unable to read Journey data
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
                <InputContainer>
                    <SelectInput
                        onChange={setRequirement}
                        data={[]}
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
