import styled, { css } from 'styled-components';
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


export const Container = styled.div`
    display: flex;
    width: 100%;
`;

export const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export const ParticipantRowsContainer = styled.div`
    display: grid;
    grid-template-columns: auto auto auto auto; 
    width: fit-content;
    padding: var(--grid-unit);
    align-items: flex-end;
    > div {
        display: flex;
        margin-right: calc(var(--grid-unit) * 2);
        padding-bottom: var(--grid-unit);
        > * {
            width: 100%;
        }
    }
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

    > div:nth-child(3), > div:nth-child(1) {
        /* width: 300px; */
        .overflowControl {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    > div:nth-child(2) {
        /* width: 150px; */
    }
`;

export const AddParticipantContainer = styled.div`
    max-width: 300px;
`;
