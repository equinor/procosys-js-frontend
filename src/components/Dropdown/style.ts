import styled, { css } from 'styled-components';

import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    display: inline-block;
    ul {
        position: absolute;
        margin-top: 0.5rem;
        max-height: 300px;
        background-color: ${tokens.colors.ui.background__default.rgba};
        border-radius: 4px;
        box-shadow: ${tokens.elevation.raised};
        overflow-y: scroll;
        z-index: 100;
    }
    :hover {
        cursor: pointer;
    }
`;

export const DropdownIcon = styled.div`
    padding-left: 8px;
    display: flex;
    flex: 1;
    justify-content: flex-end;
    align-items: right;
`;

interface DropdownButtonProps {
    readonly isOpen: boolean;
    variant?: string;
}

export const DropdownButton = styled.button<DropdownButtonProps>`
    background-color: transparent;
    border: 0;
    display: flex;
    text-overflow: '...';
    align-items: center;
    padding: 6px;
    width: 100%;
    cursor: pointer;

    ${(props): any => props.isOpen && css`
        background-color: ${tokens.colors.interactive.primary__selected_highlight.rgba};
        /* :focus & {
            outline: none;
        } */
    `}
    ${(props): any => props.variant === 'form' && css`
        background-color: ${tokens.colors.ui.background__light.rgba};
        border-bottom: 1px solid black;
    `}

`;

export const DropdownItem = styled.li`
    border: 0;
    text-align:left;
    font-weight: normal;
    cursor: pointer;
`;

export const TopTextContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-size: 12px;
`;

export const FilterContainer = styled.li`
    overflow-x: hidden;
    input {
        width: 100%;
        padding: calc(var(--grid-unit)*2);
        border: none;
        border-bottom: 1px solid #EFEFEF;
        &:focus {
            outline: none;
        }
    }

`;
