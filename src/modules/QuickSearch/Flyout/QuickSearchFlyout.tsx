import React, { useEffect, useState } from 'react';
import { ContentDocument } from '../http/QuickSearchApiClient';
import CommPkgTab from './CommPkgTab/CommPkgTab';
import RelatedMCPkgTab from './CommPkgTab/RelatedMCPkgTab';
import MCPkgTab from './MCPkgTab/MCPkgTab';
import { Tabs } from './style';

export interface QuickSearchFlyoutProps {
    item: ContentDocument;
    searchValue: string;
    highlightOn: boolean;
}

const QuickSearchFlyout = ({ item, searchValue, highlightOn }: QuickSearchFlyoutProps): JSX.Element => {
    const [activeTab, setActiveTab] = useState<string>('info');

    useEffect(() => {
        setActiveTab('info');
    }, [item]);
    
    const getTabContent = (): JSX.Element => {

        switch (activeTab) {
            case 'info': {
                if (item.commPkg) {
                    return <CommPkgTab highlightOn={highlightOn} searchValue={searchValue} commPkg={item} />
                }
                return <MCPkgTab highlightOn={highlightOn} searchValue={searchValue} mcPkg={item} />
            }
            case 'related': {
                if (item.commPkg) {
                    return <RelatedMCPkgTab highlightOn={highlightOn} searchValue={searchValue} commPkg={item} />
                }
                return <></>;
            }
            default:
                return <></>;
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