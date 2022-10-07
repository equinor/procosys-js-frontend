import styled, { css } from 'styled-components';

import { tokens } from '@equinor/eds-tokens';

interface DropdownProps {
    disabled?: boolean;
}

export const DropdownItem = styled.div<DropdownProps>`
    padding: calc(var(--grid-unit) * 2) calc(var(--grid-unit) * 3);
    ${(props): any =>
        !props.disabled &&
        css`
            :hover {
                background-color: ${tokens.colors.ui.background__light.rgba};
            }
        `}

    ${(props): any =>
        props.disabled &&
        css`
            color: ${tokens.colors.interactive.disabled__border.rgba};
            cursor: not-allowed;
        `}
`;

export const ErrorContainer = styled.div`
    display: flex;
    margin: var(--grid-unit);
    > * {
        margin-right: var(--grid-unit);
    }
`;

export const FieldContainer = styled.div`
    > * {
        width: 100%;
    }
`;

export const DateTimeContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    > div {
        margin-right: calc(var(--grid-unit) * 2);
        input {
            background-color: ${tokens.colors.ui.background__light.rgba};
            color: var(--text--default);
            height: 10px;
        }
        label {
            color: var(--text--default);
        }
    }
    > p {
        width: 150px;
    }
`;

export const LocationContainer = styled.div`
    width: 300px;
`;

export const PoTypeContainer = styled.div`
    width: 250px;
`;

export const Column = styled.div`
    display: grid;
    > * {
        margin-bottom: calc(var(--grid-unit) * 3);
    }
`;

export const FormContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 600px);
    grid-column-gap: 70px;
    @media (max-width: 850px) {
        grid-template-columns: repeat(1, 1fr);
    }
    > * {
        margin-bottom: calc(var(--grid-unit) * 3);
    }
    h5 {
        margin-top: var(--grid-unit);
        margin-bottom: calc(var(--grid-unit) * 2);
    }
    .MuiInput-underline:after {
        border-bottom: 1px solid rgba(0, 0, 0, 0.42) !important;
    }
    .MuiInput-root:hover::before {
        border-bottom: 1px solid rgba(0, 0, 0, 0.42) !important;
    }
`;

export const ConfirmationTextContainer = styled.div`
    display: flex;
    margin-top: var(--grid-unit);
    align-items: flex-start;
`;

export const TextContainer = styled.div`
    padding-left: 12px;
`;
