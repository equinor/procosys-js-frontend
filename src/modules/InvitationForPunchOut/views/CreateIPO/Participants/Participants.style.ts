import styled, { css } from 'styled-components';
import { tokens } from '@equinor/eds-tokens';
import { Tooltip } from '@equinor/eds-core-react';

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


export const Container = styled.div`
    display: flex;
    width: 100%;
`;

export const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    width: 100%;
    button:last-of-type {
        margin-left: calc(var(--grid-unit) * 2);
    }
`;

export const InputContainer = styled.div`
    display: flex;
    margin-bottom: calc(var(--grid-unit) *2);
    > div {
        margin-right: calc(var(--grid-unit) * 2);
    }

    > div:nth-child(2), > div:nth-child(1) {
        width: 300px;
    }
    .controlOverflow {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
`;

export const AddParticipantContainer = styled.div`
    max-width: 300px;
`;

