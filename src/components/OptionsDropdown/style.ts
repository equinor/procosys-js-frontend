import styled, { css } from 'styled-components';
import { Button } from '@equinor/eds-core-react';
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

interface DropdownButtonProps {
    readonly isOpen: boolean;
    variant?: string;
    disabled?: boolean;
}

export const DropdownButton = styled(Button)`
    display: flex;
    align-items: center;
    justify-content: center;

    .iconNextToText {
        margin-right: var(--grid-unit);
        height: calc(var(--grid-unit) * 2);
    }

    svg path {
        color: ${(props): string => props.disabled ? tokens.colors.interactive.disabled__border.rgba : tokens.colors.interactive.primary__resting.rgba};
    }
    /* background-color: transparent;
    border: 0;
    display: flex;
    text-overflow: '...';
    align-items: center;
    padding: 6px;
    width: 100%;
    cursor: pointer; */

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
    display: flex;
    align-items: center;
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
