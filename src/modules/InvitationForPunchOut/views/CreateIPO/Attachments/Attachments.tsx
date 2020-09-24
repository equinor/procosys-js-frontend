import React from 'react';
import { Button } from '@equinor/eds-core-react';
import { Container, FormContainer, ButtonContainer } from './Attachments.style';

interface AttachmentsProps {
    next: () => void;
    previous: () => void;
}

const Attachments = ({
    next,
    previous
}: AttachmentsProps): JSX.Element => {

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
                onClick={next}
            >
                Next
            </Button>
        </ButtonContainer>
    </Container>);
};

export default Attachments;
