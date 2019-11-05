import React, { useState } from 'react'
import { Container, DropdownButton, DropdownItem, DropdownIcon } from './style';
import { Shevron } from './../../assets/icons';

type dropdownItem = {
    text: string;
    value: any;
}

interface IDropDownProps {
    data: Array<dropdownItem>;
    selected?: dropdownItem;
    disabled?: boolean;
    onChange?: (newValue: dropdownItem, oldValue?: dropdownItem, ) => void;
}

const DropdownMenu = ({ disabled = false, data = [], selected, onChange = () => { } }: IDropDownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(selected);
    const [isDisabled, setIsDisabled] = useState(disabled);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    }

    const selectItem = (item: dropdownItem) => {
        onChange(item, selectedItem);
        setSelectedItem(item);
        setIsOpen(false);
    }

    const selectedText = (selectedItem && selectedItem.text) || 'Select';

    return (
        <Container>
            <DropdownButton
                onClick={toggleDropdown}
                disabled={disabled}
                role="listbox"
                isOpen={isOpen}
                aria-expanded={isOpen}
                aria-haspopup={true}>
                {selectedText}

                <DropdownIcon>
                    <img src={Shevron} />
                </DropdownIcon>
            </DropdownButton>
            {(isOpen && data.length > 0 && !isDisabled) && (
                <ul>
                    {data.map((item, index) => {
                        const isSelectedValue = selectedItem && item.value === selectedItem.value;
                        return (<DropdownItem
                            key={index}
                            role="option"
                            data-value={item.value}
                            data-selected={isSelectedValue}>
                            <button onClick={() => selectItem(item)}>
                                {item.text}
                            </button>
                        </DropdownItem>)
                    })}
                </ul>
            )}
            {(isOpen && data.length <= 0 && !isDisabled) && (
                <ul>
                    <li data-value={-1}>No items available</li>
                </ul>
            )}
        </Container>
    )
}

export default DropdownMenu
