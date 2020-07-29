import React, { useState } from 'react';
import { Container, IconContainer } from './PreservationRequirements.style';
import EdsIcon from '../../../../../components/EdsIcon';
import { Button } from '@equinor/eds-core-react';
import PreservationRequirementType from './PreservationRequirementType';

const addIcon = <EdsIcon name='add' size={16} />;

type PreservationRequirementsProps = {
    setDirtyLibraryType: () => void;
};

const PreservationRequirements = (props: PreservationRequirementsProps): JSX.Element => {

    const [isEditMode, setIsEditMode] = useState<boolean>(false);

    if (!isEditMode) {
        return (
            <Container>
                <IconContainer>
                    <Button variant='ghost' onClick={(): void => setIsEditMode(true)}>
                        {addIcon} New requirement type
                    </Button>
                </IconContainer>
            </Container >
        );
    }

    return (
        <PreservationRequirementType
            requirementTypeId={-1}
            setDirtyLibraryType={props.setDirtyLibraryType}
            cancel={(): void => setIsEditMode(false)}
        />
    );
};

export default PreservationRequirements;
