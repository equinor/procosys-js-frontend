import styled, { css } from 'styled-components';
import { Button } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    display: inline-block;
    position: relative;

    ul {
        position: absolute;
        margin-top: 0.5rem;
        max-height: 300px;
        overflow-y: auto;
        overflow-x: hidden;
        background-color: ${tokens.colors.ui.background__default.rgba};
        border-radius: 4px;
        box-shadow: ${tokens.elevation.raised};
        z-index: 100;
        white-space: nowrap;
        div {
            color: var(--text--default);
        }
    }
    :hover {
        cursor: pointer;
    }
`;

export const DropdownButton = styled(Button)`
    display: flex;
    align-items: center;
    justify-content: center;

    svg path {
        color: ${(props): string =>
            props.disabled
                ? tokens.colors.interactive.disabled__border.rgba
                : tokens.colors.interactive.primary__resting.rgba};
    }

    ${(props): any =>
        props.isOpen &&
        css`
            background-color: ${tokens.colors.interactive
                .primary__selected_highlight.rgba};
        `}
`;

export const IconContainer = styled.div<{ size: number }>`
    ${({ size }): any =>
        size &&
        css`
            svg {
                height: ${size}px;
                width: ${size}px;
            }
            height: ${size}px;
        `}

    display: flex;
    align-items: center;
`;

export const DropdownItem = styled.li`
    display: flex;
    align-items: center;
    border: 0;
    text-align: left;
    font-weight: normal;
    cursor: pointer;

    > * {
        width: 100%;
    }
    div {
        display: flex;
        align-items: center;
        svg {
            padding-right: calc(var(--grid-unit) * 2);
        }
    }
    div[disabled] {
        pointer-events: none;
    }
`;
