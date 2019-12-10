import { Container, DropdownButton, DropdownIcon, DropdownItem } from './style';
import React, { useRef, useState } from 'react';

import { Shevron } from './../../assets/icons';
import { useClickOutsideNotifier } from './../../hooks';

type DropdownProps = {
    disabled?: boolean;
    text: string;
    children: JSX.Element[] | JSX.Element;
}

const KEYCODE_ESCAPE = 27;

const Select: React.FC<DropdownProps> = ({
    disabled = false, text = '', children
}: DropdownProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    children = React.Children.toArray(children);

    useClickOutsideNotifier(() => {
        setIsOpen(false);
    }, containerRef);

    const toggleDropdown = (): void => {
        setIsOpen(!isOpen);
    };

    return (
        <Container ref={containerRef}>
            <DropdownButton
                onClick={toggleDropdown}
                disabled={disabled}
                role="listbox"
                isOpen={isOpen}
                aria-expanded={isOpen}
                aria-haspopup={true}
            >
                {text}

                <DropdownIcon>
                    <img src={Shevron} />
                </DropdownIcon>
            </DropdownButton>
            {isOpen && children && children.length > 0 && !disabled && (
                <ul
                    onKeyDown={(e): void => {
                        e.keyCode === KEYCODE_ESCAPE && setIsOpen(false);
                    }}
                >
                    {children.map((item, index) => {
                        return (
                            <DropdownItem
                                key={index}
                                role="option"
                                tabIndex={0}
                            >
                                {item}
                            </DropdownItem>
                        );
                    })}
                </ul>
            )}
            {isOpen && (!children || children.length <= 0) && !disabled && (
                <ul>
                    <li data-value={-1}>No items available</li>
                </ul>
            )}
        </Container>
    );
};

export default Select;
