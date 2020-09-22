import React from 'react';
import { Button, Typography } from '@equinor/eds-core-react';
import ProgressBar from '@procosys/components/ProgressBar';
import { ProgressBarSteps } from '../../types';
import { Container, HeaderContainer, ButtonContainer } from './CreateIPOHeader.style';

type ProgressBarProps = {
    steps: ProgressBarSteps[];
    canBeCreated: boolean;
    currentStep: number;
}

const CreateIPOHeader = (props: ProgressBarProps): JSX.Element => {

    return (
        <Container>
            <HeaderContainer>
                <Typography variant="h2">Create invitation for punch-out</Typography>
                <ButtonContainer>
                    <Button variant='outlined'>Cancel</Button>
                    <Button disabled={!props.canBeCreated}>Create</Button>
                </ButtonContainer>
            </HeaderContainer>
            <ProgressBar steps={props.steps} currentStep={props.currentStep} />
        </Container>
    );
};

export default CreateIPOHeader;