import {
    Breadcrumbs,
    ButtonSpacer,
    Container,
    DropdownItem,
    FormFieldSpacer,
    IconContainer,
    InputContainer,
    ResponsibleDropdownContainer,
    StepsContainer,
} from './PreservationJourney.style';
import { Button, TextField, Typography } from '@equinor/eds-core-react';
import React, { useEffect, useMemo, useState } from 'react';
import SelectInput, { SelectItem } from '../../../../../components/Select';

import { Canceler } from 'axios';
import Checkbox from './../../../../../components/Checkbox';
import Dropdown from '../../../../../components/Dropdown';
import EdsIcon from '../../../../../components/EdsIcon';
import { ProCoSysApiError } from '@procosys/core/ProCoSysApiError';
import Spinner from '@procosys/components/Spinner';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import {
    unsavedChangesConfirmationMessage,
    useDirtyContext,
} from '@procosys/core/DirtyContext';
import { usePlantConfigContext } from '@procosys/modules/PlantConfig/context/PlantConfigContext';
import {
    ButtonContainer,
    ButtonContainerLeft,
    ButtonContainerRight,
} from '../Library.style';

const addIcon = <EdsIcon name="add" />;
const upIcon = <EdsIcon name="arrow_up" />;
const downIcon = <EdsIcon name="arrow_down" />;
const deleteIcon = <EdsIcon name="delete_to_trash" />;
const duplicateIcon = <EdsIcon name="copy" />;
const voidIcon = <EdsIcon name="delete_forever" />;
const unvoidIcon = <EdsIcon name="restore_from_trash" />;

const saveTitle =
    'If you have changes to save, check that all fields are filled in, no titles are identical, and if you have a supplier step it must be the first step.';
const baseBreadcrumb = 'Library / Preservation journeys';
const moduleName = 'PreservationJourneyForm';

const WAIT_INTERVAL = 300;

const checkboxHeightInGridUnits = 4;

enum AutoTransferMethod {
    NONE = 'None',
    RFCC = 'OnRfccSign',
    RFOC = 'OnRfocSign',
}

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
    autoTransferMethod: string;
    isVoided: boolean;
    isInUse: boolean;
    mode: Mode;
    responsible: {
        code: string;
        title: string;
        rowVersion: string;
        description?: string;
    };
    rowVersion: string;
}

interface Mode {
    id: number;
    title: string;
    forSupplier: boolean;
    isVoided: boolean;
    rowVersion: string;
}

type PreservationJourneyProps = {
    forceUpdate: number;
    journeyId: number;
    setDirtyLibraryType: () => void;
};

const PreservationJourney = (props: PreservationJourneyProps): JSX.Element => {
    const getInitialJourney = (): Journey => {
        return {
            id: -1,
            title: '',
            isVoided: false,
            isInUse: false,
            steps: [],
            rowVersion: '',
        };
    };

    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [journey, setJourney] = useState<Journey | null>(null);
    const [newJourney, setNewJourney] = useState<Journey>(getInitialJourney);
    const [mappedModes, setMappedModes] = useState<SelectItem[]>([]);
    const [modes, setModes] = useState<Mode[]>([]);
    const [mappedResponsibles, setMappedResponsibles] = useState<SelectItem[]>(
        []
    );
    const [filteredResponsibles, setFilteredResponsibles] = useState<
        SelectItem[]
    >([]);
    const [canSave, setCanSave] = useState<boolean>(false);
    const [filterForResponsibles, setFilterForResponsibles] =
        useState<string>('');
    const { setDirtyStateFor, unsetDirtyStateFor } = useDirtyContext();

    useEffect(() => {
        setIsEditMode(false);
    }, [props.forceUpdate]);

    const isDirty = useMemo((): boolean => {
        return JSON.stringify(journey) != JSON.stringify(newJourney);
    }, [journey, newJourney]);

    const { preservationApiClient, libraryApiClient } = usePlantConfigContext();

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
                const modes = await preservationApiClient.getModes(
                    false,
                    (cancel: Canceler) => (requestCancellor = cancel)
                );
                const mappedModes: SelectItem[] = [];
                modes.forEach((mode) =>
                    mappedModes.push({
                        text: mode.title,
                        value: mode.id,
                        selected: false,
                    })
                );

                // Update mappedModes with voided modes if they are selected
                journey &&
                    journey.steps.forEach((step) => {
                        if (
                            !mappedModes.some(
                                (mode) => mode.value === step.mode.id
                            )
                        ) {
                            mappedModes.push({
                                text: step.mode.title,
                                value: step.mode.id,
                                selected: false,
                            });
                        }
                    });
                setModes(modes);
                setMappedModes(mappedModes);
            } catch (error) {
                console.error('Get modes failed: ', error.message, error.data);
                if (error instanceof ProCoSysApiError) {
                    if (error.isCancel) return;
                }
                showSnackbarNotification(error.message);
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, [journey]);

    /**
     * Get responsibles
     */
    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            setIsLoading(true);
            try {
                const responsibles = await libraryApiClient.getResponsibles(
                    (cancel: Canceler) => (requestCancellor = cancel)
                );
                const mappedResponsibles: SelectItem[] = [];

                responsibles.forEach((resp) =>
                    mappedResponsibles.push({
                        text: resp.code + ' - ' + resp.description,
                        value: resp.code,
                        selected: false,
                    })
                );
                setMappedResponsibles(mappedResponsibles);
                setFilteredResponsibles(mappedResponsibles);
            } catch (error) {
                console.error(
                    'Get responsibles failed: ',
                    error.message,
                    error.data
                );
                if (error instanceof ProCoSysApiError) {
                    if (error.isCancel) return;
                }
                showSnackbarNotification(error.message);
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
            await preservationApiClient
                .getJourney(journeyId, true)
                .then((response) => {
                    setJourney(response);
                    setNewJourney(cloneJourney(response));
                });
        } catch (error) {
            console.error(
                'Get preservation journey failed: ',
                error.message,
                error.data
            );
            if (error instanceof ProCoSysApiError) {
                if (error.isCancel) return;
            }
            showSnackbarNotification(error.message);
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

    const saveNewStep = async (
        journeyId: number,
        step: Step
    ): Promise<boolean> => {
        try {
            await preservationApiClient.addStepToJourney(
                journeyId,
                step.title,
                step.mode.id,
                step.responsible.code,
                step.autoTransferMethod
            );
            return true;
        } catch (error) {
            console.error(
                'Add journey step failed: ',
                error.message,
                error.data
            );
            showSnackbarNotification(error.message);
        }
        return false;
    };

    const saveNewJourney = async (): Promise<void> => {
        setIsLoading(true);
        let journeyId = -1;
        try {
            journeyId = await preservationApiClient.addJourney(
                newJourney.title
            );
            for await (const step of newJourney.steps) {
                await saveNewStep(journeyId, step);
            }
            props.setDirtyLibraryType();
            showSnackbarNotification('New journey is saved.');
        } catch (error) {
            console.error('Add journey failed: ', error.message, error.data);
            showSnackbarNotification(error.message);
        }
        if (journeyId != -1) {
            getJourney(journeyId);
        }
        setIsLoading(false);
    };

    const updateJourney = async (): Promise<boolean> => {
        try {
            await preservationApiClient.updateJourney(
                newJourney.id,
                newJourney.title,
                newJourney.rowVersion
            );
            props.setDirtyLibraryType();
            return true;
        } catch (error) {
            console.error('Update journey failed: ', error.message, error.data);
            showSnackbarNotification(error.message);
        }
        return false;
    };

    const saveUpdatedStep = async (step: Step): Promise<boolean> => {
        if (journey) {
            const originalStep = journey.steps.find((s) => s.id == step.id);
            if (JSON.stringify(originalStep) !== JSON.stringify(step)) {
                //There are changes to save
                try {
                    await preservationApiClient.updateJourneyStep(
                        newJourney.id,
                        step.id,
                        step.title,
                        step.mode.id,
                        step.responsible.code,
                        step.autoTransferMethod,
                        step.rowVersion
                    );
                } catch (error) {
                    console.error(
                        'Update journey step failed: ',
                        error.message,
                        error.data
                    );
                    showSnackbarNotification(error.message);
                    return false;
                }
            }
        }
        return true;
    };

    const saveUpdatedJourney = async (): Promise<void> => {
        setIsLoading(true);
        let saveOk = true;
        let noChangesToSave = true;
        if (journey && journey.title != newJourney.title) {
            saveOk = await updateJourney();
            noChangesToSave = false;
        }

        for await (const step of newJourney.steps) {
            if (saveOk) {
                if (step.id === -1) {
                    saveOk = await saveNewStep(newJourney.id, step);
                    noChangesToSave = false;
                } else {
                    if (journey) {
                        const originalStep = journey.steps.find(
                            (s) => s.id == step.id
                        );

                        if (originalStep === null) {
                            console.error(
                                'Error occured when trying to save update to a step that was not found in the journey.'
                            );
                            showSnackbarNotification(
                                'Error occured when trying to save update to a step that was not found in the journey.'
                            );
                            setIsLoading(false);
                            return;
                        }

                        if (
                            JSON.stringify(originalStep) !==
                            JSON.stringify(step)
                        ) {
                            saveOk = await saveUpdatedStep(step);
                            noChangesToSave = false;
                        }
                    }
                }
            }
        }
        if (noChangesToSave) {
            showSnackbarNotification('No changes need to be saved.');
        } else {
            if (saveOk) {
                getJourney(newJourney.id);
                showSnackbarNotification('Changes for journey are saved.');
            }
        }
        setIsLoading(false);
    };

    const inputIsComplete = (): boolean => {
        let ok = true;
        let errorMessage = 'Cannot save: ';
        if (newJourney.title === '') {
            ok = false;
            errorMessage += 'Title is missing. ';
        }

        newJourney.steps.some((step: Step) => {
            if (
                step.mode.id === -1 ||
                step.responsible.code === '' ||
                step.title === ''
            ) {
                errorMessage += 'Some step information is missing.';
                ok = false;
                return true;
            }
        });

        if (!ok) {
            showSnackbarNotification(errorMessage);
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
    };

    const confirmDiscardingChangesIfExist = (): boolean => {
        return !isDirty || confirm(unsavedChangesConfirmationMessage);
    };

    const cancel = (): void => {
        if (confirmDiscardingChangesIfExist()) {
            setJourney(null);
            setIsEditMode(false);
        }
    };

    const voidJourney = async (): Promise<void> => {
        if (journey && confirmDiscardingChangesIfExist()) {
            setIsLoading(true);
            try {
                await preservationApiClient.voidJourney(
                    journey.id,
                    journey.rowVersion
                );
                getJourney(journey.id);
                props.setDirtyLibraryType();
                showSnackbarNotification('Journey is voided.');
            } catch (error) {
                console.error(
                    'Error occured when trying to void journey: ',
                    error.message,
                    error.data
                );
                showSnackbarNotification(error.message);
            }
            setIsLoading(false);
        }
    };

    const unvoidJourney = async (): Promise<void> => {
        if (journey) {
            setIsLoading(true);
            try {
                await preservationApiClient.unvoidJourney(
                    journey.id,
                    journey.rowVersion
                );
                getJourney(journey.id);
                props.setDirtyLibraryType();
                showSnackbarNotification('Journey is unvoided.');
            } catch (error) {
                console.error(
                    'Error occured when trying to unvoid journey: ',
                    error.message,
                    error.data
                );
                showSnackbarNotification(error.message);
            }
            setIsLoading(false);
        }
    };

    const deleteJourney = async (): Promise<void> => {
        if (journey) {
            setIsLoading(true);
            try {
                await preservationApiClient.deleteJourney(
                    journey.id,
                    journey.rowVersion
                );
                setJourney(null);
                setCanSave(false);
                setIsEditMode(false);
                props.setDirtyLibraryType();
                showSnackbarNotification('Journey is deleted.');
            } catch (error) {
                console.error(
                    'Error occured when trying to delete journey: ',
                    error.message,
                    error.data
                );
                showSnackbarNotification(error.message);
            }
            setIsLoading(false);
        }
    };

    const duplicateJourney = async (): Promise<void> => {
        if (journey && confirmDiscardingChangesIfExist()) {
            setIsLoading(true);
            try {
                await preservationApiClient.duplicateJourney(journey.id);
                getJourney(journey.id);
                props.setDirtyLibraryType();
                showSnackbarNotification('Journey is duplicated.');
            } catch (error) {
                console.error(
                    'Error occured when trying to duplicate journey: ',
                    error.message,
                    error.data
                );
                showSnackbarNotification(error.message);
            }
            setIsLoading(false);
        }
    };

    const initNewJourney = (): void => {
        if (confirmDiscardingChangesIfExist()) {
            setNewJourney(getInitialJourney());
            setJourney(cloneJourney(newJourney));
            setIsEditMode(true);
        }
    };

    const setJourneyTitleValue = (value: string): void => {
        newJourney.title = value;
        setNewJourney(cloneJourney(newJourney));
    };

    const setModeValue = (value: number, index: number): void => {
        newJourney.steps[index].mode.id = value;
        setNewJourney(cloneJourney(newJourney));
    };

    const setResponsibleValue = (
        event: React.MouseEvent,
        stepIndex: number,
        filtRespIndex: number
    ): void => {
        event.preventDefault();
        if (newJourney.steps) {
            newJourney.steps[stepIndex].responsible.code =
                filteredResponsibles[filtRespIndex].value;
            setNewJourney(cloneJourney(newJourney));
        }
    };

    const setStepTitleValue = (value: string, index: number): void => {
        if (newJourney.steps) {
            newJourney.steps[index].title = value;
            setNewJourney(cloneJourney(newJourney));
        }
    };

    const setStepAutoTransValue = (value: string, index: number): void => {
        if (newJourney.steps) {
            newJourney.steps[index].autoTransferMethod = value;
            setNewJourney(cloneJourney(newJourney));
        }
    };

    const addNewStep = (): void => {
        const newStep: Step = {
            id: -1,
            title: '',
            autoTransferMethod: AutoTransferMethod.NONE,
            isVoided: false,
            isInUse: false,
            mode: {
                id: -1,
                title: '',
                rowVersion: '',
                isVoided: false,
                forSupplier: false,
            },
            responsible: {
                code: '',
                title: '',
                rowVersion: '',
            },
            rowVersion: '',
        };

        newJourney.steps.push(newStep);

        setNewJourney(cloneJourney(newJourney));
    };

    const swapSteps = async (stepA: Step, stepB: Step): Promise<void> => {
        setIsLoading(true);
        try {
            await preservationApiClient.swapStepsOnJourney(
                newJourney.id,
                stepA.id,
                stepA.rowVersion,
                stepB.id,
                stepB.rowVersion
            );
            getJourney(newJourney.id);
            showSnackbarNotification('Step is moved.');
        } catch (error) {
            console.error('Swap steps failed: ', error.message, error.data);
            showSnackbarNotification(error.message);
        }
        setIsLoading(false);
    };

    const moveStepDown = (stepIndex: number): void => {
        const steps = newJourney.steps;
        if (steps.length > 1 && stepIndex + 1 < steps.length) {
            swapSteps(steps[stepIndex], steps[stepIndex + 1]);
        } else {
            showSnackbarNotification('Step cannot be moved further down.');
        }
    };

    const moveStepUp = (stepIndex: number): void => {
        const steps = newJourney.steps;
        if (steps.length > 1 && stepIndex > 0) {
            swapSteps(steps[stepIndex], steps[stepIndex - 1]);
        } else {
            showSnackbarNotification('Step cannot be moved further up.');
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
                    await preservationApiClient.deleteJourneyStep(
                        journey.id,
                        step.id,
                        step.rowVersion
                    );
                    getJourney(journey.id);
                    showSnackbarNotification('Journey step is deleted.');
                } catch (error) {
                    console.error(
                        'Error occured when trying to delete journey step: ',
                        error.message,
                        error.data
                    );
                    showSnackbarNotification(error.message);
                }
                setIsLoading(false);
            }
        }
    };

    const voidStep = async (step: Step): Promise<void> => {
        if (journey) {
            setIsLoading(true);
            try {
                await preservationApiClient.voidJourneyStep(
                    journey.id,
                    step.id,
                    step.rowVersion
                );
                getJourney(journey.id);
                showSnackbarNotification('Journey step is voided.');
            } catch (error) {
                console.error(
                    'Error occured when trying to void journey step: ',
                    error.message,
                    error.data
                );
                showSnackbarNotification(error.message);
            }
            setIsLoading(false);
        }
    };

    const unvoidStep = async (step: Step): Promise<void> => {
        if (journey) {
            setIsLoading(true);
            try {
                await preservationApiClient.unvoidJourneyStep(
                    journey.id,
                    step.id,
                    step.rowVersion
                );
                getJourney(journey.id);
                showSnackbarNotification('Journey step is unvoided.');
            } catch (error) {
                console.error(
                    'Error occured when trying to unvoid journey step: ',
                    error.message,
                    error.data
                );
                showSnackbarNotification(error.message);
            }
            setIsLoading(false);
        }
    };

    /** Update list of responsibled based on filter */
    useEffect(() => {
        const handleFilterChange = async (): Promise<void> => {
            if (filterForResponsibles.length <= 0) {
                setFilteredResponsibles(mappedResponsibles);
                return;
            }
            setFilteredResponsibles(
                mappedResponsibles.filter(
                    (resp: SelectItem) =>
                        resp.text
                            .toLowerCase()
                            .indexOf(filterForResponsibles.toLowerCase()) > -1
                )
            );
        };

        const timer = setTimeout(() => {
            handleFilterChange();
        }, WAIT_INTERVAL);

        return (): void => {
            clearTimeout(timer);
        };
    }, [filterForResponsibles]);

    /** Update canSave and isDirty when newJourney or journey changes */
    useEffect(() => {
        if (journey == null || !isDirty) {
            setCanSave(false);
            unsetDirtyStateFor(moduleName);
            return;
        } else {
            setDirtyStateFor(moduleName);
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
            if (
                newJourney.steps.find((s, j) => j != i && s.title == step.title)
            ) {
                setCanSave(false);
                breakFunction = true;
                return;
            }
        });

        if (breakFunction) {
            return;
        }

        setCanSave(true);

        return (): void => {
            unsetDirtyStateFor(moduleName);
        };
    }, [newJourney, journey]);

    if (isLoading) {
        return (
            <Container>
                <Breadcrumbs>{baseBreadcrumb} /</Breadcrumbs>
                <Spinner large />
            </Container>
        );
    }

    if (!isEditMode) {
        return (
            <Container>
                <Breadcrumbs>{baseBreadcrumb}</Breadcrumbs>
                <IconContainer>
                    <Button variant="ghost" onClick={initNewJourney}>
                        {addIcon} New preservation journey
                    </Button>
                </IconContainer>
            </Container>
        );
    }

    return (
        <Container>
            <Breadcrumbs>
                {baseBreadcrumb} / {newJourney.title}
            </Breadcrumbs>
            {newJourney.isVoided && (
                <Typography
                    variant="caption"
                    style={{
                        marginLeft: 'calc(var(--grid-unit) * 2)',
                        fontWeight: 'bold',
                    }}
                >
                    Journey is voided
                </Typography>
            )}

            <ButtonContainer>
                <ButtonContainerLeft>
                    <Button variant="ghost" onClick={initNewJourney}>
                        {addIcon} New preservation journey
                    </Button>
                </ButtonContainerLeft>
                <ButtonContainerRight>
                    {newJourney.isVoided && newJourney.id != -1 && (
                        <>
                            <ButtonSpacer />
                            <Button
                                variant="outlined"
                                onClick={deleteJourney}
                                disabled={newJourney.isInUse}
                                title={
                                    newJourney.isInUse
                                        ? 'Journey that is in use cannot be deleted'
                                        : ''
                                }
                            >
                                {deleteIcon} Delete
                            </Button>
                        </>
                    )}
                    <ButtonSpacer />
                    {!newJourney.isVoided && newJourney.id != -1 && (
                        <Button variant="outlined" onClick={duplicateJourney}>
                            {duplicateIcon} Duplicate
                        </Button>
                    )}
                    <ButtonSpacer />
                    {newJourney.isVoided && (
                        <Button variant="outlined" onClick={unvoidJourney}>
                            {unvoidIcon} Unvoid
                        </Button>
                    )}
                    {!newJourney.isVoided && newJourney.id != -1 && (
                        <Button variant="outlined" onClick={voidJourney}>
                            {voidIcon} Void
                        </Button>
                    )}
                    <ButtonSpacer />
                    <Button
                        variant="outlined"
                        onClick={cancel}
                        disabled={newJourney.isVoided}
                    >
                        Cancel
                    </Button>
                    <ButtonSpacer />
                    <Button
                        onClick={handleSave}
                        disabled={newJourney.isVoided || !canSave}
                        title={canSave ? '' : saveTitle}
                    >
                        Save
                    </Button>
                </ButtonContainerRight>
            </ButtonContainer>

            <InputContainer
                style={{
                    marginTop: 'calc(var(--grid-unit) * 3)',
                    width: '280px',
                }}
            >
                <TextField
                    id={'title'}
                    label="Title for this journey"
                    value={newJourney.title}
                    onChange={(
                        e: React.ChangeEvent<HTMLInputElement>
                    ): void => {
                        setJourneyTitleValue(e.target.value);
                    }}
                    placeholder="Write here"
                    disabled={newJourney.isVoided}
                />
            </InputContainer>

            <StepsContainer>
                {newJourney.steps &&
                    newJourney.steps.map((step, index) => {
                        const modeSelectItem: SelectItem | undefined =
                            mappedModes.find(
                                (mode) => mode.value === step.mode.id
                            );
                        const responsibleSelectItem: SelectItem | undefined =
                            mappedResponsibles.find(
                                (resp) => resp.value === step.responsible.code
                            );

                        return (
                            <React.Fragment key={`step._${index}`}>
                                <FormFieldSpacer>
                                    <div style={{ width: '100%' }}>
                                        <SelectInput
                                            maxHeight={'300px'}
                                            onChange={(value): void =>
                                                setModeValue(value, index)
                                            }
                                            data={mappedModes}
                                            label={'Mode'}
                                            disabled={
                                                newJourney.isVoided ||
                                                step.isVoided
                                            }
                                        >
                                            {(modeSelectItem &&
                                                modeSelectItem.text) ||
                                                'Select mode'}
                                        </SelectInput>
                                    </div>
                                </FormFieldSpacer>
                                <FormFieldSpacer>
                                    <ResponsibleDropdownContainer>
                                        <Dropdown
                                            disabled={
                                                newJourney.isVoided ||
                                                step.isVoided
                                            }
                                            label={
                                                responsibleSelectItem ||
                                                step.responsible.code === ''
                                                    ? 'Resp'
                                                    : 'Resp - voided'
                                            }
                                            variant={
                                                responsibleSelectItem ||
                                                step.responsible.code === ''
                                                    ? 'form'
                                                    : 'error'
                                            }
                                            text={
                                                responsibleSelectItem
                                                    ? responsibleSelectItem.text
                                                    : step.responsible &&
                                                        step.responsible.code &&
                                                        step.responsible
                                                            .description
                                                      ? `${step.responsible.code} - ${step.responsible.description}`
                                                      : 'Type to select'
                                            }
                                            onFilter={setFilterForResponsibles}
                                        >
                                            {filteredResponsibles.map(
                                                (respItem, filtRespIndex) => {
                                                    return (
                                                        <DropdownItem
                                                            key={index}
                                                            onClick={(
                                                                event
                                                            ): void =>
                                                                setResponsibleValue(
                                                                    event,
                                                                    index,
                                                                    filtRespIndex
                                                                )
                                                            }
                                                        >
                                                            {respItem.text}
                                                        </DropdownItem>
                                                    );
                                                }
                                            )}
                                        </Dropdown>
                                    </ResponsibleDropdownContainer>
                                </FormFieldSpacer>
                                <FormFieldSpacer>
                                    <div style={{ minWidth: '300px' }}>
                                        <TextField
                                            id={`titleStep_${index}`}
                                            label="Title for this step"
                                            value={step.title}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>
                                            ): void =>
                                                setStepTitleValue(
                                                    e.target.value,
                                                    index
                                                )
                                            }
                                            placeholder="Write here"
                                            disabled={
                                                newJourney.isVoided ||
                                                step.isVoided
                                            }
                                        />
                                    </div>
                                </FormFieldSpacer>
                                <FormFieldSpacer>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        {index != 100 && (
                                            <div
                                                style={{
                                                    fontSize: '12px',
                                                    paddingBottom:
                                                        'var(--grid-unit)',
                                                }}
                                            >
                                                Automatic transfer on signing
                                            </div>
                                        )}
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                maxHeight: `calc(var(--grid-unit) * ${checkboxHeightInGridUnits})`,
                                            }}
                                        >
                                            <FormFieldSpacer>
                                                <Checkbox
                                                    checked={
                                                        step.autoTransferMethod ==
                                                        AutoTransferMethod.RFCC
                                                    }
                                                    disabled={
                                                        newJourney.isVoided ||
                                                        step.isVoided
                                                    }
                                                    onChange={(
                                                        checked: boolean
                                                    ): void => {
                                                        if (checked) {
                                                            setStepAutoTransValue(
                                                                AutoTransferMethod.RFCC,
                                                                index
                                                            );
                                                        } else {
                                                            setStepAutoTransValue(
                                                                AutoTransferMethod.NONE,
                                                                index
                                                            );
                                                        }
                                                    }}
                                                    heightInGridUnits={
                                                        checkboxHeightInGridUnits
                                                    }
                                                >
                                                    <Typography variant="body_long">
                                                        RFCC
                                                    </Typography>
                                                </Checkbox>
                                            </FormFieldSpacer>

                                            <FormFieldSpacer>
                                                <Checkbox
                                                    checked={
                                                        step.autoTransferMethod ==
                                                        AutoTransferMethod.RFOC
                                                    }
                                                    disabled={
                                                        newJourney.isVoided ||
                                                        step.isVoided
                                                    }
                                                    onChange={(
                                                        checked: boolean
                                                    ): void => {
                                                        if (checked) {
                                                            setStepAutoTransValue(
                                                                AutoTransferMethod.RFOC,
                                                                index
                                                            );
                                                        } else {
                                                            setStepAutoTransValue(
                                                                AutoTransferMethod.NONE,
                                                                index
                                                            );
                                                        }
                                                    }}
                                                    heightInGridUnits={
                                                        checkboxHeightInGridUnits
                                                    }
                                                >
                                                    <Typography variant="body_long">
                                                        RFOC
                                                    </Typography>
                                                </Checkbox>
                                            </FormFieldSpacer>
                                        </div>
                                    </div>
                                </FormFieldSpacer>

                                {
                                    <FormFieldSpacer>
                                        {
                                            <>
                                                <Button
                                                    disabled={
                                                        canSave ||
                                                        newJourney.isVoided ||
                                                        step.id === -1 ||
                                                        newJourney.steps
                                                            .length < 2
                                                    }
                                                    variant="ghost"
                                                    onClick={(): void =>
                                                        moveStepUp(index)
                                                    }
                                                >
                                                    {upIcon}
                                                </Button>
                                                <Button
                                                    disabled={
                                                        canSave ||
                                                        newJourney.isVoided ||
                                                        step.id === -1 ||
                                                        newJourney.steps
                                                            .length < 2
                                                    }
                                                    variant="ghost"
                                                    onClick={(): void =>
                                                        moveStepDown(index)
                                                    }
                                                >
                                                    {downIcon}
                                                </Button>
                                            </>
                                        }
                                        {(step.id == -1 ||
                                            (step.isVoided &&
                                                !step.isInUse)) && (
                                            <Button
                                                variant="ghost"
                                                title="Delete"
                                                onClick={(): Promise<void> =>
                                                    deleteStep(step, index)
                                                }
                                            >
                                                {deleteIcon}
                                            </Button>
                                        )}
                                        {step.id != -1 && !step.isVoided && (
                                            <Button
                                                disabled={canSave}
                                                variant="ghost"
                                                onClick={(): Promise<void> =>
                                                    voidStep(step)
                                                }
                                            >
                                                {voidIcon} Void
                                            </Button>
                                        )}

                                        {step.id != -1 && step.isVoided && (
                                            <Button
                                                disabled={canSave}
                                                variant="ghost"
                                                onClick={(): Promise<void> =>
                                                    unvoidStep(step)
                                                }
                                            >
                                                {unvoidIcon} Unvoid
                                            </Button>
                                        )}
                                    </FormFieldSpacer>
                                }
                            </React.Fragment>
                        );
                    })}
            </StepsContainer>
            {canSave && newJourney.steps.length > 0 && (
                <div
                    style={{
                        display: 'flex',
                        marginLeft: 'var(--grid-unit)',
                        marginBottom: 'calc(var(--grid-unit) * 2)',
                    }}
                >
                    <Typography variant="caption">
                        Note: Some actions on steps will be disabled until
                        changes are saved.
                    </Typography>
                </div>
            )}
            {!newJourney.isVoided && (
                <IconContainer>
                    <Button variant="ghost" onClick={addNewStep}>
                        {addIcon} Add step
                    </Button>
                </IconContainer>
            )}
        </Container>
    );
};

export default PreservationJourney;
