import React, { MouseEvent, useState, useRef, useEffect } from 'react';

import { Container, Flyout, FlyoutHeader, FlyoutTabs, StatusLabel, HeaderActions } from './TagFlyout.style';
import Preservation from './Preservation/Preservation';
import CloseIcon from '@material-ui/icons/Close';
import { Button } from '@equinor/eds-core-react';
import Spinner from '../../../../../components/Spinner';
import { usePreservationContext } from '../../../context/PreservationContext';
import { showSnackbarNotification } from './../../../../../core/services/NotificationService';
import { TagDetails } from './types';

interface TagFlyoutProps {
    setDisplayFlyout: (displayFlyout: boolean) => void;
    tagId: number | null;
}

const TagFlyout = ({
    setDisplayFlyout,
    tagId
}: TagFlyoutProps): JSX.Element => {
    const [activeTab, setActiveTab] = useState<string>('preservation');
    const [isLoading, setIsLoading] = useState<boolean>();
    const [tagDetails, setTagDetails] = useState<TagDetails>();
    const flyoutRef = useRef<HTMLDivElement>(null);
    const { apiClient } = usePreservationContext();

    // fade-in effect
    useEffect((): void => {
        setTimeout((): void => {
            if (flyoutRef.current) {
                flyoutRef.current.style.opacity = '1';
            }
        }, 1);
    }, [flyoutRef]);

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
    }, [flyoutRef]);

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
        <Container onMouseDown={(): void => setDisplayFlyout(false)}>
            <Flyout ref={flyoutRef} onMouseDown={(event: MouseEvent): void => event.stopPropagation()}>
                <FlyoutHeader>
                    <h1>
                        {tagDetails && tagDetails.tagNo}
                    </h1>
                    <StatusLabel status={tagDetails && tagDetails.status}>
                        <span style={{marginLeft: '8px', marginRight: '8px'}}>
                            {tagDetails && tagDetails.status}
                        </span>
                    </StatusLabel>
                    <HeaderActions>
                        <Button variant='ghost' title='Close' onClick={(): void => setDisplayFlyout(false)}>
                            <CloseIcon />
                        </Button>                            
                    </HeaderActions>                        
                </FlyoutHeader>
                <FlyoutTabs>
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
                </FlyoutTabs>
                {
                    getTabContent()
                }
            </Flyout>
        </Container>
    );   
};

export default TagFlyout;