import {
    ActionContainer,
    Container,
    LeftSection,
    RightSection,
} from './PreservationTab.style';
import { AxiosResponse, Canceler } from 'axios';
import React, { useEffect, useMemo, useState } from 'react';

import { Button } from '@equinor/eds-core-react';
import PreservationApiClient from '@procosys/modules/Preservation/http/PreservationApiClient';
import { RequirementType } from './types';
import RequirementsWidget from '../../../../../Preservation/components/RequirementsSelector/RequirementsSelector';
import Spinner from '@procosys/components/Spinner';
import { hot } from 'react-hot-loader';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useCurrentPlant } from '@procosys/core/PlantContext';
import {
    unsavedChangesConfirmationMessage,
    useDirtyContext,
} from '@procosys/core/DirtyContext';
import { useProcosysContext } from '@procosys/core/ProcosysContext';

interface TagFunction {
    id: number;
    code: string;
    description: string;
    registerCode: string;
    isVoided: boolean;
    requirements: {
        id: number;
        requirementDefinitionId: number;
        intervalWeeks: number;
    }[];
    rowVersion: string;
}

type PreservationTabProps = {
    registerCode: string;
    tagFunctionCode: string;
};

interface RequirementFormInput {
    requirementDefinitionId: number;
    intervalWeeks: number;
    isVoided?: boolean;
}

const moduleName = 'TagFunctionForm';

const PreservationTab = (props: PreservationTabProps): JSX.Element => {
    const [requirementTypes, setRequirementTypes] = useState<RequirementType[]>(
        []
    );
    const [tagFunctionDetails, setTagFunctionDetails] = useState<TagFunction>();
    const [unsavedRequirements, setUnsavedRequirements] = useState<
        RequirementFormInput[] | null
    >(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { setDirtyStateFor, unsetDirtyStateFor } = useDirtyContext();

    const { auth } = useProcosysContext();
    const { plant } = useCurrentPlant();

    const apiClient = useMemo(() => {
        const client = new PreservationApiClient(auth);
        client.setCurrentPlant(plant.id);
        return client;
    }, [plant]);

    const updateTagFunctionDetails = async (
        requestCanceller?: (cancelCallback: Canceler) => void
    ): Promise<void> => {
        try {
            const response = await apiClient.getTagFunction(
                props.tagFunctionCode,
                props.registerCode,
                requestCanceller
            );
            setTagFunctionDetails(response);
        } catch (error) {
            if (error && error.data) {
                const serverError = error.data as AxiosResponse;
                if (serverError.status !== 404) {
                    console.error(
                        'Failed to get tag function details: ',
                        error.message,
                        error.data
                    );
                    showSnackbarNotification(error.message);
                }
            }
        }
        setIsLoading(false);
    };

    const submitChanges = async (): Promise<void> => {
        setIsLoading(true);
        const changes = unsavedRequirements || [];
        try {
            await apiClient.updateTagFunction(
                props.tagFunctionCode,
                props.registerCode,
                changes
            );
            setUnsavedRequirements(null);
            updateTagFunctionDetails();
            showSnackbarNotification('Tag function requirements saved');
        } catch (err) {
            console.error(
                'Error when syncing requirements',
                err.message,
                err.data
            );
            showSnackbarNotification(
                'Failed to update tag function requirements: ' + err.message
            );
        }
        setIsLoading(false);
    };

    const confirmDiscardingChangesIfExist = (): boolean => {
        return (
            !unsavedRequirements || confirm(unsavedChangesConfirmationMessage)
        );
    };

    const voidTagFunction = async (): Promise<void> => {
        if (!tagFunctionDetails || !confirmDiscardingChangesIfExist()) return;
        try {
            await apiClient.voidUnvoidTagFunction(
                tagFunctionDetails.code,
                tagFunctionDetails.registerCode,
                'VOID',
                tagFunctionDetails.rowVersion
            );
            updateTagFunctionDetails();
            showSnackbarNotification('Tag function voided');
        } catch (err) {
            console.error(
                'Error when voiding tag function',
                err.message,
                err.data
            );
            showSnackbarNotification(
                'Failed to void tag function: ' + err.message
            );
        }
    };

    const unvoidTagFunction = async (): Promise<void> => {
        if (!tagFunctionDetails) return;
        try {
            await apiClient.voidUnvoidTagFunction(
                tagFunctionDetails.code,
                tagFunctionDetails.registerCode,
                'UNVOID',
                tagFunctionDetails.rowVersion
            );
            updateTagFunctionDetails();
            showSnackbarNotification('Tag function unvoided');
        } catch (err) {
            console.error(
                'Error when unvoiding tag function',
                err.message,
                err.data
            );
            showSnackbarNotification(
                'Failed to unvoid tag function: ' + err.message
            );
        }
    };

    const onRequirementsChanged = (req: RequirementFormInput[]): void => {
        setUnsavedRequirements(req);
    };

    /**
     * Update global dirty state
     */
    useEffect(() => {
        if (unsavedRequirements) {
            setDirtyStateFor(moduleName);
        } else {
            unsetDirtyStateFor(moduleName);
        }
        return (): void => {
            unsetDirtyStateFor(moduleName);
        };
    }, [unsavedRequirements]);

    /**
     * Get all requirement types
     */
    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                const response = await apiClient.getRequirementTypes(
                    false,
                    (cancel: Canceler) => {
                        requestCancellor = cancel;
                    }
                );
                setRequirementTypes(response);
            } catch (error) {
                console.error(
                    'Get requirement types failed: ',
                    error.message,
                    error.data
                );
                showSnackbarNotification(error.message);
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    /**
     * Get Tag Function details
     */
    useEffect(() => {
        let requestCancellor: Canceler | null = null;

        (async (): Promise<void> => {
            await updateTagFunctionDetails((cancel: Canceler) => {
                requestCancellor = cancel;
            });
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    let requirements: RequirementFormInput[] =
        (tagFunctionDetails && tagFunctionDetails.requirements) || [];
    if (unsavedRequirements) {
        requirements = unsavedRequirements;
    }

    const isVoided = tagFunctionDetails && tagFunctionDetails.isVoided;

    if (isLoading) {
        return <Spinner large />;
    }

    return (
        <Container>
            <LeftSection>
                <RequirementsWidget
                    requirementTypes={requirementTypes}
                    requirements={requirements}
                    onChange={onRequirementsChanged}
                    disabled={isVoided}
                />
            </LeftSection>
            <RightSection>
                <ActionContainer>
                    {isVoided && (
                        <Button variant="outlined" onClick={unvoidTagFunction}>
                            Unvoid
                        </Button>
                    )}
                    {!isVoided && (
                        <Button variant="outlined" onClick={voidTagFunction}>
                            Void
                        </Button>
                    )}

                    <Button
                        disabled={!unsavedRequirements}
                        onClick={submitChanges}
                    >
                        Save
                    </Button>
                </ActionContainer>
            </RightSection>
        </Container>
    );
};

export default PreservationTab;
