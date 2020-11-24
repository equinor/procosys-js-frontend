import { Container, IconContainer, StepContainer } from './style';

import EdsIcon from '../EdsIcon';
import React from 'react';

type ProgressBarSteps = {
    title: string;
    isCompleted: boolean;
}

interface ProgressBarProps {
    steps: ProgressBarSteps[];
    currentStep: number;
    goTo?: (stepNo: number) => void;
}

const ProgressBar = ({
    steps,
    currentStep,
    goTo
}: ProgressBarProps): JSX.Element => {
    const handleGoToStep = (stepNo: number): void => {
        goTo && goTo(stepNo);
    };

    return (
        <Container>
            {steps.map((step, i) => {     
                return (<StepContainer key={i} currentStep={currentStep == i+1} stepCompleted={step.isCompleted}>
                    <IconContainer onClick={():void => handleGoToStep(i+1)}>{ step.isCompleted && currentStep != i+1 ? <EdsIcon name='done' size={16} /> : i+1 }</IconContainer>
                    <div>{ step.title }</div>
                    { steps.length != i+1 && <div className='line'/> }
                </StepContainer>); 
            })}
        </Container>
    );
};

export default ProgressBar;
