import { ButtonContainer, CenterContent, Container, Header, InputContainer, RequirementMessage } from './SetTagProperties.style';
import { Journey, Requirement, RequirementType, Step } from '../types';
import React, { useEffect, useRef, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../../components/Select';
import { Button } from '@equinor/eds-core-react';
import Spinner from '../../../../../components/Spinner';
import { usePreservationContext } from '../../../context/PreservationContext';
import { AddScopeMethod } from '../AddScope';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { TextField } from '@equinor/eds-core-react';
import RequirementsSelector from '@procosys/modules/Preservation/components/RequirementsSelector/RequirementsSelector';

type SetTagPropertiesProps = {
    areaType: string;
    submitForm: (stepId: number, requirements: Requirement[], remark?: string | null, storageArea?: string) => Promise<void>;
    previousStep: () => void;
    journeys: Journey[];
    requirementTypes: RequirementType[];
    addScopeMethod: AddScopeMethod;
};

interface RequirementFormInput {
    requirementDefinitionId: number | null;
    intervalWeeks: number | null;
}

const SetTagProperties = ({
    areaType,
    submitForm,
    previousStep,
    journeys = [],
    requirementTypes = [],
    addScopeMethod,
}: SetTagPropertiesProps): JSX.Element => {
    const { project } = usePreservationContext();

    const [journey, setJourney] = useState(-1);
    const [step, setStep] = useState<Step | null>();
    const [requirements, setRequirements] = useState<RequirementFormInput[]>([]);
    const remarkInputRef = useRef<HTMLInputElement>(null);
    const storageAreaInputRef = useRef<HTMLInputElement>(null);
    const [formIsValid, setFormIsValid] = useState(false);

    const [mappedJourneys, setMappedJourneys] = useState<SelectItem[]>([]);
    const [mappedSteps, setMappedSteps] = useState<SelectItem[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    /**
     * Form validation
     */
    useEffect(() => {
        if (journey > -1 && step) {
            if (addScopeMethod === AddScopeMethod.AddTagsAutoscope) {
                //For autoscoping, the requiremnts will be added automatically based on tag function
                setFormIsValid(true);
                return;
            }

            if (requirements.length > 0) {
                const hasAllPropertiesSet = (req: RequirementFormInput): boolean => {
                    return req.intervalWeeks != null && req.requirementDefinitionId != null;
                };
                const requirementsIsValid = requirements.every(hasAllPropertiesSet);

                setFormIsValid(requirementsIsValid);
                return;
            }
        }
        setFormIsValid(false);
    }, [journey, step, requirements]);

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
                if (areaType == 'PoArea' && itm.mode.title.toUpperCase() == 'SUPPLIER') {
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


    const submit = async (): Promise<void> => {
        setIsLoading(true);
        const remarkValue = remarkInputRef.current && remarkInputRef.current.value || null;
        let storageAreaValue;
        if (storageAreaInputRef.current) {
            storageAreaValue = storageAreaInputRef.current.value;
        }

        if (step) {
            if (addScopeMethod === AddScopeMethod.AddTagsAutoscope) {
                await submitForm(step.id, [], remarkValue, storageAreaValue);
            } else {
                const requirementsMappedForApi: Requirement[] = [];
                requirements.forEach((req) => {
                    if (req.intervalWeeks != null && req.requirementDefinitionId != null) {
                        requirementsMappedForApi.push({
                            requirementDefinitionId: req.requirementDefinitionId,
                            intervalWeeks: req.intervalWeeks
                        });
                    }
                });
                if (requirementsMappedForApi.length > 0) {
                    setIsLoading(false);
                    await submitForm(step.id, requirementsMappedForApi, remarkValue, storageAreaValue);
                } else {
                    showSnackbarNotification('Error occured. Requirements are not provided.', 5000);
                }
            }
        } else {
            showSnackbarNotification('Error occured. Step is not provided.', 5000);
        }
        setIsLoading(false);
    };

    const setJourneyFromForm = (value: number): void => {
        setJourney(journeys.findIndex((pJourney: Journey) => pJourney.id === value));
    };

    const setStepFromForm = (stepId: number): void => {
        const step = journeys[journey].steps.find((pStep: Step) => pStep.id === stepId);
        setStep(step);
    };


    if (journeys.length <= 0 || (addScopeMethod !== AddScopeMethod.AddTagsAutoscope && requirementTypes.length <= 0)) {
        return (
            <div>
                <Header>
                    <h1>Add preservation scope</h1>
                    <div>{project.description}</div>
                </Header>
                <Container>
                    <div>
                        Missing data
                    </div>
                    <ButtonContainer>
                        <Button onClick={previousStep} variant="outlined">
                            Previous
                        </Button>
                    </ButtonContainer>
                </Container>
            </div>
        );
    }

    return (
        <div>
            <Header>

                {
                    addScopeMethod === AddScopeMethod.MigrateTags && (
                        <h1>Migrate preservation scope</h1>
                    )
                }

                {
                    addScopeMethod !== AddScopeMethod.MigrateTags && (
                        <h1>Add preservation scope</h1>
                    )
                }

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
                            onChange={setStepFromForm}
                            data={mappedSteps}
                            disabled={mappedSteps.length <= 0 || areaType == 'PoArea'}
                            label={'Preservation step'}
                        >
                            {(step && step.mode.title) || 'Select step'}
                        </SelectInput>
                    </InputContainer>
                    <InputContainer style={{ maxWidth: '480px' }}>
                        <TextField
                            id={'Remark'}
                            label="Remark for whole preservation journey"
                            inputRef={remarkInputRef}
                            placeholder="Write Here"
                            helpertext="For example: Check according to predecure 123, or check specifications from supplier"
                            meta="Optional"
                        />
                    </InputContainer>
                    <InputContainer style={{ maxWidth: '150px' }}>
                        <TextField
                            id={'StorageArea'}
                            label="Storage area"
                            inputRef={storageAreaInputRef}
                            placeholder="Write Here"
                            helpertext="For example: AR123"
                            meta="Optional"
                        />
                    </InputContainer>

                    {
                        addScopeMethod === AddScopeMethod.AddTagsAutoscope && (
                            <RequirementMessage>Requirements are automatically added for each Tag Function. Changes to requirements can be done after adding to scope.</RequirementMessage>
                        )
                    }
                    {
                        addScopeMethod !== AddScopeMethod.AddTagsAutoscope && (
                            <>
                                <h2>Requirements for all selected tags</h2>
                                <RequirementsSelector requirementTypes={requirementTypes} requirements={requirements} onChange={(newList): void => setRequirements(newList)} />
                            </>
                        )
                    }
                </div>
                <ButtonContainer>
                    <Button onClick={previousStep} variant="outlined" disabled={isLoading}>
                        Previous
                    </Button>
                    <Button
                        onClick={submit}
                        color="primary"
                        disabled={(!formIsValid || isLoading)}
                    >
                        {isLoading && (
                            <CenterContent>
                                <Spinner /> Add to Scope
                            </CenterContent>
                        )}
                        {!isLoading && ('Add to scope')}
                    </Button>
                </ButtonContainer>
            </Container>
        </div>

    );
};

export default SetTagProperties;
