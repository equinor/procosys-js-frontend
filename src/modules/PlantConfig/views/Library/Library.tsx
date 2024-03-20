import { Container, Divider, LibraryItemContainer } from './Library.style';
import React, { ReactElement, useEffect, useReducer, useState } from 'react';

import { Helmet } from 'react-helmet';
//import withAccessControl from '../../../../core/security/withAccessControl';
import LibraryItemDetails from './LibraryItemDetails';
import LibraryTreeview from './LibraryTreeview/LibraryTreeview';
import { hot } from 'react-hot-loader';

import { Route, Switch } from 'react-router-dom';

export enum LibraryType {
    TAG_FUNCTION = 'TagFunction',
    MODE = 'Mode',
    PRES_JOURNEY = 'PresJourney',
    PRES_REQUIREMENT = 'PresRequirement',
    PRES_REQUIREMENT_TYPE = 'PresReqType',
    PRES_REQUIREMENT_DEFINITION = 'PresReqDef',
    NOT_SELECTED = 'NotSelected',
}

const libraryTypePrefixId = [
    'mode_',
    'journey_',
    'tf_register_',
    'rt_',
    'field_withinput_',
    'field_withoutinput_',
    'header_rt_',
];

const Library = (): JSX.Element => {
    const [selectedLibraryType, setSelectedLibraryType] = useState('');
    const [selectedLibraryItem, setSelectedLibraryItem] = useState('');
    const [dirtyLibraryType, setDirtyLibraryType] = useState('');
    const [update, forceUpdate] = useReducer((x) => x + 1, 0); // Used to force an update on library content pane for top level tree nodes

    useEffect(() => {
        const pathSegments = window.location.pathname
            .split('/')
            .filter(Boolean);
        const libraryV2Index = pathSegments.findIndex(
            (segment) => segment.toLowerCase() === 'libraryv2'
        );

        if (libraryV2Index !== -1 && pathSegments.length > libraryV2Index + 1) {
            const segmentsAfterLibraryV2 = pathSegments.slice(
                libraryV2Index + 1
            );
            const libraryType = mapSegmentsToLibraryType(
                segmentsAfterLibraryV2
            );
            setSelectedLibraryType(libraryType);

            extractAndSetItemId(segmentsAfterLibraryV2);
        }
    }, []);

    const mapSegmentsToLibraryType = (segments: string[]): string => {
        const firstSegment = segments[0]?.toLowerCase().replace(/%20/g, ' ');
        console.log('firstSegment:', firstSegment);
        switch (firstSegment) {
            case 'tag functions': {
                return LibraryType.TAG_FUNCTION;
            }
            case 'modes': {
                return LibraryType.MODE;
            }
            case 'preservation journeys': {
                return LibraryType.PRES_JOURNEY;
            }
            case 'preservation requirements': {
                const isPresReqType = segments.some((segment) =>
                    segment.toLowerCase().startsWith('rt_')
                );

                const isPresReqDef = segments.some((segment) =>
                    segment.toLowerCase().startsWith('field_withinput_')
                );

                if (isPresReqDef) {
                    return LibraryType.PRES_REQUIREMENT_DEFINITION;
                } else if (isPresReqType) {
                    return LibraryType.PRES_REQUIREMENT_TYPE;
                } else {
                    return LibraryType.PRES_REQUIREMENT;
                }
            }
            case 'requirements with required user input': {
                const isPresReqDef = segments.some((segment) =>
                    segment.toLowerCase().startsWith('field_withinput_')
                );
                return isPresReqDef
                    ? LibraryType.PRES_REQUIREMENT_DEFINITION
                    : LibraryType.PRES_REQUIREMENT_TYPE;
            }
            default: {
                return LibraryType.NOT_SELECTED;
            }
        }
    };

    const extractAndSetItemId = (segments: string[]): void => {
        const itemIdPattern = libraryTypePrefixId.join('|');
        const regex = new RegExp(`(${itemIdPattern})([^/]+)`, 'i');
        const matchedSegments = segments.join('/').match(regex);

        if (matchedSegments && matchedSegments.length >= 3) {
            let extractedId = matchedSegments[2];

            if (matchedSegments[1].toLowerCase().startsWith('tf_register_')) {
                extractedId = extractedId.replace(/_/g, '|');
            }
            setSelectedLibraryItem(extractedId);
        }
    };

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
                    component={(): ReactElement => (
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
