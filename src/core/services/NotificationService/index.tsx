import React from 'react';
import { render } from 'react-dom';
import { StyledSnackbarNotification } from './style';

let lastTimeoutId = -1;
const container = document.createElement('div');
document.body.appendChild(container);

interface NotificationProps {
    message?: string;
}

const Notification = (props: NotificationProps): JSX.Element => {
    return (
        <StyledSnackbarNotification>{props.message}</StyledSnackbarNotification>
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
    duration: number
): any => {
    render(<Notification message={message} />, container);

    clearTimeout(lastTimeoutId);

    lastTimeoutId = setTimeout(() => {
        render(<div />, container);
    }, duration);
};
