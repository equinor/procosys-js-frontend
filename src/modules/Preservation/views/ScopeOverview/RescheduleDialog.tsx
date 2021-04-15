import React, { useEffect, useState } from 'react';
import { PreservedTag } from './types';
import { tokens } from '@equinor/eds-tokens';
import RequirementIcons from './RequirementIcons';
import DialogTable from './DialogTable';
import { ButtonContainer, ButtonSpacer, DialogContainer, Divider, FormFieldSpacer, InputContainer, OverflowColumn, Scrim, Title } from './RescheduleDialog.style';
import SelectInput, { SelectItem } from '../../../../components/Select';
import { TextField, Button } from '@equinor/eds-core-react';
import { Content } from '@procosys/core/services/ModalDialogService/style';
import { Typography } from '@equinor/eds-core-react';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { usePreservationContext } from '../../context/PreservationContext';
import Spinner from '@procosys/components/Spinner';
import EdsIcon from '@procosys/components/EdsIcon';
import { useDirtyContext } from '@procosys/core/DirtyContext';
import { TableOptions, UseTableRowProps } from 'react-table';
import { Tooltip } from '@material-ui/core';
import styled from 'styled-components';

const errorIcon = <EdsIcon name='error_filled' size={16} color={tokens.colors.interactive.danger__text.rgba} />;
const moduleName = 'PreservationRescheduleDialog';

const TableContainer = styled.div<{ restrictHeight?: boolean }>`
        ${(props): any => `
            height: ${props.restrictHeight ? '40%' : '100%'};
        `}
    `;

interface RescheduleDialogProps {
    tags: PreservedTag[];
    open: boolean;
    onClose: () => void;
}

const getRequirementIcons = (row: TableOptions<PreservedTag>): JSX.Element => {
    const tag = row.value as PreservedTag;
    return (
        <RequirementIcons tag={tag} />
    );
};

const getTagNoColumn = (row: TableOptions<PreservedTag>): JSX.Element => {
    const tag = row.value as PreservedTag;
    return (
        <Tooltip title={tag.tagNo || ''} arrow={true} enterDelay={200} enterNextDelay={100}>
            <OverflowColumn>{tag.tagNo}</OverflowColumn>
        </Tooltip>
    );
};

const getDescriptionColumn = (row: TableOptions<PreservedTag>): JSX.Element => {
    const tag = row.value as PreservedTag;
    return (
        <Tooltip title={tag.description || ''} arrow={true} enterDelay={200} enterNextDelay={100}>
            <OverflowColumn>{tag.description}</OverflowColumn>
        </Tooltip>
    );
};

const getStatusColumn = (row: TableOptions<PreservedTag>): JSX.Element => {
    const tag = row.value as PreservedTag;
    return (
        <Tooltip title={tag.status || ''} arrow={true} enterDelay={200} enterNextDelay={100}>
            <OverflowColumn>{tag.status}</OverflowColumn>
        </Tooltip>
    );
};

const columns = [
    {
        Header: 'Tag nr',
        accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
        Cell: getTagNoColumn
    },
    {
        Header: 'Description',
        accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
        Cell: getDescriptionColumn
    },
    {
        Header: 'Status',
        accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
        Cell: getStatusColumn
    },
    {
        Header: 'Req type',
        accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
        Cell: getRequirementIcons
    }
];

const directionItems: SelectItem[] = [
    { text: 'Earlier', value: 'Earlier' },
    { text: 'Later', value: 'Later' }];

const RescheduleDialog = (props: RescheduleDialogProps): JSX.Element | null => {

    const [directionItem, setDirectionItem] = useState<SelectItem | null>();
    const [noOfWeeks, setNoOfWeeks] = useState<string>('');
    const [noOfWeeksIsValid, setNoOfWeeksIsValid] = useState<boolean>(false);
    const [comment, setComment] = useState<string>('');
    const [reschedulableTags, setReschedulableTags] = useState<PreservedTag[]>([]);
    const [nonReschedulableTags, setNonReschedulableTags] = useState<PreservedTag[]>([]);
    const [canReschedule, setCanReschedule] = useState<boolean>(true);
    const [showSpinner, setShowSpinner] = useState<boolean>(false);
    const { apiClient } = usePreservationContext();
    const [error, setError] = useState<string>('');

    const { setDirtyStateFor, unsetDirtyStateFor } = useDirtyContext();

    const handleReschedule = (async (): Promise<void> => {
        setShowSpinner(true);
        try {
            if (noOfWeeks && directionItem && canReschedule && noOfWeeksIsValid) {
                await apiClient.reschedule(reschedulableTags.map(t => ({
                    id: t.id,
                    rowVersion: t.rowVersion
                })), Number(noOfWeeks), directionItem.value, comment);
                showSnackbarNotification(`${reschedulableTags.length} tag(s) have been successfully rescheduled.`);
            } else {
                showSnackbarNotification('Tag(s) have not been rescheduled. Number of weeks, direction and comment is required. Number of weeks must be a whole number in the range 1 to 52.');
            }
            setNoOfWeeks('');
            setNoOfWeeksIsValid(false);
            setDirectionItem(null);
            setComment('');
            setShowSpinner(false);
            props.onClose();
        } catch (error) {
            console.error('Reschedule failed: ', error.message, error.data);
            showSnackbarNotification(error.message);
        }
        return Promise.resolve();
    });

    /** Create reschedulable- and non-reschedulable tag lists*/
    useEffect(() => {
        const reschedulableTags: PreservedTag[] = [];
        const nonReschedulableTags: PreservedTag[] = [];

        props.tags.map((tag) => {
            const newTag: PreservedTag = { ...tag };
            if (tag.readyToBeRescheduled && !tag.isVoided) {
                reschedulableTags.push(newTag);
            } else {
                nonReschedulableTags.push(newTag);
            }
        });
        setReschedulableTags(reschedulableTags);
        setNonReschedulableTags(nonReschedulableTags);
    }, [props.tags]);


    const hasUnsavedChanges = (): boolean => {
        return (noOfWeeks || (directionItem && directionItem.text) || (comment && comment.length > 0)) ? true : false;
    };

    /** Set canReschedule and set global dirty state */
    useEffect(() => {
        setCanReschedule((noOfWeeksIsValid && directionItem && directionItem.text && comment && comment.length > 0) ? true : false);

        if (hasUnsavedChanges()) {
            setDirtyStateFor(moduleName);
        } else {
            unsetDirtyStateFor(moduleName);
        }
        return (): void => {
            unsetDirtyStateFor(moduleName);
        };
    }, [noOfWeeks, directionItem, comment]);

    if (!props.open) {
        return null;
    }

    const handleNoOfWeeksChanged = (newValue: string): void => {
        setNoOfWeeks(newValue);
        if (newValue === '') {
            setError('');
            setNoOfWeeksIsValid(false);
            return;
        }
        const newWeekNumber = Number(newValue);
        if (!isNaN(newWeekNumber)) {
            if (Number.isInteger(newWeekNumber)) {
                if (0 < newWeekNumber && newWeekNumber < 53) {
                    setNoOfWeeksIsValid(true);
                    setError('');
                } else {
                    setNoOfWeeksIsValid(false);
                    setError('Has to be between 0 and 53');
                }
            } else {
                setNoOfWeeksIsValid(false);
                setError('Has to be a whole number');
            }
        } else {
            setNoOfWeeksIsValid(false);
            setError('Has to be a number');
        }
    };

    

    return (
        <Scrim>
            <DialogContainer width={'80vw'}>
                <Title>
                    <Typography variant='h6'>Reschedule preservation</Typography>
                </Title>
                <Divider />
                <Content>
                    <Typography variant='body_short' bold style={{ marginTop: 'var(--grid-unit)' }}>
                        Selected {reschedulableTags.length + nonReschedulableTags.length} tag(s)
                    </Typography>
                    {
                        reschedulableTags.length > 0 && (
                            <InputContainer>
                                <FormFieldSpacer>
                                    <TextField
                                        label="No. of weeks"
                                        data-testid="No. of weeks"
                                        meta="Required"
                                        placeholder="Write here"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                            handleNoOfWeeksChanged(e.target.value);
                                        }}
                                        value={noOfWeeks || ''}
                                        helperText={error}
                                        variant={error ? 'error' : 'default'}
                                        helperIcon={error ? errorIcon : ''}
                                    />
                                </FormFieldSpacer>
                                <FormFieldSpacer>
                                    <SelectInput
                                        title='direction'
                                        onChange={(value): void => setDirectionItem(directionItems.find((p: SelectItem) => p.value === value))}
                                        data={directionItems}
                                        label={'Direction'}
                                    >
                                        {directionItem && directionItem.text || 'Select'}
                                    </SelectInput>
                                </FormFieldSpacer>
                                <FormFieldSpacer>
                                    <TextField
                                        label="Comment"
                                        data-testid="comment"
                                        meta="Required"
                                        placeholder="Write here"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                            setComment(e.target.value);
                                        }}
                                        value={comment || ''}
                                    />
                                </FormFieldSpacer>

                            </InputContainer>
                        )
                    }
                    {
                        nonReschedulableTags.length > 0 && (
                            <TableContainer restrictHeight={reschedulableTags.length > 0}>
                                <DialogTable tags={nonReschedulableTags} columns={columns} toolbarText='tag(s) will not be rescheduled' toolbarColor={tokens.colors.interactive.danger__text.rgba} />
                            </TableContainer>
                        )
                    }
                    {
                        reschedulableTags.length > 0 && (
                            <TableContainer restrictHeight={nonReschedulableTags.length > 0}>
                                <DialogTable tags={reschedulableTags} columns={columns} toolbarText='tag(s) will be rescheduled' toolbarColor={tokens.colors.interactive.primary__resting.rgba} />
                            </TableContainer>
                        )
                    }

                </Content >

                <ButtonContainer>
                    <Button onClick={props.onClose}>
                        Cancel
                    </Button>
                    <ButtonSpacer />
                    {
                        reschedulableTags.length > 0 && (
                            <Button disabled={!canReschedule || showSpinner} onClick={handleReschedule}>
                                Reschedule
                            </Button>
                        )
                    }
                    {
                        showSpinner && <Spinner />
                    }

                </ButtonContainer>
            </DialogContainer>
        </Scrim>
    );
};

export default RescheduleDialog;
