import styled, { css } from 'styled-components';

import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    ul {
        position: absolute;
        background-color: transparent;
        border-radius: 4px;
        z-index: 100;

        li div {
            box-shadow: 0px 3px 4px rgba(0,0,0,0.12), 0px 2px 4px rgba(0,0,0,0.14);
        }

        li:first-child > div {
            box-shadow: 0px -2px 5px rgba(0,0,0,0.2);
        }
        li:only-child > div {
            box-shadow: 0px 1px 5px rgba(0,0,0,0.2), 0px 3px 4px rgba(0,0,0,0.12), 0px 2px 4px rgba(0,0,0,0.14);
        }


        > div:hover, li[data-selected="true"] > div {
            background-color: ${tokens.colors.ui.background__light.rgba};
        }
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
    width: max-content;
    align-items: center;
    margin-left: var(--grid-unit);
    li {
        left: calc(var(--grid-unit) * -1);
    }
`;


export const ItemContent = styled.div`
    display: flex;
    align-items: center;
    padding: calc(var(--grid-unit) * 2);
    border: 0;
    font-weight: normal;
    margin-left: var(--grid-unit);
    background-color: ${tokens.colors.ui.background__default.rgba};

    :hover {
        background-color: ${tokens.colors.ui.background__light.rgba};
    }

    svg:first-of-type {
        padding-right: calc(var(--grid-unit) * 2);
    }

    .arrowIcon {
        margin-left: auto;
    }
`;
