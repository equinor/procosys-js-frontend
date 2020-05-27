import React, { useEffect, useState } from 'react';
//import withAccessControl from '../../../../core/security/withAccessControl';
import LibraryItemDetails from './LibraryItemDetails';
import LibraryTreeview from './LibraryTreeview/LibraryTreeview';
import { useRouteMatch } from 'react-router-dom';
import { Container, Divider } from './Library.style';


export enum LibraryType {
    TAG_FUNCTION = 'TagFunction',
    MODE = 'Mode',
    PRES_JOURNEY = 'PresJourney',
    PRES_REQUIREMENT_TYPE = 'PresReqType',
    PRES_REQUIREMENT_DEFINITION = 'PresReqDef',
    NOT_SELECTED = 'NotSelected'
}

const Library = (): JSX.Element => {

    const [selectedLibraryType, setSelectedLibraryType] = useState<string | null>(null);
    const [selectedLibraryItem, setSelectedLibraryItem] = useState<string | null>(null);

    const match = useRouteMatch();
    const params: any = match.params;

    useEffect(() => {
        setSelectedLibraryType(params.libraryType);
    }, []);

    return (
        <Container>
            <LibraryTreeview setSelectedLibraryType={setSelectedLibraryType} setSelectedLibraryItem={setSelectedLibraryItem} />

            <Divider />

            {selectedLibraryType && <LibraryItemDetails libraryType={selectedLibraryType} libraryItem={selectedLibraryItem} />}
        </Container>
    );
};

export default Library;
