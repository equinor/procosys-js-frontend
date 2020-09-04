import React, {useEffect} from 'react';
import { Button, Typography } from '@equinor/eds-core-react';
import ProgressBar from '@procosys/components/ProgressBar';
import { ProgressBarSteps } from '../../types';
import { Container, HeaderContainer, ButtonContainer } from './AddCPOHeader.style';

type ProgressBarProps = {
    steps: ProgressBarSteps[];
    canBeCreated: boolean;
    currentStep: number;
}

const AddCPOHeader = (props: ProgressBarProps): JSX.Element => {

    useEffect(() => {
        console.log(props.steps);
        console.log(props.currentStep);
    }, [props.steps]);

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

export default AddCPOHeader;
