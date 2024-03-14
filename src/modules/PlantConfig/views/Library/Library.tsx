import { Container, Divider, LibraryItemContainer } from './Library.style';
import React, { useEffect, useReducer, useState } from 'react';

import { Helmet } from 'react-helmet';
//import withAccessControl from '../../../../core/security/withAccessControl';
import LibraryItemDetails from './LibraryItemDetails';
import LibraryTreeview from './LibraryTreeview/LibraryTreeview';
import { hot } from 'react-hot-loader';
import { useRouteMatch } from 'react-router-dom';

import { Route, Switch } from 'react-router-dom';
import { TreeViewNode } from '@procosys/components/TreeView/TreeView';

export enum LibraryType {
    TAG_FUNCTION = 'TagFunction',
    MODE = 'Mode',
    PRES_JOURNEY = 'PresJourney',
    PRES_REQUIREMENT = 'PresRequirement',
    PRES_REQUIREMENT_TYPE = 'PresReqType',
    PRES_REQUIREMENT_DEFINITION = 'PresReqDef',
    NOT_SELECTED = 'NotSelected',
}

const Library = (): JSX.Element => {
    const [selectedLibraryType, setSelectedLibraryType] = useState('');
    const [selectedLibraryItem, setSelectedLibraryItem] = useState('');
    const [dirtyLibraryType, setDirtyLibraryType] = useState('');
    const [update, forceUpdate] = useReducer((x) => x + 1, 0); // Used to force an update on library content pane for top level tree nodes
    const [isLoadingRootNodes, setIsLoadingRootNodes] = useState(true);
    const [rootNodes, setRootNodes] = useState<TreeViewNode[]>([]);

    const match = useRouteMatch();
    const params: any = match.params;

    useEffect(() => {
        const loadRootNodes = async () => {
            const nodes = await import(
                '@procosys/components/TreeView/TreeView.stories'
            ).then((module) => module.rootNodes);
            setRootNodes(nodes);
            setIsLoadingRootNodes(false);
        };
        loadRootNodes();
    }, []);

    useEffect(() => {
        if (!isLoadingRootNodes) {
            params.libraryType && setSelectedLibraryType(params.libraryType);
        }
    }, [params.libraryType, isLoadingRootNodes]);

    const findNodeIdInUrl = () => {
        if (isLoadingRootNodes) return '';

        const url = window.location.pathname;
        const decodedUrl = decodeURIComponent(url);
        const partsUrl = decodedUrl.split('/');
        for (const partUrl of partsUrl) {
            const foundNode = rootNodes.find((node) =>
                partUrl.includes(node.name)
            );
            if (foundNode) {
                return foundNode.id.toString();
            }
        }
        return '';
    };

    useEffect(() => {
        if (!isLoadingRootNodes) {
            const nodeIdInUrl = findNodeIdInUrl();
            const nodeIdNumber = extractNodeIdNumberFromUrl();
            setSelectedLibraryType(nodeIdInUrl);
            setSelectedLibraryItem(nodeIdNumber);
        }
    }, [isLoadingRootNodes]);

    const extractNodeIdNumberFromUrl = () => {
        const url = window.location.pathname;
        const partsUrl = url.split('_');
        const numberUrl = partsUrl[partsUrl.length - 1].split('/')[0];
        return numberUrl;
    };

    if (isLoadingRootNodes) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            {selectedLibraryType && (
                <Helmet>
                    <title>{` - ${selectedLibraryType}`}</title>
                </Helmet>
            )}
            <LibraryTreeview
                forceUpdate={forceUpdate}
                setSelectedLibraryType={setSelectedLibraryType}
                setSelectedLibraryItem={setSelectedLibraryItem}
                dirtyLibraryType={dirtyLibraryType}
                resetDirtyLibraryType={(): void => setDirtyLibraryType('')}
            />

            <Divider />
            <Switch>
                <Route
                    path={`/`}
                    component={() => (
                        <LibraryItemContainer
                            addPaddingRight={
                                selectedLibraryType !== LibraryType.TAG_FUNCTION
                            }
                        >
                            <LibraryItemDetails
                                forceUpdate={update}
                                libraryType={selectedLibraryType}
                                libraryItem={selectedLibraryItem}
                                setSelectedLibraryType={setSelectedLibraryType}
                                setSelectedLibraryItem={setSelectedLibraryItem}
                                setDirtyLibraryType={setDirtyLibraryType}
                            />
                        </LibraryItemContainer>
                    )}
                />
            </Switch>
        </Container>
    );
};

export default hot(module)(Library);
