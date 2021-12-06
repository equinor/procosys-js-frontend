import React, { useEffect, useState } from 'react';
import { ContentDocument } from '../http/QuickSearchApiClient';
import CommPkgTab from './CommPkgTab/CommPkgTab';
import RelatedMCPkgTab from './CommPkgTab/RelatedMCPkgTab';
import MCPkgTab from './MCPkgTab/MCPkgTab';
import PunchListItemTab from './PunchListItemTab/PunchListItemTab';
import { Tabs } from './style';
import TagTab from './TagTab/TagTab';

export interface QuickSearchFlyoutProps {
    item: ContentDocument;
    searchValue: string;
    highlightOn: boolean;
}

const QuickSearchFlyout = ({
    item,
    searchValue,
    highlightOn,
}: QuickSearchFlyoutProps): JSX.Element => {
    const [activeTab, setActiveTab] = useState<string>('info');

    useEffect(() => {
        setActiveTab('info');
    }, [item]);

    const getTabContent = (): JSX.Element => {
        switch (activeTab) {
            case 'info': {
                if (item.commPkg) {
                    return (
                        <CommPkgTab
                            highlightOn={highlightOn}
                            searchValue={searchValue}
                            commPkg={item}
                        />
                    );
                }

                if (item.mcPkg) {
                    return (
                        <MCPkgTab
                            highlightOn={highlightOn}
                            searchValue={searchValue}
                            mcPkg={item}
                        />
                    );
                }

                if (item.tag) {
                    return (
                        <TagTab
                            highlightOn={highlightOn}
                            searchValue={searchValue}
                            tag={item}
                        />
                    );
                }

                if (item.punchItem) {
                    return (
                        <PunchListItemTab
                            highlightOn={highlightOn}
                            searchValue={searchValue}
                            punchItem={item}
                        />
                    );
                }
                return <></>;
            }
            case 'related': {
                if (item.commPkg) {
                    return (
                        <RelatedMCPkgTab
                            highlightOn={highlightOn}
                            searchValue={searchValue}
                            commPkg={item}
                        />
                    );
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
                <a
                    className={activeTab === 'info' ? 'active' : 'info'}
                    onClick={(): void => setActiveTab('info')}
                >
                    Info
                </a>
                {item.commPkg && (
                    <a
                        className={
                            activeTab === 'related' ? 'active' : 'mcscope'
                        }
                        onClick={(): void => setActiveTab('related')}
                    >
                        MC Packages
                    </a>
                )}
            </Tabs>
            {getTabContent()}
        </>
    );
};

export default QuickSearchFlyout;
