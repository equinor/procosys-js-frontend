import React, { useEffect } from 'react';

import { Breadcrumbs } from './Library.style';
import { LibraryType } from './Library';
import Mode from './Mode/Mode';
import PreservationJourney from './PreservationJourney/PreservationJourney';
import PreservationRequirementDefinition from './PreservationRequirements/PreservationRequirementDefinition';
import PreservationRequirementType from './PreservationRequirements/PreservationRequirementType';
import PreservationRequirements from './PreservationRequirements/PreservationRequirements';
import TagFunction from './TagFunction/TagFunction';

type LibraryItemProps = {
    forceUpdate: boolean;
    libraryType: string;
    libraryItem: string;
    setSelectedLibraryType: (libraryType: string) => void;
    setDirtyLibraryType: (libraryType: string) => void;
};

const LibraryItemDetails = (props: LibraryItemProps): JSX.Element => {

    switch (props.libraryType) {
        case LibraryType.TAG_FUNCTION: {
            const [registerCode, tagFunctionCode] = props.libraryItem.split('|');
            return <TagFunction tagFunctionCode={tagFunctionCode} registerCode={registerCode} />;
        }
        case LibraryType.MODE:
            return <Mode
                modeId={Number(props.libraryItem)}
                setDirtyLibraryType={(): void => props.setDirtyLibraryType(LibraryType.MODE)}
            />;
        case LibraryType.PRES_JOURNEY:
            return <PreservationJourney
                journeyId={Number(props.libraryItem)}
                setDirtyLibraryType={(): void => props.setDirtyLibraryType(LibraryType.PRES_JOURNEY)}
            />;
        case LibraryType.PRES_REQUIREMENT:
            return <PreservationRequirements
                forceUpdate={props.forceUpdate}
                setDirtyLibraryType={(): void => props.setDirtyLibraryType(LibraryType.PRES_REQUIREMENT)}
            />;
        case LibraryType.PRES_REQUIREMENT_TYPE:
            return <PreservationRequirementType
                requirementTypeId={Number(props.libraryItem)}
                setDirtyLibraryType={(): void => props.setDirtyLibraryType(LibraryType.PRES_REQUIREMENT)}
                cancel={(): void => { props.setSelectedLibraryType(LibraryType.PRES_REQUIREMENT); }}
            />;
        case LibraryType.PRES_REQUIREMENT_DEFINITION:
            return <PreservationRequirementDefinition
                requirementDefinitionId={Number(props.libraryItem)}
                setDirtyLibraryType={(): void => props.setDirtyLibraryType(LibraryType.PRES_REQUIREMENT)}
                cancel={(): void => { props.setSelectedLibraryType(LibraryType.PRES_REQUIREMENT); }}
            />;
        default:
            return <Breadcrumbs>Library /</Breadcrumbs>;

    }
};

export default LibraryItemDetails;
