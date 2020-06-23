import styled, { css } from 'styled-components';
import { Button } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    display: inline-block;
    ul {
        position: absolute;
        margin-top: 0.5rem;
        margin-left: var(--grid-unit);
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

export const DropdownButton = styled(Button)`
    display: flex;
    align-items: center;
    justify-content: center;

    svg path {
        color: ${(props): string => props.disabled ? tokens.colors.interactive.disabled__border.rgba : tokens.colors.interactive.primary__resting.rgba};
    }

    ${(props): any => props.isOpen && css`
        background-color: ${tokens.colors.interactive.primary__selected_highlight.rgba};
    `}
`;

interface IconContainerProps {
    text?: boolean;
    size: number;
}
export const IconContainer = styled.div<IconContainerProps>`
    ${(props): any => props.text && css`
        margin-right: var(--grid-unit);
    `}
    svg {
        height: size + 'px';
        width: size + 'px';
    }
    height: size + 'px';
    display: flex;
    align-items: center;
`;

export const DropdownItem = styled.li`
    display: flex;
    align-items: center;
    border: 0;
    text-align:left;
    font-weight: normal;
    cursor: pointer;

    > * {
        width: 100%
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
