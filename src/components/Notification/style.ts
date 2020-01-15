import styled, { css } from 'styled-components';

interface StyledNotificationProps {
    isVisible: boolean;
}

export const StyledNotification = styled.div<StyledNotificationProps>`
    visibility: visible;
    min-width: 250px;
    margin-left: -125px;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 2px;
    padding: 16px;
    position: fixed;
    z-index: 1;
    left: 50%;
    bottom: 30px;
    ${(props): any =>
        !props.isVisible &&
        css`
            visibility: hidden;
        `}
`;
