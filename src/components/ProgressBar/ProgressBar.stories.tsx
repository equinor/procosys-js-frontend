import React from 'react';
import ProgressBar, { ProgressBarProps } from '@procosys/components/ProgressBar';
import { Story, Meta } from '@storybook/react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(4', 'fit-content(100%));
`;

export default {
    title: 'Procosys/ProgressBar',
    component: ProgressBar,
    args: {
        steps: [
            {
                title: 'First step',
                isCompleted: true
            },
            {
                title: 'Second step',
                isCompleted: false
            },
            {
                title: 'Third step',
                isCompleted: false
            },
        ],
        currentStep: 1
    },
    argTypes: {
        currentStep: {
            control: {
                type: 'select',
                options: [1, 2, 3]
            }
        }
    },
    parameters: {
        docs: {
            description: {
                component: `ProgressBar component used in Procosys.
        `,
            },
        },
        info: {},
    },
} as Meta;

export const Default: Story<ProgressBarProps> = (args: JSX.IntrinsicAttributes & ProgressBarProps) => {
    return (
        <Wrapper>
            <ProgressBar {...args} ></ProgressBar>
        </Wrapper>
    );
};