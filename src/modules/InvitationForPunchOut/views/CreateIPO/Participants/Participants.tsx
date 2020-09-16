import React, { useEffect, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../../components/Select';
import { Button, TextField, Typography } from '@equinor/eds-core-react';
import { DropdownItem, Container, FormContainer, ButtonContainer, InputContainer, AddParticipantContainer } from './Participants.style';
import { Participant } from '@procosys/modules/InvitationForPunchOut/types';
import { useProcosysContext } from '@procosys/core/ProcosysContext';
import { Canceler } from '@procosys/http/HttpClient';
import EdsIcon from '@procosys/components/EdsIcon';
import ParticipantPicker from '@procosys/components/ParticipantPicker';
import { Tooltip } from '@material-ui/core';


const Organizations: SelectItem[] = [
    { text: 'Commissioning', value: 'Commissioning' },
    { text: 'Construction Company', value: 'Construction Company' },
    { text: 'Contractor', value: 'Contractor' },
    { text: 'Operation', value: 'Operation' },
    { text: 'Technical integrity', value: 'Technical integrity' },
    { text: 'Supplier', value: 'Supplier' },
];

interface ParticipantsProps {
    participants: Participant[];
    setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
    isValid: boolean;
}

const testRoles: SelectItem[] = [
    {
        text: 'Electro',
        value: 'r_Electro',
        children: [
            {
                text: 'Elisabeth Bratli',
                value: 'p_Elisabeth',
                radioButtons: true,
                radioOption: '1',
                inRole: true
            },
            {
                text: 'Lykke',
                value: 'p_Lykke',
                radioButtons: true,
                radioOption: '1',
                inRole: true

            },
            {
                text: 'Kjetil',
                value: 'p_Kjetild',
                radioButtons: true,
                radioOption: '2',
                inRole: true
            },
        ]
    },
    {
        text: 'Auto',
        value: 'r_auto',
        children: [
            {
                text: 'Christine',
                value: 'p_Christine',
                radioButtons: true,
                radioOption: '0',
                inRole: true
            },
            {
                text: 'Christer Nordbø',
                value: 'p_Christer_Nordbø',
                radioButtons: true,
                radioOption: '0',
                inRole: true
            },
            {
                text: 'Jan Inge',
                value: 'p_Jan_Inge',
                radioButtons: true,
                radioOption: '0',
                inRole: true
            },
        ]
    }
];

const testPart: SelectItem[] = [
    {
        text: 'Pål',
        value: 'p_Pål',
        radioButtons: true,
        radioOption: '0',
    },
    {
        text: 'Stein',
        value: 'p_Stein',
        radioButtons: true,
        radioOption: '0',
    },
    {
        text: 'Henning',
        value: 'p_Henning',
        radioButtons: true,
        radioOption: '0',
    },

];


const Participants = ({
    participants,
    setParticipants,
    isValid
}: ParticipantsProps): JSX.Element => {
    const [availableRoles, setAvailableRoles] = useState<SelectItem[]>([]);
    const [availablePersons, setAvailablePersons] = useState<SelectItem[]>([]);
    const [filter, setFilter] = useState<string>('');

    const setOrganization = (value: string, index: number): void => {
        setParticipants(p => {
            const participantsCopy = [...p];
            participantsCopy[index].organization = value;
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
            person: null,
            role: null
        };
        setParticipants([...participants, newParticipant]);
    };


    const setRoleOnParticipant = (value: string, index: number): void => {
        const role = availableRoles.find(c => c.value == value);
        if (role) {
            setParticipants(p => {
                const participantsCopy = [...p];
                participantsCopy[index].role = {id: 123, roleName: role.text, persons: null};
                participantsCopy[index].person = null;
                return participantsCopy;
            });
        }
    };

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

    const setPersonOnParticipant = (itmValue: string, index: number): void => {
        const person = availablePersons.find(p => p.value == itmValue);
        if (person) {
            setParticipants(p => {
                const participantsCopy = [...p];
                participantsCopy[index].role = null;
                participantsCopy[index].person = {id: 123, name: person.text, cc: false};
                return participantsCopy;
            });
        }
    };

    const updateRadioButtonParticipants = (itmValue: string, value: string, index: number): void => {
        const role = availableRoles.find(r => {
            if (r.children) {
                const person = r.children.find(c => c.value == itmValue);
                return person;
            }
        });
        const roleIndex = availableRoles.findIndex(r => {
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
                setAvailableRoles(ar => {
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

                setParticipants(p => {
                    const participantsCopy = [...p];
                    participantsCopy[index].role = {
                        id: 123,
                        roleName: role.text,
                        persons: rolePeople
                    };
                    participantsCopy[index].person = null;
                    return participantsCopy;
                });
            }
        }
    };

    useEffect(() => {
        console.log(participants);
    }, [participants]);

    useEffect(() => {
        if(filter.length > 0) {
            setAvailablePersons(testPart.filter(p => p.text.toLocaleLowerCase().startsWith(filter.toLocaleLowerCase())));
            setAvailableRoles(testRoles.filter(r => r.text.toLocaleLowerCase().startsWith(filter.toLocaleLowerCase())));
        } else {
            setAvailablePersons([]);
            setAvailableRoles([]);
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
                            <ParticipantPicker
                                onChange={(value): void => setRoleOnParticipant(value, index)}
                                onPersonChange={(value): void => setPersonOnParticipant(value, index)}
                                onRadioChange={(itmValue, value): void => updateRadioButtonParticipants(itmValue, value, index)}
                                roles={availableRoles}
                                persons={availablePersons}
                                label={'Person/role'}
                                onFilter={setFilter}
                            >
                                <Tooltip title={p.role || p.person ? getPersonRoleText(index) : ''} arrow={true} enterDelay={200} enterNextDelay={100} disableHoverListener={!p.role && !p.person}>
                                    <div className='controlOverflow'>
                                        {p.role || p.person ? getPersonRoleText(index) : 'Search to select' }
                                    </div>
                                </Tooltip>
                            </ParticipantPicker>
                            {index > 1 &&
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
            <Button constiant='outlined' disabled>Previous</Button>
            <Button disabled={!isValid}>Next</Button>
        </ButtonContainer>
    </Container>);
};

export default Participants;
