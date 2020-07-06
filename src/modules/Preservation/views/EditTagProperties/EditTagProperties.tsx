import { ButtonContainer, Container, Header, InputContainer, SpinnerContainer } from './EditTagProperties.style';
import { TagDetails, Step, Journey, RequirementType } from './types';
import React, { useEffect, useRef, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../components/Select';
import { Button } from '@equinor/eds-core-react';
import { usePreservationContext } from '../../context/PreservationContext';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { TextField } from '@equinor/eds-core-react';
import { useParams, useHistory } from 'react-router-dom';
import RequirementsSelector from '../../components/RequirementsSelector/RequirementsSelector';
import { showModalDialog } from '@procosys/core/services/ModalDialogService';
import Spinner from '@procosys/components/Spinner';
import { Canceler } from 'axios';

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

    const remarkInputRef = useRef<HTMLInputElement>(null);
    const storageAreaInputRef = useRef<HTMLInputElement>(null);

    const [tag, setTag] = useState<TagDetails>();
    const [requirementTypes, setRequirementTypes] = useState<RequirementType[]>([]);
    const [requirements, setRequirements] = useState<RequirementFormInput[]>([]);
    const [remarkOrStorageAreaEdited, setRemarkOrStorageAreaEdited] = useState<boolean>(false);
    const [journeyOrRequirementsEdited, setJourneyOrRequirementsEdited] = useState<boolean>(false);
    const [poTag, setPoTag] = useState<boolean>(false);
    const [originalRequirements, setOriginalRequirements] = useState<RequirementFormInput[]>([]);

    const [loading, setLoading] = useState(true);

    const { tagId } = useParams();

    const [requirementsFetched, setRequirementsFetched] = useState(false);
    const [rowVersion, setRowVersion] = useState<string>('');

    /**
     * Get Journeys
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
                            requirementTypeTitle: itm.requirementTypeTitle,
                            requirementDefinitionTitle: itm.requirementDefinitionTitle,
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
                    setRequirementTypes(response.data);
                } catch (error) {
                    console.error('Get Requirement Types failed: ', error.message, error.data);
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
                const data = await apiClient.getJourneys(false, (cancel: Canceler) => requestCancellor = cancel);
                setJourneys(data);
            } catch (error) {
                console.error('Get Journeys failed: ', error.message, error.data);
                showSnackbarNotification(error.message);
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    useEffect(() => {
        if (journeys.length > 0 && tag && requirementsFetched) {
            const initialJourney = journeys.findIndex((pJourney: Journey) => pJourney.title === tag.journeyTitle);
            setJourney(initialJourney);
            setStep(journeys[initialJourney].steps.find((pStep: Step) => pStep.mode.title === tag.mode));
            setLoading(false);
        }
    }, [tag, journeys, requirementsFetched]);

    /**
     * Map journeys into menu elements
     */
    useEffect(() => {
        const mapped = journeys.map((itm: Journey) => {
            return {
                text: itm.title,
                value: itm.id
            };
        });
        setMappedJourneys(mapped);
    }, [journeys]);


    /**
     * Map Journey steps into menu elements
     */
    useEffect(() => {
        if (newJourney) {
            setStep(null);
        }
        if (journeys.length > 0 && journeys[journey]) {
            const mapped = journeys[journey].steps.map((itm: Step) => {
                if (poTag && itm.mode.title.toUpperCase() == 'SUPPLIER') {
                    setStep(itm);
                }
                return {
                    text: itm.title,
                    value: itm.id
                };
            });
            setMappedSteps(mapped);
        }
    }, [journey]);


    const setJourneyFromForm = (value: number): void => {
        const j = journeys.find((pJourney: Journey) => pJourney.id === value);
        if (j) {
            setJourney(journeys.findIndex((pJourney: Journey) => pJourney.id === value));
            setNewJourney(j.title);
        }
    };

    const setStepFromForm = (stepId: number): void => {
        setStep(journeys[journey].steps.find((pStep: Step) => pStep.id === stepId));
    };


    const remarkOrStorageAreaChange = (): void => {
        if (tag && remarkInputRef.current && storageAreaInputRef.current && (remarkInputRef.current.value != tag.remark || storageAreaInputRef.current.value != tag.storageArea)) {
            setRemarkOrStorageAreaEdited(true);
        } else {
            setRemarkOrStorageAreaEdited(false);
        }
    };

    /**
     * Check if any changes have been made to journey, step or requirements
     */
    useEffect(() => {
        if (tag && ((newJourney && newJourney != tag.journeyTitle) || (step && step.mode.title != tag.mode) || JSON.stringify(requirements) != JSON.stringify(originalRequirements))) {
            setJourneyOrRequirementsEdited(true);
        } else {
            setJourneyOrRequirementsEdited(false);
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
            console.error('Error updating remark and storage area', error.message, error.data);
            throw (showSnackbarNotification(error.message));
        }
    };


    const updateJourneyAndRequirements = async (currentRowVersion: string): Promise<void> => {
        try {
            if (tag && step) {
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
                await apiClient.updateStepAndRequirements(tag.id, step.id, currentRowVersion, updatedRequirements, newRequirements);
            }
        } catch (error) {
            console.error('Error updating journey, step or requirements', error.message, error.data);
            throw (showSnackbarNotification(error.message));

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
        if (journeyOrRequirementsEdited) {
            try {
                await updateJourneyAndRequirements(currentRowVersion);
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
        <div>
            <Header>
                <h1>{tag ? `Editing ${tag.tagNo}` : 'Editing'}</h1>
                <div>{project.name}</div>
            </Header>
            {loading ?
                <SpinnerContainer>
                    <Spinner large />
                </SpinnerContainer>
                :
                <Container>
                    <div>
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
                                onChange={setStepFromForm}
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
                                placeholder={'Write Here'}
                                meta='Optional'
                                onChange={remarkOrStorageAreaChange}
                            />
                        </InputContainer>
                        <InputContainer style={{ maxWidth: '150px' }}>
                            <TextField
                                id={'StorageArea'}
                                label='Storage area'
                                defaultValue={tag ? tag.storageArea : ''}
                                inputRef={storageAreaInputRef}
                                placeholder='Write Here'
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
                            disabled={((!journeyOrRequirementsEdited && !remarkOrStorageAreaEdited) || !step)}
                        >
                            Save
                        </Button>
                    </ButtonContainer>
                </Container>
            }
        </div>

    );
};

export default EditTagProperties;
