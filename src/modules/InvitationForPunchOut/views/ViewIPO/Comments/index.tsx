import { AddSectionContainer, CommentContainer, CommentHeaderContainer, Container, HeaderContainer, SpinnerContainer, StyledButton } from './index.style';
import React, { useRef } from 'react';

import { Button } from '@equinor/eds-core-react';
import EdsIcon from '@procosys/components/EdsIcon';
import { IpoComment } from '../types';
import Spinner from '@procosys/components/Spinner';
import { TextField } from '@equinor/eds-core-react';
import { Typography } from '@equinor/eds-core-react';
import { getFormattedDateAndTime } from '@procosys/core/services/DateService';

interface CommentsProps {
    comments: IpoComment[];
    addComment: (comment: string) => Promise<void>;
    loading: boolean;
    close: () => void;
}

const Comments = ({ comments, addComment, loading, close }: CommentsProps): JSX.Element => {
    const inputRef = useRef<HTMLInputElement>();

    const handleAddComment = async (): Promise<void> => {
        if (inputRef.current && !!inputRef.current.value) {
            const comment = inputRef.current.value;
            inputRef.current.value = '';
            await addComment(comment);
        }
    };

    return (
        <Container>
            <HeaderContainer>
                <Typography variant="h3">Comments</Typography>
                <Button variant='ghost' onClick={close}><EdsIcon name='close' /></Button>
            </HeaderContainer>
            <AddSectionContainer>
                <TextField multiline label='Comment' inputRef={inputRef} />
                <StyledButton variant='outlined' disabled={loading} onClick={handleAddComment}>Add</StyledButton>
            </AddSectionContainer>
            {loading && (
                <SpinnerContainer>
                    <Spinner medium />
                </SpinnerContainer>
            )}
            {comments.map(comment => (
                <CommentContainer key={comment.id}>
                    <CommentHeaderContainer>
                        <Typography token={{ fontSize: '12px' }}>{`${comment.createdBy.firstName} ${comment.createdBy.lastName}`}</Typography>
                        <Typography token={{ fontSize: '12px' }}>{getFormattedDateAndTime(comment.createdAtUtc)}</Typography>
                    </CommentHeaderContainer>
                    <Typography variant="body_long">{comment.comment}</Typography>
                </CommentContainer>
            ))}
        </Container>
    );
};

export default Comments;

