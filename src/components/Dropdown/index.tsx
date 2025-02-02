import {
    Container,
    DropdownButton,
    DropdownItem,
    DropdownList,
    FilterContainer,
    IconContainer,
    TopTextContainer,
} from './style';
import React, { useEffect, useRef, useState } from 'react';
import { useClickOutsideNotifier } from './../../hooks';
import { KeyboardArrowDown } from '@mui/icons-material';

export interface DropdownProps {
    disabled?: boolean;
    text?: string;
    children?: React.ReactNode;
    Icon?: JSX.Element;
    onFilter?: (input: string) => void;
    label?: string;
    /** empty value and 'form' are the only implemented variants */
    variant?: string;
    meta?: string;
    maxHeight?: string;
    keepOpen?: boolean;
}

const KEYCODE_ESCAPE = 27;

const Dropdown: React.FC<DropdownProps> = ({
    disabled = false,
    text = '',
    Icon,
    children,
    onFilter,
    label,
    variant,
    meta,
    maxHeight = '80vh',
    keepOpen,
}: DropdownProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    children = children ? React.Children.toArray(children) : [];

    if (!Icon) Icon = <KeyboardArrowDown />;

    useClickOutsideNotifier(() => {
        if (onFilter) {
            onFilter('');
        }
        setIsOpen(false);
    }, containerRef);

    const toggleDropdown = (): void => {
        if (isOpen && onFilter) {
            onFilter('');
        }
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

            if (windowWidth - listLeftPosition < listWidth + 5) {
                listRef.current.style.right = '2px';
            }
        }
    }, [isOpen]);

    return (
        <Container ref={containerRef}>
            {(label || meta) && (
                <TopTextContainer variant={variant}>
                    <div>{label}</div>
                    <div>{meta}</div>
                </TopTextContainer>
            )}
            <DropdownButton
                onClick={toggleDropdown}
                disabled={disabled}
                role="listbox"
                isOpen={isOpen}
                aria-expanded={isOpen}
                aria-haspopup={true}
                variant={variant}
            >
                {text}

                <IconContainer>{Icon}</IconContainer>
            </DropdownButton>
            {isOpen && (
                <DropdownList
                    ref={listRef}
                    maxHeight={maxHeight}
                    onKeyDown={(e): void => {
                        e.keyCode === KEYCODE_ESCAPE && toggleDropdown();
                    }}
                >
                    {onFilter && (
                        <FilterContainer>
                            <input
                                autoFocus
                                type="text"
                                onKeyUp={(e): void =>
                                    onFilter(e.currentTarget.value)
                                }
                                placeholder="Filter"
                            />
                        </FilterContainer>
                    )}
                    {children &&
                        React.Children.count(children) > 0 &&
                        React.Children.map(children, (item, index) => {
                            return (
                                <DropdownItem
                                    key={index}
                                    role="option"
                                    onClick={
                                        keepOpen ? undefined : toggleDropdown
                                    }
                                    tabIndex={0}
                                >
                                    {item}
                                </DropdownItem>
                            );
                        })}
                    {(!children || React.Children.count(children) <= 0) && (
                        <ul style={{ boxShadow: 'none' }}>
                            <li data-value={-1}>No items found</li>
                        </ul>
                    )}
                </DropdownList>
            )}
        </Container>
    );
};

export default Dropdown;
