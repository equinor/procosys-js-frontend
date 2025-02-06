import styled, { css } from 'styled-components';

interface NotificationProps {
    displayRight: boolean;
}

export const StyledSnackbarNotification = styled.div<NotificationProps>`
    min-width: 250px;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2), 0px 1px 18px rgba(0, 0, 0, 0.12),
        0px 6px 10px rgba(0, 0, 0, 0.14);
    border-radius: 4px;
    background-color: #333333;
    color: #ffffff;
    padding: calc(var(--grid-unit) * 2);
    position: fixed;
    z-index: 999;

    bottom: calc(var(--grid-unit) * 4);

    ${(props): any =>
        props.displayRight &&
        css`
            right: calc(var(--grid-unit) * 4);
        `}

    ${(props): any =>
        !props.displayRight &&
        css`
            left: calc(var(--grid-unit) * 4);
        `}
`;
