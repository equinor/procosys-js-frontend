import React, { useEffect, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../../components/Select';
import Dropdown from '../../../../../components/Dropdown';
import { Button, TextField } from '@equinor/eds-core-react';
import { DropdownItem, Container, ParticipantRowsContainer, FormContainer, ButtonContainer, AddParticipantContainer } from './Participants.style';
import { Participant, RoleParticipant, Person } from '@procosys/modules/InvitationForPunchOut/types';
import EdsIcon from '@procosys/components/EdsIcon';
import RoleSelector from '../../../components/RoleSelector';
import { Canceler } from '@procosys/http/HttpClient';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { Tooltip } from '@material-ui/core';
import { useInvitationForPunchOutContext } from '@procosys/modules/InvitationForPunchOut/context/InvitationForPunchOutContext';

const WAIT_INTERVAL = 300;

enum OrganizationsEnum {
    Commissioning = 'Commissioning',
    ConstructionCompany = 'Construction Company',
    Contractor = 'Contractor',
    Operation = 'Operation',
    TechnicalIntegrity = 'Technical integrity',
    Supplier = 'Supplier',
    External = 'Guest user (external)',
};

const Organizations: SelectItem[] = [
    { text: OrganizationsEnum.Commissioning, value: OrganizationsEnum.Commissioning },
    { text: OrganizationsEnum.ConstructionCompany, value: OrganizationsEnum.ConstructionCompany },
    { text: OrganizationsEnum.Contractor, value: OrganizationsEnum.Contractor },
    { text: OrganizationsEnum.Operation, value: OrganizationsEnum.Operation },
    { text: OrganizationsEnum.TechnicalIntegrity, value: OrganizationsEnum.TechnicalIntegrity },
    { text: OrganizationsEnum.Supplier, value: OrganizationsEnum.Supplier },
    { text: OrganizationsEnum.External, value: OrganizationsEnum.External }
];

const ParticipantType: SelectItem[] = [
    { text: 'Functional role', value: 'Functional role' },
    { text: 'Person', value: 'Person' },
];

interface ParticipantsProps {
    next: () => void;
    previous: () => void;
    participants: Participant[];
    setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
    isValid: boolean;
}

const Participants = ({
    next,
    previous,
    participants,
    setParticipants,
    isValid
}: ParticipantsProps): JSX.Element => {
    const [availableRoles, setAvailableRoles] = useState<RoleParticipant[]>([]);
    const [filteredPersons, setFilteredPersons] = useState<SelectItem[]>([]);
    const [personsFilter, setPersonsFilter] = useState<SelectItem>({text: '', value: -1}); //filter string and index of participant
    const { apiClient } = useInvitationForPunchOutContext();

    useEffect(() => {
        let requestCanceler: Canceler;
        try {
            (async (): Promise<void> => {
                const functionalRoles = await apiClient.getFunctionalRolesAsync()
                    .then(roles => roles.map((role): RoleParticipant => {
                        return {
                            code: role.code,
                            description: role.description,
                            email: role.email,
                            informationalEmail: role.informationalEmail,
                            usePersonalEmail: role.usePersonalEmail,
                            notify: false,
                            persons: role.persons.map(p => {
                                return {
                                    azureOid: p.azureOid,
                                    firstName: p.firstName,
                                    lastName: p.lastName,
                                    email: p.email,
                                    radioOption: role.usePersonalEmail ? 'to' : null,
                                };
                            })
                        };
                    }));
                setAvailableRoles(functionalRoles);
            })();
            return (): void => requestCanceler && requestCanceler();
        } catch (error) {
            showSnackbarNotification(error.message);
        }
    }, []);

    const nameCombiner = (firstName: string, lastName: string): string => {
        return firstName + ' ' + lastName;
    };

    const getContractorPersons = (input: string): Canceler | null  => {
        let requestCanceler: Canceler | null = null;
        if(input != '') {
            try {
                (async (): Promise<void> => {
                    const constractorPersons = await apiClient.getContractorPersonsAsync(input, (cancel: Canceler) => requestCanceler = cancel)
                        .then(persons => persons.map((person): SelectItem => {
                            return {
                                text: nameCombiner(person.firstName, person.lastName),
                                value: person.azureOid,
                                name: person.lastName + ', ' + person.firstName,
                                email: person.email
                            };
                        })
                        );
                    setFilteredPersons(constractorPersons);
                })();
            } catch (error) {
                showSnackbarNotification(error.message);
            }
        } else {
            setFilteredPersons([]);
        }
        return (): void => {
            requestCanceler && requestCanceler();
        };
    };

    const getConstructionPersons = (input: string): Canceler | null  => {
        let requestCanceler: Canceler | null = null;
        if(input != '') {
            try {
                (async (): Promise<void> => {
                    const constructionPersons = await apiClient.getConstructionPersonsAsync(input, (cancel: Canceler) => requestCanceler = cancel)
                        .then(persons => persons.map((person): SelectItem => {
                            return {
                                text: nameCombiner(person.firstName, person.lastName),
                                value: person.azureOid,
                                name: person.lastName + ', ' + person.firstName,
                                email: person.email
                            };
                        })
                        );
                    setFilteredPersons(constructionPersons);
                })();
            } catch (error) {
                showSnackbarNotification(error.message);
            }
        } else {
            setFilteredPersons([]);
        }
        return (): void => {
            requestCanceler && requestCanceler();
        };
    };

    const getPersons = (input: string): Canceler | null  => {
        let requestCanceler: Canceler | null = null;
        if(input != '') {
            try {
                (async (): Promise<void> => {
                    const persons = await apiClient.getPersonsAsync(input, (cancel: Canceler) => requestCanceler = cancel)
                        .then(persons => persons.map((person): SelectItem => {
                            return {
                                text: nameCombiner(person.firstName, person.lastName),
                                value: person.azureOid,
                                name: person.lastName + ', ' + person.firstName,
                                email: person.email
                            };
                        })
                        );
                    setFilteredPersons(persons);
                })();
            } catch (error) {
                showSnackbarNotification(error.message);
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
        setParticipants(p => {
            const participantsCopy = [...p];
            participantsCopy[index].organization = value;
            return participantsCopy;
        });
        if(value == OrganizationsEnum.External) {
            setType('Person', index);
        }
    };

    const setExternalEmail = (value: string, index: number): void => {
        setParticipants(p => {
            const participantsCopy = [...p];
            participantsCopy[index].role = null;
            participantsCopy[index].person = null;
            participantsCopy[index].externalEmail = value;
            return participantsCopy;
        });
    };

    const setType = (value: string, index: number): void => {
        setParticipants(p => {
            const participantsCopy = [...p];
            participantsCopy[index].type = value;
            participantsCopy[index].role = null;
            participantsCopy[index].person = null;
            return participantsCopy;
        });
    };

    const deleteParticipant = (index: number): void => {
        setParticipants(p => {
            const participantsCopy = [...p];
            participantsCopy.splice(index, 1);
            return participantsCopy;
        });
    };

    const personsInRoleText = (textToDisplay: string, persons: Person[]): string => {
        persons.forEach((p, i) => {
            textToDisplay += nameCombiner(p.firstName, p.lastName);
            if (i + 1 < persons.length) {
                textToDisplay += ', ';
            }
        });
        return textToDisplay;
    };

    const getDisplayText = (index: number): string => {
        const participant = participants[index];
        if (participant.person) {
            return nameCombiner(participant.person.firstName, participant.person.lastName);
        } else if (participant.role) {
            let textToDisplay = participant.role.code;
            if (participant.role.persons.length > 0 && !participant.role.usePersonalEmail) {
                textToDisplay += ' - ';
                const cc = participant.role.persons.filter(p => p.radioOption == 'cc');
                const to = participant.role.persons.filter(p => p.radioOption == 'to');
                if (to.length > 0) {
                    textToDisplay += personsInRoleText('To: ', to);
                    if(cc.length > 0) {
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
            organization: '',
            type: 'Functional role',
            externalEmail: null,
            person: null,
            role: null
        };
        setParticipants([...participants, newParticipant]);
    };

    const setRoleOnParticipant = (value: RoleParticipant, index: number): void => {
        setParticipants(p => {
            const participantsCopy = [...p];
            participantsCopy[index].role = value;
            participantsCopy[index].person = null;
            participantsCopy[index].externalEmail = null;
            return participantsCopy;
        });
    };

    const setPersonOnParticipant = (event: React.MouseEvent, personIndex: number, participantIndex: number): void => {
        event.preventDefault();
        const person = filteredPersons[personIndex];
        if (person && person.name) {
            const name = person.name.split(', ');
            setParticipants(p => {
                const participantsCopy = [...p];
                participantsCopy[participantIndex].role = null;
                participantsCopy[participantIndex].externalEmail = null;
                participantsCopy[participantIndex].person = {
                    azureOid: person.value, 
                    firstName: name[1],
                    lastName: name[0],
                    email: person.email ? person.email : '',
                    radioOption: null
                };
                return participantsCopy;
            });
        }
    };

    useEffect(() => {
        const handleFilterChange = async (): Promise<void> => {
            if (personsFilter.value == 0) {
                getContractorPersons(personsFilter.text);
            } else if (personsFilter.value == 1) {
                getConstructionPersons(personsFilter.text);
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

    return (<Container>
        <FormContainer>
            <ParticipantRowsContainer>
                {participants.map((p, index) => {
                    return (
                        <React.Fragment key={`participant_${index}`}>
                            <div>
                                <SelectInput
                                    onChange={(value): void => setOrganization(value, index)}
                                    data={Organizations}
                                    label={'Organization'}
                                    disabled={index < 2}
                                >
                                    {p.organization || 'Select'}
                                </SelectInput>
                            </div>
                            <div>
                                <SelectInput
                                    onChange={(value): void => setType(value, index)}
                                    data={ParticipantType}
                                    label={'Type'}
                                    disabled={p.organization == OrganizationsEnum.External}
                                >
                                    {p.type}
                                </SelectInput>
                            </div>
                            { p.organization == OrganizationsEnum.External &&
                                <div>
                                    <TextField
                                        id={'guestEmail'}
                                        placeholder='Email'
                                        label='e-mail address'
                                        value={p.externalEmail ? p.externalEmail : ''}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setExternalEmail(e.target.value, index)} 
                                    />
                                </div>
                            }
                            { p.type == ParticipantType[1].text && p.organization != OrganizationsEnum.External &&
                                <div>
                                    <Dropdown
                                        label={'Person'}
                                        maxHeight='300px'
                                        variant='form'
                                        onFilter={(input: string): void => setPersonsFilter({text: input, value: index})}
                                        text={p.person ? getDisplayText(index) : 'Search to select'}
                                    >
                                        { filteredPersons.map((person, i) => {
                                            return (
                                                <DropdownItem
                                                    key={i}
                                                    onClick={(event: React.MouseEvent): void =>
                                                        setPersonOnParticipant(event, i, index)
                                                    }
                                                >
                                                    <div>{person.text}</div>
                                                </DropdownItem>
                                            );
                                        })}
                                    </Dropdown>
                                </div>
                            }
                            { p.type == ParticipantType[0].text &&
                                <div>
                                    <RoleSelector
                                        selectedRole={p.role}
                                        onChange={(value): void => setRoleOnParticipant(value, index)}
                                        roles={getRolesCopy()}
                                        label={'Role'}
                                    >
                                        {p.role ? 
                                            <Tooltip title={getDisplayText(index)} arrow={true} enterDelay={200} enterNextDelay={100}>
                                                <div className='overflowControl'>
                                                    {getDisplayText(index)}
                                                </div>
                                            </Tooltip>
                                            : 'Select' }
                                    </RoleSelector>
                                </div>
                            }
                            <div>
                                { index > 1 &&
                                <>
                                    <Button title="Delete" variant='ghost' style={{ marginTop: '12px' }} onClick={(): void => deleteParticipant(index)}>
                                        <EdsIcon name='delete_to_trash' />
                                    </Button>
                                </>
                                }
                            </div>
                        </React.Fragment>
                    );
                })}
            </ParticipantRowsContainer>
            <AddParticipantContainer>
                <Button variant='ghost' onClick={addParticipant}>
                    <EdsIcon name='add' /> Add organization
                </Button>
            </AddParticipantContainer>
        </FormContainer>
        <ButtonContainer>
            <Button
                variant='outlined'
                onClick={previous}
            >
                Previous
            </Button>
            <Button 
                disabled={!isValid}
                onClick={next}
            >
                Next
            </Button>
        </ButtonContainer>
    </Container>);
};

export default Participants;
