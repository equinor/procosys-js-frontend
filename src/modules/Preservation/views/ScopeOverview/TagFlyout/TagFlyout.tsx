import React, { MouseEvent, useState, useRef, useEffect } from 'react';

import { Container, Flyout, FlyoutHeader, FlyoutTabs, StatusLabel, HeaderActions } from './TagFlyout.style';
import Preservation from './Preservation/Preservation';
import CloseIcon from '@material-ui/icons/Close';
import { Button } from '@equinor/eds-core-react';

interface TagFlyoutProps {
    displayFlyout: boolean;
    setDisplayFlyout: (displayFlyout: boolean) => void;
    tagNo: string | undefined;
}

const TagFlyout = ({
    displayFlyout,
    setDisplayFlyout,
    tagNo
}: TagFlyoutProps): JSX.Element => {
    const [activeTab, setActiveTab] = useState<string>('preservation');
    const flyoutRef = useRef<HTMLDivElement>(null);

    // fade-in effect
    useEffect((): void => {
        setTimeout((): void => {
            if (flyoutRef.current) {
                flyoutRef.current.style.opacity = '1';
            }
        }, 1);
    }, [displayFlyout]);

    const getTabContent = (): JSX.Element => {
        switch (activeTab) {
            case 'preservation':
                return <Preservation />;
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

    if (displayFlyout) {
        return (
            <Container onMouseDown={(): void => setDisplayFlyout(false)}>
                <Flyout ref={flyoutRef} onMouseDown={(event: MouseEvent): void => event.stopPropagation()}>
                    <FlyoutHeader>
                        <h1>{tagNo}</h1>
                        <StatusLabel>
                            <span style={{marginLeft: '8px', marginRight: '8px'}}>Status</span>
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
    } else {
        return <div />;
    }        
};

export default TagFlyout;