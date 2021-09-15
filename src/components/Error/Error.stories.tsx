import React from 'react';
import ErrorComponent, { ErrorProps } from '@procosys/components/Error';
import { Story, Meta } from '@storybook/react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(4, fit-content(100%));
`;


export default {
    title: 'Procosys/ErrorComponent',
    component: ErrorComponent,
    parameters: {
        docs: {
            description: {
                component: `Error component used in Procosys.
          `,
            },
        },
        info: {},
    },
} as Meta;


export const Default: Story<ErrorProps> = (args: JSX.IntrinsicAttributes & ErrorProps & { children?: React.ReactNode; }) => {
    return (
        <Wrapper>
            <ErrorComponent {...args} />
        </Wrapper>
    );
};