import React, { useEffect, useState } from 'react';
import { PreservedTag, Step } from '../types';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import DialogTable from './SharedCode/DialogTable';
import { TableOptions, UseTableRowProps } from 'react-table';
import styled from 'styled-components';
import {
    ButtonContainer,
    ButtonSpacer,
    DialogContainer,
    Divider,
    InputSpacer,
    MainContainer,
    Scrim,
    TableContainer,
    Title,
} from './SharedCode/Dialogs.style';
import SelectInput, { SelectItem } from '@procosys/components/Select';
import { Button } from '@equinor/eds-core-react';
import Spinner from '@procosys/components/Spinner';
import { useDirtyContext } from '@procosys/core/DirtyContext';
import { Canceler } from 'axios';
import { usePreservationContext } from '@procosys/modules/Preservation/context/PreservationContext';
import { ProCoSysApiError } from '@procosys/core/ProCoSysApiError';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { Journey } from '../../AddScope/types';
import { Content } from '@procosys/core/services/ModalDialogService/style';
import { Tooltip } from '@mui/material';
import { handleErrorFromBackend } from './SharedCode/errorHandling';

const moduleName = 'PreservationUpdateJourneyDialog';

const OverflowColumn = styled.div`
    text-overflow: ellipsis;
    overflow: hidden;
`;

const getTagNoCell = (row: TableOptions<PreservedTag>): JSX.Element => {
    const tag = row.value as PreservedTag;
    return (
        <Tooltip
            title={tag.tagNo || ''}
            arrow={true}
            enterDelay={200}
            enterNextDelay={100}
        >
            <OverflowColumn>{tag.tagNo}</OverflowColumn>
        </Tooltip>
    );
};

const getDescriptionCell = (row: TableOptions<PreservedTag>): JSX.Element => {
    const tag = row.value as PreservedTag;
    return (
        <Tooltip
            title={tag.description || ''}
            arrow={true}
            enterDelay={200}
            enterNextDelay={100}
        >
            <OverflowColumn>{tag.description}</OverflowColumn>
        </Tooltip>
    );
};

const getStatusCell = (row: TableOptions<PreservedTag>): JSX.Element => {
    const tag = row.value as PreservedTag;
    return (
        <Tooltip
            title={tag.status || ''}
            arrow={true}
            enterDelay={200}
            enterNextDelay={100}
        >
            <OverflowColumn>{tag.status}</OverflowColumn>
        </Tooltip>
    );
};

const columns = [
    {
        Header: 'Tag nr',
        accessor: (
            d: UseTableRowProps<PreservedTag>
        ): UseTableRowProps<PreservedTag> => d,
        Cell: getTagNoCell,
    },
    {
        Header: 'Description',
        accessor: (
            d: UseTableRowProps<PreservedTag>
        ): UseTableRowProps<PreservedTag> => d,
        Cell: getDescriptionCell,
    },
    {
        Header: 'Status',
        accessor: (
            d: UseTableRowProps<PreservedTag>
        ): UseTableRowProps<PreservedTag> => d,
        Cell: getStatusCell,
    },
];

interface UpdateJourneyDialogProps {
    tags: PreservedTag[];
    open: boolean;
    onClose: () => void;
}

const UpdateJourneyDialog = ({
    tags,
    open,
    onClose,
}: UpdateJourneyDialogProps): JSX.Element | null => {
    if (!open) {
        return null;
    }
    const [nonUpdateableTags, setNonUpdateableTags] = useState<PreservedTag[]>(
        []
    );
    const [updateableTags, setUpdateableTags] = useState<PreservedTag[]>([]);
    const [validationErrorMessage, setValidationErrorMessage] = useState<
        string | null
    >();
    const [tagJourneyOrStepEdited, setTagJourneyOrStepEdited] =
        useState<boolean>(false);
    const [tagJourneyAndStepValid, setTagJourneyAndStepValid] =
        useState<boolean>(false);
    const { setDirtyStateFor, unsetDirtyStateFor } = useDirtyContext();
    const { apiClient, project } = usePreservationContext();
    const [journeys, setJourneys] = useState<Journey[]>([]);
    const [step, setStep] = useState<Step | null>(null);
    const [poTag, setPoTag] = useState<boolean>(false);
    const [mappedJourneys, setMappedJourneys] = useState<SelectItem[]>([]);
    const [isNewJourney, setIsNewJourney] = useState<boolean>(true);
    const [journey, setJourney] = useState<Journey>();
    const [mappedSteps, setMappedSteps] = useState<SelectItem[]>([]);
    const [showSpinner, setShowSpinner] = useState<boolean>(false);

    useEffect(() => {
        const tempNonUpdateableTags: PreservedTag[] = [];
        const tempUpdateableTags: PreservedTag[] = [];
        tags.map((tag) => {
            if (tag.tagNo.substring(0, 4) == '#PO-') {
                setPoTag(true);
            }
            if (tag.readyToBeEdited && !tag.isVoided) {
                tempUpdateableTags.push(tag);
            } else {
                tempNonUpdateableTags.push(tag);
            }
        });
        setNonUpdateableTags(tempNonUpdateableTags);
        setUpdateableTags(tempUpdateableTags);
    }, [tags]);

    /** Update global and local dirty state */
    useEffect(() => {
        if (tagJourneyOrStepEdited) {
            setDirtyStateFor(moduleName);
        } else {
            unsetDirtyStateFor(moduleName);
        }

        return (): void => {
            unsetDirtyStateFor(moduleName);
        };
    }, [tagJourneyOrStepEdited]);

    /**
     * Get Journeys
     */
    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                const data = await apiClient.getJourneys(
                    true,
                    (cancel: Canceler) => (requestCancellor = cancel),
                    project.name
                );
                setJourneys(data);
            } catch (error) {
                if (!(error instanceof ProCoSysApiError)) return;
                console.error(
                    'Get journeys failed: ',
                    error.message,
                    error.data
                );
                showSnackbarNotification(error.message);
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    const setSelectedStep = (stepId: number, journey?: Journey): void => {
        if (journey) {
            let selectedStep: Step | undefined = journey.steps.find(
                (pStep: Step) => pStep.id === stepId
            );
            if (!selectedStep) {
                //Set dummy step to handle voided step
                selectedStep = {
                    id: stepId,
                    isVoided: true,
                    title: 'Dummy step',
                    mode: {
                        id: -1,
                        title: '',
                        rowVersion: '',
                        forSupplier: false,
                    },
                    rowVersion: '',
                };
            }
            setStep(selectedStep);
        }
    };

    /**
     * Map journeys into menu elements
     */
    useEffect(() => {
        const validJourneys: SelectItem[] = [];

        journeys.forEach((journey) => {
            if (
                !journey.isVoided &&
                (!poTag ||
                    (poTag &&
                        journey.steps.some((step) => step.mode.forSupplier))) // If PO tag, only include if a supplier step exists
            ) {
                validJourneys.push({
                    text: journey.title,
                    value: journey.id,
                });
            }
        });
        setMappedJourneys(validJourneys);
    }, [journeys]);

    /**
     * Map Journey steps into menu elements, and set step if necessary.
     */
    useEffect(() => {
        if (isNewJourney && journey) {
            setStep(null);
            setIsNewJourney(false);
        }
        //Map steps to menu elements
        if (journeys.length > 0 && journey) {
            const validSteps: SelectItem[] = [];
            journey.steps.forEach((step) => {
                if (
                    !step.isVoided &&
                    (!poTag || (poTag && step.mode.forSupplier)) //for PO tags, only supplier step can be choosen
                ) {
                    validSteps.push({
                        text: step.title,
                        value: step.id,
                    });
                }
            });
            setMappedSteps(validSteps);
            // If purchase order tag, set current step to the supplier step (the only valid state)
            if (poTag) {
                const stepForSupplier = journey.steps.find(
                    (step) => step.mode.forSupplier
                );
                if (!stepForSupplier) {
                    showSnackbarNotification(
                        'Warning: Selected journey does not have a supplier step.',
                        5000
                    );
                } else {
                    setStep(stepForSupplier);
                }
            }
        }
    }, [journey]);

    const setJourneyFromForm = (value: number): void => {
        const j = journeys.find((pJourney: Journey) => pJourney.id === value);
        if (j) {
            setJourney(j);
            setIsNewJourney(true);
        }
    };

    /**
     * Check if any changes have been made to journey or step and whether the values are valid
     */
    useEffect(() => {
        if (journey) {
            setTagJourneyOrStepEdited(true);
        } else {
            setTagJourneyOrStepEdited(false);
        }
        if (journey && step && !step.isVoided) {
            setTagJourneyAndStepValid(true);
        } else {
            setTagJourneyAndStepValid(false);
        }
    }, [step, journey]);

    const updateTagJourneyAndStep = async (): Promise<void> => {
        try {
            if (step) {
                const tagDtos = updateableTags.map((tag) => {
                    return {
                        id: tag.id,
                        rowVersion: tag.rowVersion,
                    };
                });
                await apiClient.updateTagStep(tagDtos, step.id);
            }
        } catch (error) {
            const errorMessageConsole =
                'Error updating journey, step, requirements, or description';
            if (error instanceof ProCoSysApiError) {
                handleErrorFromBackend(
                    error,
                    errorMessageConsole,
                    setValidationErrorMessage
                );
            } else {
                console.error(
                    errorMessageConsole,
                    'An unknown error occurred',
                    error
                );
                throw showSnackbarNotification('An unknown error occurred');
            }
        }
    };

    const save = async (): Promise<void> => {
        setShowSpinner(true);
        if (tagJourneyAndStepValid) {
            try {
                await updateTagJourneyAndStep();
            } catch (error) {
                setShowSpinner(false);
                throw 'error';
            }
        }
        unsetDirtyStateFor(moduleName);
        setShowSpinner(false);
        showSnackbarNotification(`Changes to tags have been saved`);
        onClose();
    };

    return (
        <Scrim>
            <DialogContainer width={'80vw'}>
                <Title>
                    <Typography variant="h6">Update tag journey</Typography>
                </Title>
                <Divider />
                <Content>
                    {validationErrorMessage && (
                        <Typography variant="caption">
                            {validationErrorMessage}
                        </Typography>
                    )}
                    <InputSpacer>
                        <SelectInput
                            maxHeight={'300px'}
                            onChange={setJourneyFromForm}
                            data={mappedJourneys}
                            label={'Preservation journey for selected tag'}
                        >
                            {journey ? journey.title : 'Select journey'}
                        </SelectInput>
                    </InputSpacer>
                    <InputSpacer>
                        <SelectInput
                            onChange={(stepId): void =>
                                setSelectedStep(stepId, journey)
                            }
                            data={mappedSteps}
                            disabled={poTag || isNewJourney}
                            label={'Preservation step'}
                        >
                            {(step && step.title) || 'Select step'}
                        </SelectInput>
                        {poTag && (
                            <Typography variant="meta">
                                At least one purchase order tag has been chosen.
                                Step must therefore be supplier step and will be
                                set automatically.
                            </Typography>
                        )}
                    </InputSpacer>
                    <MainContainer style={{ height: '100%' }}>
                        {nonUpdateableTags.length > 0 && (
                            <TableContainer
                                isHalfSize={updateableTags.length > 0}
                            >
                                <Typography variant="meta">
                                    Journey cannot be updated for
                                    {nonUpdateableTags.length} tag(s).
                                </Typography>
                                <DialogTable
                                    tags={nonUpdateableTags}
                                    columns={columns}
                                    toolbarText="journey for tag(s) will not be updated"
                                    toolbarColor={
                                        tokens.colors.interactive.danger__text
                                            .rgba
                                    }
                                />
                            </TableContainer>
                        )}
                        {updateableTags.length > 0 && (
                            <TableContainer
                                isHalfSize={nonUpdateableTags.length > 0}
                            >
                                <DialogTable
                                    tags={updateableTags}
                                    columns={columns}
                                    toolbarText="journey for tag(s) will be updated"
                                    toolbarColor={
                                        tokens.colors.interactive
                                            .primary__resting.rgba
                                    }
                                />
                            </TableContainer>
                        )}
                    </MainContainer>
                </Content>
                <ButtonContainer>
                    <Button onClick={onClose} variant="outlined">
                        Cancel
                    </Button>
                    <ButtonSpacer />
                    <Button
                        onClick={save}
                        color="primary"
                        disabled={!tagJourneyAndStepValid}
                    >
                        Save
                    </Button>
                    {showSpinner && <Spinner />}
                </ButtonContainer>
            </DialogContainer>
        </Scrim>
    );
};

export default UpdateJourneyDialog;
