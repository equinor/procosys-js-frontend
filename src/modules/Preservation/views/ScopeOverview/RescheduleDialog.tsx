import React, { useEffect, useRef, useState } from 'react';
import { PreservedTag } from './types';
import { tokens } from '@equinor/eds-tokens';
import RequirementIcons from './RequirementIcons';
import DialogTable from './DialogTable';
import { ButtonContainer, ButtonSpacer, DialogContainer, Divider, FormFieldSpacer, InputContainer, Scrim, Title } from './RescheduleDialog.style';
import SelectInput, { SelectItem } from '../../../../components/Select';
import { TextField, Button } from '@equinor/eds-core-react';
import { Content } from '@procosys/core/services/ModalDialogService/style';
import { Typography } from '@equinor/eds-core-react';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { usePreservationContext } from '../../context/PreservationContext';
import Spinner from '@procosys/components/Spinner';
import { TableOptions, UseTableRowProps } from 'react-table';

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

const columns = [
    { Header: 'Tag nr', accessor: 'tagNo' },
    { Header: 'Description', accessor: 'description' },
    { Header: 'Status', accessor: 'status' },
    {
        Header: 'Req type',
        accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d,
        Cell: getRequirementIcons
    }
];

const timeItems: SelectItem[] = [
    { text: '1 week', value: 1 },
    { text: '2 weeks', value: 2 },
    { text: '3 weeks', value: 3 },
    { text: '4 weeks', value: 4 }];

const directionItems: SelectItem[] = [
    { text: 'Earlier', value: 'Earlier' },
    { text: 'Later', value: 'Later' }];

const RescheduleDialog = (props: RescheduleDialogProps): JSX.Element | null => {

    const [directionItem, setDirectionItem] = useState<SelectItem | null>();
    const [timeItem, setTimeItem] = useState<SelectItem | null>();
    const [comment, setComment] = useState<string>('');
    const [reschedulableTags, setReschedulableTags] = useState<PreservedTag[]>([]);
    const [nonReschedulableTags, setNonReschedulableTags] = useState<PreservedTag[]>([]);
    const [canReschedule, setCanReschedule] = useState<boolean>(true);
    const [showSpinner, setShowSpinner] = useState<boolean>(false);
    const { apiClient } = usePreservationContext();

    const handleReschedule = (async (): Promise<void> => {
        setShowSpinner(true);
        try {
            if (timeItem && directionItem && canReschedule) {
                await apiClient.reschedule(reschedulableTags.map(t => ({
                    id: t.id,
                    rowVersion: t.rowVersion
                })), timeItem.value, directionItem.value, comment);
                showSnackbarNotification(`${reschedulableTags.length} tag(s) have been successfully rescheduled.`);
            } else {
                showSnackbarNotification('Tags have not been rescheduled. Time, direction and comment is required.');
            }
            setTimeItem(null);
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


    /** Set canReschedule */
    useEffect((): void => {
        setCanReschedule((timeItem && timeItem.text && directionItem && directionItem.text && comment && comment.length > 0) ? true : false);
    }, [timeItem, directionItem, comment]);

    if (!props.open) {
        return null;
    }

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
                                    <SelectInput
                                        title='time'
                                        onChange={(value): void => setTimeItem(timeItems.find((p: SelectItem) => p.value === value))}
                                        data={timeItems}
                                        label='Time'
                                    >
                                        {timeItem && timeItem.text || 'Select'}
                                    </SelectInput>
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
                                        id="comment"
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
                            <DialogTable tags={nonReschedulableTags} columns={columns} toolbarText='tag(s) will not be rescheduled' toolbarColor={tokens.colors.interactive.danger__text.rgba} />
                        )
                    }
                    {
                        reschedulableTags.length > 0 && (
                            <DialogTable tags={reschedulableTags} columns={columns} toolbarText='tag(s) will be rescheduled' toolbarColor={tokens.colors.interactive.primary__resting.rgba} />
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
