import React, { ReactNode } from 'react';
import { render } from 'react-dom';
import { Scrim, DialogContainer, Title, Divider, Content, ButtonContainer } from './style';
import { Button } from '@equinor/eds-core-react';

const modalDialogContainer = document.createElement('div');
modalDialogContainer.setAttribute('id', 'model-dialog-container');
document.body.appendChild(modalDialogContainer);

interface ModalDialogProps {
    title?: string;
    content?: ReactNode;
    width?: number;
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

    const width = props.width ? props.width : 300; //default width; 

    return (
        <Scrim>
            <DialogContainer width={width}>
                {props.title &&
                    <Title>{props.title}</Title>
                }
                {props.title &&
                    <Divider />
                }
                {props.content &&
                    <Content>{props.content}</Content>
                }
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
            </DialogContainer>
        </Scrim >
    );
};

/**
 * Displays a popup modal box in the center of the page.
 * @param title Title to display
 * @param content Content to display (react node)
 * @param width Width of the dialog box, in pixels. 
 * @param cancelText  Text on cancel button. 
 * @param confirmText   Text on confirm button. 
 * @param confirmFunction  Function that will be called when clicking on confirm button. 
 */
export const showModalDialog = (
    title: string,
    content?: ReactNode,
    width?: number,
    cancelText?: string,
    confirmText?: string,
    confirmCallback?: any,
): any => {
    render(<ModalDialog title={title} content={content} width={width} cancelText={cancelText} confirmText={confirmText} confirmCallback={confirmCallback} />, modalDialogContainer);
};

