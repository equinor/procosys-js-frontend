import { ButtonContainer, Container, Header, InputContainer, SpinnerContainer } from './EditTagProperties.style';
import { TagDetails, Step, Journey, RequirementType } from './types';
import React, { useEffect, useRef, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../components/Select';
import { Button } from '@equinor/eds-core-react';
import { usePreservationContext } from '../../context/PreservationContext';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { TextField } from '@equinor/eds-core-react';
import { useParams, useHistory } from 'react-router-dom';
import { Canceler } from 'axios';
import RequirementsSelector from '../../components/RequirementsSelector/RequirementsSelector';
import { showModalDialog } from '@procosys/core/services/ModalDialogService';
import Spinner from '@procosys/components/Spinner';

interface RequirementFormInput {
    requirementDefinitionId: number;
    intervalWeeks: number;
    requirementTypeTitle?: string;
    requirementDefinitionTitle?: string;
    editingRequirements?: boolean;
    isVoided?: boolean;
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

    const [loading, setLoading] = useState(false);

    const { tagId } = useParams();


    const getTag = async (): Promise<void> => {
        if (tagId) {
            try {
                const details = await apiClient.getTagDetails(Number.parseInt(tagId));
                setTag(details);
                if(details.tagNo.substr(0,4) == '#PO-') {
                    setPoTag(true);
                }
            } catch (error) {
                console.error('Get tag details failed: ', error.message);
            }
        }
    };

    useEffect(() => {
        //console.log(requirements);
    }, [requirements]);

    const getRequirements = async (): Promise<void> => {
        if (tagId) {
            try {
                const response = await apiClient.getTagRequirements(Number.parseInt(tagId));
                const mappedResponse = response.map(itm => {
                    return {
                        requirementDefinitionId: itm.id,
                        intervalWeeks: itm.intervalWeeks,
                        requirementTypeTitle: itm.requirementTypeTitle,
                        requirementDefinitionTitle: itm.requirementDefinitionTitle,
                        editingRequirements: true,
                        isVoided: itm.isVoided
                    };
                });
                setRequirements([...mappedResponse]);
                setOriginalRequirements([...mappedResponse]);
                setLoading(false);
                //console.log('-');
            } catch (error) {
                console.error('Get requirement failed: ', error.messsage, error.data);
                showSnackbarNotification(error.message, 5000);
            }
        }
    };
    
    const getRequirementTypes = async (): Promise<void> => {
        if (tagId) {
            try {
                const response = await apiClient.getRequirementTypes(false);
                setRequirementTypes(response.data);
            } catch (error) {
                console.error('Get Requirement Types failed: ', error.messsage, error.data);
                showSnackbarNotification(error.message, 5000);
            }
        }
    };

    useEffect(() => {
        getTag();
        getRequirements();
        getRequirementTypes();
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
                console.error('Get Journeys failed: ', error.messsage, error.data);
                showSnackbarNotification(error.message, 5000);
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    useEffect(() => {
        if(journeys.length > 0 && tag) {
            if (remarkInputRef.current) {
                remarkInputRef.current.value = tag.remark;
            }
            if (storageAreaInputRef.current) {
                storageAreaInputRef.current.value = tag.storageArea;
            }
            const initialJourney = journeys.findIndex((pJourney: Journey) => pJourney.title === tag.journeyTitle);
            setJourney(initialJourney);
            setStep(journeys[initialJourney].steps.find((pStep: Step) => pStep.mode.title === tag.mode));
        }
    }, [tag, journeys]);


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
        if(journeyOrRequirementsEdited) {
            setStep(null);
        }
        if (journeys.length > 0 && journeys[journey]) {
            const mapped = journeys[journey].steps.map((itm: Step) => {
                if(poTag && itm.mode.title.toUpperCase() == 'SUPPLIER') {
                    setStep(itm);
                }
                return {
                    text: itm.mode.title,
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
    useEffect( () => {
        if (tag && ((newJourney && newJourney != tag.journeyTitle) || (step && step.mode.title != tag.mode) || JSON.stringify(requirements) != JSON.stringify(originalRequirements))) {
            setJourneyOrRequirementsEdited(true);
        } else {
            setJourneyOrRequirementsEdited(false);
        }
    }, [requirements, step, journey, originalRequirements]);


    const updateRemarkAndStorageArea = async (): Promise<void> => {
        try {
            if (tag && remarkInputRef.current && storageAreaInputRef.current) {
                await apiClient.setRemarkAndStorageArea(tag.id, remarkInputRef.current.value, storageAreaInputRef.current.value, tag.rowVersion);
            }
        } catch (error) {
            console.error('Error updating remark and storage area', error.message, error.data);
            showSnackbarNotification(error.message);
        }
    };


    const updateJourneyAndRequirements = async (): Promise<void> => {
        try {
            if (tag && step) {
                let newRequirements: RequirementFormInput[] = [];
                const numberOfNewReq = requirements.length - originalRequirements.length;
                if (requirements.length > originalRequirements.length) {
                    newRequirements = [...requirements.slice(-numberOfNewReq)];
                } 
                await apiClient.updateStepAndRequirements(tag.id, step.id, requirements.slice(0, -numberOfNewReq), newRequirements);
            }
        } catch (error) {
            console.error('Error updating remark and storage area', error.message, error.data);
            showSnackbarNotification(error.message);
        }
    };


    const save = async (): Promise<void> => {
        //setLoading(true);
        if (remarkOrStorageAreaEdited) {
            await updateRemarkAndStorageArea();
        }
        if (journeyOrRequirementsEdited) {
            await updateJourneyAndRequirements();
        }
        showSnackbarNotification('Changes to the tag have been saved');
        history.push('/');
        //setLoading(false);
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
                <h1>{tag ? `Editing ${tag.tagNo}` : 'Editing' }</h1>
                <div>{project.description}</div>
            </Header>
            { loading ? 
                <SpinnerContainer>
                    <Spinner large /> 
                </SpinnerContainer>:
                <Container>
                    <div>
                        <InputContainer>
                            <SelectInput
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
                                {(step && step.mode.title) || 'Select step'}                        
                            </SelectInput>
                        </InputContainer>
                        <InputContainer style={{ maxWidth: '480px' }}>
                            <TextField
                                id={'Remark'}
                                label='Remark for whole preservation journey'
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
                                inputRef={storageAreaInputRef}
                                placeholder='Write Here'
                                meta='Optional'
                                onChange={remarkOrStorageAreaChange}
                            />
                        </InputContainer>
                        <h2>Requirements for all selected tags</h2>
                        <RequirementsSelector requirementTypes={requirementTypes} requirements={requirements} onChange={(newList): void => setRequirements(newList)}/>
                    </div>
                    <ButtonContainer>
                        <Button  onClick={cancel} variant="outlined">
                        Cancel
                        </Button>
                        <Button
                            onClick={saveDialog}
                            color="primary"
                            disabled={((!journeyOrRequirementsEdited && !remarkOrStorageAreaEdited) || !step)}
                        >
                            {'Save'}
                        </Button>
                    </ButtonContainer>
                </Container>
            }
        </div>

    );
};

export default EditTagProperties;
