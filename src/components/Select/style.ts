import styled, { css } from 'styled-components';

import { tokens } from '@equinor/eds-tokens';

type ContainerProps = {
    openLeft?: boolean;
};

export const Container = styled.div<ContainerProps>`
    ul {
        position: absolute;
        background-color: transparent;
        border-radius: 4px;
        box-shadow: ${tokens.elevation.raised};
        ${(props): any =>
        props.openLeft &&
        css`
                right: 0px;
            `}
        z-index: 100;
    }

    ul.container {
        margin-top: 0.5rem;
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

export type SelectableItemProps = {
    selected: boolean;
};

export const SelectableItem = styled.li<SelectableItemProps>`
    position: relative;
    background-color: transparent;

    :first-child {
        background-color: ${(props): any =>
        props.selected
            ? tokens.colors.ui.background__light.rgba
            : 'transparent'};
    }

    :hover > ul {
        display: block;
    }
`;

SelectableItem.defaultProps = {
    selected: false,
};

export const CascadingItem = styled.ul`
    display: none;
    background-color: transparent;
    left: 100%;
    top: -1px;
    max-width: 264px;
    border: none;
    width: 100%;
    align-items: center;
    margin-left: var(--grid-unit);
    li {
        left: calc(var(--grid-unit) * -1);
    }
`;


export const ItemContent = styled.div`
    display: flex;
    align-items: center;

    padding: 24px 16px;
    border: 0;
    text-align: left;
    font-weight: normal;
    margin-left: var(--grid-unit);
    background-color: ${tokens.colors.ui.background__default.rgba};
    :hover {
        background-color: ${tokens.colors.ui.background__light.rgba};
    }
`;
