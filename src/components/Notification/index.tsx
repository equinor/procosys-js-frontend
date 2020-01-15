import React from 'react';
import { render } from 'react-dom';
import { StyledNotification } from './style';

let lastMessageId: string;

//todo: Should we use 'uuid'?
function generateNotificationId(): string {
    return (Math.random().toString(36) + Date.now().toString(36)).substr(2, 10);
}

interface NotificationProps {
    variant?: string; //Can be 'snackbar', 'alert', 'notification'
    visible?: boolean;
    message?: string;
}

const Notification = (props: NotificationProps): JSX.Element => {
    const { visible = true, message } = props;
    return (
        <StyledNotification isVisible={visible}>{message}</StyledNotification>
    );
};

export const showNotification = (message: string, duration: number) => {
    const overlay = document.getElementById('procosys-overlay');
    const messageId: string = generateNotificationId();
    lastMessageId = messageId;

    render(<Notification message={message} visible={true} />, overlay);

    setTimeout(() => {
        if (messageId === lastMessageId) {
            render(<Notification visible={false} />, overlay);
        }
    }, duration);
};

export default Notification;
