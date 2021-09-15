import React, { useState } from 'react';
import Select, { SelectItem, SelectProps } from '@procosys/components/Select';
import { Story, Meta } from '@storybook/react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  width: 200px;
`;

const items: SelectItem[] = [
    { text: 'Hello', value: 'world' },
    { text: 'Foo', value: 'Bar' },
];

export default {
    title: 'Procosys/Select',
    component: Select,
    parameters: {
        docs: {
            description: {
                component: `Select component used in Procosys.
        `,
            },
        },
        info: {},
    },
    args: {
        data: items
    }
} as Meta;

export const Default: Story<SelectProps> = (args: JSX.IntrinsicAttributes & SelectProps & { children?: React.ReactNode; }) => {
    const [selected, setSelected] = useState<SelectItem | null>();
    return (
        <Wrapper>
            <Select {...args} onChange={(value): void => setSelected(items.find((p: SelectItem) => p.value === value))}>
                {selected && selected.text || 'Select'}
            </Select>
        </Wrapper>

    );
};