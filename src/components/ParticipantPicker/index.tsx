import { CascadingItem, Container, DropdownButton, DropdownIcon, ItemContent, SelectableItem, Label, TitleItem, TitleContent, FilterContainer, Info } from './style';
import React, { ReactNode, useRef, useState, useEffect } from 'react';
import { useClickOutsideNotifier } from '../../hooks';
//import { Radio } from '@equinor/eds-core-react';
import { RadioGroup, Radio, FormControlLabel } from '@material-ui/core';
import { SelectItem } from '../Select';
import { Participant } from '@procosys/modules/CallForPunchOut/types';
import { SelectableItemProps } from '../Select/style';
import EdsIcon from '../EdsIcon';

export type ParticipantItem = {
    text: string;
    value: any;
    selected?: boolean;
    icon?: ReactNode;
    children?: SelectItem[];
    title?: boolean;
    radioButtons?: boolean;
    radioOption?: string;
};


type SelectProps = {
    roles: SelectItem[];
    persons: SelectItem[];
    disabled?: boolean;
    onChange?: (newValue: any) => void;
    onPersonChange?: (newValue: any) => void;
    children: ReactNode;
    label?: string;
    isVoided?: boolean;
    maxHeight?: string;
    onRadioChange?: (itmValue: string, value: string) => void;
    onFilter: (input: string) => void;
};

const KEYCODE_ENTER = 13;
const KEYCODE_ESCAPE = 27;

const ParticipantPicker = ({
    disabled = false,
    roles = [],
    persons = [],
    onChange = (): void => {
        /*eslint-disable-line no-empty */
    },
    onPersonChange = (): void => {
        /*eslint-disable-line no-empty */
    },
    children,
    label,
    isVoided = false,
    maxHeight,
    onRadioChange = (): void => {
        /*eslint-disable-line no-empty */
    },
    onFilter
}: SelectProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const filterInputRef = useRef<HTMLInputElement>(null);
    const [activeFilter, setActiveFilter] = useState<boolean>(false);

    useClickOutsideNotifier(() => {
        setIsOpen(false);
    }, containerRef);

    const toggleDropdown = (): void => {
        setIsOpen(!isOpen);
    };

    const selectItem = (value: any, inRole: boolean): void => {
        if(inRole) {
            onChange(value);
        } else {
            onPersonChange(value);
        }
        setIsOpen(false);
    };

    const filter = (e: string): void => {
        onFilter(e);
        if(e.length > 0) {
            setActiveFilter(true);
        } else {
            setActiveFilter(false);
        }
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

    // const getRadioOptions = (itm : SelectItem): JSX.Element => {
    // };


    const createNodesForItems = (items: SelectItem[], inRole: boolean): JSX.Element[] => {
        return items.map((itm, index) => {
            if(itm.title) {
                return <TitleItem
                    key={index}
                    tabIndex={0}
                >
                    <TitleContent borderTop={index > 0} >
                        <div>{itm.text}</div>
                        <div>
                            <div>To</div>
                            <div>CC</div>
                        </div>
                    </TitleContent>
                </TitleItem>;
            }
            if(!itm.children && itm.radioButtons && itm.inRole) {
                return (<SelectableItem
                    key={index}
                    role="option"
                    selected={!!itm.selected}
                    tabIndex={0}
                    data-value={itm.value}
                    data-selected={!!itm.selected}
                >
                    <ItemContent>
                        <RadioGroup value={itm.radioOption} name={'test'}>
                            <FormControlLabel key={itm.value + '1'} name={itm.value} value={'1'} label={''} checked={itm.radioOption == '1'} control={<Radio onClick={(): void => onRadioChange(itm.value, '1')} />} />
                            <FormControlLabel key={itm.value + '2'} name={itm.value} value={'2'} label={''} checked={itm.radioOption == '2'} control={<Radio onClick={(): void => onRadioChange(itm.value, '2')} />} />
                        </RadioGroup>
                        {itm.text}
                    </ItemContent>
                </SelectableItem>);
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
                            selectItem(itm.value, inRole);
                    }}
                    onClick={(): void => {
                        selectItem(itm.value, inRole);
                    }}
                    data-selected={!!itm.selected}
                >
                    <ItemContent>
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
                    {itm.text}
                    <EdsIcon name='chevron_right'/>
                </ItemContent>
                <CascadingItem>
                    {createNodesForItems(itm.children, true)}
                </CascadingItem>
            </SelectableItem>);
        });
    };

    return (
        <Container ref={containerRef} maxHeight={maxHeight}>
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

                <DropdownIcon voided={isVoided} disabled={disabled} >
                    <EdsIcon name='chevron_down' />
                </DropdownIcon>
            </DropdownButton>
            {isOpen && !disabled && (
                <ul ref={listRef}
                    className='container'
                    onKeyDown={(e): void => {
                        e.keyCode === KEYCODE_ESCAPE && setIsOpen(false);
                    }}
                >
                    
                    <FilterContainer>
                        <input 
                            autoFocus 
                            type="text" 
                            onKeyUp={(e): void => filter(e.currentTarget.value)} 
                            placeholder="Filter" 
                        />
                    </FilterContainer>
                    {(activeFilter && persons.length < 1 && roles.length < 1 ) && <li data-value={-1}><Info>No items found</Info></li> }
                    {!activeFilter && <li data-value={-1}><Info>Search to see results</Info></li> }
                    {createNodesForItems(roles, true)}
                    {createNodesForItems(persons, false)}
                </ul>
            )}
        </Container>
    );
};

export default ParticipantPicker;
