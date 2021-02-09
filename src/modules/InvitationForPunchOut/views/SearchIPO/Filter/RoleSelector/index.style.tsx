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
    justify-content: space-between;
    width: 100%;
`;

export const ClearContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    margin-left: var(--grid-unit);
    cursor: pointer;
`;

