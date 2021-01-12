import { CommentContainer, CommentHeaderContainer, CommentSectionContainer, Container, HeaderContainer, SpinnerContainer } from './index.style';
import React, { useEffect, useState } from 'react';

import { Button } from '@equinor/eds-core-react';
import { Canceler } from 'axios';
import EdsIcon from '@procosys/components/EdsIcon';
import { IpoComment } from '../types';
import Spinner from '@procosys/components/Spinner';
import { Typography } from '@equinor/eds-core-react';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useInvitationForPunchOutContext } from '@procosys/modules/InvitationForPunchOut/context/InvitationForPunchOutContext';

interface CommentsProps {
    comments: IpoComment[];
    loading: boolean;
}

const Comments = ({ comments, loading }: CommentsProps): JSX.Element => {

    return (
        <Container>
            <HeaderContainer>
                <Typography variant="h3">Comments</Typography>
            </HeaderContainer>
            <CommentSectionContainer>
                {loading && (
                    <SpinnerContainer>
                        <Spinner medium />
                    </SpinnerContainer>
                )}
                {comments.map(comment => (
                    <CommentContainer key={comment.id}>
                        <CommentHeaderContainer>
                            <Typography token={{ fontSize: '12px' }}>{`${comment.createdBy.firstName} ${comment.createdBy.lastName}`}</Typography>
                            <Typography token={{ fontSize: '12px' }}>{(new Date(comment.createdAtUtc)).toLocaleString([], {year: 'numeric', month: '2-digit', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</Typography>
                        </CommentHeaderContainer>
                        <Typography variant="body_long">{comment.comment}</Typography>                        
                    </CommentContainer>
                ))}
            </CommentSectionContainer>
        </Container>
    );
};

export default Comments;

