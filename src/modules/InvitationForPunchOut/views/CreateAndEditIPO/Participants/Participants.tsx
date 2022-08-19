import {
    AddParticipantContainer,
    Container,
    DropdownItem,
    FormContainer,
    ParticipantRowsContainer,
} from './Participants.style';
import { Button, TextField } from '@equinor/eds-core-react';
import {
    Participant,
    Person,
    RoleParticipant,
} from '@procosys/modules/InvitationForPunchOut/types';
import React, { useEffect, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../../components/Select';

import { Canceler } from '@procosys/http/HttpClient';
import Dropdown from '../../../../../components/Dropdown';
import EdsIcon from '@procosys/components/EdsIcon';
import { OrganizationMap } from '../../utils';
import { OrganizationsEnum } from '../../enums';
import RoleSelector from '../../../components/RoleSelector/RoleSelector';
import Spinner from '@procosys/components/Spinner';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useInvitationForPunchOutContext } from '@procosys/modules/InvitationForPunchOut/context/InvitationForPunchOutContext';
import { Tooltip } from '@mui/material';

const WAIT_INTERVAL = 300;

const Organizations: SelectItem[] = [
    {
        text: OrganizationMap.get(OrganizationsEnum.Commissioning) as string,
        value: OrganizationsEnum.Commissioning,
    },
    {
        text: `${
            OrganizationMap.get(OrganizationsEnum.ConstructionCompany) as string
        } additional`,
        value: OrganizationsEnum.ConstructionCompany,
    },
    {
        text: `${
            OrganizationMap.get(OrganizationsEnum.Contractor) as string
        } additional`,
        value: OrganizationsEnum.Contractor,
    },
    {
        text: OrganizationMap.get(OrganizationsEnum.Operation) as string,
        value: OrganizationsEnum.Operation,
    },
    {
        text: OrganizationMap.get(
            OrganizationsEnum.TechnicalIntegrity
        ) as string,
        value: OrganizationsEnum.TechnicalIntegrity,
    },
    {
        text: OrganizationMap.get(OrganizationsEnum.Supplier) as string,
        value: OrganizationsEnum.Supplier,
    },
    {
        text: OrganizationMap.get(OrganizationsEnum.External) as string,
        value: OrganizationsEnum.External,
    },
];

const ParticipantType: SelectItem[] = [
    { text: 'Functional role', value: 'Functional role' },
    { text: 'Person', value: 'Person' },
];

interface ParticipantsProps {
    participants: Participant[];
    setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
    availableRoles: RoleParticipant[];
    invitationStarted?: boolean;
}

const Participants = ({
    participants,
    setParticipants,
    availableRoles,
    invitationStarted,
}: ParticipantsProps): JSX.Element => {
    const [filteredPersons, setFilteredPersons] = useState<SelectItem[]>([]);
    const [personsFilter, setPersonsFilter] = useState<SelectItem>({
        text: '',
        value: -1,
    }); //filter string and index of participant
    const { apiClient } = useInvitationForPunchOutContext();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const nameCombiner = (firstName: string, lastName: string): string => {
        return `${firstName} ${lastName}`;
    };

    const getSignerPersons = (input: string): Canceler | null => {
        let requestCanceler: Canceler | null = null;
        if (input != '') {
            try {
                (async (): Promise<void> => {
                    setIsLoading(true);
                    const signerPersons = await apiClient
                        .getSignerPersonsAsync(
                            input,
                            (cancel: Canceler) => (requestCanceler = cancel)
                        )
                        .then((persons) =>
                            persons.map((person): SelectItem => {
                                return {
                                    text: nameCombiner(
                                        person.firstName,
                                        person.lastName
                                    ),
                                    value: person.azureOid,
                                    email: person.email,
                                };
                            })
                        );
                    setFilteredPersons(signerPersons);
                    setIsLoading(false);
                })();
            } catch (error) {
                showSnackbarNotification(error.message);
                setIsLoading(false);
            }
        } else {
            setFilteredPersons([]);
        }
        return (): void => {
            requestCanceler && requestCanceler();
        };
    };

    const getPersons = (input: string): Canceler | null => {
        let requestCanceler: Canceler | null = null;
        if (input != '') {
            try {
                (async (): Promise<void> => {
                    setIsLoading(true);

                    const persons = await apiClient
                        .getPersonsAsync(
                            input,
                            (cancel: Canceler) => (requestCanceler = cancel)
                        )
                        .then((persons) =>
                            persons.map((person): SelectItem => {
                                return {
                                    text: nameCombiner(
                                        person.firstName,
                                        person.lastName
                                    ),
                                    value: person.azureOid,
                                    email: person.email,
                                };
                            })
                        );
                    setFilteredPersons(persons);
                    setIsLoading(false);
                })();
            } catch (error) {
                showSnackbarNotification(error.message);
                setIsLoading(false);
            }
        } else {
            setFilteredPersons([]);
        }
        return (): void => {
            requestCanceler && requestCanceler();
        };
    };

    const getRolesCopy = (): RoleParticipant[] => {
        return JSON.parse(JSON.stringify(availableRoles));
    };

    const setOrganization = (value: string, index: number): void => {
        const organization = Organizations.find(
            (o: SelectItem) => o.value === value
        );
        if (organization) {
            setParticipants((p) => {
                const participantsCopy = [...p];
                participantsCopy[index].organization = organization;
                return participantsCopy;
            });
            if (organization.value === OrganizationsEnum.External) {
                setType('Person', index);
            }
        }
    };

    const setExternalEmail = (value: string, index: number): void => {
        setParticipants((p) => {
            const participantsCopy = [...p];
            participantsCopy[index].role = null;
            participantsCopy[index].person = null;
            participantsCopy[index].externalEmail = {
                email: value,
            };
            return participantsCopy;
        });
    };

    const setType = (value: string, index: number): void => {
        setParticipants((p) => {
            const participantsCopy = [...p];
            participantsCopy[index].type = value;
            participantsCopy[index].role = null;
            participantsCopy[index].person = null;
            return participantsCopy;
        });
    };

    const deleteParticipant = (index: number): void => {
        setParticipants((p) => {
            const participantsCopy = [...p];
            participantsCopy.splice(index, 1);
            return participantsCopy;
        });
    };

    const personsInRoleText = (
        textToDisplay: string,
        persons: Person[]
    ): string => {
        persons.forEach((p, i) => {
            textToDisplay += p.name;
            if (i + 1 < persons.length) {
                textToDisplay += ', ';
            }
        });
        return textToDisplay;
    };

    const getDisplayText = (index: number): string => {
        const participant = participants[index];
        if (participant.person) {
            return participant.person.name;
        } else if (participant.role) {
            let textToDisplay = participant.role.code;
            if (
                participant.role.persons.length > 0 &&
                !participant.role.usePersonalEmail
            ) {
                textToDisplay += ' - ';
                const cc = participant.role.persons.filter(
                    (p) => p.radioOption == 'cc'
                );
                const to = participant.role.persons.filter(
                    (p) => p.radioOption == 'to'
                );
                if (to.length > 0) {
                    textToDisplay += personsInRoleText('To: ', to);
                    if (cc.length > 0) {
                        textToDisplay += '. ';
                    }
                }
                if (cc.length > 0) {
                    textToDisplay += personsInRoleText('CC: ', cc);
                }
            }
            return textToDisplay;
        }
        return '';
    };

    const addParticipant = (): void => {
        const newParticipant: Participant = {
            organization: Organizations[0],
            sortKey: null,
            type: 'Functional role',
            externalEmail: null,
            person: null,
            role: null,
            signedAt: null,
        };
        setParticipants([...participants, newParticipant]);
    };

    const setRoleOnParticipant = (
        value: RoleParticipant,
        index: number
    ): void => {
        setParticipants((p) => {
            const participantsCopy = [...p];
            participantsCopy[index].role = value;
            participantsCopy[index].person = null;
            participantsCopy[index].externalEmail = null;
            return participantsCopy;
        });
    };

    const setPersonOnParticipant = (
        event: React.MouseEvent,
        personIndex: number,
        participantIndex: number
    ): void => {
        event.preventDefault();
        const person = filteredPersons[personIndex];
        if (person && person.text) {
            setParticipants((p) => {
                const participantsCopy = [...p];
                participantsCopy[participantIndex].role = null;
                participantsCopy[participantIndex].externalEmail = null;
                participantsCopy[participantIndex].person = {
                    azureOid: person.value,
                    name: person.text ? person.text : '',
                    email: person.email ? person.email : '',
                    radioOption: null,
                };
                return participantsCopy;
            });
        }
    };

    const isSignerParticipant = (index: number): boolean => {
        if (!participants[index] || !participants[index].organization)
            return false;

        if (
            participants[index].organization.value == Organizations[0].value ||
            participants[index].organization.value == Organizations[1].value ||
            participants[index].organization.value == Organizations[2].value ||
            participants[index].organization.value == Organizations[3].value ||
            participants[index].organization.value == Organizations[4].value
        ) {
            return true;
        }
        return false;
    };

    useEffect(() => {
        const handleFilterChange = async (): Promise<void> => {
            if (isSignerParticipant(personsFilter.value)) {
                getSignerPersons(personsFilter.text);
            } else {
                getPersons(personsFilter.text);
            }
        };

        const timer = setTimeout(() => {
            handleFilterChange();
        }, WAIT_INTERVAL);

        return (): void => {
            clearTimeout(timer);
        };
    }, [personsFilter]);

    const getOrganizationText = (
        organization: string,
        sortKey: number
    ): string | undefined => {
        let organizationText = organization;
        const organizationIsContractorOrContructionCompany =
            organization ===
                OrganizationMap.get(OrganizationsEnum.Contractor) ||
            organization ===
                OrganizationMap.get(OrganizationsEnum.ConstructionCompany);
        if (sortKey > 1 && organizationIsContractorOrContructionCompany) {
            organizationText += ' additional';
        }
        return organizationText;
    };

    return (
        <Container>
            <FormContainer>
                <ParticipantRowsContainer>
                    {participants.map((p, index) => {
                        return (
                            <React.Fragment key={`participant_${index}`}>
                                <div>
                                    <SelectInput
                                        onChange={(value): void =>
                                            setOrganization(value, index)
                                        }
                                        data={Organizations}
                                        label={'Organization'}
                                        disabled={index < 2}
                                    >
                                        {p.organization.text
                                            ? getOrganizationText(
                                                  p.organization.text,
                                                  index
                                              )
                                            : 'Select'}
                                    </SelectInput>
                                </div>
                                <div>
                                    <SelectInput
                                        onChange={(value): void =>
                                            setType(value, index)
                                        }
                                        data={ParticipantType}
                                        label={'Type'}
                                        disabled={
                                            (invitationStarted &&
                                                p.signedAt &&
                                                index < 2) ||
                                            p.organization.value ==
                                                OrganizationsEnum.External
                                        }
                                    >
                                        {p.type}
                                    </SelectInput>
                                </div>
                                {p.organization.value ==
                                    OrganizationsEnum.External && (
                                    <div>
                                        <TextField
                                            id={'guestEmail'}
                                            placeholder="Email"
                                            label="e-mail address"
                                            defaultValue={
                                                p.externalEmail
                                                    ? p.externalEmail.email
                                                    : ''
                                            }
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>
                                            ): void =>
                                                setExternalEmail(
                                                    e.target.value,
                                                    index
                                                )
                                            }
                                        />
                                    </div>
                                )}
                                {p.type == ParticipantType[1].text &&
                                    p.organization.value !=
                                        OrganizationsEnum.External && (
                                        <div>
                                            <Dropdown
                                                label={'Person'}
                                                maxHeight="300px"
                                                variant="form"
                                                disabled={
                                                    index < 2
                                                        ? invitationStarted
                                                            ? p.signedAt
                                                                ? true
                                                                : false
                                                            : false
                                                        : false
                                                }
                                                onFilter={(
                                                    input: string
                                                ): void =>
                                                    setPersonsFilter({
                                                        text: input,
                                                        value: index,
                                                    })
                                                }
                                                text={
                                                    p.person
                                                        ? getDisplayText(index)
                                                        : 'Search to select'
                                                }
                                            >
                                                {isLoading && (
                                                    <div
                                                        style={{
                                                            margin: 'calc(var(--grid-unit))',
                                                        }}
                                                    >
                                                        <Spinner medium />
                                                    </div>
                                                )}
                                                {!isLoading &&
                                                    filteredPersons.map(
                                                        (person, i) => {
                                                            return (
                                                                <DropdownItem
                                                                    key={i}
                                                                    onClick={(
                                                                        event: React.MouseEvent
                                                                    ): void =>
                                                                        setPersonOnParticipant(
                                                                            event,
                                                                            i,
                                                                            index
                                                                        )
                                                                    }
                                                                >
                                                                    <div>
                                                                        {
                                                                            person.text
                                                                        }
                                                                    </div>
                                                                </DropdownItem>
                                                            );
                                                        }
                                                    )}
                                            </Dropdown>
                                        </div>
                                    )}
                                {p.type == ParticipantType[0].text && (
                                    <div>
                                        <RoleSelector
                                            selectedRole={p.role}
                                            onChange={(value): void =>
                                                setRoleOnParticipant(
                                                    value,
                                                    index
                                                )
                                            }
                                            roles={getRolesCopy()}
                                            label={'Role'}
                                            disabled={
                                                index < 2
                                                    ? invitationStarted
                                                        ? p.signedAt
                                                            ? true
                                                            : false
                                                        : false
                                                    : false
                                            }
                                        >
                                            {p.role ? (
                                                <Tooltip
                                                    title={getDisplayText(
                                                        index
                                                    )}
                                                    arrow={true}
                                                    enterDelay={200}
                                                    enterNextDelay={100}
                                                >
                                                    <div className="overflowControl">
                                                        {getDisplayText(index)}
                                                    </div>
                                                </Tooltip>
                                            ) : (
                                                'Select'
                                            )}
                                        </RoleSelector>
                                    </div>
                                )}
                                <div>
                                    {index > 1 && (
                                        <>
                                            <Button
                                                title="Delete"
                                                variant="ghost"
                                                style={{ marginTop: '12px' }}
                                                onClick={(): void =>
                                                    deleteParticipant(index)
                                                }
                                            >
                                                <EdsIcon name="delete_to_trash" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </React.Fragment>
                        );
                    })}
                </ParticipantRowsContainer>
                <AddParticipantContainer>
                    <Button variant="ghost" onClick={addParticipant}>
                        <EdsIcon name="add" /> Add organization
                    </Button>
                </AddParticipantContainer>
            </FormContainer>
        </Container>
    );
};

export default Participants;
