import { ButtonContainer, Container, InputContainer } from './SetTagProperties.style';
import React, { useMemo, useState } from 'react';

import { Button } from '@equinor/eds-core-react';
import FirstPage from '@material-ui/icons/FirstPage';
import SelectInput from '../../../../../components/Select';
import { TextField } from '@equinor/eds-core-react';

type SetTagPropertiesProps = {
    nextStep: () => void;
    previousStep: () => void;
    journeys: {
        id: number;
        text: string;
    }[];
    steps: {
        id: number;
        text: string;
    }[];
};

const SetTagProperties = ({
    nextStep,
    previousStep,
    journeys = [],
    steps = []
}: SetTagPropertiesProps): JSX.Element => {
    const [journey, setJourney] = useState(-1);
    const [step, setStep] = useState<number>(-1);
    const [formIsValid, setFormIsValid] = useState(false);

    useMemo(() => {
        if (journey > -1 && step > -1) {
            setFormIsValid(true);
            return;
        }
        setFormIsValid(false);
    }, [journey, step]);

    const journeysDataMapped = useMemo(() => {
        return journeys.map((itm) => {
            return {
                text: itm.text,
                value: itm.text
            };
        });
    }, [journeys]);

    const stepsDataMapped = useMemo(() => {
        return steps.map((itm) => {
            return {
                text: itm.text,
                value: itm.text
            };
        });
    }, [steps]);

    const setJourneyFromForm = (value: string): void => {
        setJourney(journeys.findIndex(pJourney => pJourney.text === value));
    };

    const setStepFromForm = (value: string): void => {
        setStep(steps.findIndex(pStep => pStep.text === value));
    };

    const setRequirement = (req: any): void => {
        console.log('Setting requirement', req);
    };

    const fakeData = [{
        text: 'Testing',
        value: '1',
        icon: <FirstPage />,
        selected: true,
        children: [{
            text: 'Testing sub',
            value: '1-1',
        }, {
            text: 'Sub-Sub',
            value: '1-2',
            selected: true,
            children: [{
                text: 'sub-sub-sub',
                selected: true,
                value: '1-2-1'
            }]
        }],
    }, {
        text: 'Testing no-menu',
        icon: <FirstPage />,
        value: '2',
    }, {
        text: 'Testing 3',
        icon: <FirstPage />,
        value: '3',
        children: [{
            text: 'Testing sub 3-1',
            value: '3-1',
        },
        {
            text: 'Testing sub 3-2',
            value: '3-2',
        },
        {
            text: 'Testing sub 3-3',
            value: '3-3',
        }],
    }];

    return (
        <Container>
            <div>
                <InputContainer>
                    <SelectInput
                        onChange={setJourneyFromForm}
                        data={journeysDataMapped}
                        label={'Preservation journey for all selected tags'}
                    >
                        {(journey > -1 && journeys[journey].text) || 'Select journey'}
                    </SelectInput>
                </InputContainer>
                <InputContainer>
                    <SelectInput
                        onChange={setStepFromForm}
                        data={stepsDataMapped}
                        label={'Preservation step'}
                    >
                        {(step > -1 && steps[step].text) || 'Select step'}
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
                        data={fakeData}
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
