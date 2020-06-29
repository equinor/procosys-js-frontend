import React, { useState, useEffect } from 'react';
import { usePlantConfigContext } from '@procosys/modules/PlantConfig/context/PlantConfigContext';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { Container, InputContainer, ButtonContainer, ButtonSpacer, IconContainer } from './Mode.style';
import EdsIcon from '../../../../../components/EdsIcon';
import { TextField, Typography, Button } from '@equinor/eds-core-react';
import Spinner from '@procosys/components/Spinner';
import Checkbox from './../../../../../components/Checkbox';

const addIcon = <EdsIcon name='add' size={16} />;

interface ModeItem {
    id: number;
    title: string;
    forSupplier: boolean;
    isVoided: boolean;
    rowVersion: string;
}

type ModeProps = {
    modeId: number;
    setDirtyLibraryType: () => void;
};

const Mode = (props: ModeProps): JSX.Element => {

    const createNewMode = (): ModeItem => {
        return { id: -1, title: '', isVoided: false, forSupplier: false, rowVersion: '' };
    };

    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [mode, setMode] = useState<ModeItem | null>(null);
    const [newMode, setNewMode] = useState<ModeItem>(createNewMode);
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [isSaved, setIsSaved] = useState<boolean>(false);

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
            console.error('Get mode failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message, 5000);
        }
        setIsLoading(false);
    };

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
            console.error('Add mode failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message, 5000);
        }
    };

    const updateMode = async (): Promise<void> => {
        try {
            await preservationApiClient.updateMode(newMode.id, newMode.title, newMode.forSupplier, newMode.rowVersion);
            setIsSaved(true);
            props.setDirtyLibraryType();
        } catch (error) {
            console.error('Update mode failed: ', error.messsage, error.data);
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
            showSnackbarNotification('Changes for mode is saved.', 5000);
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

    const voidMode = async (): Promise<void> => {
        if (mode) {
            setIsLoading(true);
            try {
                await preservationApiClient.voidMode(mode.id, mode.rowVersion);
                getMode(mode.id);
                props.setDirtyLibraryType();
                showSnackbarNotification('Mode is voided.', 5000);
            } catch (error) {
                console.error('Error occured when trying to void mode: ', error.messsage, error.data);
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
                console.error('Error occured when trying to unvoid mode: ', error.messsage, error.data);
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
        return <Spinner large />;
    }

    if (!isEditMode) {
        return (
            <Container>
                <IconContainer>
                    <Button variant='ghost' onClick={initNewMode}>
                        {addIcon} New mode
                    </Button>
                </IconContainer>
            </Container>);
    }

    return (
        <Container>
            {newMode.isVoided &&
                <Typography bold variant="caption" style={{ marginLeft: 'calc(var(--grid-unit) * 2)' }}>Mode is voided</Typography>
            }
            <ButtonContainer>
                {newMode.isVoided &&
                    <Button variant="outlined" onClick={unvoidMode}>
                        Unvoid
                    </Button>
                }

                {!newMode.isVoided &&
                    <Button variant="outlined" onClick={voidMode}>
                        Void
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
                    placeholder="Write Here"
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
