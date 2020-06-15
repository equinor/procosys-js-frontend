import { ButtonContainer, CenterContent, Container, Header, InputContainer } from './EditTagProperties.style';
import { TagDetails, Step, Journey, RequirementType } from './types';
import React, { useEffect, useRef, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../components/Select';
import { Button } from '@equinor/eds-core-react';
import Spinner from '../../../../components/Spinner';
import { usePreservationContext } from '../../context/PreservationContext';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { TextField } from '@equinor/eds-core-react';
import { useParams, useHistory } from 'react-router-dom';
import { Canceler } from 'axios';
import RequirementsSelector from '../../components/RequirementsSelector/RequirementsSelector';

interface RequirementFormInput {
    requirementDefinitionId: number | null;
    intervalWeeks: number | null;
    requirementTypeTitle?: string;
    requirementDefinitionTitle?: string;
    disabledRequirement?: boolean;
}

const SetTagProperties = (): JSX.Element => {
    const { apiClient, project } = usePreservationContext();
    const history = useHistory();

    const [journey, setJourney] = useState(-1);
    const [journeys, setJourneys] = useState<Journey[]>([]);
    const [step, setStep] = useState<Step | null>();
    const remarkInputRef = useRef<HTMLInputElement>(null);
    const storageAreaInputRef = useRef<HTMLInputElement>(null);
    //const [formIsValid, setFormIsValid] = useState(false);
    const [tag, setTag] = useState<TagDetails>();
    const [requirementTypes, setRequirementTypes] = useState<RequirementType[]>([]);
    const [requirements, setRequirements] = useState<RequirementFormInput[]>([]);

    const [mappedJourneys, setMappedJourneys] = useState<SelectItem[]>([]);
    const [mappedSteps, setMappedSteps] = useState<SelectItem[]>([]);

    const [isLoading] = useState<boolean>(false);

    const { tagId } = useParams();

    const getTag = async (): Promise<void> => {
        if (tagId) {
            try {
                const details = await apiClient.getTagDetails(Number.parseInt(tagId));
                setTag(details);
                
            } catch (error) {
                console.error('Get tag details failed: ', error.message);
            }
        }
    };

    const getRequirements = async (): Promise<void> => {
        if (tagId) {
            try {
                const response = await apiClient.getTagRequirements(Number.parseInt(tagId));
                setRequirements(response.map(itm => {
                    return {
                        requirementDefinitionId: itm.id,
                        intervalWeeks: itm.intervalWeeks,
                        requirementTypeTitle: itm.requirementTypeTitle,
                        requirementDefinitionTitle: itm.requirementDefinitionTitle,
                        disabledRequirement: true,
                    };
                }));
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
            setStep(journeys[initialJourney].steps.find((pStep: Step) => pStep.title === tag.mode));
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
        setStep(null);
        if (journeys.length > 0 && journeys[journey]) {
            const mapped = journeys[journey].steps.map((itm: Step) => {
                return {
                    text: itm.mode.title,
                    value: itm.id
                };
            });
            setMappedSteps(mapped);
        }
    }, [journey]);


    const setJourneyFromForm = (value: number): void => {
        setJourney(journeys.findIndex((pJourney: Journey) => pJourney.id === value));
    };



    // const submit = async (): Promise<void> => {
    //     setIsLoading(true);
    //     // const remarkValue = remarkInputRef.current && remarkInputRef.current.value || null;
    //     // let storageAreaValue;
    //     // if (storageAreaInputRef.current) {
    //     //     storageAreaValue = storageAreaInputRef.current.value;
    //     // }

    //     if (step) {
    //         // if (addScopeMethod === AddScopeMethod.AddTagsAutoscope) {
    //         //     await submitForm(step.id, [], remarkValue, storageAreaValue);
    //         // } else {
    //         //     const requirementsMappedForApi: Requirement[] = [];
    //         //     requirements.forEach((req) => {
    //         //         if (req.intervalWeeks != null && req.requirementDefinitionId != null) {
    //         //             requirementsMappedForApi.push({
    //         //                 requirementDefinitionId: req.requirementDefinitionId,
    //         //                 intervalWeeks: req.intervalWeeks
    //         //             });
    //         //         }
    //         //     });
    //         //     if (requirementsMappedForApi.length > 0) {
    //         //         await submitForm(step.id, requirementsMappedForApi, remarkValue, storageAreaValue);
    //         //     } else {
    //         //         showSnackbarNotification('Error occured. Requirements are not provided.', 5000);
    //         //     }
    //         // }
    //     } else {
    //         showSnackbarNotification('Error occured. Step is not provided.', 5000);
    //     }
    //     setIsLoading(false);
    // };

    // const setJourneyFromForm = (value: number): void => {
    //     setJourney(journeys.findIndex((pJourney: Journey) => pJourney.id === value));
    // };

    // const setStepFromForm = (stepId: number): void => {
    //     const step = journeys[journey].steps.find((pStep: Step) => pStep.id === stepId);
    //     setStep(step);
    // };

    const cancel = (): void => {
        history.push('/');
    };

    return (
        <div>
            <Header>
                <h1>Edit preservation scope</h1>
                <div>{project.description}</div>
            </Header>
            <Container>
                <div>
                    <InputContainer>
                        <SelectInput
                            onChange={setJourneyFromForm}
                            data={mappedJourneys}
                            label={'Preservation journey for all selected tags'}
                        >
                            {(journey > -1 && journeys[journey].title) || 'Select journey'}
                        </SelectInput>
                    </InputContainer>
                    <InputContainer>
                        <SelectInput
                            //onChange={setStepFromForm}
                            data={mappedSteps}
                            //disabled={mappedSteps.length <= 0 || areaType == 'PoArea'}
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
                            helpertext='For example: Check according to predecure 123, or check specifications from supplier'
                            meta='Optional'
                        />
                    </InputContainer>
                    <InputContainer style={{ maxWidth: '150px' }}>
                        <TextField
                            id={'StorageArea'}
                            label='Storage area'
                            inputRef={storageAreaInputRef}
                            placeholder='Write Here'
                            helpertext='For example: AR123'
                            meta='Optional'
                        />
                    </InputContainer>
                    <h2>Requirements for all selected tags</h2>
                    <RequirementsSelector requirementTypes={requirementTypes} requirements={requirements} onChange={(newList): void => setRequirements(newList)}/>
                </div>
                <ButtonContainer>
                    <Button  onClick={cancel} variant="outlined" disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        //onClick={submit}
                        color="primary"
                        //disabled={(!formIsValid || isLoading)}
                    >
                        {isLoading && (
                            <CenterContent>
                                <Spinner /> Save
                            </CenterContent>
                        )}
                        {!isLoading && ('Save')}
                    </Button>
                </ButtonContainer>
            </Container>
        </div>

    );
};

export default SetTagProperties;
