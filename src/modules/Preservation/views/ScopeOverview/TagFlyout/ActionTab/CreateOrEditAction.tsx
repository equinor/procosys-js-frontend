import React, { useState, useRef, useEffect } from 'react';
import { showSnackbarNotification } from '../../../../../../core/services/NotificationService';
import { Container, Header, InputContainer, ButtonContainer, ButtonSpacer, AttachmentsContainer } from './CreateOrEditAction.style';
import { usePreservationContext } from '../../../../context/PreservationContext';
import { Button, TextField, Typography } from '@equinor/eds-core-react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import ActionAttachments from './ActionAttachments';

interface ActionTabProps {
    tagId: number;
    actionId?: number;
    title?: string;
    description?: string;
    dueTimeUtc?: Date | null;
    rowVersion?: string;
    backToParentView: () => void;
    setDirty: () => void;
}

const CreateOrEditAction = ({
    tagId,
    actionId,
    title,
    description,
    dueTimeUtc,
    rowVersion,
    backToParentView,
    setDirty
}: ActionTabProps): JSX.Element => {

    const { apiClient } = usePreservationContext();

    const [newTitle, setNewTitle] = useState<string>(title ? title : '');
    const [newDescription, setNewDescription] = useState<string>(description ? description : '');
    const [newDueTimeUtc, setNewDueTimeUtc] = useState<Date | null>(dueTimeUtc ? dueTimeUtc : null);

    const titleInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLInputElement>(null);

    /** Set initial values */
    useEffect(() => {
        titleInputRef.current && title ? titleInputRef.current.value = title : null;
        descriptionInputRef.current && description ? descriptionInputRef.current.value = description : null;

    }, []);

    const saveAction = async (): Promise<void> => {
        try {
            if (actionId) {
                if (rowVersion) {
                    await apiClient.updateAction(tagId, actionId, newTitle, newDescription, newDueTimeUtc, rowVersion);
                    backToParentView();
                    showSnackbarNotification('Action is updated.', 5000, true);
                } else {
                    showSnackbarNotification('Error occured. Action is not updated. Row version is missing.', 5000, true);
                }
            } else {
                await apiClient.createNewAction(tagId, newTitle, newDescription, newDueTimeUtc);
                setDirty();
                backToParentView();
                showSnackbarNotification('New action is created.', 5000, true);
            }
        } catch (error) {
            console.error('Tag preservation failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000, true);
        }
    };

    return (
        <Container>

            {!actionId &&
                <Header>
                    <h1>Create Action</h1>
                </Header>
            }

            <InputContainer>
                <TextField
                    id={'title'}
                    label="Title"
                    inputRef={titleInputRef}
                    placeholder="Write Here"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setNewTitle(e.target.value)}
                />
            </InputContainer>
            <InputContainer>
                <TextField
                    id={'description'}
                    label="Description"
                    inputRef={descriptionInputRef}
                    multiline
                    rows={4}
                    placeholder="Write Here"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setNewDescription(e.target.value)}
                />
            </InputContainer>
            <InputContainer>
                <MuiPickersUtilsProvider utils={DateFnsUtils} >
                    <KeyboardDatePicker
                        clearable
                        label="Due date"
                        value={newDueTimeUtc}
                        onChange={(date: MaterialUiPickersDate): void => setNewDueTimeUtc(date)}
                        disablePast={false}
                        format='dd.MM.yyyy'
                        variant='inline'
                        inputVariant='outlined'
                        placeholder='dd.mm.yyyy'
                    />
                </MuiPickersUtilsProvider>
            </InputContainer>

            {actionId &&
                <AttachmentsContainer>
                    <Typography variant='caption'>Attachments</Typography>

                    <ActionAttachments
                        tagId={tagId}
                        actionId={actionId}
                        enableActions={true}
                    />
                </AttachmentsContainer>
            }

            <ButtonContainer>
                <Button onClick={backToParentView}>
                    Cancel
                </Button>
                <ButtonSpacer />
                <Button onClick={saveAction} disabled={!newTitle || !newDescription}>
                    Save
                </Button>
            </ButtonContainer>
        </Container>
    );
};

export default CreateOrEditAction;
