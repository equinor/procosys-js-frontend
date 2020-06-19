import React from 'react';
import TagFunction from './TagFunction/TagFunction';
import { LibraryType } from './Library';
import PreservationJourney from './PreservationJourney/PreservationJourney';

type LibraryItemProps = {
    libraryType: string;
    libraryItem: string;
    setDirtyLibraryType: (libraryType: string) => void;
};

const LibraryItemDetails = (props: LibraryItemProps): JSX.Element => {

    // TODO: add "setDirtyLibrary type" to all types and events within them.

    switch (props.libraryType) {
        case LibraryType.TAG_FUNCTION: {
            const [registerCode, tagFunctionCode] = props.libraryItem.split('|');
            return <TagFunction tagFunctionCode={tagFunctionCode} registerCode={registerCode} />;
        }
        case LibraryType.MODE:
            return <div>Mode id={props.libraryItem}</div>;
        case LibraryType.PRES_JOURNEY:
            return <PreservationJourney 
                journeyId={Number(props.libraryItem)} 
                setDirtyLibraryType={(): void => props.setDirtyLibraryType(LibraryType.PRES_JOURNEY)} 
            />;
        case LibraryType.PRES_REQUIREMENT_TYPE:
            return <div>req type</div>;
        case LibraryType.PRES_REQUIREMENT_DEFINITION:
            return <div>def</div>;
        default:
            return <div></div>;

    }
};

export default LibraryItemDetails;
