import React, { useState, useEffect } from 'react';

import { Container, Header, Tabs, StatusLabel, HeaderActions } from './TagFlyout.style';
import PreservationTab from './PreservationTab/PreservationTab';
import CloseIcon from '@material-ui/icons/Close';
import { Button } from '@equinor/eds-core-react';
import Spinner from '../../../../../components/Spinner';
import { usePreservationContext } from '../../../context/PreservationContext';
import { showSnackbarNotification } from './../../../../../core/services/NotificationService';
import { TagDetails, TagRequirement } from './types';

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
    const [tagRequirements, setTagRequirements] = useState<TagRequirement[]>();
    const { apiClient } = usePreservationContext();

    const getTagDetails = async (id: number): Promise<void> => {
        try {            
            setIsLoading(true);
            const tagDetails = await apiClient.getTagDetails(id);
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

    const getTagRequirements = async (id: number): Promise<void> => {
        try {            
            const tagRequirements = await apiClient.getTagRequirements(id);
            setTagRequirements(tagRequirements);
        }
        catch (error) {
            console.error(`Get TagRequirements failed: ${error.message}`);
            showSnackbarNotification(error.message, 5000);
        }
    };

    useEffect(() => {
        if (tagId !== null) {
            getTagDetails(tagId);
        }
    }, [tagId]);

    useEffect(() => {
        if (tagId !== null) {
            getTagRequirements(tagId);
        }
    }, [tagId]);    

    const getTabContent = (): JSX.Element => {
        if (isLoading) {
            return (
                <div style={{margin: 'calc(var(--grid-unit) * 5) auto'}}><Spinner medium /></div>
            );
        }

        switch (activeTab) {
            case 'preservation':
                return <PreservationTab details={tagDetails} requirements={tagRequirements} />;
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
                    <span style={{marginLeft: 'var(--grid-unit)', marginRight: 'var(--grid-unit)'}}>
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