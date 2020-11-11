import { Button, Typography } from '@equinor/eds-core-react';
import { ButtonContainer, Container, HeaderContainer } from './CreateIPOHeader.style';
import React, { useEffect, useState } from 'react';

import ProgressBar from '@procosys/components/ProgressBar';
import { Step } from '../../types';
import { StepsEnum } from './CreateIPO';

type ProgressBarProps = {
    steps: Step[];
    canBeCreated: boolean;
    currentStep: number;
    createNewIpo: () => void;
    next: () => void;
    previous: () => void;
    goTo: (stepNo: number) => void;
}

const CreateIPOHeader = (props: ProgressBarProps): JSX.Element => {
    const [validNext, setValidNext] = useState<boolean>(props.steps[props.currentStep -1].isCompleted);

    useEffect(() => {
        props.currentStep == StepsEnum.UploadAttachments ?
            setValidNext(true) : 
            props.currentStep == StepsEnum.SummaryAndCreate ?
                setValidNext(false) :
                setValidNext(props.steps[props.currentStep - 1].isCompleted);
    }, [props.steps, props.currentStep]);

    return (
        <Container>
            <HeaderContainer>
                <Typography variant="h2">Create invitation for punch-out</Typography>
                <ButtonContainer>
                    <Button variant='outlined'>Cancel</Button>
                    <Button 
                        constiant='outlined' 
                        disabled={props.currentStep === 1}
                        onClick={props.previous}>
                            Previous
                    </Button>
                    {props.currentStep == StepsEnum.SummaryAndCreate ? (
                        <Button
                            disabled={!props.canBeCreated}
                            onClick={props.createNewIpo}
                        >
                            Create
                        </Button>
                    ) : (
                        <Button 
                            disabled={!validNext} 
                            onClick={props.next}
                        >
                            Next
                        </Button>
                    )}
                </ButtonContainer>
            </HeaderContainer>
            <ProgressBar steps={props.steps} currentStep={props.currentStep} goTo={props.goTo} />
        </Container>
    );
};

export default CreateIPOHeader;
