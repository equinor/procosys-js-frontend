import { Container, Option, Select } from './style';
import React, { useRef } from 'react';

export type SelectItem = {
    text: string;
};

type SelectProps = {
    data: Array<SelectItem>;
    disabled?: boolean;
    onChange?: (index: number) => void;
    selectedIndex?: number;
    label?: string;
};

const SelectInput = ({
    disabled = false,
    onChange = (): void => {
        /**/
    },
    selectedIndex = -1,
    label,
    data,
}: SelectProps): JSX.Element => {
    const inputReference = useRef<HTMLSelectElement>(null);

    const selectionChanged = (): void => {
        if (!inputReference.current) return;
        //Deduct 1 index position because of default item
        onChange(inputReference.current.selectedIndex - 1);
    };

    return (
        <Container>
            <label>
                {label && <span>{label}</span>}
                <Select
                    disabled={disabled}
                    onChange={selectionChanged}
                    placeholder={'Select'}
                    ref={inputReference}
                >
                    <Option>Select</Option>
                    {data.map((item, index) => {
                        return (
                            <Option
                                key={index}
                                selected={selectedIndex === index}
                            >
                                {item.text}
                            </Option>
                        );
                    })}
                </Select>
            </label>
        </Container>
    );
};

export default SelectInput;
