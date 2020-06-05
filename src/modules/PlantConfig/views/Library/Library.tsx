import { hot } from 'react-hot-loader';
import React, { useEffect, useState } from 'react';
//import withAccessControl from '../../../../core/security/withAccessControl';
import LibraryItemDetails from './LibraryItemDetails';
import LibraryTreeview from './LibraryTreeview/LibraryTreeview';
import { Container, Divider } from './Library.style';
import { useHistory } from 'react-router-dom';

export enum LibraryType {
    TAG_FUNCTION = 'TagFunction',
    MODE = 'Mode',
    PRES_JOURNEY = 'PresJourney',
    PRES_REQUIREMENT_TYPE = 'PresReqType',
    PRES_REQUIREMENT_DEFINITION = 'PresReqDef',
    NOT_SELECTED = 'NotSelected'
}

const Library = (): JSX.Element => {

    const history = useHistory();

    const [selectedLibraryType, setSelectedLibraryType] = useState<string>('');
    const [selectedLibraryItem, setSelectedLibraryItem] = useState<string>('');

    useEffect(() => {
        history.replace('/Library/');
    }, []);

    return (
        <Container>
            <LibraryTreeview setSelectedLibraryType={setSelectedLibraryType} setSelectedLibraryItem={setSelectedLibraryItem} />

            <Divider />

            <LibraryItemDetails libraryType={selectedLibraryType} libraryItem={selectedLibraryItem} />

        </Container>
    );
};

export default hot(module)(Library);
