import React, { useEffect, useState } from 'react';
import { ContentDocument } from '../http/QuickSearchApiClient';
import CommPkgTab from './CommPkgTab/CommPkgTab';
import RelatedMCPkgTab from './CommPkgTab/RelatedMCPkgTab';
import MCPkgTab from './MCPkgTab/MCPkgTab';
import { Tabs } from './style';

export interface QuickSearchFlyoutProps {
    item: ContentDocument;
}

const QuickSearchFlyout = ({ item }: QuickSearchFlyoutProps): JSX.Element => {
    const [activeTab, setActiveTab] = useState<string>('info');

    useEffect(() => {
        setActiveTab('info');
    }, [item]);
    
    const getTabContent = (): JSX.Element => {

        switch (activeTab) {
            case 'info': {
                if (item.commPkg) {
                    return <CommPkgTab commPkg={item} />
                }
                return <MCPkgTab mcPkg={item} />
            }
            case 'related': {
                if (item.commPkg) {
                    return <RelatedMCPkgTab commPkg={item} />
                }
                return <div></div>;
            }
            default:
                return <div></div>;
        }
    };

    return (
        <>
            <Tabs>
                <a className={activeTab === 'info' ? 'active' : 'info'} onClick={(): void => setActiveTab('info')}>Info</a>
                {item.commPkg && (<a className={activeTab === 'related' ? 'active' : 'mcscope'} onClick={(): void => setActiveTab('related')}>MC Packages</a>)}
            </Tabs>
            {
                getTabContent()
            }
        </>
    );
};

export default QuickSearchFlyout;