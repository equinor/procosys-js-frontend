import React, { useState, useEffect } from 'react';

import { Container, Header, Tabs, StatusLabel, HeaderActions } from './TagFlyout.style';
import Preservation from './Preservation/Preservation';
import CloseIcon from '@material-ui/icons/Close';
import { Button } from '@equinor/eds-core-react';
import Spinner from '../../../../../components/Spinner';
import { usePreservationContext } from '../../../context/PreservationContext';
import { showSnackbarNotification } from './../../../../../core/services/NotificationService';
import { TagDetails } from './types';

interface TagFlyoutProps {
    close: () => void;
    tagId: number | null;
}

const TagFlyout = ({
    close,
    tagId
}: TagFlyoutProps): JSX.Element => {
    const [activeTab, setActiveTab] = useState<string>('preservation');
    const [isLoading, setIsLoading] = useState<boolean>();
    const [tagDetails, setTagDetails] = useState<TagDetails>();
    const { apiClient } = usePreservationContext();

    const getTagDetails = async (id: number): Promise<void> => {
        try {            
            setIsLoading(true);
            const tagDetails = await apiClient.getPreservedTagDetails(id);
            setTagDetails(tagDetails);
        }
        catch (error) {
            console.error(`Get TagDetails failed: ${error.message}`);
            showSnackbarNotification(error.message, 5000);
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (tagId !== null) {
            getTagDetails(tagId);
        }
    }, [tagId]);

    const getTabContent = (): JSX.Element => {
        if (isLoading) {
            return (
                <div style={{margin: '40px auto'}}><Spinner medium /></div>
            );
        }

        switch (activeTab) {
            case 'preservation':
                return <Preservation details={tagDetails} />;
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
        <Container style={{display: 'flex', flexDirection: 'column'}}>
            <Header>
                <h1>
                    {tagDetails ? tagDetails.tagNo : '-'}
                </h1>
                <StatusLabel status={tagDetails && tagDetails.status}>
                    <span style={{marginLeft: '8px', marginRight: '8px'}}>
                        {tagDetails && tagDetails.status}
                    </span>
                </StatusLabel>
                <HeaderActions>
                    <Button variant='ghost' title='Close' onClick={close}>
                        <CloseIcon />
                    </Button>                            
                </HeaderActions>                        
            </Header>
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