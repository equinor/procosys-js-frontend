import { CascadingItem, Container, DropdownButton, DropdownIcon, ItemContent, SelectableItem, Label, TitleItem, TitleContent } from './style';
import React, { ReactNode, useRef, useState, useEffect } from 'react';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { useClickOutsideNotifier } from './../../hooks';

export type SelectItem = {
    text: string;
    value: any;
    selected?: boolean;
    icon?: ReactNode;
    children?: SelectItem[];
    title?: boolean;
};

type SelectProps = {
    data: SelectItem[];
    disabled?: boolean;
    onChange?: (newValue: any) => void;
    children: ReactNode;
    label?: string;
    isVoided?: boolean;
};

const KEYCODE_ENTER = 13;
const KEYCODE_ESCAPE = 27;

const Select = ({
    disabled = false,
    data = [],
    onChange = (): void => {
        /*eslint-disable-line no-empty */
    },
    children,
    label,
    isVoided = false
}: SelectProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

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

    /**
     * Open dropdown to the left:
     * When there is not enough space on the right-hand side of the viewport, relative to the dropdown.
     * Calculates using: (window width - dropdown position) < (dropdown size + margin)
     */
    useEffect(() => {
        if (isOpen && listRef.current) {
            const listWidth = listRef.current.offsetWidth;
            const listLeftPosition = listRef.current.offsetLeft;
            const windowWidth = window.innerWidth;

            if ((windowWidth - listLeftPosition) < (listWidth + 5)) {
                listRef.current.style.right = '2px';
            }
        }
    }, [isOpen]);

    const createNodesForItems = (items: SelectItem[]): JSX.Element[] => {
        return items.map((itm, index) => {
            if(itm.title) {
                return <TitleItem
                    key={index}
                    tabIndex={0}
                >
                    <TitleContent borderTop={index > 0} >
                        {itm.text}
                    </TitleContent>
                </TitleItem>;
            }

            if (!itm.children) {
                return (<SelectableItem
                    key={index}
                    role="option"
                    selected={!!itm.selected}
                    tabIndex={0}
                    data-value={itm.value}
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
                data-value={itm.value}
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
                    <KeyboardArrowRightIcon className='arrowIcon' />
                </ItemContent>
                <CascadingItem>
                    {createNodesForItems(itm.children)}
                </CascadingItem>
            </SelectableItem>);
        });
    };

    return (
        <Container ref={containerRef}>
            <Label isVoided={isVoided}>{label}</Label>
            <DropdownButton
                isVoided={isVoided}
                onClick={toggleDropdown}
                disabled={disabled}
                role="listbox"
                isOpen={isOpen}
                aria-expanded={isOpen}
                aria-haspopup={true}
            >
                {children}

                {!isVoided && <DropdownIcon disabled={disabled} >
                    <KeyboardArrowDownIcon />
                </DropdownIcon>}
            </DropdownButton>
            {isOpen && data.length > 0 && !disabled && (
                <ul ref={listRef}
                    className='container'
                    onKeyDown={(e): void => {
                        e.keyCode === KEYCODE_ESCAPE && setIsOpen(false);
                    }}
                >
                    {createNodesForItems(data)}
                </ul>
            )}
            {isOpen && data.length <= 0 && !disabled && (
                <ul style={{ boxShadow: 'none' }}>
                    <li data-value={-1}>No items found</li>
                </ul>
            )}
        </Container>
    );
};

export default Select;
