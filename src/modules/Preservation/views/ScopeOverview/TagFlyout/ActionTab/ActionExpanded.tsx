import React, { useState, useEffect } from 'react';
import { usePreservationContext } from '../../../../context/PreservationContext';
import { showSnackbarNotification } from '../../../../../../core/services/NotificationService';
import { getFormattedDate } from '../../../../../../core/services/DateService';
import { Container, Section, GridRow, IconContainer, StyledButton } from './ActionExpanded.style';
import { Button, Typography } from '@equinor/eds-core-react';
import { Canceler } from 'axios';
import CreateOrEditAction from './CreateOrEditAction';
import EdsIcon from '../../../../../../components/EdsIcon';

const editIcon = <EdsIcon name='edit' size={16} />;

interface ActionDetails {
    id: number;
    title: string;
    description: string;
    dueTimeUtc: Date;
    isClosed: boolean;
    createdAtUtc: Date;
    closedAtUtc: Date | null;
    createdBy: {
        id: number;
        firstName: string;
        lastName: string;
    };
    rowVersion: string;
    closedBy: {
        id: number;
        firstName: string;
        lastName: string;
    };
}

interface ActionDetailsProps {
    tagId: number;
    actionId: number;
    updateTitle: (title: string) => void;
    toggleDetails: () => void;
    getActionList?: () => void;
}

const ActionExpanded = ({
    tagId,
    actionId,
    updateTitle,
    toggleDetails,
    getActionList
}: ActionDetailsProps): JSX.Element => {
    const { apiClient } = usePreservationContext();
    const [actionDetails, setActionDetails] = useState<ActionDetails | null>(null);
    const [showEditMode, setShowEditMode] = useState<boolean>(false);

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
                showSnackbarNotification(error.message, 5000, true);
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, [showEditMode]);

    const closeAction = async (): Promise<void> => {
        try {
            if (actionDetails && actionDetails.rowVersion) {
                await apiClient.closeAction(tagId, actionId, actionDetails.rowVersion);
                getActionList && getActionList();
                toggleDetails();
                showSnackbarNotification('Action is closed.', 5000, true);
            } else {
                showSnackbarNotification('Error occured. Action is not closed. Row version is missing.', 5000, true);
            }
        } catch (error) {
            console.error('Closing action failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message, 5000, true);
        }

        return Promise.resolve();
    };

    const getDateField = (date: Date | null): string => {
        if (date === null) {
            return '-';
        }
        return getFormattedDate(date);
    };

    return (
        <>
            {
                showEditMode && actionDetails && (
                    < CreateOrEditAction
                        tagId={tagId}
                        actionId={actionId}
                        title={actionDetails.title}
                        description={actionDetails.description}
                        dueTimeUtc={actionDetails.dueTimeUtc}
                        rowVersion={actionDetails.rowVersion}
                        backToParentView={(): void => { setShowEditMode(false); }}
                        updateTitle={updateTitle}
                    />
                )
            }

            <Container isClosed={actionDetails ? actionDetails.isClosed : false}>
                {!showEditMode && (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Section>
                                <Typography variant='caption'>Due date</Typography>
                                <Typography variant="body_short">
                                    {getDateField(actionDetails && actionDetails.dueTimeUtc)}
                                </Typography>
                            </Section>
                            {
                                actionDetails && !actionDetails.isClosed && (
                                    <IconContainer>
                                        <StyledButton
                                            data-testid="editIcon"
                                            variant='ghost'
                                            onClick={(): void => setShowEditMode(true)}>
                                            {editIcon}
                                        </StyledButton>
                                    </IconContainer>
                                )
                            }
                        </div>
                        {
                            actionDetails && actionDetails.isClosed && (
                                <Section>
                                    <div>
                                        <GridRow>
                                            <Typography variant='caption' style={{ gridColumn: '1', gridRow: '1' }}>Closed at</Typography>
                                            <Typography variant='caption' style={{ gridColumn: '2', gridRow: '1' }}>Closed by</Typography>
                                            <Typography variant='body_short' style={{ gridColumn: '1', gridRow: '2' }}>
                                                {getDateField(actionDetails && actionDetails.closedAtUtc)}
                                            </Typography>
                                            <Typography variant='body_short' style={{ gridColumn: '2', gridRow: '2' }}>
                                                {actionDetails && actionDetails.closedBy.firstName} {actionDetails && actionDetails.closedBy.lastName}
                                            </Typography>
                                        </GridRow>
                                    </div>
                                </Section>
                            )
                        }
                        <Section>
                            <div>
                                <GridRow>
                                    <Typography variant='caption' style={{ gridColumn: '1', gridRow: '1' }}>Added at</Typography>
                                    <Typography variant='caption' style={{ gridColumn: '2', gridRow: '1' }}>Added by</Typography>
                                    <Typography variant='body_short' style={{ gridColumn: '1', gridRow: '2' }}>
                                        {getDateField(actionDetails && actionDetails.createdAtUtc)}
                                    </Typography>
                                    <Typography variant='body_short' style={{ gridColumn: '2', gridRow: '2' }}>
                                        {actionDetails && actionDetails.createdBy.firstName} {actionDetails && actionDetails.createdBy.lastName}
                                    </Typography>
                                </GridRow>
                            </div>
                        </Section>
                        <Section>
                            <Typography variant='caption'>Description</Typography>
                            <Typography variant="body_short">{actionDetails && actionDetails.description}</Typography>
                        </Section>
                        {
                            actionDetails && !actionDetails.isClosed && (
                                <Section>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button onClick={closeAction}>Close action</Button>
                                    </div>
                                </Section>
                            )
                        }

                    </>)
                }

            </Container >
        </>
    );
};

export default ActionExpanded; 