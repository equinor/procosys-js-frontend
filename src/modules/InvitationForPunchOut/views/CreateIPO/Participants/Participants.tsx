import React, { useEffect, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../../components/Select';
import Dropdown from '../../../../../components/Dropdown';
import { Button, TextField, Typography } from '@equinor/eds-core-react';
import { DropdownItem, Container, FormContainer, ButtonContainer, InputContainer, AddParticipantContainer } from './Participants.style';
import { Participant, RoleParticipant } from '@procosys/modules/InvitationForPunchOut/types';
import EdsIcon from '@procosys/components/EdsIcon';
import ParticipantPicker, { ParticipantItem } from '../../../../../components/ParticipantPicker';

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
        text: 'Stein',
        value: 'p_Stein',
    },
    {
        text: 'Henning',
        value: 'p_Henning',
    },

];


const Participants = ({
    next,
    previous,
    participants,
    setParticipants,
    isValid
}: ParticipantsProps): JSX.Element => {

    const testRoles: ParticipantItem[] = [
        {
            text: 'Electro',
            value: 'r_Electro',
            sendToPersonalEmail: false,
            children: [
                {
                    text: 'Elisabeth',
                    value: 'p_Elisabeth',
                    radioButtons: true,
                    radioOption: '0',
                },
                {
                    text: 'Lykke',
                    value: 'p_Lykke',
                    radioButtons: true,
                    radioOption: '0',
    
                },
                {
                    text: 'Kjetil',
                    value: 'p_Kjetild',
                    radioButtons: true,
                    radioOption: '0',
                },
            ]
        },
        {
            text: 'Auto',
            value: 'r_auto',
            sendToPersonalEmail: true,
            children: [
                {
                    text: 'Christine',
                    value: 'p_Christine'
                },
                {
                    text: 'Christer Nordbø',
                    value: 'p_Christer_Nordbø'
                },
                {
                    text: 'Jan Inge',
                    value: 'p_Jan_Inge'
                },
            ]
        }
    ];

 

    const [availableRoles, setAvailableRoles] = useState<ParticipantItem[]>(testRoles);
    const [availablePersons, setAvailablePersons] = useState<SelectItem[]>(testPart);
    const [filteredPersons, setFilteredPersons] = useState<SelectItem[]>(testPart);
    const [filter, setFilter] = useState<string>('');

    const getRolesCopy = (): ParticipantItem[] => {
        return JSON.parse(JSON.stringify(testRoles));
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
            return participant.person.name;
        } else if (participant.role) {
            let textToDisplay = participant.role.roleName;
            if (participant.role.persons) {
                textToDisplay += ' - ';
                const cc = participant.role.persons.filter(p => p.cc);
                const to = participant.role.persons.filter(p => !p.cc);
                if (to.length > 0) {
                    textToDisplay += 'To: ';
                    to.forEach((p, i) => {
                        textToDisplay += p.name;
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
                        textToDisplay += p.name;
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
        const person = availablePersons[personIndex];
        if (person) {
            setParticipants(p => {
                const participantsCopy = [...p];
                participantsCopy[participantIndex].role = null;
                participantsCopy[participantIndex].person = {id: 123, name: person.text, cc: false};
                return participantsCopy;
            });
        }
    };

    useEffect(() => {
        console.log(participants);
    }, [participants]);

    useEffect(() => {
        if(filter.length > 0) {
            setAvailablePersons(testPart.filter(p => p.text.toLocaleLowerCase().startsWith(filter.toLocaleLowerCase())));
        } else {
            // setAvailablePersons([]);
        }
    }, [filter]);

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
                                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                    text={(participants[index].person && participants[index].person!.name) || 'Select'}
                                >
                                    { availablePersons.map((person, i) => {
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
                                <ParticipantPicker
                                    onChange={(value): void => setRoleOnParticipant(value, index)}
                                    roles={getRolesCopy()}
                                    label={'Role'}
                                >
                                    {p.role ? getPersonRoleText(index) : 'Search to select' }
                                </ParticipantPicker>
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
