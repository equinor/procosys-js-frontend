import React from 'react';
import Checkbox, { CheckboxProps } from '@procosys/components/Checkbox';
import { Story, Meta } from '@storybook/react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(4, fit-content(100%));
`;


export default {
    title: 'Procosys/Checkbox',
    component: Checkbox,
    parameters: {
        docs: {
            description: {
                component: `Checkbox component used in Procosys.
          `,
            },
        },
        info: {},
    },
    argTypes: {
        children: {
            control: {
                type: 'select',
                options: ['label', 'div'],
            },
        },
    },
} as Meta;


export const Default: Story<CheckboxProps> = (args: JSX.IntrinsicAttributes & CheckboxProps & { children?: React.ReactNode; }) => {
    return (
        <Wrapper>
            <Checkbox {...args} />
        </Wrapper>
    );
};
