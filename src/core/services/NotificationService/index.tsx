import React from 'react';
import { render } from 'react-dom';
import { StyledSnackbarNotification } from './style';

let lastTimeoutId = -1;
const snackbarContainer = document.createElement('div');
snackbarContainer.setAttribute('id', 'notification-snackbar-container');
document.body.appendChild(snackbarContainer);

interface NotificationProps {
    message?: string;
    displayRight: boolean;
}

const Notification = (props: NotificationProps): JSX.Element => {
    return (
        <StyledSnackbarNotification displayRight={props.displayRight}>
            {props.message}
        </StyledSnackbarNotification>
    );
};

/**
 * Displays a snackbar notification at the bottom of the page, left aligned.
 * Only the last snackbar notification will show.
 *
 * @param message Message to display
 * @param duration Duration of notification, in milliseconds
 */
export const showSnackbarNotification = (
    message: string,
    duration: number,
    displayRight = false
): any => {
    clearTimeout(lastTimeoutId);
    render(<Notification message={message} displayRight={displayRight} />, snackbarContainer);

    lastTimeoutId = setTimeout(() => {
        render(<></>, snackbarContainer);
    }, duration);
};
