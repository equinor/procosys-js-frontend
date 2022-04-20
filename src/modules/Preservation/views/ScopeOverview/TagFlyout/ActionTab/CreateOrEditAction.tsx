import {
    AttachmentsContainer,
    ButtonContainer,
    ButtonSpacer,
    Container,
    Header,
    InputContainer,
} from './CreateOrEditAction.style';
import { Button, TextField, Typography } from '@equinor/eds-core-react';
import React, {
    ChangeEvent,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import ActionAttachments from './ActionAttachments';
import { TextField as DateTimeField } from '@mui/material';
import Spinner from '@procosys/components/Spinner';
import {
    formatForDatePicker,
    getFormattedDate,
} from '@procosys/core/services/DateService';
import { showSnackbarNotification } from '../../../../../../core/services/NotificationService';
import { usePreservationContext } from '../../../../context/PreservationContext';
import { useDirtyContext } from '@procosys/core/DirtyContext';

const moduleName = 'PreservationCreateorEditAction';

interface ActionTabProps {
    tagId: number;
    isVoided: boolean;
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
    isVoided,
    actionId,
    title,
    description,
    dueTimeUtc,
    rowVersion,
    backToParentView,
    setDirty,
}: ActionTabProps): JSX.Element => {
    const { apiClient } = usePreservationContext();

    const [newTitle, setNewTitle] = useState<string>(title ? title : '');
    const [newDescription, setNewDescription] = useState<string>(
        description ? description : ''
    );
    const [newDueTimeUtc, setNewDueTimeUtc] = useState<Date | null>(
        dueTimeUtc ? dueTimeUtc : null
    );
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDirty, setIsDirty] = useState<boolean>(false);

    const titleInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLInputElement>(null);

    const { setDirtyStateFor, unsetDirtyStateFor } = useDirtyContext();

    /** Set initial values */
    useEffect(() => {
        titleInputRef.current && title
            ? (titleInputRef.current.value = title)
            : null;
        descriptionInputRef.current && description
            ? (descriptionInputRef.current.value = description)
            : null;
    }, []);

    /** Update global and local dirty state */
    useEffect(() => {
        if (
            title != newTitle ||
            description != newDescription ||
            getFormattedDate(dueTimeUtc) != getFormattedDate(newDueTimeUtc)
        ) {
            setIsDirty(true);
            setDirtyStateFor(moduleName);
        } else {
            setIsDirty(false);
            unsetDirtyStateFor(moduleName);
        }

        return (): void => {
            unsetDirtyStateFor(moduleName);
        };
    }, [newTitle, newDescription, newDueTimeUtc]);

    const saveAction = async (): Promise<void> => {
        setIsLoading(true);
        try {
            if (actionId) {
                if (rowVersion) {
                    await apiClient.updateAction(
                        tagId,
                        actionId,
                        newTitle,
                        newDescription,
                        newDueTimeUtc,
                        rowVersion
                    );
                    setDirty();
                    backToParentView();
                    showSnackbarNotification('Action is updated.', 5000, true);
                } else {
                    showSnackbarNotification(
                        'Error occured. Action is not updated. Row version is missing.',
                        5000,
                        true
                    );
                }
            } else {
                await apiClient.createNewAction(
                    tagId,
                    newTitle,
                    newDescription,
                    newDueTimeUtc
                );
                setDirty();
                backToParentView();
                showSnackbarNotification('New action is created.', 5000, true);
            }
        } catch (error) {
            console.error('Update action failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000, true);
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <Container>
            {!actionId && (
                <Header>
                    <Typography variant="h1">Create Action</Typography>
                </Header>
            )}

            <InputContainer>
                <TextField
                    id={'title'}
                    label="Title"
                    inputRef={titleInputRef}
                    placeholder="Write here"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                        setNewTitle(e.target.value)
                    }
                />
            </InputContainer>
            <InputContainer>
                <TextField
                    id={'description'}
                    label="Description"
                    inputRef={descriptionInputRef}
                    multiline
                    rows={4}
                    placeholder="Write here"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                        setNewDescription(e.target.value)
                    }
                />
            </InputContainer>
            <InputContainer>
                <DateTimeField
                    InputProps={{ inputProps: { max: '2121-01-01' } }}
                    id="actionDate"
                    label="Date"
                    type="date"
                    value={formatForDatePicker(newDueTimeUtc, 'yyyy-MM-dd')}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(
                        event: ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                        >
                    ): void => setNewDueTimeUtc(new Date(event.target.value))}
                />
            </InputContainer>

            {actionId && (
                <AttachmentsContainer>
                    <Typography variant="caption">Attachments</Typography>

                    <ActionAttachments
                        tagId={tagId}
                        isVoided={isVoided}
                        actionId={actionId}
                        enableActions={true}
                    />
                </AttachmentsContainer>
            )}

            <ButtonContainer>
                <Button onClick={backToParentView}>Cancel</Button>
                <ButtonSpacer />
                <Button
                    onClick={saveAction}
                    disabled={!(isDirty && newTitle && newDescription)}
                >
                    Save
                </Button>
            </ButtonContainer>
        </Container>
    );
};

export default CreateOrEditAction;
