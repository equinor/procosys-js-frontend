import { Container, DropdownButton, DropdownIcon, DropdownItem } from './style';
import React, { ReactNode, useRef, useState } from 'react';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { useClickOutsideNotifier } from './../../hooks';

export type SelectItem = {
    text: string;
    icon?: ReactNode;
    children?: SelectItem[];
};

type SelectProps = {
    data: Array<SelectItem>;
    selectedIndex?: number;
    disabled?: boolean;
    onChange?: (newIndex: number) => void;
    openLeft?: boolean;
    children: ReactNode;
    label?: string;
};

const KEYCODE_ENTER = 13;
const KEYCODE_ESCAPE = 27;

const Select = ({
    disabled = false,
    selectedIndex = -1,
    data = [],
    onChange = (): void => {
        /*eslint-disable-line no-empty */
    },
    openLeft,
    children,
    label,
}: SelectProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useClickOutsideNotifier(() => {
        setIsOpen(false);
    }, containerRef);

    const toggleDropdown = (): void => {
        setIsOpen(!isOpen);
    };

    const selectItem = (index: number): void => {
        onChange(index);
        setIsOpen(false);
    };

    return (
        <Container ref={containerRef} openLeft={openLeft || false}>
            {label}
            <DropdownButton
                onClick={toggleDropdown}
                disabled={disabled}
                role="listbox"
                isOpen={isOpen}
                aria-expanded={isOpen}
                aria-haspopup={true}
            >
                {children}

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
                        const isSelectedValue = selectedIndex === index;
                        return (
                            <DropdownItem
                                key={index}
                                role="option"
                                selected={isSelectedValue}
                                data-value={item.text}
                                tabIndex={0}
                                onKeyDown={(e): void => {
                                    e.keyCode === KEYCODE_ENTER &&
                                        selectItem(index);
                                }}
                                onClick={(): void => {
                                    selectItem(index);
                                }}
                                data-selected={isSelectedValue}
                            >
                                {item.icon || null}
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
