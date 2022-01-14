import { Button, Typography } from '@equinor/eds-core-react';
import {
    Container,
    GridRow,
    IconContainer,
    Section,
    StyledButton,
} from './ActionExpanded.style';
import React, { useEffect, useState } from 'react';

import ActionAttachments from './ActionAttachments';
import { Canceler } from 'axios';
import CreateOrEditAction from './CreateOrEditAction';
import EdsIcon from '../../../../../../components/EdsIcon';
import Spinner from '@procosys/components/Spinner';
import { getFormattedDate } from '../../../../../../core/services/DateService';
import { showSnackbarNotification } from '../../../../../../core/services/NotificationService';
import { usePreservationContext } from '../../../../context/PreservationContext';

const editIcon = <EdsIcon name="edit" size={16} />;

interface ActionDetails {
    id: number;
    title: string;
    description: string;
    dueTimeUtc: Date | null;
    isClosed: boolean;
    createdAtUtc: Date;
    modifiedAtUtc: Date | null;
    closedAtUtc: Date | null;
    createdBy: {
        id: number;
        firstName: string;
        lastName: string;
    };
    modifiedBy: {
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
    isVoided: boolean;
    actionId: number;
    toggleDetails: () => void;
    getActionList: () => void;
    setDirty: () => void;
}

const ActionExpanded = ({
    tagId,
    isVoided,
    actionId,
    toggleDetails,
    getActionList,
    setDirty,
}: ActionDetailsProps): JSX.Element => {
    const { apiClient } = usePreservationContext();
    const [actionDetails, setActionDetails] = useState<ActionDetails>();
    const [showEditMode, setShowEditMode] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                if (tagId != null) {
                    const actionDetails = await apiClient.getActionDetails(
                        tagId,
                        actionId,
                        (cancel: Canceler) => (requestCancellor = cancel)
                    );
                    setActionDetails(actionDetails);
                }
            } catch (error) {
                console.error(
                    'Get action details failed: ',
                    error.message,
                    error.data
                );
                showSnackbarNotification(error.message, 5000, true);
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, [showEditMode]);

    const closeAction = async (): Promise<void> => {
        setIsLoading(true);
        try {
            if (actionDetails) {
                await apiClient.closeAction(
                    tagId,
                    actionId,
                    actionDetails.rowVersion
                );
                setDirty();
                getActionList();
                toggleDetails();
                showSnackbarNotification('Action is closed.', 5000, true);
            }
        } catch (error) {
            console.error('Closing action failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000, true);
            setIsLoading(false);
        }
    };

    const getDateField = (date: Date | null): string => {
        if (date === null) {
            return '-';
        }
        return getFormattedDate(date);
    };

    if (!actionDetails || isLoading) {
        return <Spinner />;
    }

    if (showEditMode) {
        return (
            <CreateOrEditAction
                tagId={tagId}
                isVoided={isVoided}
                actionId={actionId}
                title={actionDetails.title}
                description={actionDetails.description}
                dueTimeUtc={actionDetails.dueTimeUtc}
                rowVersion={actionDetails.rowVersion}
                backToParentView={(): void => {
                    getActionList();
                    setShowEditMode(false);
                }}
                setDirty={setDirty}
            />
        );
    }

    return (
        <Container isClosed={actionDetails.isClosed}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Section>
                    <Typography variant="caption">Due date</Typography>
                    <Typography variant="body_short">
                        {getDateField(actionDetails.dueTimeUtc)}
                    </Typography>
                </Section>
                {!isVoided && !actionDetails.isClosed && (
                    <IconContainer>
                        <StyledButton
                            data-testid="editIcon"
                            variant="ghost"
                            onClick={(): void => setShowEditMode(true)}
                        >
                            {editIcon}
                        </StyledButton>
                    </IconContainer>
                )}
            </div>
            {actionDetails.isClosed && (
                <Section>
                    <div>
                        <GridRow>
                            <Typography
                                variant="caption"
                                style={{ gridColumn: '1', gridRow: '1' }}
                            >
                                Closed at
                            </Typography>
                            <Typography
                                variant="caption"
                                style={{ gridColumn: '2', gridRow: '1' }}
                            >
                                Closed by
                            </Typography>
                            <Typography
                                variant="body_short"
                                style={{ gridColumn: '1', gridRow: '2' }}
                            >
                                {getDateField(actionDetails.closedAtUtc)}
                            </Typography>
                            <Typography
                                variant="body_short"
                                style={{ gridColumn: '2', gridRow: '2' }}
                            >
                                {actionDetails.closedBy.firstName}{' '}
                                {actionDetails.closedBy.lastName}
                            </Typography>
                        </GridRow>
                    </div>
                </Section>
            )}
            {actionDetails.createdAtUtc && (
                <Section>
                    <div>
                        <GridRow>
                            <Typography
                                variant="caption"
                                style={{ gridColumn: '1', gridRow: '1' }}
                            >
                                Added at
                            </Typography>
                            <Typography
                                variant="caption"
                                style={{ gridColumn: '2', gridRow: '1' }}
                            >
                                Added by
                            </Typography>
                            <Typography
                                variant="body_short"
                                style={{ gridColumn: '1', gridRow: '2' }}
                            >
                                {getDateField(actionDetails.createdAtUtc)}
                            </Typography>
                            <Typography
                                variant="body_short"
                                style={{ gridColumn: '2', gridRow: '2' }}
                            >
                                {actionDetails.createdBy.firstName}{' '}
                                {actionDetails.createdBy.lastName}
                            </Typography>
                        </GridRow>
                    </div>
                </Section>
            )}
            {actionDetails.modifiedAtUtc && (
                <Section>
                    <div>
                        <GridRow>
                            <Typography
                                variant="caption"
                                style={{ gridColumn: '1', gridRow: '1' }}
                            >
                                Modified at
                            </Typography>
                            <Typography
                                variant="caption"
                                style={{ gridColumn: '2', gridRow: '1' }}
                            >
                                Modified by
                            </Typography>
                            <Typography
                                variant="body_short"
                                style={{ gridColumn: '1', gridRow: '2' }}
                            >
                                {getDateField(actionDetails.modifiedAtUtc)}
                            </Typography>
                            <Typography
                                variant="body_short"
                                style={{ gridColumn: '2', gridRow: '2' }}
                            >
                                {actionDetails.modifiedBy.firstName}{' '}
                                {actionDetails.modifiedBy.lastName}
                            </Typography>
                        </GridRow>
                    </div>
                </Section>
            )}
            <Section>
                <Typography variant="caption">Description</Typography>
                <Typography variant="body_short">
                    {actionDetails.description}
                </Typography>
            </Section>

            <Section>
                <Typography variant="caption">Attachments</Typography>
                <ActionAttachments
                    tagId={tagId}
                    isVoided={isVoided}
                    actionId={actionId}
                    enableActions={false}
                />
            </Section>

            {!actionDetails.isClosed && (
                <Section>
                    <div
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                        <Button disabled={isVoided} onClick={closeAction}>
                            Close action
                        </Button>
                    </div>
                </Section>
            )}
        </Container>
    );
};

export default ActionExpanded;
