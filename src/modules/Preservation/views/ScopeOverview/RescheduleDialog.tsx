import React, { useEffect, useRef, useState } from 'react';
import { PreservedTag } from './types';
import { tokens } from '@equinor/eds-tokens';
import RequirementIcons from './RequirementIcons';
import { Column } from 'material-table';
import DialogTable from './DialogTable';
import { ButtonContainer, ButtonSpacer, DialogContainer, Divider, FormFieldSpacer, InputContainer, Scrim, Title } from './RescheduleDialog.style';
import SelectInput, { SelectItem } from '../../../../components/Select';
import { TextField, Button } from '@equinor/eds-core-react';
import { Content } from '@procosys/core/services/ModalDialogService/style';
import { Typography } from '@equinor/eds-core-react';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { usePreservationContext } from '../../context/PreservationContext';
import Spinner from '@procosys/components/Spinner';

interface RescheduleDialogProps {
    tags: PreservedTag[];
    open: boolean;
    onClose: () => void;
}

const getRequirementIcons = (tag: PreservedTag): JSX.Element => {
    return (
        <RequirementIcons tag={tag} />
    );
};

const columns: Column<any>[] = [
    { title: 'Tag nr', field: 'tagNo' },
    { title: 'Description', field: 'description' },
    { title: 'Status', field: 'status' },
    { title: 'Req type', render: getRequirementIcons }
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


    /** Set canReschedule */
    useEffect((): void => {
        setCanReschedule((noOfWeeksIsValid && directionItem && directionItem.text && comment && comment.length > 0) ? true : false);
    }, [noOfWeeks, directionItem, comment]);

    if (!props.open) {
        return null;
    }

    const handleNoOfWeeksChanged = (newValue: string): void => {
        setNoOfWeeks(newValue);
        const newWeekNumber = Number(newValue);
        if(!isNaN(newWeekNumber)){
            if(Number.isInteger(newWeekNumber)){
                if(0 < newWeekNumber && newWeekNumber < 53){
                    setNoOfWeeksIsValid(true);
                }else{
                    setNoOfWeeksIsValid(false);
                    showSnackbarNotification('The number of weeks has to be at least 1 and at most 52', 5000);
                }
            }else{
                setNoOfWeeksIsValid(false);
                showSnackbarNotification('The number of weeks has to be a whole number', 5000);
            }
        }else{
            setNoOfWeeksIsValid(false);
            showSnackbarNotification('The number of weeks has to be a number', 5000);
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
                                        id="noOfWeeks"
                                        meta="Required"
                                        placeholder="No. of weeks"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                            handleNoOfWeeksChanged(e.target.value);
                                        }}
                                        value={noOfWeeks || ''}
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
                                        id="comment"
                                        meta="Required"
                                        placeholder="Write comment here"
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
                            <div>
                                <DialogTable tags={nonReschedulableTags} columns={columns} toolbarText='tag(s) will not be rescheduled' toolbarColor={tokens.colors.interactive.danger__text.rgba} />
                            </div>
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
