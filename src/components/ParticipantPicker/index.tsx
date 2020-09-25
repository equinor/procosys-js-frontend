import { CascadingItem, Container, DropdownButton, DropdownIcon, ItemContent, SelectableItem, Label, TitleItem, TitleContent, FilterContainer, Info } from './style';
import React, { ReactNode, useRef, useState, useEffect } from 'react';
import { useClickOutsideNotifier } from '../../hooks';
import { RadioGroup, Radio, FormControlLabel } from '@material-ui/core';
import { SelectItem } from '../Select';
import { Participant, RoleParticipant } from '@procosys/modules/InvitationForPunchOut/types';
import { SelectableItemProps } from '../Select/style';
import EdsIcon from '../EdsIcon';

export type ParticipantItem = {
    text: string;
    value: any;
    sendToPersonalEmail?: boolean,
    selected?: boolean;
    children?: ParticipantItem[];
    title?: boolean;
    radioButtons?: boolean;
    radioOption?: string;
};

type SelectProps = {
    roles: ParticipantItem[];
    disabled?: boolean;
    onChange?: (newValue: any) => void;
    children: ReactNode;
    label?: string;
    maxHeight?: string;
};

const KEYCODE_ENTER = 13;
const KEYCODE_ESCAPE = 27;

const ParticipantPicker = ({
    disabled = false,
    roles,
    onChange = (): void => {
        /*eslint-disable-line no-empty */
    },
    children,
    label,
    maxHeight,
}: SelectProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const [filter, setFilter] = useState<string>('');
    const [allRoles, setAllRoles] = useState<ParticipantItem[]>(roles);
    const [filteredRoles, setFilteredRoles] = useState<ParticipantItem[]>(roles);

    useClickOutsideNotifier(() => {
        setIsOpen(false);
    }, containerRef);

    const toggleDropdown = (): void => {
        setIsOpen(!isOpen);
    };

    const selectItem = (value: any, sendToPersonalEmail: boolean): void => {
        onChange(value);
        if(sendToPersonalEmail) {
            const role = allRoles.find(c => c.value == value);
            if (role) {
                const selectedRole: RoleParticipant = {
                    id: 123,
                    roleName: role.text,
                    persons: null
                };
                onChange(selectedRole);
            }          
        } else {
            const role = allRoles.find(c => c.value == value);
            if (role && role.children) {
                const radioCheckedPersons = role.children.filter(p => p.radioOption && p.radioOption != '0');
                const rolePeople = radioCheckedPersons.map(r => {
                    return {
                        id: r.value,
                        name: r.text,
                        cc: r.radioOption == '2'
                    };
                });
                const selectedRole: RoleParticipant = {
                    id: 123,
                    roleName: role.text,
                    persons: rolePeople.length > 0 ? rolePeople : null
                };
                onChange(selectedRole);
            }
        }
        setIsOpen(false);
    };

    const filterRoles = (filter: string): void => {
        if(filter.length > 0) {
            setFilteredRoles(allRoles.filter(r => r.text.toLocaleLowerCase().startsWith(filter.toLocaleLowerCase())));
        } else {
            setFilteredRoles(allRoles);
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

    const getNewValue = (value: string, currentValue: string): string => {
        switch (value) {
            case currentValue:
                return '0';
            case '1':
                return '1';
            case '2':
                return '2';
            default:
                return '0';
        }
    };

    const updateRadioButtonParticipants = (itmValue: string, value: string): void => {
        const role = allRoles.find(r => {
            if (r.children) {
                const person = r.children.find(c => c.value == itmValue);
                return person;
            }
        });
        const roleIndex = allRoles.findIndex(r => {
            if (r.children) {
                const person = r.children.find(c => c.value == itmValue);
                return person;
            }
        });

        if (role && role.children && roleIndex > -1) {

            const person = role.children.find(c => c.value == itmValue);
            const personIndex = role.children.findIndex(c => c.value == itmValue);

            if (person && personIndex > -1 && person.radioOption) {

                const newValue = getNewValue(value, person.radioOption);
                setAllRoles(ar => {
                    const copyR = [...ar];
                    copyR.forEach((r, i) => {
                        if (r.children && i != roleIndex) {
                            r.children.forEach(person => {
                                person.radioOption = '0';
                            });
                        }
                        if (r.children && i == roleIndex) {
                            person.radioOption = newValue;
                        }
                    });
                    return copyR;
                });

                const radioCheckedPersons = role.children.filter(p => p.radioOption && p.radioOption != '0');
                const rolePeople = radioCheckedPersons.map(r => {
                    return {
                        id: r.value,
                        name: r.text,
                        cc: r.radioOption == '2'
                    };
                });

                const selectedRole: RoleParticipant = {
                    id: 123,
                    roleName: role.text,
                    persons: rolePeople.length > 0 ? rolePeople : null

                };

                onChange(selectedRole);
            }
        }
    };

    const createChildNodes = (parentItem: ParticipantItem, items: ParticipantItem[]): JSX.Element[] => {
        const groupOption = (<SelectableItem
            key={0 + parentItem.value}
            role="option"
            selected={!!parentItem.selected}
            tabIndex={0}
            data-value={parentItem.value}
            onKeyDown={(e): void => {
                e.keyCode === KEYCODE_ENTER &&
                    selectItem(parentItem.value, parentItem.sendToPersonalEmail ? true : false);
            }}
            onClick={(): void => {
                selectItem(parentItem.value, parentItem.sendToPersonalEmail ? true : false);
            }}
            data-selected={!!parentItem.selected}
        >
            <ItemContent>
                Send to group
            </ItemContent>
        </SelectableItem>);

        const initial = (
            <TitleItem
                key={-1}
                tabIndex={0}
            >
                { !parentItem.sendToPersonalEmail &&
                    <TitleContent borderTop={true} >
                        <div>Additionally, send to following persons in group</div>
                        <div className='toCc'>
                            <div>To</div>
                            <div>CC</div>
                        </div>
                    </TitleContent>
                }
                { parentItem.sendToPersonalEmail &&
                    <TitleContent borderTop={true} >
                        <div>The following persons are in the group</div>
                    </TitleContent>
                }
            </TitleItem>);

        const personsInRole = items.map((itm, index) => {
            return (<SelectableItem
                key={index}
                role="option"
                selected={!!itm.selected}
                tabIndex={0}
                data-value={itm.value}
                data-selected={!!itm.selected}
            >
                <ItemContent>
                    { !parentItem.sendToPersonalEmail &&
                        <RadioGroup value={'radio'} name={'radioGroup'}>
                            <FormControlLabel key={itm.value + '1'} name={itm.value} value={'1'} label={''} checked={itm.radioOption == '1'} control={<Radio onClick={(): void => updateRadioButtonParticipants(itm.value, '1')} />} />
                            <FormControlLabel key={itm.value + '2'} name={itm.value} value={'2'} label={''} checked={itm.radioOption == '2'} control={<Radio onClick={(): void => updateRadioButtonParticipants(itm.value, '2')} />} />
                        </RadioGroup>
                    }
                    {itm.text}
                </ItemContent>
            </SelectableItem>);
        });

        return [groupOption, initial].concat(personsInRole);
    };


    const createNodesForItems = (items: ParticipantItem[]): JSX.Element[] => {
        return items.map((itm, index) => {
            if (!itm.children) {
                return (<> </>);
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
                    {createChildNodes(itm, itm.children)}
                </CascadingItem>
            </SelectableItem>);
        });
    };

    return (
        <Container ref={containerRef} maxHeight={maxHeight}>
            <Label>{label}</Label>
            <DropdownButton
                onClick={toggleDropdown}
                disabled={disabled}
                role="listbox"
                isOpen={isOpen}
                aria-expanded={isOpen}
                aria-haspopup={true}
            >
                {children}

                <DropdownIcon disabled={disabled} >
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
                            onKeyUp={(e): void => filterRoles(e.currentTarget.value)} 
                            placeholder="Filter" 
                        />
                    </FilterContainer>
                    { (filter.length > 0 && filteredRoles.length < 1 ) && <li data-value={-1}><Info>No items found</Info></li> }
                    { createNodesForItems(filteredRoles) }
                </ul>
            )}
        </Container>
    );
};

export default ParticipantPicker;
