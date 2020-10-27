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
    selectedTags: PreservedTag[];
    setShowTagReschedule: (showTagReschedule: boolean) => void;
    refreshScopeList: () => void;
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

const timeItems: SelectItem[] = [
    { text: '1 week', value: 1 },
    { text: '2 weeks', value: 2 },
    { text: '3 weeks', value: 3 },
    { text: '4 weeks', value: 4 }];

const directionItems: SelectItem[] = [
    { text: 'Earlier', value: 'Earlier' },
    { text: 'Later', value: 'Later' }];

const RescheduleDialog = (props: RescheduleDialogProps): JSX.Element => {

    const [directionItem, setDirectionItem] = useState<SelectItem>();
    const [timeItem, setTimeItem] = useState<SelectItem>();
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
            setShowSpinner(false);
            props.refreshScopeList();
            props.setShowTagReschedule(false);
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

        props.selectedTags.map((tag) => {
            const newTag: PreservedTag = { ...tag };
            if (tag.readyToBeRescheduled && !tag.isVoided) {
                reschedulableTags.push(newTag);
            } else {
                nonReschedulableTags.push(newTag);
            }
        });
        setReschedulableTags(reschedulableTags);
        setNonReschedulableTags(nonReschedulableTags);
    }, [props.selectedTags]);


    /** Set canReschedule */
    useEffect((): void => {
        setCanReschedule((timeItem && timeItem.text && directionItem && directionItem.text && comment && comment.length > 0) ? true : false);
    }, [timeItem, directionItem, comment]);

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
                                        onChange={(value): void => setTimeItem(timeItems.find((p: SelectItem) => p.value === value))}
                                        data={timeItems}
                                        label={'Time'}
                                    >
                                        {timeItem && timeItem.text || 'Select'}
                                    </SelectInput>
                                </FormFieldSpacer>
                                <FormFieldSpacer>
                                    <SelectInput
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
                            <div>
                                <DialogTable tags={nonReschedulableTags} columns={columns} toolbarText='tag(s) will not be rescheduled' toolbarColor={tokens.colors.interactive.danger__text.rgba} />
                            </div>
                        )
                    }
                    {
                        reschedulableTags.length > 0 && (
                            <DialogTable tags={reschedulableTags} columns={columns} toolbarText='tag(s) will be resceduled' toolbarColor={tokens.colors.interactive.primary__resting.rgba} />
                        )
                    }

                </Content >

                <ButtonContainer>
                    <Button onClick={(): void => { props.setShowTagReschedule(false); }}>
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
