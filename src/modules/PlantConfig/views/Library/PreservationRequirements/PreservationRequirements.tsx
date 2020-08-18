import React, { useState } from 'react';
import { Container, IconContainer } from './PreservationRequirements.style';
import EdsIcon from '../../../../../components/EdsIcon';
import { Button } from '@equinor/eds-core-react';
import PreservationRequirementType from './PreservationRequirementType';
import PreservationRequirementDefinition from './PreservationRequirementDefinition';

const addIcon = <EdsIcon name='add' size={16} />;

type PreservationRequirementsProps = {
    setDirtyLibraryType: () => void;
};

enum NodeTypes {
    REQUIREMENT,
    REQUIREMENT_TYPE,
    REQUIREMENT_DEFINITION
}

const PreservationRequirements = (props: PreservationRequirementsProps): JSX.Element => {

    const [nodeType, setNodeType] = useState<NodeTypes>(NodeTypes.REQUIREMENT);

    if (nodeType === (NodeTypes.REQUIREMENT)) {
        return (
            <Container>
                <IconContainer>
                    <Button variant='ghost' onClick={(): void => setNodeType(NodeTypes.REQUIREMENT_TYPE)}>
                        {addIcon} New requirement type
                    </Button>
                    <Button variant='ghost' onClick={(): void => setNodeType(NodeTypes.REQUIREMENT_DEFINITION)}>
                        {addIcon} New requirement definition
                    </Button>
                </IconContainer >
            </Container >
        );
    }

    if (nodeType === (NodeTypes.REQUIREMENT_TYPE)) {
        return (
            <PreservationRequirementType
                requirementTypeId={-1}
                setDirtyLibraryType={props.setDirtyLibraryType}
                cancel={(): void => setNodeType(NodeTypes.REQUIREMENT)}
            />
        );
    }
    if (nodeType === (NodeTypes.REQUIREMENT_DEFINITION)) {

        return (
            <PreservationRequirementDefinition
                requirementDefinitionId={-1}
                setDirtyLibraryType={props.setDirtyLibraryType}
                cancel={(): void => setNodeType(NodeTypes.REQUIREMENT)}
            />
        );

    }

    return (<div>Something went wrong. Node type is not set correctly.</div>);
};

export default PreservationRequirements;
