import { CascadingItem, Container, DropdownButton, DropdownIcon, ItemContent, SelectableItem } from './style';
import React, { ReactNode, useRef, useState } from 'react';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { useClickOutsideNotifier } from './../../hooks';

export type SelectItem = {
    text: string;
    icon?: ReactNode;
    children?: SelectItem[];
};

type SelectProps = {
    data: SelectItem[];
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

    const createNodesForItems = (items: SelectItem[]): JSX.Element[] => {

        return items.map((itm, index) => {

            const isSelectedItem = index === selectedIndex;
            if (!itm.children) {
                return (<SelectableItem
                    key={index}
                    role="option"
                    selected={isSelectedItem}
                    data-value={itm.text}
                    tabIndex={0}
                    onKeyDown={(e): void => {
                        e.keyCode === KEYCODE_ENTER &&
                            selectItem(index);
                    }}
                    onClick={(): void => {
                        selectItem(index);
                    }}
                    data-selected={isSelectedItem}
                >
                    <ItemContent>
                        {itm.icon || null}
                        {itm.text}
                    </ItemContent>
                </SelectableItem>);
            }

            return (<SelectableItem
                key={index}
                role="option"
                selected={isSelectedItem}
                data-value={itm.text}
                tabIndex={0}
                onKeyDown={(e): void => {
                    e.keyCode === KEYCODE_ENTER &&
                        selectItem(index);
                }}
                data-selected={isSelectedItem}
            >
                <ItemContent>
                    {itm.icon || null}
                    {itm.text}
                </ItemContent>
                <CascadingItem>
                    {createNodesForItems(itm.children)}
                </CascadingItem>
            </SelectableItem>);
        });
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
                    className='container'
                    onKeyDown={(e): void => {
                        e.keyCode === KEYCODE_ESCAPE && setIsOpen(false);
                    }}
                >
                    {createNodesForItems(data)}
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
