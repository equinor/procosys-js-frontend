import React, { useState, useEffect } from 'react';

import { Container, Header, Tabs, StatusLabel, HeaderActions, HeaderNotification, NotificationIcon } from './TagFlyout.style';
import PreservationTab from './PreservationTab/PreservationTab';
import CloseIcon from '@material-ui/icons/Close';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';
import NotificationsOutlinedIcon from '@material-ui/icons/NotificationsOutlined';
import { Button, Typography } from '@equinor/eds-core-react';
import { usePreservationContext } from '../../../context/PreservationContext';
import { showSnackbarNotification } from './../../../../../core/services/NotificationService';
import { TagDetails } from './types';
import Spinner from '../../../../../components/Spinner';

enum PreservationStatus {
    NotStarted,
    Active,
    Completed,
    Unknown
}

interface TagFlyoutProps {
    close: () => void;
    tagId: number;
}

const TagFlyout = ({
    close,
    tagId
}: TagFlyoutProps): JSX.Element => {
    const [activeTab, setActiveTab] = useState<string>('preservation');
    const [tagDetails, setTagDetails] = useState<TagDetails | null>(null);
    const [isPreservingTag, setIsPreservingTag] = useState<boolean>(false);
    const [isStartingPreservation, setIsStartingPreservation] = useState<boolean>(false);
    const { apiClient } = usePreservationContext();

    const getTagDetails = async (): Promise<void> => {
        try {
            const tagDetails = await apiClient.getTagDetails(tagId);
            setTagDetails(tagDetails);
        }
        catch (error) {
            console.error(`Get TagDetails failed: ${error.message}`);
            showSnackbarNotification(error.message, 5000, true);
        }
    };

    useEffect(() => {
        getTagDetails();
    }, [tagId]);

    const preserveTag = async (): Promise<void> => {
        try {
            setIsPreservingTag(true);
            await apiClient.preserveSingleTag(tagId);
            showSnackbarNotification('Tag has been preserved for this week.', 5000, true);
        }
        catch (error) {
            console.error(`Preserve tag failed: ${error.message}`);
            showSnackbarNotification(error.message, 5000, true);
        }
        finally {
            setIsPreservingTag(false);
            getTagDetails();
        }
    };

    const startPreservation = async (): Promise<void> => {
        try {
            setIsStartingPreservation(true);
            await apiClient.startPreservationForTag(tagId);
            showSnackbarNotification('Status was set to \'Active\' for this tag.', 5000, true);
        }
        catch (error) {
            console.error(`Preserve tag failed: ${error.message}`);
            showSnackbarNotification(error.message, 5000, true);
        }
        finally {
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

    const getTagStatus = (): PreservationStatus => {
        if (tagDetails)
        {
            switch (tagDetails.status.toLowerCase()) {
                case 'notstarted':
                    return PreservationStatus.NotStarted;
                case 'active':
                    return PreservationStatus.Active;
                case 'completed':
                    return PreservationStatus.Completed;                
            }
        }

        return PreservationStatus.Unknown;
    };

    const preservationIsNotStarted = (): boolean => getTagStatus() === PreservationStatus.NotStarted;
    const preservationIsStarted = (): boolean => getTagStatus() === PreservationStatus.Active;

    const getTabContent = (): JSX.Element => {
        switch (activeTab) {
            case 'preservation':
                return <PreservationTab tagDetails={tagDetails} refreshTagDetails={getTagDetails} />;
            case 'actions':
                return <div></div>;
            case 'attachments':
                return <div></div>;
            case 'history':
                return <div></div>;
            default:
                return <div>Unknown</div>;
        }
    };

    return (
        <Container>
            {
                preservationIsNotStarted() &&
                <HeaderNotification>
                    <NotificationIcon>
                        <NotificationsOutlinedIcon />
                    </NotificationIcon>
                    <Typography variant='body_long' style={{marginLeft: 'calc(var(--grid-unit) * 2)'}}>
                        This tag is not being preserved yet. Click start preservation to enable writing preservation records.
                    </Typography>                
                </HeaderNotification>
            }
            <Header>
                <h1>
                    {tagDetails ? tagDetails.tagNo : '-'}
                </h1>
                <HeaderActions>
                    {preservationIsStarted() &&
                        <Button 
                            disabled={!isPreserveTagButtonEnabled()}
                            onClick={preserveTag}
                        >
                            {isPreservingTag && (
                                <span style={{display: 'flex', alignItems: 'center'}}>
                                    <span style={{marginBottom: '4px'}}><Spinner /></span> Preserved this week
                                </span>
                            )}
                            {!isPreservingTag && ('Preserved this week')}
                        </Button>}
                    {preservationIsNotStarted() &&
                        <Button 
                            variant='ghost' 
                            title='Start preservation' 
                            disabled={isStartingPreservation}
                            onClick={startPreservation}
                        >
                            <PlayArrowOutlinedIcon />
                        </Button>}      
                    <Button variant='ghost' title='Close' onClick={close}>
                        <CloseIcon />
                    </Button>                            
                </HeaderActions>                        
            </Header>
            <StatusLabel status={tagDetails && tagDetails.status}>
                <span style={{margin: '0 var(--grid-unit)'}}>
                    {tagDetails && tagDetails.status}
                </span>
            </StatusLabel>            
            <Tabs>
                <a 
                    className={activeTab === 'preservation' ? 'active': 'preservation'} 
                    onClick={(): void => setActiveTab('preservation')}>
                            Preservation
                </a>
                <a 
                    className={activeTab === 'actions' ? 'active': 'actions'}
                    onClick={(): void => setActiveTab('actions')}>
                            Actions
                </a>
                <a 
                    className={activeTab === 'attachments' ? 'active': 'attachments'}
                    onClick={(): void => setActiveTab('attachments')}>
                            Attachments
                </a>
                <a 
                    className={activeTab === 'history' ? 'active': 'history'}
                    onClick={(): void => setActiveTab('history')}>
                            History
                </a>
            </Tabs>
            {
                getTabContent()
            }
        </Container>
    );   
};

export default TagFlyout;