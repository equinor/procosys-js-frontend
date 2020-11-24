import { Button, Typography } from '@equinor/eds-core-react';
import { ButtonContainer, Container, ErrorContainer, Header, InputContainer, SpinnerContainer, ContentContainer } from './EditTagProperties.style';
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

interface RequirementFormInput {
    requirementDefinitionId: number;
    intervalWeeks: number;
    requirementId?: number;
    requirementTypeTitle?: string;
    requirementDefinitionTitle?: string;
    editingRequirements?: boolean;
    isVoided?: boolean;
    rowVersion?: string;
}

const EditTagProperties = (): JSX.Element => {
    const { apiClient, project } = usePreservationContext();
    const history = useHistory();

    const [journey, setJourney] = useState(-1);
    const [journeys, setJourneys] = useState<Journey[]>([]);
    const [mappedJourneys, setMappedJourneys] = useState<SelectItem[]>([]);
    const [newJourney, setNewJourney] = useState<string>();

    const [mappedSteps, setMappedSteps] = useState<SelectItem[]>([]);
    const [step, setStep] = useState<Step | null>();

    const tagDescriptionInputRef = useRef<HTMLInputElement>(null);
    const remarkInputRef = useRef<HTMLInputElement>(null);
    const storageAreaInputRef = useRef<HTMLInputElement>(null);

    const [tag, setTag] = useState<TagDetails>();
    const [requirementTypes, setRequirementTypes] = useState<RequirementType[]>([]);
    const [requirements, setRequirements] = useState<RequirementFormInput[]>([]);
    const [remarkOrStorageAreaEdited, setRemarkOrStorageAreaEdited] = useState<boolean>(false);
    const [tagJourneyOrRequirementsEdited, setTagJourneyOrRequirementsEdited] = useState<boolean>(false);
    const [poTag, setPoTag] = useState<boolean>(false);
    const [originalRequirements, setOriginalRequirements] = useState<RequirementFormInput[]>([]);
    const [validationErrorMessage, setValidationErrorMessage] = useState<string | null>();

    const [loading, setLoading] = useState(true);

    const { tagId } = useParams() as any;

    const [requirementsFetched, setRequirementsFetched] = useState(false);
    const [rowVersion, setRowVersion] = useState<string>('');

    const dummyTagTypes = ['PreArea', 'SiteArea', 'PoArea'];

    /**
     * Get tag details
     */
    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            if (tagId) {
                try {
                    const details = await apiClient.getTagDetails(Number.parseInt(tagId), (cancel: Canceler) => requestCancellor = cancel);
                    setTag(details);
                    if (details.tagNo.substr(0, 4) == '#PO-') {
                        setPoTag(true);
                    }
                    setRowVersion(details.rowVersion);
                } catch (error) {
                    console.error('Get tag details failed: ', error.message, error.data);
                    showSnackbarNotification(error.message);
                }
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    /**
     * Get Requirements
     */
    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            if (tagId) {
                try {
                    const response = await apiClient.getTagRequirements(Number.parseInt(tagId), true, true, (cancel: Canceler) => requestCancellor = cancel);
                    const mappedResponse = response.map(itm => {
                        return {
                            requirementDefinitionId: -1,
                            requirementId: itm.id,
                            intervalWeeks: itm.intervalWeeks,
                            requirementTypeTitle: itm.requirementType.title,
                            requirementDefinitionTitle: itm.requirementDefinition.title,
                            editingRequirements: true,
                            isVoided: itm.isVoided,
                            rowVersion: itm.rowVersion
                        };
                    });
                    setRequirements([...mappedResponse]);
                    setOriginalRequirements([...mappedResponse]);
                    setRequirementsFetched(true);
                } catch (error) {
                    console.error('Get requirement failed: ', error.message, error.data);
                    showSnackbarNotification(error.message);
                }
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    /**
     * Get Requirement Types
     */
    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            if (tagId) {
                try {
                    const response = await apiClient.getRequirementTypes(false, (cancel: Canceler) => requestCancellor = cancel);
                    setRequirementTypes(response);
                } catch (error) {
                    console.error('Get requirement types failed: ', error.message, error.data);
                    showSnackbarNotification(error.message);
                }
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    /**
     * Get Journeys
     */
    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                const data = await apiClient.getJourneys(true, (cancel: Canceler) => requestCancellor = cancel);
                setJourneys(data);
            } catch (error) {
                console.error('Get journeys failed: ', error.message, error.data);
                showSnackbarNotification(error.message);
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    const setSelectedStep = (journeyIndex: number, stepId: number): void => {
        if (tag) {
            let selectedStep: Step | undefined = journeys[journeyIndex].steps.find((pStep: Step) => pStep.id === stepId);
            if (!selectedStep) {
                //Set dummy step to handle voided step
                selectedStep = {
                    id: stepId,
                    isVoided: true,
                    title: tag.step.title,
                    mode: { id: -1, title: '', rowVersion: '', forSupplier: false },
                    rowVersion: ''
                };
            }
            setStep(selectedStep);
        }
    };

    useEffect(() => {
        if (journeys.length > 0 && tag && requirementsFetched) {
            const initialJourney = journeys.findIndex((pJourney: Journey) => pJourney.title === tag.journey.title);
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
                if ((journey.id == tag.journey.id)   //If journey is currently set, include even if it is not currently valid
                    || (!journey.isVoided
                        && (!poTag || (poTag && journey.steps.some((step) => step.mode.forSupplier)))) // If PO tag, only include if a supplier step exists
                ) {

                    validJourneys.push({
                        text: journey.title,
                        value: journey.id
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
                if ((tag.step.id == step.id)   //If step is currently set, include even if it is not currently valid
                    || (!step.isVoided
                        && (!poTag || (poTag && step.mode.forSupplier))) //for PO tags, only supplier step can be choosen
                ) {
                    validSteps.push({
                        text: step.title,
                        value: step.id
                    });
                }
            });

            setMappedSteps(validSteps);

            // If purchase order tag, set current step to the supplier step (the only valid state)
            if (poTag) {
                const stepForSupplier = journeys[journey].steps.find((step) => step.mode.forSupplier);
                if (!stepForSupplier) {
                    showSnackbarNotification('Warning: Selected journey does not have a supplier step.', 5000);
                } else {
                    setStep(stepForSupplier);
                }
            }

        }
    }, [journey]);

    const handleErrorFromBackend = (error: ProCoSysApiError, errorMessageConsole: string): void => {
        if (error.data && error.data.status == 400) {
            console.error(errorMessageConsole, error.message, error.data);
            setValidationErrorMessage(error.message);
            throw (showSnackbarNotification('Validation error. Changes are not saved.'));
        } else {
            console.error(errorMessageConsole, error.message, error.data);
            throw (showSnackbarNotification(error.message));
        }
    };

    const setJourneyFromForm = (value: number): void => {
        const j = journeys.find((pJourney: Journey) => pJourney.id === value);
        if (j) {
            setJourney(journeys.findIndex((pJourney: Journey) => pJourney.id === value));
            setNewJourney(j.title);
        }
    };

    const remarkOrStorageAreaChange = (): void => {
        if (tag && remarkInputRef.current && storageAreaInputRef.current && (remarkInputRef.current.value != tag.remark || storageAreaInputRef.current.value != tag.storageArea)) {
            setRemarkOrStorageAreaEdited(true);
        } else {
            setRemarkOrStorageAreaEdited(false);
        }
    };

    const tagDescriptionChange = (): void => {
        if (tag && tagDescriptionInputRef.current && tagDescriptionInputRef.current.value != tag.description) {
            setTagJourneyOrRequirementsEdited(true);
        } else {
            setTagJourneyOrRequirementsEdited(false);
        }
    };

    /**
     * Check if any changes have been made to journey, step or requirements
     */
    useEffect(() => {
        if (tag && ((newJourney && newJourney != tag.journey.title) || (step && step.id != tag.step.id) || JSON.stringify(requirements) != JSON.stringify(originalRequirements))) {
            setTagJourneyOrRequirementsEdited(true);
        } else {
            setTagJourneyOrRequirementsEdited(false);
        }
    }, [requirements, step, journey, originalRequirements]);

    const updateRemarkAndStorageArea = async (): Promise<string> => {
        try {
            if (tag && remarkInputRef.current && storageAreaInputRef.current) {
                const updatedRowVersion = await apiClient.setRemarkAndStorageArea(tag.id, remarkInputRef.current.value, storageAreaInputRef.current.value, rowVersion);
                setRowVersion(updatedRowVersion);
                return updatedRowVersion;
            }
            return rowVersion;
        } catch (error) {
            handleErrorFromBackend(error, 'Error updating remark and storage area');
            throw (error.message);
        }
    };

    const updateTagJourneyAndRequirements = async (currentRowVersion: string): Promise<void> => {
        try {
            if (tag && step && tagDescriptionInputRef.current) {
                let newRequirements: RequirementFormInput[] = [];
                const numberOfNewReq = requirements.length - originalRequirements.length;
                if (requirements.length > originalRequirements.length) {
                    newRequirements = [...requirements.slice(-numberOfNewReq)];
                }
                const updatedRequirements = requirements.slice(0, originalRequirements.length).map(req => {
                    return {
                        requirementId: req.requirementId,
                        intervalWeeks: req.intervalWeeks,
                        isVoided: req.isVoided,
                        rowVersion: req.rowVersion
                    };
                });
                await apiClient.updateTagStepAndRequirements(tag.id, tagDescriptionInputRef.current.value, step.id, currentRowVersion, updatedRequirements, newRequirements);
            }
        } catch (error) {
            handleErrorFromBackend(error, 'Error updating journey, step or requirements');
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
                throw ('error');
            }
        }
        if (tagJourneyOrRequirementsEdited) {
            try {
                await updateTagJourneyAndRequirements(currentRowVersion);
            } catch (error) {
                setLoading(false);
                throw ('error');
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
            true);
    };

    const cancel = (): void => {
        history.push('/');
    };

    return (
        <Container>
            <Header>
                <Typography variant="h1">{tag ? `Editing ${tag.tagNo}` : 'Editing'}</Typography>
                <div>{project.name}</div>
            </Header>
            {
                loading ?
                    <SpinnerContainer>
                        <Spinner large />
                    </SpinnerContainer>
                    :
                    <ContentContainer>
                        <div>
                            {validationErrorMessage &&
                                <ErrorContainer>
                                    <Typography variant="caption">{validationErrorMessage}</Typography>
                                </ErrorContainer>
                            }
                            <InputContainer style={{ maxWidth: '480px' }}>
                                <TextField
                                    id={'Description'}
                                    label='Tag description'
                                    defaultValue={tag ? tag.description : ''}
                                    inputRef={tagDescriptionInputRef}
                                    disabled={tag && !dummyTagTypes.includes(tag.tagType)}
                                    placeholder={'Write here'}
                                    onChange={tagDescriptionChange}
                                />
                            </InputContainer>
                            <InputContainer>
                                <SelectInput
                                    maxHeight={'300px'}
                                    onChange={setJourneyFromForm}
                                    data={mappedJourneys}
                                    label={'Preservation journey for selected tag'}
                                >
                                    {(journey > -1 && journeys[journey].title) || 'Select journey'}
                                </SelectInput>
                            </InputContainer>
                            <InputContainer>
                                <SelectInput
                                    onChange={(stepId): void => setSelectedStep(journey, stepId)}
                                    data={mappedSteps}
                                    disabled={poTag}
                                    label={'Preservation step'}
                                >
                                    {(step && step.title) || 'Select step'}
                                </SelectInput>
                            </InputContainer>
                            <InputContainer style={{ maxWidth: '480px' }}>
                                <TextField
                                    id={'Remark'}
                                    label='Remark for whole preservation journey'
                                    defaultValue={tag ? tag.remark : ''}
                                    inputRef={remarkInputRef}
                                    placeholder={'Write here'}
                                    meta='Optional'
                                    onChange={remarkOrStorageAreaChange}
                                    multiline='true'
                                />
                            </InputContainer>
                            <InputContainer style={{ maxWidth: '150px' }}>
                                <TextField
                                    id={'StorageArea'}
                                    label='Storage area'
                                    defaultValue={tag ? tag.storageArea : ''}
                                    inputRef={storageAreaInputRef}
                                    placeholder='Write here'
                                    meta='Optional'
                                    onChange={remarkOrStorageAreaChange}
                                />
                            </InputContainer>
                            <h2>Requirements for all selected tags</h2>
                            <RequirementsSelector requirementTypes={requirementTypes} requirements={requirements} onChange={(newList): void => setRequirements(newList)} />
                        </div>
                        <ButtonContainer>
                            <Button onClick={cancel} variant="outlined">
                                Cancel
                            </Button>
                            <Button
                                onClick={saveDialog}
                                color="primary"
                                disabled={((!tagJourneyOrRequirementsEdited && !remarkOrStorageAreaEdited) || !step)}
                            >
                                Save
                            </Button>
                        </ButtonContainer>
                    </ContentContainer>
            }
        </Container >

    );
};

export default EditTagProperties;
