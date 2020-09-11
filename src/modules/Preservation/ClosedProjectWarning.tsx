import React, { useEffect, useState } from 'react';
import { usePreservationContext } from './context/PreservationContext';
import { ClosedProjectContainer, IconSpacer } from './style';
import EdsIcon from '@procosys/components/EdsIcon';
import { tokens } from '@equinor/eds-tokens';
import { useProcosysContext } from '../../core/ProcosysContext';
import { Canceler } from 'axios';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';

const CloseProjectWarning = (): JSX.Element | null => {
    const { procosysApiClient } = useProcosysContext();
    const { project } = usePreservationContext();

    const warningIcon = <EdsIcon name='warning_outlined' color={tokens.colors.interactive.warning__resting.rgba} size={24} />;

    const [isProjectClosed, setIsProjectClosed] = useState<boolean>(false);

    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                const response = await procosysApiClient.getProjectAsync(project.id, (cancelerCallback) => requestCancellor = cancelerCallback);
                if (response.isClosed) {
                    setIsProjectClosed(true);
                } else {
                    setIsProjectClosed(false);
                }
            } catch (error) {
                console.error('Get project closed statue failed: ', error.message, error.data);
                showSnackbarNotification(error.message, 5000, true);
            }
        })();
    }, [project.id]);

    if (isProjectClosed) {
        return (
            <ClosedProjectContainer>
                {warningIcon} <IconSpacer /> Selected project {project.name} is closed.
            </ClosedProjectContainer>
        );
    }
    return null;
};

export default CloseProjectWarning;
