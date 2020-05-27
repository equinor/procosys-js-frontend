import React, { useState, useEffect } from 'react';
import { usePlantConfigContext } from '@procosys/modules/PlantConfig/context/PlantConfigContext';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { Container, InputContainer, StepsContainer, FormFieldSpacer, ButtonContainer, ButtonSpacer, IconContainer } from './PreservationJourney.style';
import { Button } from '@equinor/eds-core-react';
import EdsIcon from '../../../../../components/EdsIcon';
import { TextField } from '@equinor/eds-core-react';
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


    //todo: bare gjøre direkte i useEffekt? 
    const getJourney = async (): Promise<void> => {
        setIsLoading(true);
        try {
            await preservationApiClient.getJourney(props.journeyId).then(
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
            getJourney();
            setIsEditMode(true);
        } else {
            setJourney(null);
            setIsEditMode(false);
        }
    }, [props.journeyId]);

    const saveNewStep = async (step: Step): Promise<void> => {
        try {
            await preservationApiClient.addStepToJourney(newJourney.id, step.title, step.mode.id, step.responsible.code);
        } catch (error) {
            console.error('Add journey failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message, 5000);
        }
    };


    const saveNewJourney = async (): Promise<void> => {
        try {
            const journeyId = await preservationApiClient.addJourney(newJourney.title);
            newJourney.id = journeyId;
            setNewJourney(cloneJourney(newJourney));

            for await (const step of newJourney.steps) {
                saveNewStep(step);
            }
            showSnackbarNotification('New journey is saved.', 5000);

        } catch (error) {
            console.error('Add journey failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message, 5000);
        }
    };

    const saveUpdatedJourney = async (): Promise<void> => {
        try {
            await preservationApiClient.updateJourney(newJourney.id, newJourney.title, newJourney.rowVersion);
        } catch (error) {
            console.error('Update journey failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message, 5000);
        }
    };

    const saveUpdatedStep = async (step: Step): Promise<void> => {

        if (journey) {
            const originalStep = journey.steps.find((s) => s.id == step.id);
            if (JSON.stringify(originalStep) !== JSON.stringify(step)) {
                //There are changes to save
                try {
                    await preservationApiClient.updateJourneyStep(newJourney.id, step.id, step.title, step.mode.id, step.responsible.code, step.rowVersion);
                } catch (error) {
                    console.error('Update journey failed: ', error.messsage, error.data);
                    showSnackbarNotification(error.message, 5000);
                }
            }
        }
    };

    const handleSave = (): void => {
        let isSaved = false;
        if (newJourney.id === -1) {

            //Save new journey
            saveNewJourney();
        } else {
            //Save updates to journey
            if (journey && journey.title != newJourney.title) {
                saveUpdatedJourney();
                isSaved = true;
            }

            newJourney.steps.forEach(step => {
                if (step.id === -1) {
                    //New step
                    saveNewStep(step);
                    isSaved = true;
                } else {
                    if (journey) {
                        const originalStep = journey.steps.find((s) => s.id == step.id);
                        if (originalStep === null) {
                            console.log('Error occured when trying to save update to a step that was not found in the journey.');
                            showSnackbarNotification('Error occured when trying to save update to a step that was not found in the journey.', 5000);
                            return;
                        } else {
                            if (JSON.stringify(originalStep) !== JSON.stringify(step)) {
                                saveUpdatedStep(step);
                                isSaved = true;
                            }
                        }
                    }
                }
            });

            if (isSaved) {
                showSnackbarNotification('Changes for journey is saved.', 5000);
            } else {
                showSnackbarNotification('No changes need to be saved.', 5000);
            }
        }
    };

    /*
    const voidJourney = () => {

    };

    const unvoidJourney = () => {

    };
*/
    const initNewJourney = (): void => {
        setNewJourney(createNewJourney());
        setIsEditMode(true);
    };

    const setJourneyTitleValue = (value: string): void => {
        if (newJourney) {
            newJourney.title = value;
            setNewJourney(cloneJourney(newJourney));
        }
    };

    const setModeValue = (value: number, index: number): void => {
        newJourney.steps[index].mode.id = value;
        setNewJourney(cloneJourney(newJourney));
    };

    const setResponsibleValue = (value: string, index: number): void => {
        if (newJourney && newJourney.steps) {
            newJourney.steps[index].responsible.code = value;
            setNewJourney(cloneJourney(newJourney));
        }
    };

    const setStepTitleValue = (value: string, index: number): void => {
        if (newJourney && newJourney.steps) {
            newJourney.steps[index].title = value;
            setNewJourney(cloneJourney(newJourney));
        }
    };

    const addNewStep = (): void => {
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
            getJourney();
        } catch (error) {
            console.error('Swap steps failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message, 5000);
        }
        setIsLoading(false);

        return Promise.resolve();
    };


    const moveStepDown = (stepIndex: number): void => {
        const steps = newJourney.steps;
        if (steps.length > 1 && stepIndex + 1 < steps.length) {
            swapSteps(steps[stepIndex], steps[stepIndex + 1]);
        }
    };

    const moveStepUp = (stepIndex: number): void => {
        const steps = newJourney.steps;
        if (steps.length > 1 && stepIndex - 1 > 0) {
            swapSteps(steps[stepIndex], steps[stepIndex - 1]);
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
            <ButtonContainer>
                <Button variant="outlined" onClick={initNewJourney}>
                    Void
                </Button>
                <ButtonSpacer />
                <Button variant="outlined" onClick={initNewJourney}>
                    Cancel
                </Button>
                <ButtonSpacer />
                <Button onClick={handleSave}>
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
                />
            </InputContainer>

            <StepsContainer>

                {newJourney.steps && newJourney.steps.map((step, index) => {
                    const modeSelectItem: SelectItem | undefined = mappedModes.find(mode => mode.value === step.mode.id);
                    const responsibleSelectItem: SelectItem | undefined = mappedResponsibles.find(resp => resp.value === step.responsible.code);


                    return (
                        <React.Fragment key={`step._${index}`}>

                            <FormFieldSpacer>

                                <SelectInput
                                    onChange={(value): void => setModeValue(value, index)}
                                    data={mappedModes}
                                    label={'Mode'}
                                >
                                    {(modeSelectItem && modeSelectItem.text || 'Select mode')}
                                </SelectInput>

                            </FormFieldSpacer>

                            <FormFieldSpacer>

                                <SelectInput
                                    onChange={(value): void => setResponsibleValue(value, index)}
                                    data={mappedResponsibles}
                                    label={'Resp'}
                                >
                                    {(responsibleSelectItem && responsibleSelectItem.text || 'Select responsible')}
                                </SelectInput>

                            </FormFieldSpacer>
                            <FormFieldSpacer>
                                <div style={{ minWidth: '300px' }}>
                                    <TextField
                                        id={'titleStep'}
                                        label="Title for this step"
                                        value={step.title}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setStepTitleValue(e.target.value, index)}
                                        placeholder="Write Here"
                                    />
                                </div>
                            </FormFieldSpacer>
                            <FormFieldSpacer>
                                {newJourney.steps.length > 1 &&
                                    <>
                                        <Button variant='ghost' onClick={(): void => moveStepUp(index)}>
                                            {upIcon}
                                        </Button>
                                        <Button variant='ghost' onClick={(): void => moveStepDown(index)}>
                                            {downIcon}
                                        </Button>
                                    </>
                                }
                                <Button variant='ghost' onClick={(): void => deleteStep(index)}>
                                    {deleteIcon}
                                </Button>

                            </FormFieldSpacer>

                        </React.Fragment>
                    );
                })}
            </StepsContainer>

            <IconContainer>
                <Button variant='ghost' onClick={addNewStep}>
                    {addIcon} Add step
                </Button>
            </IconContainer>

        </Container >

    );
};

export default PreservationJourney;
