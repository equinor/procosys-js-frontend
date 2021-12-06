import React from 'react';
import Flyout, { FlyoutProps } from '@procosys/components/Flyout';
import { Story, Meta } from '@storybook/react';
import styled from 'styled-components';

const Wrapper = styled.div`
    margin: 32px;
    display: grid;
    grid-gap: 32px;
    grid-template-columns: repeat(4, fit-content(100%));
`;

export default {
    title: 'Procosys/Flyout',
    component: Flyout,
    parameters: {
        docs: {
            description: {
                component: `Flyout component used in Procosys.
          `,
            },
        },
        info: {},
    },
    argTypes: {
        position: {
            control: {
                type: 'select',
                options: ['left', 'right'],
                default: 'right',
            },
        },
    },
} as Meta;

export const Default: Story<FlyoutProps> = (
    args: JSX.IntrinsicAttributes & FlyoutProps
) => {
    const children = (
        <>
            <div>child1</div>
            <div>child2</div>
        </>
    );

    return (
        <Wrapper>
            <Flyout {...args}>{children}</Flyout>
        </Wrapper>
    );
};
