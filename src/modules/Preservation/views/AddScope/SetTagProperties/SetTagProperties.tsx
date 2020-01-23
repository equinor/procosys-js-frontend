import { ButtonContainer, Container, InputContainer } from './SetTagProperties.style';
import React, { useMemo, useState } from 'react';

import { Button } from '@equinor/eds-core-react';
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
    const [step, setStep] = useState(-1);
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
                text: itm.text
            };
        });
    }, [journeys]);

    const stepsDataMapped = useMemo(() => {
        return steps.map((itm) => {
            return {
                text: itm.text
            };
        });
    }, [steps]);

    return (
        <Container>
            <div>
                <InputContainer>
                    <SelectInput
                        onChange={setJourney}
                        data={journeysDataMapped}
                        label={'Preservation journey for all selected tags'}
                    >
                        {(journey > -1 && journeys[journey].text) || 'Select journey'}
                    </SelectInput>
                </InputContainer>
                <InputContainer>
                    <SelectInput
                        onChange={setStep}
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
