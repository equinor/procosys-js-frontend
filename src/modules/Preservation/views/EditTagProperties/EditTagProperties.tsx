import { Button, Typography } from '@equinor/eds-core-react';
import {
    ButtonContainer,
    Container,
    ContentContainer,
    ErrorContainer,
    Header,
    InputContainer,
    SpinnerContainer,
} from './EditTagProperties.style';
import { Journey, RequirementType, Step, TagDetails } from './types';
import React, { useEffect, useRef, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../components/Select';
import { useHistory, useParams } from 'react-router-dom';

import { Canceler } from 'axios';
import { ProCoSysApiError } from '@procosys/core/ProCoSysApiError';
import RequirementsSelector from '../../components/RequirementsSelector/RequirementsSelector';
import Spinner from '@procosys/components/Spinner';
import { TextField } from '@equinor/eds-core-react';
import { showModalDialog } from '@procosys/core/services/ModalDialogService';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { usePreservationContext } from '../../context/PreservationContext';
import { useDirtyContext } from '@procosys/core/DirtyContext';

const moduleName = 'PreservationEditProperties';

const EditTagProperties = (): JSX.Element => {
    const { apiClient, project } = usePreservationContext();
    const history = useHistory();
    const { setDirtyStateFor, unsetDirtyStateFor } = useDirtyContext();

    const [journey, setJourney] = useState(-1);
    const [journeys, setJourneys] = useState<Journey[]>([]);
    const [mappedJourneys, setMappedJourneys] = useState<SelectItem[]>([]);
    const [newJourney, setNewJourney] = useState<string>();

    const [mappedSteps, setMappedSteps] = useState<SelectItem[]>([]);
    const [step, setStep] = useState<Step | null>();

    const remarkInputRef = useRef<HTMLInputElement>(null);
    const [tag, setTag] = useState<TagDetails>();
    const [tagJourneyOrRequirementsEdited, setTagJourneyOrRequirementsEdited] =
        useState<boolean>(false);
    const [validationErrorMessage, setValidationErrorMessage] = useState<
        string | null
    >();

    const [loading, setLoading] = useState(true);

    const { tagId } = useParams() as any;

    const [rowVersion, setRowVersion] = useState<string>('');

    /**
     * Get tag details
     */
    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            if (tagId) {
                try {
                    const details = await apiClient.getTagDetails(
                        Number.parseInt(tagId),
                        (cancel: Canceler) => (requestCancellor = cancel)
                    );
                    setTag(details);
                    if (details.tagNo.substr(0, 4) == '#PO-') {
                        setPoTag(true);
                    }
                    setRowVersion(details.rowVersion);
                    setDescription(details.description);
                } catch (error) {
                    console.error(
                        'Get tag details failed: ',
                        error.message,
                        error.data
                    );
                    showSnackbarNotification(error.message);
                }
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    const hasUnsavedChanges = (): boolean => {
        return tagJourneyOrRequirementsEdited || remarkOrStorageAreaEdited;
    };

    /** Update global and local dirty state */
    useEffect(() => {
        if (hasUnsavedChanges()) {
            setDirtyStateFor(moduleName);
        } else {
            unsetDirtyStateFor(moduleName);
        }

        return (): void => {
            unsetDirtyStateFor(moduleName);
        };
    }, [tagJourneyOrRequirementsEdited, remarkOrStorageAreaEdited]);

    /**
     * Get Journeys
     */
    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                const data = await apiClient.getJourneys(
                    true,
                    (cancel: Canceler) => (requestCancellor = cancel)
                );
                setJourneys(data);
            } catch (error) {
                console.error(
                    'Get journeys failed: ',
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

    const setSelectedStep = (journeyIndex: number, stepId: number): void => {
        if (tag) {
            let selectedStep: Step | undefined = journeys[
                journeyIndex
            ].steps.find((pStep: Step) => pStep.id === stepId);
            if (!selectedStep) {
                //Set dummy step to handle voided step
                selectedStep = {
                    id: stepId,
                    isVoided: true,
                    title: tag.step.title,
                    mode: {
                        id: -1,
                        title: '',
                        rowVersion: '',
                        forSupplier: false,
                    },
                    rowVersion: '',
                };
            }
            setStep(selectedStep);
        }
    };

    useEffect(() => {
        if (journeys.length > 0 && tag && requirementsFetched) {
            const initialJourney = journeys.findIndex(
                (pJourney: Journey) => pJourney.title === tag.journey.title
            );
            setJourney(initialJourney);
            setSelectedStep(initialJourney, tag.step.id);
            setLoading(false);
        }
    }, [tag, journeys, requirementsFetched]);

    /**
     * Map journeys into menu elements
     */
    useEffect(() => {
        const validJourneys: SelectItem[] = [];
        if (tag) {
            journeys.forEach((journey) => {
                if (
                    journey.id == tag.journey.id || //If journey is currently set, include even if it is not currently valid
                    (!journey.isVoided &&
                        (!poTag ||
                            (poTag &&
                                journey.steps.some(
                                    (step) => step.mode.forSupplier
                                )))) // If PO tag, only include if a supplier step exists
                ) {
                    validJourneys.push({
                        text: journey.title,
                        value: journey.id,
                    });
                }
            });
            setMappedJourneys(validJourneys);
        }
    }, [journeys, tag]);

    /**
     * Map Journey steps into menu elements, and set step if necessary.
     */
    useEffect(() => {
        if (newJourney) {
            setStep(null);
        }

        //Map steps to menu elements
        if (tag && journeys.length > 0 && journeys[journey]) {
            const validSteps: SelectItem[] = [];
            journeys[journey].steps.forEach((step) => {
                if (
                    tag.step.id == step.id || //If step is currently set, include even if it is not currently valid
                    (!step.isVoided &&
                        (!poTag || (poTag && step.mode.forSupplier))) //for PO tags, only supplier step can be choosen
                ) {
                    validSteps.push({
                        text: step.title,
                        value: step.id,
                    });
                }
            });

            setMappedSteps(validSteps);

            // If purchase order tag, set current step to the supplier step (the only valid state)
            if (poTag) {
                const stepForSupplier = journeys[journey].steps.find(
                    (step) => step.mode.forSupplier
                );
                if (!stepForSupplier) {
                    showSnackbarNotification(
                        'Warning: Selected journey does not have a supplier step.',
                        5000
                    );
                } else {
                    setStep(stepForSupplier);
                }
            }
        }
    }, [journey]);

    const handleErrorFromBackend = (
        error: ProCoSysApiError,
        errorMessageConsole: string
    ): void => {
        if (error.data && error.data.status == 400) {
            console.error(errorMessageConsole, error.message, error.data);
            setValidationErrorMessage(error.message);
            throw showSnackbarNotification(
                'Validation error. Changes are not saved.'
            );
        } else {
            console.error(errorMessageConsole, error.message, error.data);
            throw showSnackbarNotification(error.message);
        }
    };

    const setJourneyFromForm = (value: number): void => {
        const j = journeys.find((pJourney: Journey) => pJourney.id === value);
        if (j) {
            setJourney(
                journeys.findIndex((pJourney: Journey) => pJourney.id === value)
            );
            setNewJourney(j.title);
        }
    };

    /**
     * Check if any changes have been made to journey, step requirements, or description
     */
    useEffect(() => {
        if (
            tag &&
            ((newJourney && newJourney != tag.journey.title) ||
                (step && step.id != tag.step.id) ||
                JSON.stringify(requirements) !=
                    JSON.stringify(originalRequirements) ||
                (description && description != tag.description))
        ) {
            setTagJourneyOrRequirementsEdited(true);
        } else {
            setTagJourneyOrRequirementsEdited(false);
        }
    }, [requirements, step, journey, originalRequirements, description]);

    const updateRemarkAndStorageArea = async (): Promise<string> => {
        try {
            if (tag && remarkInputRef.current && storageAreaInputRef.current) {
                const updatedRowVersion =
                    await apiClient.setRemarkAndStorageArea(
                        tag.id,
                        remarkInputRef.current.value,
                        storageAreaInputRef.current.value,
                        rowVersion
                    );
                setRowVersion(updatedRowVersion);
                return updatedRowVersion;
            }
            return rowVersion;
        } catch (error) {
            handleErrorFromBackend(
                error,
                'Error updating remark and storage area'
            );
            throw error.message;
        }
    };

    const updateTagJourneyAndRequirements = async (
        currentRowVersion: string
    ): Promise<void> => {
        try {
            if (tag && step && description) {
                let newRequirements: RequirementFormInput[] = [];
                const numberOfNewReq =
                    requirements.length - originalRequirements.length;
                if (requirements.length > originalRequirements.length) {
                    newRequirements = [...requirements.slice(-numberOfNewReq)];
                }
                const updatedRequirements = requirements
                    .slice(0, originalRequirements.length)
                    .map((req) => {
                        return {
                            requirementId: req.requirementId,
                            intervalWeeks: req.intervalWeeks,
                            isVoided: req.isVoided,
                            rowVersion: req.rowVersion,
                        };
                    });
                const deletedRequirements = requirements
                    .filter((req) => req.isVoided && req.isDeleted)
                    .map((req) => {
                        return {
                            requirementId: req.requirementId,
                            rowVersion: req.rowVersion,
                        };
                    });
                await apiClient.updateTagStepAndRequirements(
                    tag.id,
                    description,
                    step.id,
                    currentRowVersion,
                    updatedRequirements,
                    newRequirements,
                    deletedRequirements
                );
            }
        } catch (error) {
            handleErrorFromBackend(
                error,
                'Error updating journey, step, requirements, or description'
            );
        }
    };

    const save = async (): Promise<void> => {
        setLoading(true);
        let currentRowVersion = rowVersion;
        if (remarkOrStorageAreaEdited) {
            try {
                currentRowVersion = await updateRemarkAndStorageArea();
            } catch (error) {
                setLoading(false);
                throw 'error';
            }
        }
        if (tagJourneyOrRequirementsEdited) {
            try {
                await updateTagJourneyAndRequirements(currentRowVersion);
            } catch (error) {
                setLoading(false);
                throw 'error';
            }
        }
        setLoading(false);
        if (tag) {
            showSnackbarNotification(`Changes to ${tag.tagNo} have been saved`);
        }
        history.push('/');
    };

    const saveDialog = (): void => {
        showModalDialog(
            'Confirm saving changes to tag',
            null,
            '30vw',
            'Back to editing',
            null,
            'Save',
            save,
            true
        );
    };

    const cancel = (): void => {
        history.push('/');
    };

    return (
        <Container>
            <Header>
                <Typography variant="h1">
                    {tag ? `Editing ${tag.tagNo}` : 'Editing'}
                </Typography>
                <div>{project.name}</div>
            </Header>
            {loading ? (
                <SpinnerContainer>
                    <Spinner large />
                </SpinnerContainer>
            ) : (
                <ContentContainer>
                    <div>
                        {validationErrorMessage && (
                            <ErrorContainer>
                                <Typography variant="caption">
                                    {validationErrorMessage}
                                </Typography>
                            </ErrorContainer>
                        )}
                        <InputContainer>
                            <SelectInput
                                maxHeight={'300px'}
                                onChange={setJourneyFromForm}
                                data={mappedJourneys}
                                label={'Preservation journey for selected tag'}
                            >
                                {(journey > -1 && journeys[journey].title) ||
                                    'Select journey'}
                            </SelectInput>
                        </InputContainer>
                        <InputContainer>
                            <SelectInput
                                onChange={(stepId): void =>
                                    setSelectedStep(journey, stepId)
                                }
                                data={mappedSteps}
                                disabled={poTag}
                                label={'Preservation step'}
                            >
                                {(step && step.title) || 'Select step'}
                            </SelectInput>
                        </InputContainer>
                    </div>
                    <ButtonContainer>
                        <Button onClick={cancel} variant="outlined">
                            Cancel
                        </Button>
                        <Button
                            onClick={saveDialog}
                            color="primary"
                            disabled={!hasUnsavedChanges() || !step}
                        >
                            Save
                        </Button>
                    </ButtonContainer>
                </ContentContainer>
            )}
        </Container>
    );
};

export default EditTagProperties;
