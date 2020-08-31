import React from 'react';

import { Container, StepContainer } from './style';
import EdsIcon from '../EdsIcon';

type ProgressBarSteps = {
    title: string;
    isCompleted: boolean;
    isCurrent: boolean;
}

interface ProgressBarProps {
    steps: ProgressBarSteps[];
}

const ProgressBar = ({
    steps
}: ProgressBarProps): JSX.Element => {

    return (
        <Container>
            {steps.map((step, i) => {     
                return (<StepContainer key={i} currentStep={step.isCurrent} stepCompleted={step.isCompleted}>
                    <div>{ step.isCompleted ? <EdsIcon name='done' size={16} /> : i+1 }</div>
                    <div>{ step.title }</div>
                    { steps.length != i+1 && <div className='line'/> }
                </StepContainer>); 
            })}
        </Container>
    );
};

export default ProgressBar;
