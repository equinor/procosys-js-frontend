import { Container, DropdownButton, DropdownIcon, DropdownItem } from './style';
import React, { useRef, useState } from 'react';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { useClickOutsideNotifier } from './../../hooks';

export type SelectItem = {
    text: string;
    value: string | number;
};

type SelectProps =  {
    data: Array<SelectItem>;
    selected?: SelectItem;
    disabled?: boolean;
    onChange?: (newValue: SelectItem, oldValue?: SelectItem) => void;
    openLeft?: boolean;
}

const KEYCODE_ENTER = 13;
const KEYCODE_ESCAPE = 27;

const Select = ({
    disabled = false,
    data = [],
    selected,
    onChange = (): void => {/*eslint-disable-line no-empty */},
    openLeft,
}: SelectProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(selected);
    const containerRef = useRef<HTMLDivElement>(null);

    useClickOutsideNotifier(() => {
        setIsOpen(false);
    }, containerRef);

    const toggleDropdown = (): void => {
        setIsOpen(!isOpen);
    };

    const selectItem = (item: SelectItem): void => {
        onChange(item, selectedItem);
        setSelectedItem(item);
        setIsOpen(false);
    };

    const selectedText = (selectedItem && selectedItem.text) || 'Select';
    return (
        <Container ref={containerRef} openLeft={openLeft || false}>
            <DropdownButton
                onClick={toggleDropdown}
                disabled={disabled}
                role="listbox"
                isOpen={isOpen}
                aria-expanded={isOpen}
                aria-haspopup={true}
            >
                {selectedText}

                <DropdownIcon>
                    <KeyboardArrowDownIcon />
                </DropdownIcon>
            </DropdownButton>
            {isOpen && data.length > 0 && !disabled && (
                <ul
                    onKeyDown={(e): void => {
                        e.keyCode === KEYCODE_ESCAPE && setIsOpen(false);
                    }}
                >
                    {data.map((item, index) => {
                        const isSelectedValue =
                            (selectedItem && item.value === selectedItem.value) || false;
                        return (
                            <DropdownItem
                                key={index}
                                role="option"
                                selected={isSelectedValue}
                                data-value={item.value}
                                tabIndex={0}
                                onKeyDown={(e): void => {
                                    e.keyCode === KEYCODE_ENTER && selectItem(item);
                                }}
                                onClick={(): void => {
                                    selectItem(item);
                                }}
                                data-selected={isSelectedValue}
                            >
                                {item.text}
                            </DropdownItem>
                        );
                    })}
                </ul>
            )}
            {isOpen && data.length <= 0 && !disabled && (
                <ul>
                    <li data-value={-1}>No items available</li>
                </ul>
            )}
        </Container>
    );
};

export default Select;
