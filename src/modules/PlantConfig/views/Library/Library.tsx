import { Container, Divider, LibraryItemContainer } from './Library.style';
import React, { useEffect, useReducer, useState } from 'react';

import { Helmet } from 'react-helmet';
//import withAccessControl from '../../../../core/security/withAccessControl';
import LibraryItemDetails from './LibraryItemDetails';
import LibraryTreeview from './LibraryTreeview/LibraryTreeview';
import { hot } from 'react-hot-loader';
import { useRouteMatch } from 'react-router-dom';

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

    const match = useRouteMatch();
    const params: any = match.params;

    useEffect(() => {
        params.libraryType && setSelectedLibraryType(params.libraryType);
    }, []);

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
            <LibraryItemContainer
                addPaddingRight={
                    selectedLibraryType != LibraryType.TAG_FUNCTION
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
        </Container>
    );
};

export default hot(module)(Library);
