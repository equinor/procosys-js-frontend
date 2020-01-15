import styled, { css } from 'styled-components';

import { tokens } from '@equinor/eds-tokens';

type ContainerProps = {
    openLeft?: boolean;
}

export const Container = styled.div<ContainerProps>`
    display: inline-block;
    ul {
        position: absolute;
        margin-top: 0.5rem;
        max-height: 300px;
        background-color: ${tokens.colors.ui.background__default.rgba};
        border-radius: 4px;
        box-shadow: ${tokens.elevation.raised};
        overflow-y: scroll;
        ${(props): any => props.openLeft && css`
            right: 0px;
        `}
        z-index: 100;
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
}

export const DropdownButton = styled.button<DropdownButtonProps>`
    background-color: transparent;
    border: 0;
    display: flex;
    text-overflow: '...';
    align-items: center;
    padding: 6px;
    width: 100%;
    ${(props): any => props.isOpen && css`
        background-color: ${tokens.colors.interactive.primary__selected_highlight.rgba};
        /* :focus & {
            outline: none;
        } */
    `}
`;

export const DropdownItem = styled.li`
    padding: 24px 16px;
    border: 0;
    text-align:left;
    font-weight: normal;
`;
