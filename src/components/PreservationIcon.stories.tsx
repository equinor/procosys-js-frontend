import React from 'react';
import PreservationIcon, { IconProps } from '@procosys/components/PreservationIcon';
import { Story, Meta } from '@storybook/react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  width: 200px;
`;

const variants = ['Area', 'Battery', 'Bearings', 'Electrical', 'Heating', 'Installation', 'Power', 'Nitrogen', 'Pressure', 'Rotate', 'Other'];


export default {
    title: 'Procosys/PreservationIcon',
    component: PreservationIcon,
    parameters: {
        docs: {
            description: {
                component: `Preservation icon component used in Procosys.
        `,
            },
        },
        info: {},
    },
    argTypes: {
        variant: {
            control: {
                type: 'select',
                options: variants.sort()
            }
        }
    }
} as Meta;

export const Default: Story<IconProps> = (args: JSX.IntrinsicAttributes & IconProps) => {
    return (
        <Wrapper>
            <PreservationIcon {...args} />
        </Wrapper>

    );
};