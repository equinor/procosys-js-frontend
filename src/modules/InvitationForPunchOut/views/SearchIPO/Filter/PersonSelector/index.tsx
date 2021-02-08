import { Container, DropdownItem } from './index.style';
import React, { useEffect, useState } from 'react';

import { Canceler } from '@procosys/http/HttpClient';
import Dropdown  from '@procosys/components/Dropdown';
import { SelectItem } from '@procosys/components/Select';
import Spinner from '@procosys/components/Spinner';
import { rolePersonParamType } from '..';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useInvitationForPunchOutContext } from '@procosys/modules/InvitationForPunchOut/context/InvitationForPunchOutContext';

const WAIT_INTERVAL = 300;


interface PersonSelectorProps {
    personOid: string;
    onChange: (filterParam: rolePersonParamType, value: string) => void;
}

const PersonSelector = ({
    personOid,
    onChange,
}: PersonSelectorProps): JSX.Element => {
    const [filteredPersons, setFilteredPersons] = useState<SelectItem[]>([]);
    const [personsFilter, setPersonsFilter] = useState<string>(''); //filter string and index of participant
    const { apiClient } = useInvitationForPunchOutContext();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedPerson, setSelectedPerson] = useState<SelectItem>();

    const nameCombiner = (firstName: string, lastName: string): string => {
        return `${firstName} ${lastName}`;
    };

    useEffect(() => {
        setSelectedPerson(filteredPersons.find(p => p.value === personOid));
    }, [personOid]);


    const getPersons = (input: string): Canceler | null => {
        let requestCanceler: Canceler | null = null;
        if (input != '') {
            try {
                (async (): Promise<void> => {
                    setIsLoading(true);

                    const persons = await apiClient.getPersonsAsync(input, (cancel: Canceler) => requestCanceler = cancel)
                        .then(persons => persons.map((person): SelectItem => {
                            return {
                                text: nameCombiner(person.firstName, person.lastName),
                                value: person.azureOid,
                                email: person.email
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


    const setPerson = (event: React.MouseEvent, personIndex: number): void => {
        event.preventDefault();
        const person = filteredPersons[personIndex];
        if (person) {
            onChange('personOid', person.value);
        }
    };


    useEffect(() => {
        const handleFilterChange = async (): Promise<void> => {
            getPersons(personsFilter);
        };

        const timer = setTimeout(() => {
            handleFilterChange();
        }, WAIT_INTERVAL);

        return (): void => {
            clearTimeout(timer);
        };
    }, [personsFilter]);

    return (<Container>
        <Dropdown
            label={'Person'}
            maxHeight='300px'
            variant='form'
            onFilter={(input: string): void => setPersonsFilter(input)}
            text={selectedPerson ? selectedPerson.text : 'Search to select'}
        >
            {isLoading && <div style={{ margin: 'calc(var(--grid-unit))' }} ><Spinner medium /></div>}
            {!isLoading &&
                                            filteredPersons.map((person, i) => {
                                                return (
                                                    <DropdownItem
                                                        key={i}
                                                        onClick={(event: React.MouseEvent): void =>
                                                            setPerson(event, i)
                                                        }
                                                    >
                                                        <div>{person.text}</div>
                                                    </DropdownItem>
                                                );
                                            })}
        </Dropdown>
    </Container>);
};

export default PersonSelector;

