import React, { useState, useEffect } from 'react';
import { usePreservationContext } from '../../../../context/PreservationContext';
import { showSnackbarNotification } from '../../../../../../core/services/NotificationService';
import { getFormattedDate } from '../../../../../../core/services/DateService';
import { Container, Section, GridRow } from './ActionExpanded.style';
import { Button, Typography } from '@equinor/eds-core-react';
import { Canceler } from 'axios';

interface ActionDetails {
    id: number;
    title: string;
    description: string;
    dueTimeUtc: Date;
    isClosed: boolean;
    createdAt: Date;
    closedAtUtc: Date;
    createdBy: {
        id: number;
        firstName: string;
        lastName: string;
    };
    closedBy: {
        id: number;
        firstName: string;
        lastName: string;
    };
}

interface ActionDetailsProps {
    tagId: number | null;
    actionId: number;
    close: () => void;

}

const ActionExpanded = ({
    tagId,
    actionId,
    close
}: ActionDetailsProps): JSX.Element => {
    const { apiClient } = usePreservationContext();
    const [actionDetails, setActionDetails] = useState<ActionDetails>();

    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                if (tagId != null) {
                    const actionDetails = await apiClient.getActionDetails(tagId, actionId, (cancel: Canceler) => requestCancellor = cancel);
                    setActionDetails(actionDetails);
                }
            } catch (error) {
                console.error('Get Journeys failed: ', error.messsage, error.data);
                showSnackbarNotification(error.message, 5000);
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    return (
        <Container>
            <Section>
                <Typography variant='caption'>Due date</Typography>
                <Typography variant="body_short">{getFormattedDate(actionDetails && actionDetails.dueTimeUtc)}</Typography>
            </Section>
            <Section>
                <GridRow>
                    <Typography variant='caption' style={{ gridColumn: '1', gridRow: '1' }}>Added at</Typography>
                    <Typography variant='caption' style={{ gridColumn: '2', gridRow: '1' }}>Added by</Typography>
                    <Typography variant='body_short' style={{ gridColumn: '1', gridRow: '2' }}>{getFormattedDate(actionDetails && actionDetails.createdAt)} </Typography>
                    <Typography variant='body_short' style={{ gridColumn: '2', gridRow: '2' }}>{actionDetails && actionDetails.createdBy.firstName} {actionDetails && actionDetails.createdBy.lastName}</Typography>
                </GridRow>
            </Section>
            <Section>
                <Typography variant='caption'>Description</Typography>
                <Typography variant="body_short">{actionDetails && actionDetails.description}</Typography>
            </Section>
            <Section>
                <div style={{ display: 'flex', marginTop: 'var(--grid-unit)', justifyContent: 'flex-end' }}>
                    <Button onClick={(): void => close()}>Close</Button>
                </div>
            </Section>
        </Container >
    );
};

export default ActionExpanded; 