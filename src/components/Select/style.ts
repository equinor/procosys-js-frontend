import styled, { css } from 'styled-components';

import { tokens } from '@equinor/eds-tokens';

type ContainerProps = {
    openLeft?: boolean;
};

export const Container = styled.div<ContainerProps>`
    ul {
        position: absolute;
        margin-top: 0.5rem;
        background-color: ${tokens.colors.ui.background__default.rgba};
        border-radius: 4px;
        box-shadow: ${tokens.elevation.raised};
        max-height: 300px;
        overflow-y: scroll;
        ${(props): any =>
        props.openLeft &&
        css`
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
    max-width: 264px;
    border: none;
    display: flex;
    width: 100%;
    align-items: center;
    padding: 6px;
    background-color: ${tokens.colors.ui.background__light.rgba};
    border-bottom: 1px solid black;
    ${(props): any =>
        props.isOpen &&
        css`
            background-color: ${tokens.colors.interactive.primary__selected_highlight.rgba};
        `}
`;

export type DropDownItemProps = {
    selected: boolean;
};

export const DropdownItem = styled.li<DropDownItemProps>`
    background-color: ${(props): any =>
        props.selected
            ? tokens.colors.ui.background__light.rgba
            : 'transparent'};
    padding: 24px 16px;
    border: 0;
    text-align: left;
    font-weight: normal;
`;

DropdownItem.defaultProps = {
    selected: false,
};
