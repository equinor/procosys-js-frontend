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
    ipoId: number;
    show: React.Dispatch<React.SetStateAction<boolean>>;
    hasComments: React.Dispatch<React.SetStateAction<boolean>>;
}

const Comments = ({ ipoId, show, hasComments }: CommentsProps): JSX.Element => {
    const [comments, setComments] = useState<IpoComment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { apiClient } = useInvitationForPunchOutContext();

    useEffect(() => {
        hasComments(comments.length > 0);
    }, [comments]);

    const getComments = async (requestCanceller?: (cancelCallback: Canceler) => void): Promise<void> => {
        try {
            const response = await apiClient.getComments(ipoId, requestCanceller);
            setComments(response);
        } catch (error) {
            console.error(error.message, error.data);
            showSnackbarNotification(error.message);
        }
    };

    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            setLoading(true);
            await getComments((cancel: Canceler) => { requestCancellor = cancel; });
            setLoading(false);
        })();
        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    return (
        <Container>
            <HeaderContainer>
                <Typography variant="h3">Comments</Typography>
                <Button variant="ghost" title='Close' onClick={(): void => show(false)}>
                    <EdsIcon name="close" />
                </Button>
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

