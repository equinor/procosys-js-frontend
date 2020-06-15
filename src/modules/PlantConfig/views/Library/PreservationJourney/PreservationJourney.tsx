import React, { useState, useEffect } from 'react';
import { usePlantConfigContext } from '@procosys/modules/PlantConfig/context/PlantConfigContext';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { Container, InputContainer, StepsContainer, FormFieldSpacer, ButtonContainer, ButtonSpacer, IconContainer } from './PreservationJourney.style';
import EdsIcon from '../../../../../components/EdsIcon';
import { TextField, Typography, Button } from '@equinor/eds-core-react';
import SelectInput, { SelectItem } from '../../../../../components/Select';
import { Canceler } from 'axios';
import Spinner from '@procosys/components/Spinner';

const addIcon = <EdsIcon name='add' size={16} />;
const upIcon = <EdsIcon name='arrow_up' size={16} />;
const downIcon = <EdsIcon name='arrow_down' size={16} />;
const deleteIcon = <EdsIcon name='delete_to_trash' size={16} />;

interface Journey {
    id: number;
    title: string;
    isVoided: boolean;
    steps: Step[];
    rowVersion: string;
}

interface Step {
    id: number;
    title: string;
    isVoided: boolean;
    mode: {
        id: number;
        rowVersion: string;
    };
    responsible: {
        code: string;
        title: string;
        rowVersion: string;
    };
    rowVersion: string;
}

type PreservationJourneyProps = {
    journeyId: number;
};

const PreservationJourney = (props: PreservationJourneyProps): JSX.Element => {

    const createNewJourney = (): Journey => {
        return { id: -1, title: '', isVoided: false, steps: [], rowVersion: '' };
    };

    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [journey, setJourney] = useState<Journey | null>(null);
    const [newJourney, setNewJourney] = useState<Journey>(createNewJourney);
    const [mappedModes, setMappedModes] = useState<SelectItem[]>([]);
    const [mappedResponsibles, setMappedResponsibles] = useState<SelectItem[]>([]);
    const [isDirty, setIsDirty] = useState<boolean>(false);

    const {
        preservationApiClient
    } = usePlantConfigContext();

    const cloneJourney = (journey: Journey): Journey => {
        return JSON.parse(JSON.stringify(journey));
    };

    /**
     * Get Modes
     */
    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                const modes = await preservationApiClient.getModes((cancel: Canceler) => requestCancellor = cancel);
                const mappedModes: SelectItem[] = [];

                modes.forEach(mode => mappedModes.push({ text: mode.title, value: mode.id, selected: false }));
                setMappedModes(mappedModes);

            } catch (error) {
                console.error('Get Modes failed: ', error.messsage, error.data);
                showSnackbarNotification(error.message, 5000);
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    /**
    * Get responsibles
    */
    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            setIsLoading(true);
            try {
                const responsibles = await preservationApiClient.getResponsibles((cancel: Canceler) => requestCancellor = cancel);
                const mappedResponsibles: SelectItem[] = [];

                responsibles.forEach(resp => mappedResponsibles.push({ text: resp.title, value: resp.code, selected: false }));
                setMappedResponsibles(mappedResponsibles);
            } catch (error) {
                console.error('Get Responsibles failed: ', error.messsage, error.data);
                showSnackbarNotification(error.message, 5000);
            }
            setIsLoading(false);
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);


    const getJourney = async (journeyId: number): Promise<void> => {
        setIsLoading(true);
        try {
            await preservationApiClient.getJourney(journeyId).then(
                (response) => {
                    setJourney(response);
                    setNewJourney(cloneJourney(response));
                }
            );
        } catch (error) {
            console.error('Get preservation journey failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message, 5000);
        }
        setIsLoading(false);
    };

    useEffect((): void => {
        if (props.journeyId) {
            getJourney(props.journeyId);
            setIsEditMode(true);
        } else {
            setJourney(null);
            setIsEditMode(false);
        }
    }, [props.journeyId]);

    const saveNewStep = async (journeyId: number, step: Step): Promise<boolean> => {
        try {
            await preservationApiClient.addStepToJourney(journeyId, step.title, step.mode.id, step.responsible.code);
            return true;
        } catch (error) {
            console.error('Add journey failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message, 5000);
            return false;
        }
    };

    const saveNewJourney = async (): Promise<void> => {
        try {
            const journeyId = await preservationApiClient.addJourney(newJourney.title);

            for await (const step of newJourney.steps) {
                await saveNewStep(journeyId, step);
            }
            getJourney(journeyId);
            showSnackbarNotification('New journey is saved.', 5000);
        } catch (error) {
            console.error('Add journey failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message, 5000);
        }
    };

    const updateJourney = async (): Promise<boolean> => {
        try {
            await preservationApiClient.updateJourney(newJourney.id, newJourney.title, newJourney.rowVersion);
            return true;
        } catch (error) {
            console.error('Update journey failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message, 5000);
            return false;
        }
    };

    const saveUpdatedStep = async (step: Step): Promise<boolean> => {
        if (journey) {
            const originalStep = journey.steps.find((s) => s.id == step.id);
            if (JSON.stringify(originalStep) !== JSON.stringify(step)) {
                //There are changes to save
                try {
                    await preservationApiClient.updateJourneyStep(newJourney.id, step.id, step.title, step.mode.id, step.responsible.code, step.rowVersion);
                    return true;
                } catch (error) {
                    console.error('Update journey failed: ', error.messsage, error.data);
                    console.log('error is: ', error.message);
                    showSnackbarNotification(error.message, 5000);
                    return false;
                }
            }
        }
        return false;
    };

    const saveUpdatedJourney = async (): Promise<void> => {
        let isSaved = false;
        let error = false;

        if (journey && journey.title != newJourney.title) {
            isSaved = await updateJourney();
            if (!isSaved) {
                error = true;
            }
        }

        for await (const step of newJourney.steps) {
            if (step.id === -1) {
                isSaved = await saveNewStep(newJourney.id, step);
                if (!isSaved) {
                    error = true;
                }
            } else {
                if (journey) {
                    const originalStep = journey.steps.find((s) => s.id == step.id);

                    if (originalStep === null) {
                        console.log('Error occured when trying to save update to a step that was not found in the journey.');
                        showSnackbarNotification('Error occured when trying to save update to a step that was not found in the journey.', 5000);
                        return;
                    }

                    if (JSON.stringify(originalStep) !== JSON.stringify(step)) {
                        isSaved = await saveUpdatedStep(step);
                        if (!isSaved) {
                            error = true;
                        }
                    }
                }
            }
        }
        if (error) {
            getJourney(newJourney.id);
        } else if (isSaved) {
            getJourney(newJourney.id);
            showSnackbarNotification('Changes for journey is saved.', 5000);
        } else {
            showSnackbarNotification('No changes need to be saved.', 5000);
        }
    };

    const handleSave = (): void => {
        if (newJourney.id === -1) {
            saveNewJourney();
        } else {
            saveUpdatedJourney();
        }
        setIsDirty(false);
    };

    const cancel = (): void => {
        if (isDirty && !confirm('Do you want to cancel changes without saving?')) {
            return;
        }
        setJourney(null);
        setIsEditMode(false);
    };

    const voidJourney = async (): Promise<void> => {
        if (journey) {
            setIsLoading(true);
            try {
                await preservationApiClient.voidJourney(journey.id, journey.rowVersion);
                getJourney(journey.id);
                showSnackbarNotification('Journey is voided.', 5000);
            } catch (error) {
                console.error('Error occured when trying to void journey: ', error.messsage, error.data);
                showSnackbarNotification(error.message, 5000);
            }
            setIsLoading(false);
        }
    };

    const unvoidJourney = async (): Promise<void> => {
        if (journey) {
            setIsLoading(true);
            try {
                await preservationApiClient.unvoidJourney(journey.id, journey.rowVersion);
                getJourney(journey.id);
                showSnackbarNotification('Journey is unvoided.', 5000);
            } catch (error) {
                console.error('Error occured when trying to unvoid journey: ', error.messsage, error.data);
                showSnackbarNotification(error.message, 5000);
            }
            setIsLoading(false);
        }
    };

    const initNewJourney = (): void => {
        setNewJourney(createNewJourney());
        setIsEditMode(true);
    };

    const setJourneyTitleValue = (value: string): void => {
        setIsDirty(true);
        newJourney.title = value;
        setNewJourney(cloneJourney(newJourney));
    };

    const setModeValue = (value: number, index: number): void => {
        setIsDirty(true);
        newJourney.steps[index].mode.id = value;
        setNewJourney(cloneJourney(newJourney));
    };

    const setResponsibleValue = (value: string, index: number): void => {
        if (newJourney.steps) {
            setIsDirty(true);
            newJourney.steps[index].responsible.code = value;
            setNewJourney(cloneJourney(newJourney));
        }
    };

    const setStepTitleValue = (value: string, index: number): void => {
        if (newJourney.steps) {
            setIsDirty(true);
            newJourney.steps[index].title = value;
            setNewJourney(cloneJourney(newJourney));
        }
    };

    const addNewStep = (): void => {
        setIsDirty(true);
        const newStep: Step = {
            id: -1,
            title: '',
            isVoided: false,
            mode: {
                id: -1,
                rowVersion: ''
            },
            responsible: {
                code: '',
                title: '',
                rowVersion: ''
            },
            rowVersion: ''
        };

        newJourney.steps.push(newStep);

        setNewJourney(cloneJourney(newJourney));
    };

    const swapSteps = async (stepA: Step, stepB: Step): Promise<void> => {
        setIsLoading(true);
        try {
            await preservationApiClient.swapStepsOnJourney(newJourney.id, stepA.id, stepA.rowVersion, stepB.id, stepB.rowVersion);
            getJourney(newJourney.id);
            showSnackbarNotification('Step is moved.', 5000);
        } catch (error) {
            console.error('Swap steps failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message, 5000);
        }
        setIsLoading(false);
    };


    const moveStepDown = (stepIndex: number): void => {
        const steps = newJourney.steps;
        if (steps.length > 1 && stepIndex + 1 < steps.length) {
            swapSteps(steps[stepIndex], steps[stepIndex + 1]);
        } else {
            showSnackbarNotification('Step cannot be moved further down.', 5000);
        }
    };

    const moveStepUp = (stepIndex: number): void => {
        const steps = newJourney.steps;
        if (steps.length > 1 && stepIndex > 0) {
            swapSteps(steps[stepIndex], steps[stepIndex - 1]);
        } else {
            showSnackbarNotification('Step cannot be moved further up.', 5000);
        }
    };

    const deleteStep = (stepIndex: number): void => {
        console.log(stepIndex);
    };

    if (isLoading) {
        return <Spinner large />;
    }

    if (!isEditMode) {
        return (
            <Container>
                <IconContainer>
                    <Button variant='ghost' onClick={initNewJourney}>
                        {addIcon} New Preservation Journey
                    </Button>
                </IconContainer>
            </Container>);
    }

    return (
        <Container>
            {newJourney.isVoided &&
                <Typography bold variant="caption" style={{ marginLeft: 'calc(var(--grid-unit) * 2)' }}>Journey is voided</Typography>
            }
            <ButtonContainer>
                {newJourney.isVoided &&
                    <Button variant="outlined" onClick={unvoidJourney}>
                        Unvoid
                    </Button>
                }

                {!newJourney.isVoided &&
                    <Button variant="outlined" onClick={voidJourney}>
                        Void
                    </Button>
                }
                <ButtonSpacer />
                <Button variant="outlined" onClick={cancel} disabled={newJourney.isVoided}>
                    Cancel
                </Button>
                <ButtonSpacer />
                <Button onClick={handleSave} disabled={newJourney.isVoided || !isDirty}>
                    Save
                </Button>
            </ButtonContainer>

            <InputContainer style={{ width: '280px' }}>
                <TextField
                    id={'title'}
                    label='Title for this journey'
                    value={newJourney.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { setJourneyTitleValue(e.target.value); }}
                    placeholder="Write Here"
                    disabled={newJourney.isVoided}
                />
            </InputContainer>

            <StepsContainer>

                {newJourney.steps && newJourney.steps.map((step, index) => {
                    const modeSelectItem: SelectItem | undefined = mappedModes.find(mode => mode.value === step.mode.id);
                    const responsibleSelectItem: SelectItem | undefined = mappedResponsibles.find(resp => resp.value === step.responsible.code);


                    return (
                        <React.Fragment key={`step._${index}`}>

                            <FormFieldSpacer>
                                <div style={{ width: '100%' }}>
                                    <SelectInput
                                        onChange={(value): void => setModeValue(value, index)}
                                        data={mappedModes}
                                        label={'Mode'}
                                        disabled={newJourney.isVoided}
                                    >
                                        {(modeSelectItem && modeSelectItem.text || 'Select mode')}
                                    </SelectInput>
                                </div>
                            </FormFieldSpacer>

                            <FormFieldSpacer>
                                <div style={{ width: '100%' }}>
                                    <SelectInput
                                        onChange={(value): void => setResponsibleValue(value, index)}
                                        data={mappedResponsibles}
                                        label={'Resp'}
                                        disabled={newJourney.isVoided}
                                    >
                                        {(responsibleSelectItem && responsibleSelectItem.text || 'Select responsible')}
                                    </SelectInput>
                                </div>
                            </FormFieldSpacer>
                            <FormFieldSpacer>
                                <div style={{ minWidth: '300px' }}>
                                    <TextField
                                        id={'titleStep'}
                                        label="Title for this step"
                                        value={step.title}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setStepTitleValue(e.target.value, index)}
                                        placeholder="Write Here"
                                        disabled={newJourney.isVoided}
                                    />
                                </div>
                            </FormFieldSpacer>
                            <FormFieldSpacer>
                                {newJourney.steps.length > 1 &&
                                    <>
                                        <Button disabled={newJourney.isVoided || step.id === -1} variant='ghost' onClick={(): void => moveStepUp(index)}>
                                            {upIcon}
                                        </Button>
                                        <Button disabled={newJourney.isVoided || step.id === -1} variant='ghost' onClick={(): void => moveStepDown(index)}>
                                            {downIcon}
                                        </Button>
                                    </>
                                }
                                <Button disabled={newJourney.isVoided} variant='ghost' onClick={(): void => deleteStep(index)}>
                                    {deleteIcon}
                                </Button>

                            </FormFieldSpacer>

                        </React.Fragment>
                    );
                })}
            </StepsContainer>

            {
                !newJourney.isVoided &&
                <IconContainer>
                    <Button variant='ghost' onClick={addNewStep}>
                        {addIcon} Add step
                    </Button>
                </IconContainer>
            }


        </Container >

    );
};

export default PreservationJourney;
