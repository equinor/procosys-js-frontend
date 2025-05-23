import { Container, Divider, LibraryItemContainer } from './Library.style';
import React, { useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet';
import LibraryItemDetails from './LibraryItemDetails';
import LibraryTreeview, {
    LibraryProvider,
} from './LibraryTreeview/LibraryTreeview';
import { Route, Routes, useLocation, useSearchParams } from 'react-router-dom';

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

    const [searchParams] = useSearchParams();
    const registerCode = searchParams.get('registerCode') ?? '';
    const tagFunctionCode = searchParams.get('tagFunctionCode') ?? '';

    const [dirtyLibraryType, setDirtyLibraryType] = useState('');
    const { pathname } = useLocation();
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
    }, [pathname]);

    const mapSegmentsToLibraryType = (segments: string[]): string => {
        const firstSegment = segments[0]?.toLowerCase().replace(/%20/g, ' ');
        switch (firstSegment) {
            case 'tag functions':
                return LibraryType.TAG_FUNCTION;
            case 'modes':
                return LibraryType.MODE;
            case 'preservation journeys':
                return LibraryType.PRES_JOURNEY;
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
            default:
                return LibraryType.NOT_SELECTED;
        }
    };

    const extractAndSetItemId = (segments: string[]): void => {
        const itemIdPattern = libraryTypePrefixId.join('|');
        const regex = new RegExp(`(${itemIdPattern})([^/]+)`, 'i');
        const matchedSegments = segments.join('/').match(regex);

        if (matchedSegments && matchedSegments.length >= 3) {
            const extractedId = matchedSegments[2];
            setSelectedLibraryItem(extractedId);
        }
    };

    return (
        <LibraryProvider>
            <Container>
                {selectedLibraryType && (
                    <Helmet>
                        <title>{` - ${selectedLibraryType}`}</title>
                    </Helmet>
                )}
                <LibraryTreeview
                    selectedLibraryItem={selectedLibraryItem}
                    forceUpdate={forceUpdate}
                    setSelectedLibraryType={setSelectedLibraryType}
                    setSelectedLibraryItem={setSelectedLibraryItem}
                    dirtyLibraryType={dirtyLibraryType}
                    resetDirtyLibraryType={(): void => setDirtyLibraryType('')}
                />

                <Divider />
                <Routes>
                    <Route
                        path="/"
                        element={
                            <LibraryItemContainer
                                addPaddingRight={
                                    selectedLibraryType !==
                                    LibraryType.TAG_FUNCTION
                                }
                            >
                                <LibraryItemDetails
                                    forceUpdate={update}
                                    libraryType={selectedLibraryType}
                                    libraryItem={selectedLibraryItem}
                                    tagFunctionCode={tagFunctionCode}
                                    registerCode={registerCode}
                                    setSelectedLibraryType={
                                        setSelectedLibraryType
                                    }
                                    setSelectedLibraryItem={
                                        setSelectedLibraryItem
                                    }
                                    setDirtyLibraryType={setDirtyLibraryType}
                                />
                            </LibraryItemContainer>
                        }
                    />
                </Routes>
            </Container>
        </LibraryProvider>
    );
};

export default Library;
