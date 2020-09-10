import React, { useEffect, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../../components/Select';
import Dropdown from '../../../../../components/Dropdown';
import { Button, TextField, Typography } from '@equinor/eds-core-react';
import { DropdownItem, DateTimeContainer, Container, PoTypeContainer, LocationContainer, FormContainer, ButtonContainer } from './Participants.style';
import { ProjectDetails, GeneralInfoDetails } from '@procosys/modules/CallForPunchOut/types';
import { TextField as DateTimeField } from '@material-ui/core';
import { useProcosysContext } from '@procosys/core/ProcosysContext';
import { Canceler } from '@procosys/http/HttpClient';

const Organizations: SelectItem[] = [
    { text: 'Commissioning', value: 'Commissioning' },
    { text: 'Construction Company', value: 'Construction Company' },
    { text: 'Contractor', value: 'Contractor' },
    { text: 'Operation', value: 'Operation' },
    { text: 'Technical integrity', value: 'Technical integrity' },
    { text: 'Supplier', value: 'Supplier' },
];

interface ParticipantsProps {
    participants: GeneralInfoDetails;
    setParticipants: React.Dispatch<React.SetStateAction<GeneralInfoDetails>>;
    fromMain: boolean;
}

const Participants = ({
    participants,
    setParticipants
}: ParticipantsProps): JSX.Element => {
    const { procosysApiClient } = useProcosysContext();
    const [availableProjects, setAvailableProjects] = useState<ProjectDetails[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<ProjectDetails[]>([]);
    const [filterForProjects, setFilterForProjects] = useState<string>('');
    const [isValidForm, setIsValidForm] = useState<boolean>(false);

    useEffect(() => {
        let requestCanceler: Canceler;
        (async (): Promise<void> => {
            const allProjects = await procosysApiClient.getAllProjectsForUserAsync((cancelerCallback) => requestCanceler = cancelerCallback)
                .then(projects => projects.map((project): ProjectDetails => {
                    return {
                        id: project.id,
                        name: project.name,
                        description: project.description
                    };
                }));
            setAvailableProjects(allProjects);
            setFilteredProjects(allProjects);
        })();
        return (): void => requestCanceler && requestCanceler();
    },[]);


    return (<Container>
        <FormContainer>
          
        </FormContainer>
        <ButtonContainer>
            <Button constiant='outlined' disabled>Previous</Button>
            <Button disabled={!isValidForm}>Next</Button>
        </ButtonContainer>
    </Container>);
};

export default Participants;
