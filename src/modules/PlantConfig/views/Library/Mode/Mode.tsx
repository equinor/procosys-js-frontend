import { Breadcrumbs, ButtonContainer, ButtonSpacer, Container, IconContainer, InputContainer } from './Mode.style';
import { Button, TextField, Typography } from '@equinor/eds-core-react';
import React, { useEffect, useState } from 'react';

import Checkbox from './../../../../../components/Checkbox';
import EdsIcon from '../../../../../components/EdsIcon';
import Spinner from '@procosys/components/Spinner';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useDirtyContext } from '@procosys/core/DirtyContext';
import { usePlantConfigContext } from '@procosys/modules/PlantConfig/context/PlantConfigContext';

const deleteIcon = <EdsIcon name='delete_to_trash'/>;
const addIcon = <EdsIcon name='add'/>;
const voidIcon = <EdsIcon name='delete_forever'/>;
const unvoidIcon = <EdsIcon name='restore_from_trash'/>;
const baseBreadcrumb = 'Library / Modes';

interface ModeItem {
    id: number;
    title: string;
    forSupplier: boolean;
    isInUse: boolean;
    isVoided: boolean;
    rowVersion: string;
}

type ModeProps = {
    modeId: number;
    forceUpdate: number;
    setDirtyLibraryType: () => void;
};

const Mode = (props: ModeProps): JSX.Element => {

    const createNewMode = (): ModeItem => {
        return { id: -1, title: '', isVoided: false, forSupplier: false, isInUse: false, rowVersion: '' };
    };

    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [mode, setMode] = useState<ModeItem | null>(null);
    const [newMode, setNewMode] = useState<ModeItem>(createNewMode);
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const { setDirtyStateFor, unsetDirtyStateFor } = useDirtyContext();

    useEffect(() => {
        setIsEditMode(false);
    }, [props.forceUpdate]);

    const {
        preservationApiClient,
    } = usePlantConfigContext();

    const cloneMode = (mode: ModeItem): ModeItem => {
        return JSON.parse(JSON.stringify(mode));
    };

    const getMode = async (modeId: number): Promise<void> => {
        setIsLoading(true);
        try {
            await preservationApiClient.getMode(modeId).then(
                (response) => {
                    setMode(response);
                    setNewMode(cloneMode(response));
                    setIsDirty(false);
                }
            );
        } catch (error) {
            console.error('Get mode failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (isDirty) {
            setDirtyStateFor('ModeForm');
        } else {
            unsetDirtyStateFor('ModeForm');
        }
        return (): void => {
            unsetDirtyStateFor('ModeForm');
        };
    }, [isDirty]);

    useEffect((): void => {
        if (props.modeId) {
            getMode(props.modeId);
            setIsEditMode(true);
        } else {
            setMode(null);
            setIsEditMode(false);
        }
    }, [props.modeId]);

    const saveNewMode = async (): Promise<void> => {
        try {
            const modeId = await preservationApiClient.addMode(newMode.title, newMode.forSupplier);
            getMode(modeId);
            props.setDirtyLibraryType();
            showSnackbarNotification('New mode is saved.', 5000);
        } catch (error) {
            console.error('Add mode failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
        }
    };

    const updateMode = async (): Promise<void> => {
        try {
            await preservationApiClient.updateMode(newMode.id, newMode.title, newMode.forSupplier, newMode.rowVersion);
            setIsSaved(true);
            props.setDirtyLibraryType();
        } catch (error) {
            console.error('Update mode failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
            getMode(newMode.id);
        }
    };

    const saveUpdatedMode = async (): Promise<void> => {
        let noChangesToSave = true;
        if (mode && (mode.title != newMode.title || mode.forSupplier != newMode.forSupplier)) {
            await updateMode();
            noChangesToSave = false;
        }

        if (noChangesToSave) {
            showSnackbarNotification('No changes need to be saved.', 5000);
        }
    };

    useEffect(() => {
        if (isSaved) {
            getMode(newMode.id);
            showSnackbarNotification('Changes for mode are saved.', 5000);
            setIsSaved(false);
        }
    }, [isSaved]);

    const handleSave = (): void => {
        if (newMode.id === -1) {
            saveNewMode();
        } else {
            saveUpdatedMode();
        }
        setIsDirty(false);
    };

    const cancel = (): void => {
        if (isDirty && !confirm('Do you want to cancel changes without saving?')) {
            return;
        }
        setMode(null);
        setIsEditMode(false);
    };

    const deleteMode = async (): Promise<void> => {
        if (mode) {
            setIsLoading(true);
            try {
                await preservationApiClient.deleteMode(mode.id, mode.rowVersion);
                setMode(null);
                setIsDirty(false);
                setIsEditMode(false);
                props.setDirtyLibraryType();
                showSnackbarNotification('Mode is deleted.');
            } catch (error) {
                console.error('Error occured when trying to delete mode: ', error.message, error.data);
                showSnackbarNotification(error.message);
            }
            setIsLoading(false);
        }
    };

    const voidMode = async (): Promise<void> => {
        if (mode) {
            setIsLoading(true);
            try {
                await preservationApiClient.voidMode(mode.id, mode.rowVersion);
                getMode(mode.id);
                props.setDirtyLibraryType();
                showSnackbarNotification('Mode is voided.', 5000);
            } catch (error) {
                console.error('Error occured when trying to void mode: ', error.message, error.data);
                showSnackbarNotification(error.message, 5000);
            }
            setIsLoading(false);
        }
    };

    const unvoidMode = async (): Promise<void> => {
        if (mode) {
            setIsLoading(true);
            try {
                await preservationApiClient.unvoidMode(mode.id, mode.rowVersion);
                getMode(mode.id);
                props.setDirtyLibraryType();
                showSnackbarNotification('Mode is unvoided.', 5000);
            } catch (error) {
                console.error('Error occured when trying to unvoid mode: ', error.message, error.data);
                showSnackbarNotification(error.message, 5000);
            }
            setIsLoading(false);
        }
    };

    const initNewMode = (): void => {
        setNewMode(createNewMode());
        setIsEditMode(true);
    };

    const setTitleValue = (value: string): void => {
        setIsDirty(true);
        newMode.title = value;
        setNewMode(cloneMode(newMode));
    };

    const setForSupplierValue = (value: boolean): void => {
        setIsDirty(true);
        newMode.forSupplier = value;
        setNewMode(cloneMode(newMode));
    };

    if (isLoading) {
        return (
            <Container>
                <Breadcrumbs>{baseBreadcrumb} /</Breadcrumbs>
                <Spinner large />
            </Container>);
    }

    if (!isEditMode) {
        return (
            <Container>
                <Breadcrumbs>{baseBreadcrumb}</Breadcrumbs>
                <IconContainer>
                    <Button variant='ghost' onClick={initNewMode}>
                        {addIcon} New mode
                    </Button>
                </IconContainer>
            </Container>);
    }

    return (
        <Container>
            <Breadcrumbs>{baseBreadcrumb} / {newMode.title}</Breadcrumbs>
            {newMode.isVoided &&
                <Typography variant="caption" style={{ marginLeft: 'calc(var(--grid-unit) * 2)', fontWeight: 'bold' }}>Mode is voided</Typography>
            }
            <ButtonContainer>
                {newMode.isVoided &&
                    <Button variant="outlined" onClick={deleteMode} disabled={newMode.isInUse} title={newMode.isInUse ? 'Mode that is in use cannot be deleted' : ''}>
                        {deleteIcon} Delete
                    </Button>
                }
                <ButtonSpacer />
                {newMode.isVoided &&
                    <Button variant="outlined" onClick={unvoidMode}>
                        {unvoidIcon} Unvoid
                    </Button>
                }
                {!newMode.isVoided && newMode.id != -1 &&
                    <Button variant="outlined" onClick={voidMode}>
                        {voidIcon} Void
                    </Button>
                }
                <ButtonSpacer />
                <Button variant="outlined" onClick={cancel} disabled={newMode.isVoided}>
                    Cancel
                </Button>
                <ButtonSpacer />
                <Button onClick={handleSave} disabled={newMode.isVoided || !isDirty}>
                    Save
                </Button>
            </ButtonContainer>

            <InputContainer style={{ width: '280px' }}>
                <TextField
                    id={'title'}
                    label='Title for this mode'
                    value={newMode.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { setTitleValue(e.target.value); }}
                    placeholder="Write here"
                    disabled={newMode.isVoided}
                />
            </InputContainer>

            <InputContainer>
                <Checkbox
                    checked={newMode.forSupplier}
                    disabled={newMode.isVoided}
                    onChange={(checked: boolean): void => {
                        setForSupplierValue(checked);
                    }}
                >
                    <Typography variant='body_long'>For supplier preservation</Typography>
                </Checkbox>
            </InputContainer>


        </Container >

    );
};

export default Mode;
