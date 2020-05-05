import { Container, DropdownButton, IconContainer, DropdownItem, FilterContainer, TopTextContainer } from './style';
import React, { useRef, useState, useEffect } from 'react';
import EdsIcon from '../EdsIcon';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { useClickOutsideNotifier } from './../../hooks';

type DropdownProps = {
    disabled?: boolean;
    text?: string;
    children?: React.ReactNode;
    Icon?: JSX.Element;
    onFilter?: (input: string) => void;
    label?: string;
    variant?: string;
    meta?: string;
    clearable?: boolean;
    defaultText?: string;
};

const KEYCODE_ESCAPE = 27;
const clearIcon = <EdsIcon name='close' />;

const Select: React.FC<DropdownProps> = ({
    disabled = false,
    text = '',
    Icon = <KeyboardArrowDownIcon />,
    children,
    onFilter,
    label,
    variant,
    meta,
    clearable,
    defaultText = ''
}: DropdownProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    children = children ? React.Children.toArray(children) : [];
    const [cleared, setCleared] = useState<boolean>(false);
    const [displayIcon, setDisplayIcon] = useState<JSX.Element>(Icon);

    useClickOutsideNotifier(() => {
        setIsOpen(false);
    }, containerRef);

    const toggleDropdown = (): void => {
        if (isOpen && onFilter) {
            onFilter('');
        }
        setIsOpen(!isOpen);
    };

    const itemClicked = (): void => {
        toggleDropdown();
        if (clearable) {
            setCleared(false);
            setDisplayIcon(clearIcon);
        }
    };

    const clear = (e: React.MouseEvent): void => {
        e.stopPropagation();
        setCleared(true);
        setDisplayIcon(Icon);
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
            {(label || meta) &&
            <TopTextContainer>
                <div>{label}</div>
                <div>{meta}</div>
            </TopTextContainer>
            }
            <DropdownButton
                onClick={toggleDropdown}
                disabled={disabled}
                role="listbox"
                isOpen={isOpen}
                aria-expanded={isOpen}
                aria-haspopup={true}
                variant={variant}
            >
                {cleared ? defaultText : text}

                <IconContainer onClick={(e: React.MouseEvent): void => {
                    if (displayIcon == clearIcon) {
                        clear(e);
                    }
                }}>{displayIcon}</IconContainer>
            </DropdownButton>
            {isOpen && (
                <ul ref={listRef}
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
                                    onClick={itemClicked}
                                    tabIndex={0}
                                >
                                    {item}
                                </DropdownItem>
                            );
                        })
                    )}
                    {(!children || React.Children.count(children) <= 0) && (
                        <ul style={{boxShadow: 'none'}}>
                            <li data-value={-1}>No items found</li>
                        </ul>
                    )}

                </ul>
            )}
        </Container>
    );
};

export default Select;
