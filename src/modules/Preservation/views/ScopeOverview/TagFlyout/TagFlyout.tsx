import React, { useState, useEffect } from 'react';

import { Container, Header, Tabs, StatusLabel, HeaderActions } from './TagFlyout.style';
import PreservationTab from './PreservationTab/PreservationTab';
import ActionTab from './ActionTab/ActionTab';
import CloseIcon from '@material-ui/icons/Close';
import { Button } from '@equinor/eds-core-react';
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
    const [tagDetails, setTagDetails] = useState<TagDetails>();
    const { apiClient } = usePreservationContext();

    const getTagDetails = async (id: number): Promise<void> => {
        try {
            const tagDetails = await apiClient.getTagDetails(id);
            setTagDetails(tagDetails);
        }
        catch (error) {
            console.error(`Get TagDetails failed: ${error.message}`);
            showSnackbarNotification(error.message, 5000);
        }
    };

    useEffect(() => {
        if (tagId !== null) {
            getTagDetails(tagId);
        }
    }, [tagId]);

    const getTabContent = (): JSX.Element => {
        switch (activeTab) {
            case 'preservation':
                return <PreservationTab tagId={tagId} tagDetails={tagDetails} />;
            case 'actions':
                return <ActionTab tagId={tagId} />;
            case 'attachments':
                return <div></div>;
            case 'history':
                return <div></div>;
            default:
                return <div>Unknown</div>;
        }
    };

    return (
        <Container style={{ display: 'flex', flexDirection: 'column' }}>
            <Header>
                <h1>
                    {tagDetails ? tagDetails.tagNo : '-'}
                </h1>
                <StatusLabel status={tagDetails && tagDetails.status}>
                    <span style={{ marginLeft: 'var(--grid-unit)', marginRight: 'var(--grid-unit)' }}>
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
                    className={activeTab === 'preservation' ? 'active' : 'preservation'}
                    onClick={(): void => setActiveTab('preservation')}>
                    Preservation
                </a>
                <a
                    className={activeTab === 'actions' ? 'active' : 'actions'}
                    onClick={(): void => setActiveTab('actions')}>
                    Actions
                </a>
                <a
                    className={activeTab === 'attachments' ? 'active' : 'attachments'}
                    onClick={(): void => setActiveTab('attachments')}>
                    Attachments
                </a>
                <a
                    className={activeTab === 'history' ? 'active' : 'history'}
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