import styled, { css } from 'styled-components';

import { tokens } from '@equinor/eds-tokens';
import { Breakpoints } from '@procosys/core/styling';

export const Container = styled.div`
    display: inline-block;
    position: relative;
    ul {
        position: absolute;
        margin-top: 0.5rem;
        background-color: ${tokens.colors.ui.background__default.rgba};
        border-radius: 4px;
        box-shadow: ${tokens.elevation.raised};
        overflow-y: auto;
        z-index: 100;
        white-space: nowrap;
        ${Breakpoints.MOBILE} {
            max-width: 300px;
        }
    }
    :hover {
        cursor: pointer;
    }
`;

export const DropdownList = styled.ul<{ maxHeight?: string }>`
    ${({ maxHeight }): any =>
        maxHeight &&
        css`
            max-height: ${maxHeight};
        `}
`;

export const IconContainer = styled.div`
    padding-left: var(--grid-unit);
    display: flex;
    flex: 1;
    justify-content: flex-end;
    align-items: right;
`;

interface DropdownButtonProps {
    readonly isOpen: boolean;
    variant?: string;
    disabled?: boolean;
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
    color: var(--text--default);

    path {
        ${({ disabled }): any =>
            disabled &&
            css`
                fill: ${tokens.colors.interactive.disabled__text.rgba};
            `}
    }

    ${({ disabled }): any =>
        disabled &&
        css`
            color: ${tokens.colors.interactive.disabled__text.rgba};
        `}

    ${(props): any =>
        props.isOpen &&
        css`
            background-color: ${tokens.colors.interactive
                .primary__selected_highlight.rgba};
            /* :focus & {
            outline: none;
        } */
        `}
    ${(props): any =>
        props.variant === 'form' &&
        css`
            background-color: ${tokens.colors.ui.background__light.rgba};
            border-bottom: 1px solid black;
        `}
        ${(props): any =>
        props.variant === 'error' &&
        css`
            background-color: ${tokens.colors.ui.background__light.rgba};
            border: 1px solid red;
        `}
`;

export const DropdownItem = styled.li`
    border: 0;
    text-align: left;
    font-weight: normal;
    cursor: pointer;
    div {
        color: var(--text--default);
    }
`;

export const TopTextContainer = styled.div<{ variant?: string }>`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-size: 12px;

    ${({ variant }): any =>
        variant === 'error' &&
        css`
            color: red;
        `}
`;

export const FilterContainer = styled.li`
    overflow-x: hidden;
    input {
        width: 100%;
        padding: calc(var(--grid-unit) * 2);
        border: none;
        border-bottom: 1px solid #efefef;
        &:focus {
            outline: none;
        }
    }
`;
