import React, { useState } from 'react';
import Dropdown, { DropdownProps } from '@procosys/components/Dropdown';
import { Story, Meta } from '@storybook/react';
import styled from 'styled-components';



const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(4, fit-content(100%));
`;

const DropdownItem = styled.div<DropdownProps>`
    padding: calc(var(--grid-unit) * 2) calc(var(--grid-unit) * 3);
`;

const generateOptions = (size: number): string[] => {
    const optionsArr: string[] = [];
    let i = 0;
    while (i < size) {
        optionsArr.push('Option ' + (i + 1));
        i++;
    }
    return optionsArr;
};

const optionsArr = generateOptions(6);

export default {
    title: 'Procosys/DropDown',
    component: Dropdown,
    parameters: {
        docs: {
            description: {
                component: `Dropdown component used in Procosys.
        `,
            },
        }
    },
    argTypes:{
        Icon:{
            control:false
        }
    }
} as Meta;

export const Default: Story<DropdownProps> = (args: JSX.IntrinsicAttributes & DropdownProps & { children?: React.ReactNode; }) => {
    args.text = 'I am a dropdown';
    return (
        <Wrapper>
            <Dropdown {...args} >
                {optionsArr.map((option, index) => {
                    return (
                        <DropdownItem key={index}>
                            <div>{option}</div>
                            <div>Subtext {option}</div>
                        </DropdownItem>
                    );
                })}
            </Dropdown>
        </Wrapper>
    );
};

export const Filtered: Story<DropdownProps> = (args: JSX.IntrinsicAttributes & DropdownProps & { children?: React.ReactNode; }) => {
    const [filteredOptions, setFilteredOptions] = useState<string[]>(generateOptions(7));
    const [selectedText, setSelectedText] = useState<string>('I am a dropdown');

    const handleChange = (val: string): void => {
        const _filteredOptions = JSON.parse(JSON.stringify(optionsArr)).filter((p: string) => {
            return p.toLowerCase().indexOf(val.toLowerCase()) > -1;
        });
        setFilteredOptions(_filteredOptions);
    };

    const setSelected = (event: React.MouseEvent, index: number): void => {
        setSelectedText(filteredOptions[index]);
    };

    args.text = selectedText;

    return (
        <Wrapper>
            <Dropdown onFilter={handleChange} {...args}>
                {filteredOptions && filteredOptions.length > 0 &&  filteredOptions.map((option, index) => {
                    return (
                        <DropdownItem key={index} onClick={(event): void => setSelected(event, index)}>
                            <div>{option}</div>
                            <div>Subtext {option}</div>
                        </DropdownItem>
                    );
                })}
            </Dropdown>
        </Wrapper>
    );
};