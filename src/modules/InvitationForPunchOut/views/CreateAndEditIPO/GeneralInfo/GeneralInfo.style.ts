import styled, { css } from 'styled-components';

import { Checkbox } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';

interface DropdownProps {
    disabled?: boolean;
}

export const DropdownItem = styled.div<DropdownProps>`
    padding: calc(var(--grid-unit) * 2) calc(var(--grid-unit) * 3);
    ${(props): any => !props.disabled && css`
        :hover {
            background-color: ${tokens.colors.ui.background__light.rgba}
        }
    `}

    ${(props): any => props.disabled && css`
        color: ${tokens.colors.interactive.disabled__border.rgba};
        cursor: not-allowed;
    `}
`;

export const DateTimeContainer = styled.div`
    display: flex;
    > div {
        margin-right: calc(var(--grid-unit) * 2);
        input {
            background-color: ${tokens.colors.ui.background__light.rgba};
            color: var(--text--default);
        }
        label {
            color: var(--text--default);
        }
    }
`;

export const Container = styled.div`
    display: flex;
    width: 100%;
`;

export const LocationContainer = styled.div`
    width: 300px;
`;

export const PoTypeContainer = styled.div`
    width: 250px;
`;

export const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 600px;
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
    /* width: 600px; */
    align-items: flex-start;
`;

export const TextContainer = styled.div`
    padding: 12px;
`;

export const ConfirmCheckbox = styled(Checkbox)`
    margin: 0 !important;
    padding: 0 !important;
`;
