import {
    ButtonContainer,
    CenterContent,
    Container,
    Header,
    InputContainer,
    RequirementMessage,
} from './SetTagProperties.style';
import { Journey, Requirement, RequirementType, Step } from '../types';
import React, { useEffect, useRef, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../../components/Select';
import { TextField, Typography } from '@equinor/eds-core-react';

import { AddScopeMethod } from '../AddScope';
import { Button } from '@equinor/eds-core-react';
import RequirementsSelector from '@procosys/modules/Preservation/components/RequirementsSelector/RequirementsSelector';
import Spinner from '../../../../../components/Spinner';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { usePreservationContext } from '../../../context/PreservationContext';
import { useDirtyContext } from '@procosys/core/DirtyContext';

type SetTagPropertiesProps = {
    areaType: string;
    submitForm: (
        stepId: number,
        requirements: Requirement[],
        remark?: string | null,
        storageArea?: string
    ) => Promise<void>;
    previousStep: () => void;
    journeys: Journey[];
    requirementTypes: RequirementType[];
    addScopeMethod: AddScopeMethod;
    isLoading: boolean;
};

interface RequirementFormInput {
    requirementDefinitionId: number | null;
    intervalWeeks: number | null;
}

const moduleName = 'PreservationAddScopeSetTagProperties';

const SetTagProperties = ({
    areaType,
    submitForm,
    previousStep,
    journeys = [],
    requirementTypes = [],
    addScopeMethod,
    isLoading,
}: SetTagPropertiesProps): JSX.Element => {
    const { project } = usePreservationContext();

    const [journey, setJourney] = useState(-1);
    const [step, setStep] = useState<Step | null>();
    const [requirements, setRequirements] = useState<RequirementFormInput[]>(
        []
    );
    const [remark, setRemark] = useState<string>('');
    const [storageArea, setStorageArea] = useState<string>('');
    const [formIsValid, setFormIsValid] = useState(false);
    const [mappedJourneys, setMappedJourneys] = useState<SelectItem[]>([]);
    const [mappedSteps, setMappedSteps] = useState<SelectItem[]>([]);

    const { setDirtyStateFor, unsetDirtyStateFor } = useDirtyContext();

    const hasUnsavedChanges = (): boolean => {
        return (
            (journey && journey != -1) ||
            (step && step != null) ||
            (requirements && requirements.length > 0) ||
            remark != '' ||
            storageArea != ''
        );
    };

    /** Update global dirty state */
    useEffect(() => {
        if (hasUnsavedChanges()) {
            setDirtyStateFor(moduleName);
        } else {
            unsetDirtyStateFor(moduleName);
        }
        return (): void => {
            unsetDirtyStateFor(moduleName);
        };
    }, [journey, step, requirements, remark, storageArea]);

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
                const hasAllPropertiesSet = (
                    req: RequirementFormInput
                ): boolean => {
                    return (
                        req.intervalWeeks != null &&
                        req.requirementDefinitionId != null
                    );
                };
                const requirementsIsValid =
                    requirements.every(hasAllPropertiesSet);

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
                value: itm.id,
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
                if (areaType == 'PoArea' && itm.mode.forSupplier) {
                    setStep(itm);
                }
                return {
                    text: itm.title,
                    value: itm.id,
                };
            });
            setMappedSteps(mapped);
        }
    }, [journey]);

    const submit = async (): Promise<void> => {
        if (step) {
            if (addScopeMethod === AddScopeMethod.AddTagsAutoscope) {
                await submitForm(step.id, [], remark, storageArea);
            } else {
                const requirementsMappedForApi: Requirement[] = [];
                requirements.forEach((req) => {
                    if (
                        req.intervalWeeks != null &&
                        req.requirementDefinitionId != null
                    ) {
                        requirementsMappedForApi.push({
                            requirementDefinitionId:
                                req.requirementDefinitionId,
                            intervalWeeks: req.intervalWeeks,
                        });
                    }
                });
                if (requirementsMappedForApi.length > 0) {
                    await submitForm(
                        step.id,
                        requirementsMappedForApi,
                        remark,
                        storageArea
                    );
                } else {
                    showSnackbarNotification(
                        'Error occured. Requirements are not provided.',
                        5000
                    );
                }
            }
        } else {
            showSnackbarNotification(
                'Error occured. Step is not provided.',
                5000
            );
        }
    };

    const setJourneyFromForm = (value: number): void => {
        setJourney(
            journeys.findIndex((pJourney: Journey) => pJourney.id === value)
        );
    };

    const setStepFromForm = (stepId: number): void => {
        const step = journeys[journey].steps.find(
            (pStep: Step) => pStep.id === stepId
        );
        setStep(step);
    };

    if (
        journeys.length <= 0 ||
        (addScopeMethod !== AddScopeMethod.AddTagsAutoscope &&
            requirementTypes.length <= 0)
    ) {
        return (
            <div>
                <Header>
                    <Typography variant="h1">Add preservation scope</Typography>
                    <div>{project.name}</div>
                </Header>
                <Container>
                    <div>
                        Missing journey or requirement definitions. Please
                        create this first, and try again.
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
                {addScopeMethod === AddScopeMethod.MigrateTags && (
                    <Typography variant="h1">
                        Migrate preservation scope
                    </Typography>
                )}

                {addScopeMethod !== AddScopeMethod.MigrateTags && (
                    <Typography variant="h1">Add preservation scope</Typography>
                )}

                <div>{project.name}</div>
            </Header>
            <Container>
                <div>
                    <InputContainer>
                        <SelectInput
                            maxHeight={'300px'}
                            onChange={setJourneyFromForm}
                            data={mappedJourneys}
                            label={'Preservation journey for all selected tags'}
                        >
                            {(journey > -1 && journeys[journey].title) ||
                                'Select journey'}
                        </SelectInput>
                    </InputContainer>
                    <InputContainer>
                        <SelectInput
                            onChange={setStepFromForm}
                            data={mappedSteps}
                            disabled={
                                mappedSteps.length <= 0 || areaType == 'PoArea'
                            }
                            label={'Preservation step'}
                        >
                            {(step && step.title) || 'Select step'}
                        </SelectInput>
                    </InputContainer>
                    <InputContainer style={{ maxWidth: '480px' }}>
                        <TextField
                            id={'Remark'}
                            label="Remark for whole preservation journey"
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ): void => setRemark(e.target.value)}
                            value={remark}
                            placeholder="Write here"
                            helpertext="For example: Check according to predecure 123, or check specifications from supplier"
                            meta="Optional"
                        />
                    </InputContainer>
                    <InputContainer style={{ maxWidth: '150px' }}>
                        <TextField
                            id={'StorageArea'}
                            label="Storage area"
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ): void => setStorageArea(e.target.value)}
                            value={storageArea}
                            placeholder="Write here"
                            helpertext="For example: AR123"
                            meta="Optional"
                        />
                    </InputContainer>

                    {addScopeMethod === AddScopeMethod.AddTagsAutoscope && (
                        <RequirementMessage>
                            Requirements are automatically added for each tag
                            function. Changes to requirements can be done after
                            adding to scope.
                        </RequirementMessage>
                    )}
                    {addScopeMethod !== AddScopeMethod.AddTagsAutoscope && (
                        <>
                            <h2>Requirements for all selected tags</h2>
                            <RequirementsSelector
                                requirementTypes={requirementTypes}
                                requirements={requirements}
                                onChange={(newList): void =>
                                    setRequirements(newList)
                                }
                            />
                        </>
                    )}
                </div>
                <ButtonContainer>
                    <Button
                        onClick={previousStep}
                        variant="outlined"
                        disabled={isLoading}
                    >
                        Previous
                    </Button>
                    <Button
                        onClick={submit}
                        color="primary"
                        disabled={!formIsValid || isLoading}
                    >
                        {isLoading && (
                            <CenterContent>
                                <Spinner /> Add to scope
                            </CenterContent>
                        )}
                        {!isLoading && 'Add to scope'}
                    </Button>
                </ButtonContainer>
            </Container>
        </div>
    );
};

export default SetTagProperties;
