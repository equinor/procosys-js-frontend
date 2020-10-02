import React from 'react';
import { Button } from '@equinor/eds-core-react';
import { Container, FormContainer, ButtonContainer } from './Participants.style';
import { Participant } from '@procosys/modules/InvitationForPunchOut/types';

interface ParticipantsProps {
    participants: Participant[];
    setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
    isValid: boolean;
    next: () => void;
    previous: () => void;
}

const Participants = ({
    participants,
    setParticipants,
    isValid,
    next,
    previous
}: ParticipantsProps): JSX.Element => {

    return (<Container>
        <FormContainer>

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
