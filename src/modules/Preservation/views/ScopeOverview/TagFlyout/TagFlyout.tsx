import React, { MouseEvent, useState } from 'react';

import { Container, Flyout, FlyoutHeader, FlyoutTabs } from './TagFlyout.style';
import Preservation from './Preservation/Preservation';

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
                <Flyout onMouseDown={(event: MouseEvent): void => event.stopPropagation()}>
                    <FlyoutHeader>
                        <h1>{tagNo}</h1>
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