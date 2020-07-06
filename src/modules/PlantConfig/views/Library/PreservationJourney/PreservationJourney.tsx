import React, { useState, useEffect } from 'react';
import { usePlantConfigContext } from '@procosys/modules/PlantConfig/context/PlantConfigContext';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { Container, InputContainer, StepsContainer, FormFieldSpacer, ButtonContainer, ButtonSpacer, DropdownItem, IconContainer, ResponsibleDropdownContainer } from './PreservationJourney.style';
import EdsIcon from '../../../../../components/EdsIcon';
import { TextField, Typography, Button } from '@equinor/eds-core-react';
import SelectInput, { SelectItem } from '../../../../../components/Select';
import { Canceler } from 'axios';
import Spinner from '@procosys/components/Spinner';
import Dropdown from '../../../../../components/Dropdown';

const addIcon = <EdsIcon name='add' size={16} />;
const upIcon = <EdsIcon name='arrow_up' size={16} />;
const downIcon = <EdsIcon name='arrow_down' size={16} />;
const deleteIcon = <EdsIcon name='delete_to_trash' size={16} />;
const voidIcon = <EdsIcon name='delete_forever' size={16} />;
const unvoidIcon = <EdsIcon name='restore_from_trash' size={16} />;

const saveTitle = 'If you have changes to save, check that all fields are filled in, no titles are identical, and if you have a supplier step it must be the first step.';

interface Journey {
    id: number;
    title: string;
    isVoided: boolean;
    isInUse: boolean;
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
    setDirtyLibraryType: () => void;
};

const PreservationJourney = (props: PreservationJourneyProps): JSX.Element => {

    const createNewJourney = (): Journey => {
        return { id: -1, title: '', isVoided: false, isInUse: false, steps: [], rowVersion: '' };
    };

    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [journey, setJourney] = useState<Journey | null>(null);
    const [newJourney, setNewJourney] = useState<Journey>(createNewJourney);
    const [mappedModes, setMappedModes] = useState<SelectItem[]>([]);
    const [mappedResponsibles, setMappedResponsibles] = useState<SelectItem[]>([]);
    const [filteredResponsibles, setFilteredResponsibles] = useState<SelectItem[]>([]);
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [filterForResponsibles, setFilterForResponsibles] = useState<string>('');
    const [canSave, setCanSave] = useState<boolean>(false);

    const {
        preservationApiClient,
        libraryApiClient
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
                const modes = await preservationApiClient.getModes(false, (cancel: Canceler) => requestCancellor = cancel);
                const mappedModes: SelectItem[] = [];

                modes.forEach(mode => mappedModes.push({ text: mode.title, value: mode.id, selected: false }));
                setMappedModes(mappedModes);

            } catch (error) {
                console.error('Get Modes failed: ', error.message, error.data);
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
                const responsibles = await libraryApiClient.getResponsibles((cancel: Canceler) => requestCancellor = cancel);
                const mappedResponsibles: SelectItem[] = [];

                responsibles.forEach(resp => mappedResponsibles.push({ text: (resp.code + ' - ' + resp.description), value: resp.code, selected: false }));
                setMappedResponsibles(mappedResponsibles);
            } catch (error) {
                console.error('Get Responsibles failed: ', error.message, error.data);
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
            await preservationApiClient.getJourney(journeyId, true).then(
                (response) => {
                    setJourney(response);
                    setNewJourney(cloneJourney(response));
                    setIsDirty(false);
                }
            );
        } catch (error) {
            console.error('Get preservation journey failed: ', error.message, error.data);
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

    const saveNewStep = async (journeyId: number, step: Step): Promise<void> => {
        try {
            await preservationApiClient.addStepToJourney(journeyId, step.title, step.mode.id, step.responsible.code);
            setIsSaved(true);
        } catch (error) {
            console.error('Add journey failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
            getJourney(newJourney.id);
        }
    };

    const saveNewJourney = async (): Promise<void> => {
        try {
            const journeyId = await preservationApiClient.addJourney(newJourney.title);
            setNewJourney((newJourney): Journey => { return { ...newJourney, id: journeyId }; });
            for await (const step of newJourney.steps) {
                await saveNewStep(journeyId, step);
            }
            getJourney(journeyId);
            props.setDirtyLibraryType();
            showSnackbarNotification('New journey is saved.', 5000);
        } catch (error) {
            console.error('Add journey failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
        }
    };

    const updateJourney = async (): Promise<void> => {
        try {
            await preservationApiClient.updateJourney(newJourney.id, newJourney.title, newJourney.rowVersion);
            props.setDirtyLibraryType();
            setIsSaved(true);
        } catch (error) {
            console.error('Update journey failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
            getJourney(newJourney.id);
        }
    };

    const saveUpdatedStep = async (step: Step): Promise<void> => {
        if (journey) {
            const originalStep = journey.steps.find((s) => s.id == step.id);
            if (JSON.stringify(originalStep) !== JSON.stringify(step)) {
                //There are changes to save
                try {
                    await preservationApiClient.updateJourneyStep(newJourney.id, step.id, step.title, step.mode.id, step.responsible.code, step.rowVersion);
                    setIsSaved(true);
                } catch (error) {
                    console.error('Update journey failed: ', error.message, error.data);
                    showSnackbarNotification(error.message, 5000);
                    getJourney(newJourney.id);
                }
            }
        }
    };

    const saveUpdatedJourney = async (): Promise<void> => {
        let noChangesToSave = true;
        if (journey && journey.title != newJourney.title) {
            await updateJourney();
            noChangesToSave = false;
        }

        for await (const step of newJourney.steps) {
            if (step.id === -1) {
                await saveNewStep(newJourney.id, step);
                noChangesToSave = false;
            } else {
                if (journey) {
                    const originalStep = journey.steps.find((s) => s.id == step.id);

                    if (originalStep === null) {
                        console.log('Error occured when trying to save update to a step that was not found in the journey.');
                        showSnackbarNotification('Error occured when trying to save update to a step that was not found in the journey.', 5000);
                        return;
                    }

                    if (JSON.stringify(originalStep) !== JSON.stringify(step)) {
                        await saveUpdatedStep(step);
                        noChangesToSave = false;
                    }
                }
            }
        }

        if (noChangesToSave) {
            showSnackbarNotification('No changes need to be saved.', 5000);
        }
    };

    useEffect(() => {
        if (isSaved) {
            getJourney(newJourney.id);
            showSnackbarNotification('Changes for journey is saved.', 5000);
            setIsSaved(false);
        }
    }, [isSaved]);

    const inputIsComplete = (): boolean => {
        let ok = true;
        let errorMessage = 'Cannot save: ';
        if (newJourney.title === '') {
            ok = false;
            errorMessage += 'Title is missing. ';
        }

        newJourney.steps.some((step: Step) => {
            if (step.mode.id === -1 || step.responsible.code === '' || step.title === '') {
                errorMessage += 'Some step information is missing.';
                ok = false;
                return true;
            }
        });

        if (!ok) {
            showSnackbarNotification(errorMessage, 5000);
            return false;
        }

        return true;
    };

    const handleSave = (): void => {
        if (!inputIsComplete()) {
            return;
        }
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
        setIsDirty(false);
        setIsEditMode(false);
    };

    const voidJourney = async (): Promise<void> => {
        if (journey) {
            setIsLoading(true);
            try {
                await preservationApiClient.voidJourney(journey.id, journey.rowVersion);
                getJourney(journey.id);
                props.setDirtyLibraryType();
                showSnackbarNotification('Journey is voided.', 5000);
            } catch (error) {
                console.error('Error occured when trying to void journey: ', error.message, error.data);
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
                props.setDirtyLibraryType();
                showSnackbarNotification('Journey is unvoided.', 5000);
            } catch (error) {
                console.error('Error occured when trying to unvoid journey: ', error.message, error.data);
                showSnackbarNotification(error.message, 5000);
            }
            setIsLoading(false);
        }
    };

    const deleteJourney = async (): Promise<void> => {
        if (journey) {
            setIsLoading(true);
            try {
                await preservationApiClient.deleteJourney(journey.id, journey.rowVersion);
                setJourney(null);
                setIsDirty(false);
                setIsEditMode(false);
                props.setDirtyLibraryType();
                showSnackbarNotification('Journey is deleted.', 5000);
            } catch (error) {
                console.error('Error occured when trying to delete journey: ', error.message, error.data);
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

    const setResponsibleValue = (event: React.MouseEvent, stepIndex: number, filtRespIndex: number): void => {
        event.preventDefault();
        if (newJourney.steps) {
            setIsDirty(true);
            newJourney.steps[stepIndex].responsible.code = filteredResponsibles[filtRespIndex].value;
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
            console.error('Swap steps failed: ', error.message, error.data);
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

    const deleteStep = async (step: Step, stepIndex: number): Promise<void> => {
        if (step.id == -1) {
            newJourney.steps.splice(stepIndex, 1);
            setNewJourney(cloneJourney(newJourney));
        } else {
            if (journey) {
                setIsLoading(true);
                try {
                    await preservationApiClient.deleteJourneyStep(journey.id, step.id, step.rowVersion);
                    getJourney(journey.id);
                    showSnackbarNotification('Journey step is deleted.', 5000);
                } catch (error) {
                    console.error('Error occured when trying to delete journey step: ', error.message, error.data);
                    showSnackbarNotification(error.message, 5000);
                }
                setIsLoading(false);
            }
        }
    };

    const voidStep = async (step: Step): Promise<void> => {
        if (journey) {
            setIsLoading(true);
            try {
                await preservationApiClient.voidJourneyStep(journey.id, step.id, step.rowVersion);
                getJourney(journey.id);
                showSnackbarNotification('Journey step is voided.', 5000);
            } catch (error) {
                console.error('Error occured when trying to void journey step: ', error.message, error.data);
                showSnackbarNotification(error.message, 5000);
            }
            setIsLoading(false);
        }
    };


    const unvoidStep = async (step: Step): Promise<void> => {
        if (journey) {
            setIsLoading(true);
            try {
                await preservationApiClient.unvoidJourneyStep(journey.id, step.id, step.rowVersion);
                getJourney(journey.id);
                showSnackbarNotification('Journey step is unvoided.', 5000);
            } catch (error) {
                console.error('Error occured when trying to unvoid journey step: ', error.message, error.data);
                showSnackbarNotification(error.message, 5000);
            }
            setIsLoading(false);
        }
    };

    /** Update list of responsibled based on filter */
    useEffect(() => {
        if (filterForResponsibles.length <= 0) {
            setFilteredResponsibles(mappedResponsibles);
            return;
        }
        setFilteredResponsibles(mappedResponsibles.filter((resp: SelectItem) => resp.text.toLowerCase().indexOf(filterForResponsibles.toLowerCase()) > -1));
    }, [filterForResponsibles, mappedResponsibles]);

    useEffect(() => {
        if (JSON.stringify(journey) == JSON.stringify(newJourney)) {
            setCanSave(false);
            return;
        }
        if (newJourney.title.length < 3) {
            setCanSave(false);
            return;
        }
        let breakFunction = false;
        newJourney.steps.forEach((step, i) => {
            if (!step.title || step.mode.id == -1 || !step.responsible.code) {
                setCanSave(false);
                breakFunction = true;
                return;
            }
            if (newJourney.steps.find((s, j) => j != i && s.title == step.title)) {
                setCanSave(false);
                breakFunction = true;
                return;
            }
            const mode = mappedModes.find(mode => mode.value == step.mode.id);
            if (i != 0 && mode && mode.text == 'SUPPLIER') {
                setCanSave(false);
                breakFunction = true;
                return;
            }
        });

        if (breakFunction) {
            return;
        }

        setCanSave(true);
    }, [newJourney]);

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
                {(newJourney.isVoided && !newJourney.isInUse) &&
                    <Button className='buttonIcon' variant="outlined" onClick={deleteJourney}>
                        {deleteIcon} Delete
                    </Button>
                }
                <ButtonSpacer />
                {newJourney.isVoided &&
                    <Button className='buttonIcon' variant="outlined" onClick={unvoidJourney}>
                        {unvoidIcon} Unvoid
                    </Button>
                }
                {!newJourney.isVoided &&
                    <Button className='buttonIcon' variant="outlined" onClick={voidJourney}>
                        {voidIcon} Void
                    </Button>
                }
                <ButtonSpacer />
                <Button variant="outlined" onClick={cancel} disabled={newJourney.isVoided}>
                    Cancel
                </Button>
                <ButtonSpacer />
                <Button onClick={handleSave} disabled={newJourney.isVoided || !isDirty || !canSave} title={canSave ? '' : saveTitle}>
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
                                        maxHeight={'300px'}
                                        onChange={(value): void => setModeValue(value, index)}
                                        data={mappedModes}
                                        label={'Mode'}
                                        disabled={newJourney.isVoided || step.isVoided}
                                    >
                                        {(modeSelectItem && modeSelectItem.text || 'Select mode')}
                                    </SelectInput>
                                </div>
                            </FormFieldSpacer>
                            <FormFieldSpacer>
                                <ResponsibleDropdownContainer>
                                    <Dropdown
                                        disabled={newJourney.isVoided || step.isVoided}
                                        label={'Resp'}
                                        variant='form'
                                        text={(responsibleSelectItem && responsibleSelectItem.text) || 'Type to select'}
                                        onFilter={setFilterForResponsibles}
                                    >
                                        {filteredResponsibles.map((respItem, filtRespIndex) => {
                                            return (
                                                <DropdownItem
                                                    key={index}
                                                    onClick={(event): void => setResponsibleValue(event, index, filtRespIndex)}
                                                >
                                                    {respItem.text}
                                                </DropdownItem>
                                            );
                                        })}
                                    </Dropdown>
                                </ResponsibleDropdownContainer>
                            </FormFieldSpacer>
                            <FormFieldSpacer>
                                <div style={{ minWidth: '300px' }}>
                                    <TextField
                                        id={'titleStep'}
                                        label="Title for this step"
                                        value={step.title}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setStepTitleValue(e.target.value, index)}
                                        placeholder="Write Here"
                                        disabled={newJourney.isVoided || step.isVoided}
                                    />
                                </div>
                            </FormFieldSpacer>
                            {
                                (isDirty && index == 0) &&
                                <FormFieldSpacer>
                                    <Typography variant="caption">Actions on steps are unavailable until other changes are saved.</Typography>
                                </FormFieldSpacer>
                            }
                            {
                                (isDirty && index != 0) &&
                                <div></div>
                            }
                            {
                                !isDirty && (
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
                                        {(step.id == -1 || (journey && !journey.isInUse) && step.isVoided) &&
                                            (<Button variant='ghost' title="Delete" onClick={(): Promise<void> => deleteStep(step, index)}>
                                                {deleteIcon}
                                            </Button>)
                                        }
                                        {(step.id != -1 && !step.isVoided) &&
                                            (<Button className='voidUnvoid' variant='ghost' onClick={(): Promise<void> => voidStep(step)}>
                                                {voidIcon} Void
                                            </Button>)
                                        }

                                        {(step.id != -1 && step.isVoided) &&
                                            (<Button className='voidUnvoid' variant='ghost' onClick={(): Promise<void> => unvoidStep(step)}>
                                                {unvoidIcon} Unvoid
                                            </Button>)
                                        }
                                    </FormFieldSpacer>
                                )
                            }
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
