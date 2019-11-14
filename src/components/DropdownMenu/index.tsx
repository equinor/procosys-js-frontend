import React, { useState, useRef, useMemo } from 'react'
import { Container, DropdownButton, DropdownItem, DropdownIcon } from './style';
import { Shevron } from './../../assets/icons';
import { useClickOutsideNotifier } from './../../hooks';

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

const KEYCODE_ENTER = 13;
const KEYCODE_ESCAPE = 27;

const DropdownMenu = ({ disabled = false, data = [], selected, onChange = () => { } }: IDropDownProps) => {
    console.log("Re-rendering");

    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(selected);
    const containerRef = useRef<HTMLDivElement>(null);

    useMemo(() => {
        console.log("State: ", isOpen);
    }, [isOpen])


    useClickOutsideNotifier(() => {
        console.log("Closing...", isOpen);
        isOpen && setIsOpen(false);
    }, containerRef);

    const toggleDropdown = () => {
        console.log("Toggling menu - future: ", !isOpen);
        setIsOpen(!isOpen);
    }

    const selectItem = (item: dropdownItem) => {
        console.log("Selecting item");
        onChange(item, selectedItem);
        setSelectedItem(item);
        setIsOpen(false);
    }

    const selectedText = (selectedItem && selectedItem.text) || 'Select';
    return (
        <Container ref={containerRef}>
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
            {(isOpen && data.length > 0 && !disabled) && (
                <ul onKeyDown={(e) => {
                    console.log("Keydown");
                    e.keyCode === KEYCODE_ESCAPE && setIsOpen(false);
                }
                }>
                    {data.map((item, index) => {
                        const isSelectedValue = selectedItem && item.value === selectedItem.value || false;
                        return (<DropdownItem
                            key={index}
                            role="option"
                            selected={isSelectedValue}
                            data-value={item.value}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                console.log("Keydown");
                                e.keyCode === KEYCODE_ENTER && selectItem(item);
                            }}
                            onClick={() => {
                                console.log("Clicked Item ", item)
                                selectItem(item);
                            }}
                            data-selected={isSelectedValue}>
                            {item.text}
                        </DropdownItem>)
                    })}
                </ul>
            )}
            {(isOpen && data.length <= 0 && !disabled) && (
                <ul>
                    <li data-value={-1}>No items available</li>
                </ul>
            )}
        </Container>
    )
}

export default DropdownMenu
