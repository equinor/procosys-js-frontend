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
    width?: string;
    buttonOneText?: string;
    buttonOneCallback: () => void;
    buttonTwoText?: string;
    buttonTwoCallback: () => void;
}

const ModalDialog = (props: ModalDialogProps): JSX.Element => {

    const buttonOneHandler = (): void => {
        render(<></>, modalDialogContainer);
        if (props.buttonOneCallback != null) {
            props.buttonOneCallback();
        }
    };

    const buttonTwoHandler = (): void => {
        render(<></>, modalDialogContainer);
        if (props.buttonTwoCallback != null) {
            props.buttonTwoCallback();
        }
    };

    const width = props.width ? props.width : '300px'; //default width; 

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
                {props.buttonTwoText &&
                    (<ButtonContainer>
                        <Button variant="outlined" onClick={buttonTwoHandler}>
                            {props.buttonTwoText}
                        </Button>
                    </ButtonContainer>)
                }
                {props.buttonOneText &&
                    <ButtonContainer>
                        <Button onClick={buttonOneHandler}>
                            {props.buttonOneText}
                        </Button>
                    </ButtonContainer>
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
 * @param buttonOneText  Text on the first button. 
 * @param buttonOneCallback  Callback function that will be called when clicking on the first button. 
 * @param buttonTwoText   Text on the second button. 
 * @param buttonTwoCallback  Callback function that will be called when clicking on the second button. 
 */
export const showModalDialog = (
    title: string,
    content?: ReactNode,
    width?: string,
    buttonOneText?: string,
    buttonOneCallback?: any,
    buttonTwoText?: string,
    buttonTwoCallback?: any,
): any => {
    render(<ModalDialog title={title} content={content} width={width} buttonOneText={buttonOneText} buttonOneCallback={buttonOneCallback} buttonTwoText={buttonTwoText} buttonTwoCallback={buttonTwoCallback} />, modalDialogContainer);
};

