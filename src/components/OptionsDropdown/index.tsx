import { Container, DropdownButton, DropdownItem } from './style';
import React, { useRef, useState, useEffect } from 'react';
import { useClickOutsideNotifier } from '../../hooks';
import EdsIcon from '../EdsIcon';
import { tokens } from '@equinor/eds-tokens';


type DropdownProps = {
    disabled?: boolean;
    text?: string;
    children?: React.ReactNode;
    icon?: string;
    variant?: string;
};

const KEYCODE_ESCAPE = 27;

const Select: React.FC<DropdownProps> = ({
    disabled = false,
    text = '',
    icon,
    children,
    variant
}: DropdownProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    children = children ? React.Children.toArray(children) : [];

    useClickOutsideNotifier(() => {
        setIsOpen(false);
    }, containerRef);

    const toggleDropdown = (): void => {
        console.log(children);
        setIsOpen(!isOpen);
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

    return (
        <Container ref={containerRef}>
            <DropdownButton
                onClick={toggleDropdown}
                disabled={disabled}
                role="listbox"
                isOpen={isOpen}
                aria-expanded={isOpen}
                aria-haspopup={true}
                variant={variant}
            >
                {icon && <div className='iconNextToText' ><EdsIcon name={icon} color={disabled && tokens.colors.interactive.disabled__border.rgba} /></div>}
                {text}
            </DropdownButton>
            {isOpen && (
                <ul ref={listRef}
                    onKeyDown={(e): void => {
                        e.keyCode === KEYCODE_ESCAPE && toggleDropdown();
                    }}
                >
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
                </ul>
            )}
        </Container>
    );
};

export default Select;
