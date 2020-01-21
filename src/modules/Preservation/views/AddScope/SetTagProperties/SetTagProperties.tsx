import { ButtonContainer, Container, InputContainer } from './SetTagProperties.style';
import React, { useMemo, useState } from 'react';

import { Button } from '@equinor/eds-core-react';
import SelectInput from '../../../../../components/Select';
import { Tag } from '../types';
import { TextField } from '@equinor/eds-core-react';

type SelectTagsProps = {
    nextStep: () => void;
    previousStep: () => void;
    tags: Tag[];
};

const journeyOptions = [{
    text: 'Journey 1'
},
{
    text: 'Journey 2'
}];

const stepOptions = [{
    text: 'Step 1'
},
{
    text: 'Step 2'
}];

const SetTagProperties = (props: SelectTagsProps): JSX.Element => {
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

    return (
        <Container>
            <div>
                <InputContainer>
                    <SelectInput
                        onChange={setJourney}
                        data={journeyOptions}
                        label={'Preservation journey for all selected tags'}
                    >
                        {journeyOptions[step].text || 'Select'}
                    </SelectInput>
                </InputContainer>
                <InputContainer>
                    <SelectInput
                        onChange={setStep}
                        data={stepOptions}
                        label={'Select step'}
                    >
                        {stepOptions[step].text || 'Select'}
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
                <Button onClick={props.previousStep} variant="outlined">
                    Previous
                </Button>
                <Button
                    onClick={props.nextStep}
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
