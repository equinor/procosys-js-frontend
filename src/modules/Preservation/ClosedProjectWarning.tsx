import React, { useEffect } from 'react';
import { usePreservationContext } from './context/PreservationContext';
import { ClosedProjectContainer, IconSpacer } from './style';
import EdsIcon from '@procosys/components/EdsIcon';
import { tokens } from '@equinor/eds-tokens';

const CloseProjectWarning = (): JSX.Element | null => {

    const { project } = usePreservationContext();
    const warningIcon = <EdsIcon name='warning_outlined' color={tokens.colors.interactive.warning__resting.rgba} size={24} />;

    if (project.isClosed) {
        return (
            <ClosedProjectContainer>
                {warningIcon} <IconSpacer /> Selected project {project.name} is closed.
            </ClosedProjectContainer>
        );
    }
    return null;
};

export default CloseProjectWarning;
