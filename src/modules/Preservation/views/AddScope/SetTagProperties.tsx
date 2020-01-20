import React, { useMemo, useState } from 'react';

import { Button } from '@equinor/eds-core-react';
import SelectInput from '../../../../components/SelectInput';
import { Tag } from './types';
import { TextField } from '@equinor/eds-core-react';
import styled from 'styled-components';
import { usePreservationContext } from '../../context/PreservationContext';

type SelectTagsProps = {
    nextStep: () => void;
    previousStep: () => void;
    tags: Tag[];
};

const Header = styled.div`
    h1 {
        display: inline-block;
    }
    span {
        margin-left: calc(var(--grid-unit) * 4);
    }
    margin-bottom: calc(var(--grid-unit) * 3);
`;

const InputContainer = styled.div`
    margin: calc(var(--grid-unit) * 2) 0px;
`;

const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
`;

const ButtonContainer = styled.div`
    button:last-of-type {
        margin-left: calc(var(--grid-unit) * 2);
    }
`;

const SetTagProperties = (props: SelectTagsProps): JSX.Element => {
    const [journey, setJourney] = useState(-1);
    const [step, setStep] = useState(-1);
    const [formIsValid, setFormIsValid] = useState(false);

    const { project } = usePreservationContext();

    useMemo(() => {
        if (journey > -1 && step > -1) {
            setFormIsValid(true);
            return;
        }
        setFormIsValid(false);
    }, [journey, step]);

    return (
        <>
            <Header>
                <h1>Set Tag Properties</h1>
                <span>{project.description}</span>
            </Header>
            <Container>
                <div>
                    <InputContainer>
                        <SelectInput
                            onChange={setJourney}
                            data={[{ text: 'Option 1' }, { text: 'Option 2' }]}
                            label={'Preservation journey for all selected tags'}
                        />
                    </InputContainer>
                    <InputContainer>
                        <SelectInput
                            onChange={setStep}
                            data={[{ text: 'Option 1' }, { text: 'Option 2' }]}
                            label={'Select step'}
                        />
                    </InputContainer>
                    <InputContainer>
                        <TextField
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
        </>
    );
};

export default SetTagProperties;
