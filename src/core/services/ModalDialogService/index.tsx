import React, { ReactNode } from 'react';
import { render } from 'react-dom';
import {
    Scrim,
    DialogContainer,
    Title,
    Divider,
    Content,
    ButtonContainer,
    ButtonSpacer,
} from './style';
import { Button } from '@equinor/eds-core-react';
import { Typography } from '@equinor/eds-core-react';

const modalDialogContainer = document.createElement('div');
modalDialogContainer.setAttribute('id', 'model-dialog-container');
document.body.appendChild(modalDialogContainer);

interface ModalDialogProps {
    title: string | null;
    content: ReactNode | null;
    width: string | null;
    buttonOneText: string;
    buttonOneCallback: (() => void) | null;
    buttonTwoText: string | null;
    buttonTwoCallback: (() => void) | null;
    buttonOneOutlined?: boolean;
}

const ModalDialog = (props: ModalDialogProps): JSX.Element => {
    const buttonOneHandler = (): void => {
        render(<></>, modalDialogContainer);
        if (props.buttonOneCallback) {
            props.buttonOneCallback();
        }
    };

    const buttonTwoHandler = (): void => {
        render(<></>, modalDialogContainer);
        if (props.buttonTwoCallback) {
            props.buttonTwoCallback();
        }
    };

    const width = props.width ? props.width : '300px'; //default width;

    return (
        <Scrim>
            <DialogContainer width={width}>
                {props.title && (
                    <Title>
                        <Typography variant="h6">{props.title}</Typography>
                    </Title>
                )}
                {props.title && <Divider />}
                {props.content && <Content>{props.content}</Content>}
                <ButtonContainer>
                    {props.buttonOneText && (
                        <Button
                            variant={
                                props.buttonOneOutlined
                                    ? 'outlined'
                                    : 'contained'
                            }
                            onClick={buttonOneHandler}
                        >
                            {props.buttonOneText}
                        </Button>
                    )}
                    <ButtonSpacer />
                    {props.buttonTwoText && (
                        <Button onClick={buttonTwoHandler}>
                            {props.buttonTwoText}
                        </Button>
                    )}
                </ButtonContainer>
            </DialogContainer>
        </Scrim>
    );
};

/**
 * Displays a popup modal box in the center of the page.
 * @param title Title to display
 * @param content Content to display (react node)
 * @param width Width of the dialog box, in pixels. If null, default value is used.
 * @param buttonOneText  Text on the first button. There must always be one button (to be able to close the dialog box)
 * @param buttonOneCallback  Callback function that will be called when clicking on the first button. If null, the button will act as a close-button.
 * @param buttonTwoText   Text on the second button.
 * @param buttonTwoCallback  Callback function that will be called when clicking on the second button. If null, the button will act as a close-button.
 */
export const showModalDialog = (
    title: string | null,
    content: ReactNode | null,
    width: string | null,
    buttonOneText: string,
    buttonOneCallback: (() => void) | null,
    buttonTwoText: string | null,
    buttonTwoCallback: (() => void) | null,
    buttonOneOutlined?: boolean
): any => {
    render(
        <ModalDialog
            title={title}
            content={content}
            width={width}
            buttonOneText={buttonOneText}
            buttonOneCallback={buttonOneCallback}
            buttonTwoText={buttonTwoText}
            buttonTwoCallback={buttonTwoCallback}
            buttonOneOutlined={buttonOneOutlined}
        />,
        modalDialogContainer
    );
};
