import styled from 'styled-components';

export const StyledSnackbarNotification = styled.div`
    visibility: visible;
    min-width: 250px;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2), 0px 1px 18px rgba(0, 0, 0, 0.12),
        0px 6px 10px rgba(0, 0, 0, 0.14);
    border-radius: 4px;
    background-color: #333333;
    color: #ffffff;
    text-align: left;
    padding: calc(var(--grid-unit) * 2);
    position: fixed;
    z-index: 1;
    left: 2%;
    bottom: 30px;
`;
