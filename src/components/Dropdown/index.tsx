import { Container, DropdownButton, DropdownIcon, DropdownItem } from './style';
import React, { useRef, useState } from 'react';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { useClickOutsideNotifier } from './../../hooks';

type DropdownProps = {
    disabled?: boolean;
    text?: string;
    children?: React.ReactNode;
    Icon?: JSX.Element;
    openLeft?: boolean;
};

const KEYCODE_ESCAPE = 27;

const Select: React.FC<DropdownProps> = ({
    disabled = false,
    text = '',
    Icon = <KeyboardArrowDownIcon />,
    children,
    openLeft,
}: DropdownProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    children = children ? React.Children.toArray(children) : [];

    useClickOutsideNotifier(() => {
        setIsOpen(false);
    }, containerRef);

    const toggleDropdown = (): void => {
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
            {isOpen && children && React.Children.count(children) > 0 && !disabled && (
                <ul
                    onKeyDown={(e): void => {
                        e.keyCode === KEYCODE_ESCAPE && setIsOpen(false);
                    }}
                >
                    {React.Children.map(children, (item, index) => {
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
                    })}
                </ul>
            )}
            {isOpen && (!children || React.Children.count(children) <= 0) && !disabled && (
                <ul>
                    <li data-value={-1}>No items available</li>
                </ul>
            )}
        </Container>
    );
};

export default Select;
