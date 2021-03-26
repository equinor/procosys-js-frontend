import React, { useState } from 'react';
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


export const WithUseState: Story<CheckboxProps> = (args: JSX.IntrinsicAttributes & CheckboxProps & { children?: React.ReactNode; }) => {
    const [iAmChecked, setIAmChecked] = useState<boolean>(true);
    const label = (<label>I am a label</label>);
    const div = (<div>I am a div</div>);
    args.children == 'label' ? args.children = label : args.children === 'div' ? args.children = div : undefined;
    return (
        <Wrapper>
            <Checkbox {...args} checked={iAmChecked} onChange={(): void => setIAmChecked(iAmChecked => !iAmChecked)} />
        </Wrapper>
    );
};


export const WithChildren: Story<CheckboxProps> = (args: JSX.IntrinsicAttributes & CheckboxProps & { children?: React.ReactNode; }) => {
    const label = (<label>I am a label</label>);
    const div = (<div>I am a div</div>);
    args.children == 'label' ? args.children = label : args.children === 'div' ? args.children = div : undefined;

    return (
        <Wrapper>
            <Checkbox {...args} />
        </Wrapper>
    );
};