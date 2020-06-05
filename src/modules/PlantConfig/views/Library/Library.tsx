import { hot } from 'react-hot-loader';
import React, { useEffect, useState } from 'react';
//import withAccessControl from '../../../../core/security/withAccessControl';
import LibraryItemDetails from './LibraryItemDetails';
import LibraryTreeview from './LibraryTreeview/LibraryTreeview';
import { useRouteMatch } from 'react-router-dom';
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

    const match = useRouteMatch();
    const params: any = match.params;

    const history = useHistory();

    const [path, setPath] = useState<string>(params.path);
    const [selectedLibraryType, setSelectedLibraryType] = useState<string>(params.libraryType);
    const [selectedLibraryItem, setSelectedLibraryItem] = useState<string>(params.libraryItem);

    useEffect(() => {
        if(path && selectedLibraryType && selectedLibraryItem) {
            history.replace(`/Library/${path}/${selectedLibraryType}/${selectedLibraryItem}`);
        }
    }, [path]);

    useEffect(() => {
        history.replace('/Library/');
    }, []);

    return (
        <Container>
            <LibraryTreeview setSelectedLibraryType={setSelectedLibraryType} setSelectedLibraryItem={setSelectedLibraryItem} setPath={setPath} />

            <Divider />

            <LibraryItemDetails libraryType={selectedLibraryType} libraryItem={selectedLibraryItem} />

        </Container>
    );
};

export default hot(module)(Library);
