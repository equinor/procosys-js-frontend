import React from 'react';
import { render } from 'react-dom';
import { Modal, ModalContent, ButtonContainer } from './style';
import { Button } from '@equinor/eds-core-react';


const modalDialogContainer = document.createElement('div');
modalDialogContainer.setAttribute('id', 'model-dialog-container');
document.body.appendChild(modalDialogContainer);

interface ModalDialogProps {
    message: string;
    cancelText?: string;
    confirmText?: string;
    confirmCallback: () => void;
}

const ModalDialog = (props: ModalDialogProps): JSX.Element => {

    const cancel = (): void => {
        render(<></>, modalDialogContainer);
    };

    const confirm = (): void => {
        props.confirmCallback();
        render(<></>, modalDialogContainer);
    };

    window.onclick = (e: any): void => {
        if (e.target.id === 'Modal') {
            cancel();
        }
    };

    return (
        <Modal id='Modal'>
            <ModalContent>
                {props.message}
                {props.confirmText &&
                    <ButtonContainer>
                        <Button title='Confirm' onClick={confirm}>
                            {props.confirmText}
                        </Button>
                    </ButtonContainer>
                }
                {props.cancelText &&
                    (<ButtonContainer>
                        <Button title='Close' variant="outlined" onClick={cancel}>
                            {props.cancelText}
                        </Button>
                    </ButtonContainer>)
                }
            </ModalContent>
        </Modal >
    );
};

/**
 * Displays a popup modal box in the center of the page.
 * @param message Message to display
 * @param cancelText  Text on cancel button. 
 * @param confirmText   Text on confirm button. 
 * @param confirmFunction  Function that will be called when clicking on confirm button. 
 */
export const showModalDialog = (
    message: string,
    cancelText?: string,
    confirmText?: string,
    confirmCallback?: any,
): any => {
    render(<ModalDialog message={message} cancelText={cancelText} confirmText={confirmText} confirmCallback={confirmCallback} />, modalDialogContainer);
};
