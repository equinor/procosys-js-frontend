import { CascadingItem, Container, DropdownButton, DropdownIcon, ItemContent, SelectableItem } from './style';
import React, { ReactNode, useRef, useState } from 'react';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { useClickOutsideNotifier } from './../../hooks';

export type SelectItem = {
    text: string;
    value: any;
    selected?: boolean;
    icon?: ReactNode;
    children?: SelectItem[];
};

type SelectProps = {
    data: SelectItem[];
    disabled?: boolean;
    onChange?: (newValue: any) => void;
    openLeft?: boolean;
    children: ReactNode;
    label?: string;
};

const KEYCODE_ENTER = 13;
const KEYCODE_ESCAPE = 27;

const Select = ({
    disabled = false,
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

    const selectItem = (value: any): void => {
        onChange(value);
        setIsOpen(false);
    };

    const createNodesForItems = (items: SelectItem[]): JSX.Element[] => {

        return items.map((itm, index) => {

            if (!itm.children) {
                return (<SelectableItem
                    key={index}
                    role="option"
                    selected={!!itm.selected}
                    tabIndex={0}
                    onKeyDown={(e): void => {
                        e.keyCode === KEYCODE_ENTER &&
                            selectItem(itm.value);
                    }}
                    onClick={(): void => {
                        selectItem(itm.value);
                    }}
                    data-selected={!!itm.selected}
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
                selected={!!itm.selected}
                data-value={itm.text}
                tabIndex={0}
                onKeyDown={(e): void => {
                    if (e.keyCode === KEYCODE_ENTER) {
                        // We should do something to support keyboard navigation
                    }
                }}
                data-selected={!!itm.selected}
            >
                <ItemContent>
                    {itm.icon || null}
                    {itm.text}
                    <KeyboardArrowRightIcon />
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
