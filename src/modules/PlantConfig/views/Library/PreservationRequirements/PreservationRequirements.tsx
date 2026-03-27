import { Breadcrumbs, Container, IconContainer } from './PreservationRequirements.style';
import React, { useEffect, useState } from 'react';
import { Button, Tooltip } from '@equinor/eds-core-react';
import EdsIcon from '../../../../../components/EdsIcon';
import PreservationRequirementDefinition from './PreservationRequirementDefinition';
import PreservationRequirementType from './PreservationRequirementType';
import { useLibraryPreservationPermissions } from '../useLibraryPreservationPermissions';

const addIcon = <EdsIcon name="add" size={16} />;

type PreservationRequirementsProps = {
  forceUpdate: number;
  setDirtyLibraryType: () => void;
};

enum NodeTypes {
  REQUIREMENT,
  REQUIREMENT_TYPE,
  REQUIREMENT_DEFINITION,
}

const PreservationRequirements = (props: PreservationRequirementsProps): JSX.Element => {
  const [nodeType, setNodeType] = useState<NodeTypes>(NodeTypes.REQUIREMENT);
  const { canCreate, insufficientPrivilegesTitle } = useLibraryPreservationPermissions();

  useEffect(() => {
    setNodeType(NodeTypes.REQUIREMENT);
  }, [props.forceUpdate]);

  if (nodeType === NodeTypes.REQUIREMENT) {
    return (
      <Container>
        <Breadcrumbs>Library / Preservation requirements</Breadcrumbs>
        <IconContainer>
          <Tooltip title={!canCreate ? insufficientPrivilegesTitle : ''}>
            <Button variant="ghost" onClick={(): void => setNodeType(NodeTypes.REQUIREMENT_TYPE)} disabled={!canCreate}>
              {addIcon} New requirement type
            </Button>
          </Tooltip>
          <Tooltip title={!canCreate ? insufficientPrivilegesTitle : ''}>
            <Button variant="ghost" onClick={(): void => setNodeType(NodeTypes.REQUIREMENT_DEFINITION)} disabled={!canCreate}>
              {addIcon} New requirement definition
            </Button>
          </Tooltip>
        </IconContainer>
      </Container>
    );
  }

  if (nodeType === NodeTypes.REQUIREMENT_TYPE) {
    return (
      <PreservationRequirementType
        requirementTypeId={-1}
        setDirtyLibraryType={props.setDirtyLibraryType}
        cancel={(): void => setNodeType(NodeTypes.REQUIREMENT)}
        addNewRequirementDefinition={(): void => {
          setNodeType(NodeTypes.REQUIREMENT_DEFINITION);
        }}
      />
    );
  }
  if (nodeType === NodeTypes.REQUIREMENT_DEFINITION) {
    return (
      <PreservationRequirementDefinition
        requirementDefinitionId={-1}
        setDirtyLibraryType={props.setDirtyLibraryType}
        cancel={(): void => setNodeType(NodeTypes.REQUIREMENT)}
        addNewRequirementType={(): void => {
          setNodeType(NodeTypes.REQUIREMENT_TYPE);
        }}
      />
    );
  }

  return <div>Something went wrong. Node type is not set correctly.</div>;
};

export default PreservationRequirements;
