import React from 'react';
import TagFunction from './TagFunction/TagFunction';
import { LibraryType } from './Library';

type LibraryItemProps = {
    libraryType: string;
    libraryItem: string;
};

const LibraryItemDetails = (props: LibraryItemProps): JSX.Element => {

    switch (props.libraryType) {
        case LibraryType.TAG_FUNCTION: {
            const [registerCode, tagFunctionCode] = props.libraryItem.split('|');
            return <TagFunction tagFunctionCode={tagFunctionCode} registerCode={registerCode} />;
        }
        case LibraryType.MODE:
            return <div>Mode id={props.libraryItem}</div>;
        case LibraryType.PRES_JOURNEY:
            return <div>Journey id={props.libraryItem}</div>;
        case LibraryType.PRES_REQUIREMENT_TYPE:
            return <div>req type</div>;
        case LibraryType.PRES_REQUIREMENT_DEFINITION:
            return <div>def</div>;
        default:
            return <div></div>;

    }
};

export default LibraryItemDetails;
