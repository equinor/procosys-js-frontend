import React, { useEffect, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../../components/Select';
import Dropdown from '../../../../../components/Dropdown';
import { Button } from '@equinor/eds-core-react';
import { DropdownItem, Container, FormContainer, ButtonContainer, InputContainer, AddParticipantContainer } from './Participants.style';
import { Participant, RoleParticipant } from '@procosys/modules/InvitationForPunchOut/types';
import EdsIcon from '@procosys/components/EdsIcon';
import RoleSelector from '../../../components/RoleSelector';
import { Canceler } from '@procosys/http/HttpClient';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { Tooltip } from '@material-ui/core';
import { useInvitationForPunchOutContext } from '@procosys/modules/InvitationForPunchOut/context/InvitationForPunchOutContext';

const Organizations: SelectItem[] = [
    { text: 'Commissioning', value: 'Commissioning' },
    { text: 'Construction Company', value: 'Construction Company' },
    { text: 'Contractor', value: 'Contractor' },
    { text: 'Operation', value: 'Operation' },
    { text: 'Technical integrity', value: 'Technical integrity' },
    { text: 'Supplier', value: 'Supplier' },
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

const testPart: SelectItem[] = [
    {
        text: 'Pål',
        value: 'p_Pål'
    },
    {
        text: 'Pernille',
        value: 'p_Pernille'
    },
    {
        text: 'Kristen',
        value: 'p_Kristen',
    },
    {
        text: 'Kjetil',
        value: 'p_Kjetil',
    },
    {
        text: 'Cato',
        value: 'p_Cato',
    },
    {
        text: 'Christine',
        value: 'p_Christine',
    },

];

const Participants = ({
    next,
    previous,
    participants,
    setParticipants,
    isValid
}: ParticipantsProps): JSX.Element => {
    const [availableRoles, setAvailableRoles] = useState<RoleParticipant[]>([]);
    const [filteredPersons, setFilteredPersons] = useState<SelectItem[]>([]);
    const [personFilter, setPersonsFilter] = useState<string>('');
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
                                    radioOption: '0',
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

    useEffect(() => {
        if(personFilter != '') {
            //let requestCanceler: Canceler;
            try {
                // (async (): Promise<void> => {
                //     const filteredPersonsResponse = await apiClient.getCommPkgsAsync(projectId, filter)
                //         .then(commPkgs => commPkgs.map((commPkg): CommPkgRow => {
                //             return {
                //                 commPkgNo: commPkg.commPkgNo,
                //                 description: commPkg.description,
                //                 status: commPkg.status,
                //                 tableData: {
                //                     checked: selectedCommPkgScope.some(c => c.commPkgNo == commPkg.commPkgNo)
                //                 }
                //             };
                //         }));
                setFilteredPersons(testPart.filter(r => r.text.toLocaleLowerCase().startsWith(personFilter.toLocaleLowerCase())));
                //})();
                //return (): void => requestCanceler && requestCanceler();
            } catch (error) {
                showSnackbarNotification(error.message);
            }
        } else {
            setFilteredPersons([]);
        }
    }, [personFilter]);

    const getRolesCopy = (): RoleParticipant[] => {
        return JSON.parse(JSON.stringify(availableRoles));
    };

    const setOrganization = (value: string, index: number): void => {
        setParticipants(p => {
            const participantsCopy = [...p];
            participantsCopy[index].organization = value;
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

    const getPersonRoleText = (index: number): string => {
        const participant = participants[index];
        if (participant.person) {
            return participant.person.firstName + ' ' + participant.person.lastName;
        } else if (participant.role) {
            let textToDisplay = participant.role.code;
            if (participant.role.persons) {
                textToDisplay += ' - ';
                const cc = participant.role.persons.filter(p => p.radioOption == 'cc');
                const to = participant.role.persons.filter(p => p.radioOption == 'to');
                if (to.length > 0) {
                    textToDisplay += 'To: ';
                    to.forEach((p, i) => {
                        textToDisplay += p.firstName + ' ' + p.lastName;
                        if(cc.length == 0) {
                            if (i + 1 < to.length) {
                                textToDisplay += ', ';
                            }
                        } else {
                            textToDisplay += ', ';
                        }
                    });
                }
                if (cc.length > 0) {
                    textToDisplay += 'CC: ';
                    cc.forEach((p, i) => {
                        textToDisplay += p.firstName + ' ' + p.lastName;
                        if(i + 1 < cc.length) {
                            textToDisplay += ', ';
                        }
                    });
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
            return participantsCopy;
        });
    };

    const setPersonOnParticipant = (event: React.MouseEvent, personIndex: number, participantIndex: number): void => {
        event.preventDefault();
        const person = filteredPersons[personIndex];
        // if (person) {
        //     setParticipants(p => {
        //         const participantsCopy = [...p];
        //         participantsCopy[participantIndex].role = null;
        //         participantsCopy[participantIndex].person = {id: 123, firstName: person.text, cc: false};
        //         return participantsCopy;
        //     });
        // }
    };

    return (<Container>
        <FormContainer>
            {participants.map((p, index) => {
                return (
                    <React.Fragment key={`participant_${index}`}>
                        <InputContainer key={`role_${index}`}>
                            <SelectInput
                                onChange={(value): void => setOrganization(value, index)}
                                data={Organizations}
                                label={'Organization'}
                                disabled={index < 2}
                            >
                                {p.organization || 'Select'}
                            </SelectInput>
                            <SelectInput
                                onChange={(value): void => setType(value, index)}
                                data={ParticipantType}
                                label={'Type'}
                            >
                                {p.type}
                            </SelectInput>
                            { p.type == ParticipantType[1].text &&
                                <Dropdown
                                    label={'Person'}
                                    maxHeight='300px'
                                    variant='form'
                                    onFilter={(input: string): void => setPersonsFilter(input)}
                                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                    text={(participants[index].person && (participants[index].person!.firstName + ' ' + participants[index].person!.lastName)) || 'Search to select'}
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
                            }
                            { p.type == ParticipantType[0].text &&
                                <RoleSelector
                                    onChange={(value): void => setRoleOnParticipant(value, index)}
                                    roles={getRolesCopy()}
                                    label={'Role'}
                                >
                                    {p.role ? 
                                        <Tooltip title={getPersonRoleText(index)} arrow={true} enterDelay={200} enterNextDelay={100}>
                                            <div className='overflowControl'>
                                                {getPersonRoleText(index)}
                                            </div>
                                        </Tooltip>
                                        : 'Select' }
                                </RoleSelector>
                            }
                            { index > 1 &&
                                    <Button title="Delete" variant='ghost' style={{ marginTop: '12px' }} onClick={(): void => deleteParticipant(index)}>
                                        <EdsIcon name='delete_to_trash' />
                                    </Button>
                            }
                        </InputContainer>
                    </React.Fragment>
                );
            })}
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
