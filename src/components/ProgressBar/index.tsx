import React from 'react';

import { Container, StepContainer } from './style';
import EdsIcon from '../EdsIcon';

type ProgressBarSteps = {
    title: string;
    isCompleted: boolean;
}

interface ProgressBarProps {
    steps: ProgressBarSteps[];
    currentStep: number;
}

const ProgressBar = ({
    steps,
    currentStep
}: ProgressBarProps): JSX.Element => {

    return (
        <Container>
            {steps.map((step, i) => {     
                return (<StepContainer key={i} currentStep={currentStep == i+1} stepCompleted={step.isCompleted}>
                    <div>{ step.isCompleted && currentStep != i+1 ? <EdsIcon name='done' size={16} /> : i+1 }</div>
                    <div>{ step.title }</div>
                    { steps.length != i+1 && <div className='line'/> }
                </StepContainer>); 
            })}
        </Container>
    );
};

export default ProgressBar;
