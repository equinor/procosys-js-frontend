import React, { useState } from 'react';
import { ContentDocument } from '../http/GlobalSearchApiClient';
import CommPkgTab from './CommPkgTab/CommPkgTab';
import RelatedMCPkgTab from './CommPkgTab/RelatedMCPkgTab';
import MCPkgTab from './MCPkgTab/MCPkgTab';
import RelatedCommPkgTab from './MCPkgTab/RelatedCommPkgTab';
import { Tabs } from './style';

export interface GlobalSearchFlyoutProps {
    item: ContentDocument;
}

const GlobalSearchFlyout = ({ item }: GlobalSearchFlyoutProps): JSX.Element => {
    const [activeTab, setActiveTab] = useState<string>('info');

    const getTabContent = (): JSX.Element => {

        switch (activeTab) {
            case 'info': {
                if (item.commPkg) {
                    return <CommPkgTab commPkg={item} />
                } else {
                    return <MCPkgTab mcPkg={item} />
                }

            }
            case 'related': {
                if (item.commPkg) {
                    return <RelatedMCPkgTab commPkg={item} />
                } else {
                    return <RelatedCommPkgTab mcPkg={item} />
                }
            }
            default:
                return <div>Unknown</div>;
        }
    };

    return (
        <>
            <Tabs>
                <a className={activeTab === 'info' ? 'active' : 'info'} onClick={(): void => setActiveTab('info')}>Info</a>
                {item.commPkg && (<a className={activeTab === 'related' ? 'active' : 'mcscope'} onClick={(): void => setActiveTab('related')}>MC Packages</a>)}
                {item.mcPkg && (<a className={activeTab === 'related' ? 'active' : 'commPkg'} onClick={(): void => setActiveTab('related')}>Comm package</a>)}
            </Tabs>
            {
                getTabContent()
            }
        </>
    );
};

export default GlobalSearchFlyout;