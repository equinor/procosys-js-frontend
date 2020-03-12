import React from 'react';

import { PreservedTag, Requirement } from './types';
import { RequirementsContainer, RequirementIcon } from './RequirementIcons.style';
import PreservationIcon from '../PreservationIcon';

const isRequirementOverdue = (requirement: Requirement): boolean => requirement.nextDueWeeks < 0;

const isRequirementDue = (requirement: Requirement): boolean => requirement.nextDueWeeks === 0;

interface RequirementProps {
    tag: PreservedTag;
}

const RequirementIcons = ({
    tag }: RequirementProps
): JSX.Element => {
    return (
        <RequirementsContainer>
            {
                tag.requirements.map(req => {
                    return (
                        <RequirementIcon
                            key={req.id}
                            isDue={isRequirementDue(req) || isRequirementOverdue(req)}
                            isReadyToBePreserved={req.readyToBePreserved}
                        >
                            <PreservationIcon variant={req.requirementTypeCode} />
                        </RequirementIcon>
                    );
                })
            }
        </RequirementsContainer>
    );
};

export default RequirementIcons;
