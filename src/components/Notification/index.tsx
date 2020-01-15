import React from 'react';
import { render } from 'react-dom';
import { StyledSnackbarNotification } from './style';

let lastTimeoutNumber = -1;

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
    if (lastTimeoutNumber == -1) {
        const container = document.getElementById('procosys-overlay');
        render(<div id="procosys-snackbar-notification"></div>, container);
    }

    const notificationContainer = document.getElementById(
        'procosys-snackbar-notification'
    );

    render(<Notification message={message} />, notificationContainer);

    if (lastTimeoutNumber != -1) {
        clearTimeout(lastTimeoutNumber);
    }

    const timeoutNumber = setTimeout(() => {
        render(<div />, notificationContainer);
    }, duration);

    lastTimeoutNumber = timeoutNumber;
};
