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
        background-color: ${tokens.colors.ui.background__default.rgba};
        border-radius: 4px;
        box-shadow: ${tokens.elevation.raised};
        max-height: 300px;
        overflow-y: scroll;
        ${(props): any => props.openLeft && css`
            right: 0px;
        `}
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

export type DropDownItemProps = {
    selected: boolean;
}

export const DropdownItem = styled.li<DropDownItemProps>`
    background-color: ${(props): any => props.selected ? tokens.colors.ui.background__light.rgba : 'transparent'};
    padding: 24px 16px;
    border: 0;
    text-align:left;
    font-weight: normal;
`;

DropdownItem.defaultProps = {
    selected: false
};
