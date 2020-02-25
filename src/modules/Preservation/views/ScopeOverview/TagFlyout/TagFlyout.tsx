import React, { useState, useEffect } from 'react';

import { Container, Header, Tabs, StatusLabel, HeaderActions, HeaderNotification, NotificationIcon } from './TagFlyout.style';
import PreservationTab from './PreservationTab/PreservationTab';
import CloseIcon from '@material-ui/icons/Close';
import NotificationsOutlinedIcon from '@material-ui/icons/NotificationsOutlined';
import { Button, Typography } from '@equinor/eds-core-react';
import { usePreservationContext } from '../../../context/PreservationContext';
import { showSnackbarNotification } from './../../../../../core/services/NotificationService';
import { TagDetails } from './types';
import Spinner from '../../../../../components/Spinner';

interface TagFlyoutProps {
    close: () => void;
    tagId: number | null;
}

const TagFlyout = ({
    close,
    tagId
}: TagFlyoutProps): JSX.Element => {
    const [activeTab, setActiveTab] = useState<string>('preservation');
    const [tagDetails, setTagDetails] = useState<TagDetails>();
    const [isLoadingPreserveTag, setIsLoadingPreserveTag] = useState<boolean>(false);
    const [updateRequirements, setUpdateRequirements] = useState<number>(0);
    const { apiClient } = usePreservationContext();

    const getTagDetails = async (): Promise<void> => {
        if (tagId !== null) {
            try {
                const tagDetails = await apiClient.getTagDetails(tagId);
                setTagDetails(tagDetails);
            }
            catch (error) {
                console.error(`Get TagDetails failed: ${error.message}`);
                showSnackbarNotification(error.message, 5000, true);
            }
        }
    };

    const preserveTag = async (): Promise<void> => {
        if (tagId !== null) {
            try {
                setIsLoadingPreserveTag(true);
                await apiClient.preserveSingleTag(tagId);
                showSnackbarNotification('Tag has been preserved for this week.', 5000, true);
            }
            catch (error) {
                console.error(`Preserve tag failed: ${error.message}`);
                showSnackbarNotification(error.message, 5000, true);
            }
            finally {
                setIsLoadingPreserveTag(false);
                setUpdateRequirements(updateRequirements + 1);
                getTagDetails();
            }
        }
    };

    useEffect(() => {
        getTagDetails();
    }, [tagId]);

    const getTabContent = (): JSX.Element => {
        switch (activeTab) {
            case 'preservation':
                return <PreservationTab 
                    tagId={tagId} 
                    tagDetails={tagDetails} 
                    getTagDetails={getTagDetails} 
                    updateRequirements={updateRequirements} 
                />;
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

    const showHeaderNotification = (): boolean => {
        if (tagDetails) {
            return tagDetails.status.toLowerCase() === 'notstarted';
        }

        return false;
    };

    const isPreserveTagButtonEnabled = (): boolean => {
        if (!tagDetails || isLoadingPreserveTag) {
            return false;
        }

        return tagDetails.readyToBePreserved;
    };

    return (
        <Container>
            {
                showHeaderNotification() &&
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
                    <Button 
                        disabled={!isPreserveTagButtonEnabled()}
                        onClick={preserveTag}
                    >
                        {isLoadingPreserveTag && (
                            <span style={{display: 'flex', alignItems: 'center'}}>
                                <span style={{marginBottom: '4px'}}><Spinner /></span> Preserved this week
                            </span>
                        )}
                        {!isLoadingPreserveTag && ('Preserved this week')}
                    </Button>                    
                    <Button variant='ghost' title='Close' onClick={close}>
                        <CloseIcon />
                    </Button>                            
                </HeaderActions>                        
            </Header>
            <StatusLabel status={tagDetails && tagDetails.status}>
                <span style={{marginLeft: 'var(--grid-unit)', marginRight: 'var(--grid-unit)'}}>
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