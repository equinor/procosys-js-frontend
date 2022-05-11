import {
    CascadingItem,
    Container,
    DropdownButton,
    DropdownIcon,
    ItemContent,
    SelectableItem,
    Label,
    TitleItem,
    TitleContent,
    FilterContainer,
    Info,
} from './style';
import React, { ReactNode, useRef, useState, useEffect } from 'react';
import { useClickOutsideNotifier } from '../../../../hooks';
import {
    RoleParticipant,
    Person,
} from '@procosys/modules/InvitationForPunchOut/types';
import EdsIcon from '../../../../components/EdsIcon';
import Checkbox from '../../../../components/Checkbox';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import { withStyles } from '@mui/styles';
import { Radio, RadioProps } from '@mui/material';

const GreenRadio = withStyles({
    root: {
        color: tokens.colors.interactive.primary__resting.rgba,
        '&$checked': {
            color: tokens.colors.interactive.primary__resting.rgba,
        },
    },
    checked: {},
})((props: RadioProps) => <Radio color="default" {...props} />);

type RoleSelectorProps = {
    selectedRole?: RoleParticipant | null;
    roles: RoleParticipant[];
    disabled?: boolean;
    onChange?: (newValue: any) => void;
    children: ReactNode;
    label?: string;
};

const RoleSelector = ({
    selectedRole,
    disabled = false,
    roles,
    onChange = (): void => {
        /*eslint-disable-line no-empty */
    },
    children,
    label,
}: RoleSelectorProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const [filter, setFilter] = useState<string>('');
    const [allRoles, setAllRoles] = useState<RoleParticipant[]>(roles);
    const [filteredRoles, setFilteredRoles] =
        useState<RoleParticipant[]>(roles);
    const [pickedRoleValue, setPickedRoleValue] = useState<string | null>(null);
    const [functionalRoleExists, setFunctionalRoleExists] =
        useState<boolean>(true);

    useEffect(() => {
        if (roles.length != allRoles.length) {
            setAllRoles(roles);
        }
    }, [roles]);

    useEffect(() => {
        setFilteredRoles(roles);
        if (!selectedRole) return;
        const index = roles.findIndex((r) => r.code == selectedRole.code);
        if (index === -1) {
            setFunctionalRoleExists(false);
            return;
        }
        if (selectedRole.notify) {
            setFilteredRoles(() => {
                const rolesCopy = [...roles];
                rolesCopy[index].notify = true;
                rolesCopy[index].persons.forEach((p) => {
                    const person = selectedRole.persons.find(
                        (pers) => pers.email == p.email
                    );
                    if (person) {
                        p.radioOption = person.radioOption;
                    }
                });
                return rolesCopy;
            });
        } else {
            setFilteredRoles(roles);
        }
    }, [selectedRole]);

    useEffect(() => {
        if (pickedRoleValue) {
            const pickedRoleExists = allRoles.some(
                (r) => r.code == pickedRoleValue
            );
            setFunctionalRoleExists(pickedRoleExists);
        }
    }, [pickedRoleValue, selectedRole]);

    useClickOutsideNotifier(() => {
        setIsOpen(false);
    }, containerRef);

    const toggleDropdown = (): void => {
        setIsOpen(!isOpen);
    };

    const clearOtherRoles = (roleIndex: number): void => {
        setAllRoles((allRoles) => {
            const allRolesCopy = [...allRoles];
            allRolesCopy.forEach((role, i) => {
                if (i != roleIndex && !role.usePersonalEmail) {
                    role.notify = false;
                    role.persons.forEach((person) => {
                        person.radioOption = null;
                    });
                }
            });
            return allRolesCopy;
        });
    };

    const selectItem = (role: RoleParticipant, roleIndex: number): void => {
        clearOtherRoles(roleIndex);
        setPickedRoleValue(role.code);
        if (role.usePersonalEmail) {
            onChange({ ...role });
        } else {
            const radioCheckedPersons = role.persons.filter(
                (p) => p.radioOption
            );
            const selectedRole = { ...role, persons: radioCheckedPersons };
            onChange(selectedRole);
        }
        setIsOpen(false);
    };

    const filterRoles = (input: string): void => {
        setFilter(input);
        if (input.length > 0) {
            setFilteredRoles(
                allRoles.filter((role) =>
                    role.code
                        .toLocaleLowerCase()
                        .includes(input.toLocaleLowerCase())
                )
            );
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

            if (windowWidth - listLeftPosition < listWidth + 5) {
                listRef.current.style.right = '2px';
            }
        }
    }, [isOpen]);

    const getNewValue = (
        value: string,
        currentValue: string | null
    ): string | null => {
        switch (value) {
            case currentValue:
                return null;
            case 'to':
                return 'to';
            case 'cc':
                return 'cc';
            default:
                return null;
        }
    };

    const updateRadioButtonParticipants = (
        person: Person,
        radioValue: string,
        role: RoleParticipant,
        roleIndex: number
    ): void => {
        const newValue = getNewValue(radioValue, person.radioOption);
        setAllRoles((allRoles) => {
            const allRolesCopy = [...allRoles];
            allRolesCopy.forEach((role, i) => {
                if (i != roleIndex) {
                    role.persons.forEach((person) => {
                        person.radioOption = null;
                    });
                }
                if (i == roleIndex) {
                    person.radioOption = newValue;
                }
            });
            return allRolesCopy;
        });

        if (role.code == pickedRoleValue) {
            const radioCheckedPersons = role.persons.filter(
                (p) => p.radioOption
            );
            const selectedRole = { ...role, persons: radioCheckedPersons };
            onChange(selectedRole);
        }
    };

    const showPersons = (notify: boolean, index: number): void => {
        setFilteredRoles((r) => {
            const copy = [...r];
            copy[index].notify = notify;
            if (!notify) {
                copy[index].persons.forEach((p) => {
                    p.radioOption = null;
                });
                //update selected role
                const selectedRole = { ...copy[index], persons: [] };
                onChange(selectedRole);
            }
            return copy;
        });
    };

    const createChildNodes = (
        parentItem: RoleParticipant,
        parentIndex: number,
        items: Person[]
    ): JSX.Element[] => {
        const info = (
            <TitleItem key={0} tabIndex={0}>
                <TitleContent
                    borderTop={true}
                    marginBottom={true}
                    hideToCc={!parentItem.notify}
                >
                    <Checkbox
                        checked={parentItem.notify}
                        onChange={(checked: boolean): void => {
                            showPersons(checked, parentIndex);
                        }}
                    >
                        <Typography variant="body_short" italic>
                            Additionally, notify individuals
                        </Typography>
                    </Checkbox>
                    <div className="toCc">
                        <Typography variant="body_short">To</Typography>
                        <Typography variant="body_short">CC</Typography>
                    </div>
                </TitleContent>
            </TitleItem>
        );

        const personsInRole = items.map((person, index) => {
            return (
                <SelectableItem
                    hideItems={!parentItem.notify}
                    key={index + 1}
                    role="option"
                    tabIndex={0}
                >
                    <ItemContent readOnlyItem={false}>
                        <div className="radioButtons">
                            <div>
                                <GreenRadio
                                    checked={person.radioOption == 'to'}
                                    onClick={(): void =>
                                        updateRadioButtonParticipants(
                                            person,
                                            'to',
                                            parentItem,
                                            parentIndex
                                        )
                                    }
                                    value="to"
                                    name="to"
                                />
                            </div>
                            <div>
                                <GreenRadio
                                    checked={person.radioOption == 'cc'}
                                    onClick={(): void =>
                                        updateRadioButtonParticipants(
                                            person,
                                            'cc',
                                            parentItem,
                                            parentIndex
                                        )
                                    }
                                    value="cc"
                                    name="cc"
                                />
                            </div>
                        </div>
                        {person.name}
                    </ItemContent>
                </SelectableItem>
            );
        });

        const groupOption = (
            <SelectableItem
                key={-1}
                role="option"
                tabIndex={0}
                data-value={parentItem.code}
                onKeyDown={(e): void => {
                    e.code === 'Enter' && selectItem(parentItem, parentIndex);
                }}
                onClick={(): void => {
                    selectItem(parentItem, parentIndex);
                }}
            >
                <ItemContent readOnlyItem={false} greenText={true}>
                    Add/update functional role to invitation
                </ItemContent>
            </SelectableItem>
        );

        return [info].concat(personsInRole).concat(groupOption);
    };

    const createNodesForItems = (items: RoleParticipant[]): JSX.Element[] => {
        return items.map((itm, index) => {
            if (itm.persons.length < 1 || itm.usePersonalEmail) {
                return (
                    <SelectableItem
                        key={index}
                        role="option"
                        tabIndex={0}
                        onKeyDown={(e): void => {
                            e.code === 'Enter' && selectItem(itm, index);
                        }}
                        onClick={(): void => {
                            selectItem(itm, index);
                        }}
                    >
                        <ItemContent readOnlyItem={false}>
                            <div>
                                <Typography>{itm.code}</Typography>
                                <Typography
                                    style={{
                                        fontSize: '12px',
                                        marginTop: '8px',
                                    }}
                                >
                                    {itm.description}
                                </Typography>
                            </div>
                        </ItemContent>
                    </SelectableItem>
                );
            }
            return (
                <SelectableItem key={index} role="option" tabIndex={0}>
                    <ItemContent readOnlyItem={false}>
                        <div>
                            <Typography>{itm.code}</Typography>
                            <Typography
                                style={{ fontSize: '12px', marginTop: '8px' }}
                            >
                                {itm.description}
                            </Typography>
                        </div>
                        <EdsIcon name="chevron_right" />
                    </ItemContent>
                    <CascadingItem>
                        {createChildNodes(itm, index, itm.persons)}
                    </CascadingItem>
                </SelectableItem>
            );
        });
    };

    return (
        <Container ref={containerRef}>
            <Label>{label}</Label>
            <DropdownButton
                onClick={toggleDropdown}
                disabled={disabled}
                role="listbox"
                isOpen={isOpen}
                error={!functionalRoleExists}
                aria-expanded={isOpen}
                aria-haspopup={true}
            >
                {children}

                <DropdownIcon disabled={disabled}>
                    <EdsIcon name="chevron_down" />
                </DropdownIcon>
            </DropdownButton>
            {functionalRoleExists ? null : (
                <Label error>
                    This functional role has been deleted or renamed. Please
                    choose another one.
                </Label>
            )}
            {isOpen && !disabled && (
                <ul
                    ref={listRef}
                    className="container"
                    onKeyDown={(e): void => {
                        e.code === 'Escape' && setIsOpen(false);
                    }}
                >
                    <FilterContainer>
                        <input
                            autoFocus
                            type="text"
                            onKeyUp={(e): void =>
                                filterRoles(e.currentTarget.value)
                            }
                            placeholder="Filter"
                        />
                    </FilterContainer>
                    {filter.length > 0 && filteredRoles.length < 1 && (
                        <li data-value={-1}>
                            <Info>No items found</Info>
                        </li>
                    )}
                    {createNodesForItems(filteredRoles)}
                </ul>
            )}
        </Container>
    );
};

export default RoleSelector;
