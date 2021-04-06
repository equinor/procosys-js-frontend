import React from 'react';
import Loading, { LoadingProps } from '@procosys/components/Loading';
import { Story, Meta } from '@storybook/react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(4, fit-content(100%));
`;


export default {
    title: 'Procosys/Loading',
    component: Loading,
    parameters: {
        docs: {
            description: {
                component: `Component to display loading status.
          `,
            },
        },
        info: {},
    },
} as Meta;


export const Default: Story<LoadingProps> = (args: JSX.IntrinsicAttributes & LoadingProps & { children?: React.ReactNode; }) => {
    return (
        <Wrapper>
            <Loading {...args} />
        </Wrapper>
    );
};