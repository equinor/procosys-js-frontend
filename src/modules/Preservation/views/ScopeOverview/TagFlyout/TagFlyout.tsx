import {
    Container,
    Header,
    HeaderActions,
    HeaderNotification,
    NotificationIcon,
    StatusLabel,
    StyledButton,
    Tabs,
    TagNoContainer,
    TagsGrid,
} from './TagFlyout.style';
import React, { useEffect, useState } from 'react';

import ActionTab from './ActionTab/ActionTab';
import AttachmentTab from './AttachmentTab/AttachmentTab';
import { Canceler } from 'axios';
import HistoryTab from './HistoryTab/HistoryTab';
import PreservationTab from './PreservationTab/PreservationTab';
import Spinner from '../../../../../components/Spinner';
import { TagDetails } from './types';
import { Typography } from '@equinor/eds-core-react';
import { showSnackbarNotification } from './../../../../../core/services/NotificationService';
import { useCurrentPlant } from '@procosys/core/PlantContext';
import { usePreservationContext } from '../../../context/PreservationContext';
import { useProcosysContext } from '@procosys/core/ProcosysContext';
import {
    NotificationsOutlined,
    PlayArrowOutlined,
    Close,
} from '@mui/icons-material';

enum PreservationStatus {
    NotStarted = 'Not started',
    Active = 'Active',
    Completed = 'Completed',
    Unknown = 'Unknown',
}

interface TagFlyoutProps {
    tagId: number;
    close: () => void;
    setDirty: () => void;
}

const TagFlyout = ({ tagId, close, setDirty }: TagFlyoutProps): JSX.Element => {
    const [activeTab, setActiveTab] = useState<string>('preservation');
    const [tagDetails, setTagDetails] = useState<TagDetails | null>(null);
    const [mainTagId, setMainTagId] = useState<number>();
    const [isPreservingTag, setIsPreservingTag] = useState<boolean>(false);
    const [isStartingPreservation, setIsStartingPreservation] =
        useState<boolean>(false);
    const { apiClient, project } = usePreservationContext();
    const { procosysApiClient } = useProcosysContext();
    const { plant } = useCurrentPlant();

    const getTagDetails = async (): Promise<void> => {
        try {
            const details = await apiClient.getTagDetails(tagId);
            setTagDetails(details);
            console.log(details);
        } catch (error) {
            console.error(`Get tag details failed: ${error.message}`);
            showSnackbarNotification(error.message, 5000, true);
        }
    };

    const isStandardTag = (): boolean =>
        tagDetails ? tagDetails.tagType === 'Standard' : false;

    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            if (tagDetails && isStandardTag()) {
                try {
                    const tag = await procosysApiClient.getTagId(
                        [tagDetails.tagNo],
                        project.name,
                        (cancel: Canceler) => (requestCancellor = cancel)
                    );
                    if (tag.length > 0) {
                        setMainTagId(tag[0].id);
                    }
                } catch (error) {
                    console.error(`Getting tag id failed: ${error.message}`);
                    showSnackbarNotification(error.message);
                }
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, [tagDetails]);

    useEffect(() => {
        getTagDetails();
    }, [tagId]);

    const preserveTag = async (): Promise<void> => {
        try {
            setIsPreservingTag(true);
            await apiClient.preserveSingleTag(tagId);

            setDirty();
            showSnackbarNotification(
                'This tag has been preserved.',
                5000,
                true
            );
        } catch (error) {
            console.error(`Preserve tag failed: ${error.message}`);
            showSnackbarNotification(error.message, 5000, true);
        } finally {
            setIsPreservingTag(false);
            getTagDetails();
        }
    };

    const startPreservation = async (): Promise<void> => {
        try {
            setIsStartingPreservation(true);
            await apiClient.startPreservationForTag(tagId);

            setDirty();
            showSnackbarNotification(
                "Status was set to 'Active' for this tag.",
                5000,
                true
            );
        } catch (error) {
            console.error(
                `Start preservation for tag failed: ${error.message}`
            );
            showSnackbarNotification(error.message, 5000, true);
        } finally {
            setIsStartingPreservation(false);
            getTagDetails();
        }
    };

    const isPreserveTagButtonEnabled = (): boolean => {
        if (!tagDetails || isPreservingTag) {
            return false;
        }

        return tagDetails.readyToBePreserved;
    };

    const preservationIsNotStarted = tagDetails
        ? tagDetails.status === PreservationStatus.NotStarted
        : false;
    const preservationIsStarted = tagDetails
        ? tagDetails.status === PreservationStatus.Active
        : false;
    const isVoided = tagDetails ? tagDetails.isVoided : false;
    const isVoidedInSource = tagDetails ? tagDetails.isVoidedInSource : false;
    const isDeletedInSource = tagDetails ? tagDetails.isDeletedInSource : false;

    const getTabContent = (): JSX.Element => {
        switch (activeTab) {
            case 'preservation': {
                if (tagDetails === null) {
                    return (
                        <div
                            style={{
                                margin: 'calc(var(--grid-unit) * 5) auto',
                            }}
                        >
                            <Spinner medium />
                        </div>
                    );
                }

                return (
                    <PreservationTab
                        tagDetails={tagDetails}
                        refreshTagDetails={getTagDetails}
                        setDirty={setDirty}
                    />
                );
            }
            case 'actions': {
                return (
                    <ActionTab
                        tagId={tagId}
                        isVoided={tagDetails ? tagDetails.isVoided : false}
                        setDirty={setDirty}
                    />
                );
            }
            case 'attachments':
                return (
                    <AttachmentTab
                        tagId={tagId}
                        isVoided={tagDetails ? tagDetails.isVoided : false}
                    />
                );
            case 'history':
                return <HistoryTab tagId={tagId} />;
            default:
                return <div>Unknown</div>;
        }
    };

    return (
        <Container>
            {!isVoided && preservationIsNotStarted && (
                <HeaderNotification>
                    <NotificationIcon>
                        <NotificationsOutlined />
                    </NotificationIcon>
                    <Typography
                        variant="body_long"
                        style={{ marginLeft: 'calc(var(--grid-unit) * 2)' }}
                    >
                        This tag is not being preserved yet. Click start
                        preservation to enable writing preservation records.
                    </Typography>
                </HeaderNotification>
            )}
            <Header>
                <TagNoContainer isStandardTag={isStandardTag()}>
                    <a
                        href={
                            mainTagId
                                ? `/${plant.pathId}/Completion#Tag|${mainTagId}`
                                : ''
                        }
                    >
                        <Typography variant="h1">
                            {tagDetails ? tagDetails.tagNo : '-'}
                        </Typography>
                    </a>
                </TagNoContainer>
                <HeaderActions>
                    {!isVoided && preservationIsStarted && (
                        <StyledButton
                            disabled={!isPreserveTagButtonEnabled()}
                            onClick={preserveTag}
                        >
                            {isPreservingTag && (
                                <span
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <span style={{ marginBottom: '4px' }}>
                                        <Spinner />
                                    </span>{' '}
                                    Preserved this week
                                </span>
                            )}
                            {!isPreservingTag && 'Preserved this week'}
                        </StyledButton>
                    )}
                    {!isVoided && preservationIsNotStarted && (
                        <StyledButton
                            variant="ghost"
                            title="Start preservation"
                            disabled={isStartingPreservation}
                            onClick={startPreservation}
                        >
                            <PlayArrowOutlined />
                        </StyledButton>
                    )}
                    <StyledButton variant="ghost" title="Close" onClick={close}>
                        <Close />
                    </StyledButton>
                </HeaderActions>
            </Header>
            <TagsGrid>
                <StatusLabel
                    status={
                        isVoided ? 'Voided' : tagDetails && tagDetails.status
                    }
                >
                    <span style={{ margin: '0 var(--grid-unit)' }}>
                        {isVoided ? 'Voided' : tagDetails && tagDetails.status}
                    </span>
                </StatusLabel>
                {isVoidedInSource && (
                    <StatusLabel status={'Voided in source'}>
                        <span style={{ margin: '0 var(--grid-unit)' }}>
                            {isVoidedInSource ? 'Voided in source' : ''}
                        </span>
                    </StatusLabel>
                )}
                {isDeletedInSource && (
                    <StatusLabel
                        status={isDeletedInSource ? 'Deleted in source' : ''}
                    >
                        <span style={{ margin: '0 var(--grid-unit)' }}>
                            {isDeletedInSource ? 'Deleted in source' : ''}
                        </span>
                    </StatusLabel>
                )}
            </TagsGrid>
            <Tabs>
                <a
                    className={
                        activeTab === 'preservation' ? 'active' : 'preservation'
                    }
                    onClick={(): void => setActiveTab('preservation')}
                >
                    Preservation
                </a>
                <a
                    className={activeTab === 'actions' ? 'active' : 'actions'}
                    onClick={(): void => setActiveTab('actions')}
                >
                    Preservation actions
                </a>
                <a
                    className={
                        activeTab === 'attachments' ? 'active' : 'attachments'
                    }
                    onClick={(): void => setActiveTab('attachments')}
                >
                    Attachments
                </a>
                <a
                    className={activeTab === 'history' ? 'active' : 'history'}
                    onClick={(): void => setActiveTab('history')}
                >
                    History
                </a>
            </Tabs>
            {getTabContent()}
        </Container>
    );
};

export default TagFlyout;
