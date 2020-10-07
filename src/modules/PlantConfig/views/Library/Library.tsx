import { Container, Divider, LibraryItemContainer } from './Library.style';
import React, { useEffect, useState } from 'react';

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
    NOT_SELECTED = 'NotSelected'
}

const Library = (): JSX.Element => {

    const [selectedLibraryType, setSelectedLibraryType] = useState('');
    const [selectedLibraryItem, setSelectedLibraryItem] = useState('');
    const [dirtyLibraryType, setDirtyLibraryType] = useState('');
    const [forceUpdate, setForceUpdate] = useState<boolean>(false);

    const match = useRouteMatch();
    const params: any = match.params;

    useEffect(() => {
        setSelectedLibraryType(params.libraryType);
    }, []);

    return (
        <Container>
            <LibraryTreeview
                setForceUpdate={setForceUpdate}
                setSelectedLibraryType={setSelectedLibraryType}
                setSelectedLibraryItem={setSelectedLibraryItem}
                dirtyLibraryType={dirtyLibraryType}
                resetDirtyLibraryType={(): void => setDirtyLibraryType('')}
            />

            <Divider />
            <LibraryItemContainer addPaddingRight={selectedLibraryType != LibraryType.TAG_FUNCTION}>
                <LibraryItemDetails
                    forceUpdate={forceUpdate}
                    libraryType={selectedLibraryType}
                    libraryItem={selectedLibraryItem}
                    setSelectedLibraryType={setSelectedLibraryType}
                    setDirtyLibraryType={setDirtyLibraryType}
                />
            </LibraryItemContainer>

        </Container>
    );
};

export default hot(module)(Library);
