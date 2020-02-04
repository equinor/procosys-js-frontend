import { Container, DropdownButton, DropdownIcon, DropdownItem, FilterContainer } from './style';
import React, { useRef, useState } from 'react';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { useClickOutsideNotifier } from './../../hooks';

type DropdownProps = {
    disabled?: boolean;
    text?: string;
    children?: React.ReactNode;
    Icon?: JSX.Element;
    openLeft?: boolean;
    onFilter?: (input: string) => void;
};

const KEYCODE_ESCAPE = 27;

const Select: React.FC<DropdownProps> = ({
    disabled = false,
    text = '',
    Icon = <KeyboardArrowDownIcon />,
    children,
    openLeft,
    onFilter,
}: DropdownProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    children = children ? React.Children.toArray(children) : [];

    useClickOutsideNotifier(() => {
        setIsOpen(false);
    }, containerRef);

    const toggleDropdown = (): void => {
        if (isOpen && onFilter) {
            onFilter('');
        }
        setIsOpen(!isOpen);
    };

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
                {text}

                <DropdownIcon>{Icon}</DropdownIcon>
            </DropdownButton>
            {isOpen && (
                <ul
                    onKeyDown={(e): void => {
                        e.keyCode === KEYCODE_ESCAPE && toggleDropdown();
                    }}
                >
                    {onFilter && (
                        <FilterContainer>
                            <input autoFocus type="text" onKeyUp={(e): void => onFilter(e.currentTarget.value)} placeholder="Filter" />
                        </FilterContainer>
                    )}
                    {children && React.Children.count(children) > 0 && (
                        React.Children.map(children, (item, index) => {
                            return (
                                <DropdownItem
                                    key={index}
                                    role="option"
                                    onClick={toggleDropdown}
                                    tabIndex={0}
                                >
                                    {item}
                                </DropdownItem>
                            );
                        })
                    )}
                    {(!children || React.Children.count(children) <= 0) && (
                        <ul>
                            <li data-value={-1}>No items available</li>
                        </ul>
                    )}

                </ul>
            )}
        </Container>
    );
};

export default Select;
