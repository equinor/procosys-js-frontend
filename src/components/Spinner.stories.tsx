import React from 'react';
import Spinner, { SpinnerProps } from '@procosys/components/Spinner';
import { Story, Meta } from '@storybook/react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  width: 200px;
`;


export default {
    title: 'Procosys/Spinner',
    component: Spinner,
    parameters: {
        docs: {
            description: {
                component: `Spinner used in Procosys.
        `,
            },
        },
        info: {},
    }
} as Meta;

export const Default: Story<SpinnerProps> = (args: JSX.IntrinsicAttributes & SpinnerProps) => {
    return (
        <Wrapper>
            <Spinner {...args} />
        </Wrapper>

    );
};