import { CascadingItem, Container, DropdownButton, DropdownIcon, ItemContent, SelectableItem, Label, TitleItem, TitleContent, FilterContainer, Info } from './style';
import React, { ReactNode, useRef, useState, useEffect } from 'react';
import { useClickOutsideNotifier } from '../../hooks';
import { Radio, withStyles, RadioProps } from '@material-ui/core';
import { RoleParticipant } from '@procosys/modules/InvitationForPunchOut/types';
import EdsIcon from '../EdsIcon';
import Checkbox from '../Checkbox';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';

const GreenRadio = withStyles({
    root: {
        color: tokens.colors.interactive.primary__resting.rgba,
        '&$checked': {
            color: tokens.colors.interactive.primary__resting.rgba,
        },
    },
    checked: {},
})((props: RadioProps) => <Radio color="default" {...props} />);

export type RoleItem = {
    text: string;
    value: any;
    sendToPersonalEmail?: boolean,
    selected?: boolean;
    children?: RoleItem[];
    radioButtons?: boolean;
    radioOption?: string;
    showRadioOptions?: boolean;
    notify?: boolean;
};

type RoleSelectorProps = {
    roles: RoleItem[];
    disabled?: boolean;
    onChange?: (newValue: any) => void;
    children: ReactNode;
    label?: string;
    maxHeight?: string;
};

const KEYCODE_ENTER = 13;
const KEYCODE_ESCAPE = 27;

const RoleSelector = ({
    disabled = false,
    roles,
    onChange = (): void => {
        /*eslint-disable-line no-empty */
    },
    children,
    label,
    maxHeight
}: RoleSelectorProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const [filter, setFilter] = useState<string>('');
    const [allRoles, setAllRoles] = useState<RoleItem[]>(roles);
    const [filteredRoles, setFilteredRoles] = useState<RoleItem[]>(roles);
    const [pickedRoleValue, setPickedRoleValue] = useState<string | null>(null);

    useEffect(() => {
        if (roles.length != allRoles.length) {
            setAllRoles(roles);
            setFilteredRoles(roles);
        }
    }, [roles]);

    useClickOutsideNotifier(() => {
        setIsOpen(false);
    }, containerRef);

    const toggleDropdown = (): void => {
        setIsOpen(!isOpen);
    };

    const clearOtherRoles = (roleIndex: number): void => {
        setAllRoles(ar => {
            const copyR = [...ar];
            copyR.forEach((r, i) => {
                if (r.children && i != roleIndex) {
                    r.notify = false;
                    r.children.forEach(person => {
                        person.radioOption = '0';
                    });
                }
            });
            return copyR;
        });
    };

    const selectItem = (value: any, sendToPersonalEmail: boolean, roleIndex: number): void => {
        setPickedRoleValue(value);
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
                clearOtherRoles(roleIndex);
                onChange(selectedRole);
            }
        }
        setIsOpen(false);
    };

    const filterRoles = (input: string): void => {
        setFilter(input);
        if(input.length > 0) {
            setFilteredRoles(allRoles.filter(r => r.text.toLocaleLowerCase().startsWith(input.toLocaleLowerCase())));
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

    const updateRadioButtonParticipants = (itmValue: string, value: string, parentValue: string): void => {
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
                if (parentValue == pickedRoleValue) {
                    onChange(selectedRole);
                }
            }
        }
    };

    const showPersons = (notify: boolean, index: number): void => {
        setFilteredRoles(r => {
            const copy = [...r];
            copy[index].notify = notify;
            return copy;
        });
    };

    const createChildNodes = (parentItem: RoleItem, parentIndex: number, items: RoleItem[]): JSX.Element[] => {
        const groupOption = (<SelectableItem
            key={-1}
            role="option"
            selected={!!parentItem.selected}
            tabIndex={0}
            data-value={parentItem.value}
            onKeyDown={(e): void => {
                e.keyCode === KEYCODE_ENTER &&
                    selectItem(parentItem.value, parentItem.sendToPersonalEmail ? true : false, parentIndex);
            }}
            onClick={(): void => {
                selectItem(parentItem.value, parentItem.sendToPersonalEmail ? true : false, parentIndex);
            }}
            data-selected={!!parentItem.selected}
        >
            <ItemContent  readOnlyItem={false} greenText={true}>
                Add functional role to invitation
            </ItemContent>
        </SelectableItem>);

        const info = (
            <TitleItem
                key={0}
                tabIndex={0}
            >
                { !parentItem.sendToPersonalEmail &&
                    <TitleContent
                        borderTop={true}
                        marginBottom={true}
                        hideToCc={!parentItem.notify}
                        disabled={items.length < 1}
                    >
                        <Checkbox 
                            disabled={items.length < 1}
                            checked={parentItem.notify}
                            onChange={(checked: boolean): void => {
                                showPersons(checked, parentIndex);
                            }}
                        >
                            <Typography variant="body_short" italic>Additionally, notify individuals</Typography>
                        </Checkbox>
                        <div className='toCc'>
                            <Typography variant="body_short" >To</Typography>
                            <Typography variant="body_short" >CC</Typography>
                        </div>
                    </TitleContent>
                }
                { parentItem.sendToPersonalEmail &&
                    <TitleContent borderTop={true} >
                        <Typography variant="body_short" italic>The following persons are in the role</Typography>
                    </TitleContent>
                }
            </TitleItem>);

        const personsInRole = items.map((itm, index) => {
            return (<SelectableItem
                hideItems={!parentItem.notify && !parentItem.sendToPersonalEmail}
                key={index + 1}
                role="option"
                selected={!!itm.selected}
                tabIndex={0}
                data-value={itm.value}
                data-selected={!!itm.selected}
            >
                <ItemContent readOnlyItem={parentItem.sendToPersonalEmail ? true : false}>
                    { !parentItem.sendToPersonalEmail &&
                        <div className='radioButtons'>
                            <div>
                                <GreenRadio
                                    checked={itm.radioOption == '1'}
                                    onClick={(): void => updateRadioButtonParticipants(itm.value, '1', parentItem.value)}
                                    value="1"
                                    name="to"
                                />
                            </div>
                            <div>
                                <GreenRadio
                                    checked={itm.radioOption == '2'}
                                    onClick={(): void => updateRadioButtonParticipants(itm.value, '2', parentItem.value)}
                                    value="2"
                                    name="cc"
                                />
                            </div>
                        </div>
                    }
                    {itm.text}
                </ItemContent>
            </SelectableItem>);
        });

        if (parentItem.sendToPersonalEmail) {
            return [groupOption, info].concat(personsInRole);
        }
        return [info].concat(personsInRole).concat(groupOption);
    };

    const createNodesForItems = (items: RoleItem[]): JSX.Element[] => {
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
                data-selected={!!itm.selected}
            >
                <ItemContent readOnlyItem={false}>
                    {itm.text}
                    <EdsIcon name='chevron_right'/>
                </ItemContent>
                <CascadingItem>
                    {createChildNodes(itm, index, itm.children)}
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

export default RoleSelector;
