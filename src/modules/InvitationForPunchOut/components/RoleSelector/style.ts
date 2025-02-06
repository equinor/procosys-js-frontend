import styled, { css } from 'styled-components';

import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    position: relative;

    ul {
        position: absolute;
        background-color: transparent;
        border-radius: 4px;
        z-index: 100;
        white-space: nowrap;

        li > div {
            box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.12),
                0px 2px 4px rgba(0, 0, 0, 0.14);
        }

        li:first-child > div {
            border-radius: 4px 4px 0px 0px;
            box-shadow: 0px -2px 5px rgba(0, 0, 0, 0.2);
        }
        li:only-child > div {
            box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.2),
                0px 3px 4px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.14);
            border-radius: 4px;
        }

        li:last-child > div {
            border-radius: 0px 0px 4px 4px;
        }

        > div:hover,
        li[data-selected='true'] > div {
            background-color: ${tokens.colors.ui.background__light.rgba};
        }
    }

    ul.container {
        margin-top: 0.5rem;
    }
`;

interface IconProps {
    disabled: boolean;
}

export const DropdownIcon = styled.div<IconProps>`
    padding-left: 8px;
    display: flex;
    flex: 1;
    justify-content: flex-end;
    align-items: right;
    path {
        ${({ disabled }): any =>
            disabled &&
            css`
                fill: ${tokens.colors.interactive.disabled__text.rgba};
            `}
    }
    min-height: calc(var(--grid-unit) * 3);
`;

interface DropdownButtonProps {
    readonly isOpen: boolean;
    readonly error?: boolean;
}

export const DropdownButton = styled.button<DropdownButtonProps>`
    border: ${(props): string => (props.error ? 'solid' : 'none')};
    border-color: ${tokens.colors.interactive.danger__resting.rgba};
    display: flex;
    width: 100%;
    align-items: center;
    padding: 6px;
    background-color: ${tokens.colors.ui.background__light.rgba};
    border-bottom: 1px solid black;
    ${(props): any =>
        props.isOpen &&
        css`
            background-color: ${tokens.colors.interactive
                .primary__selected_highlight.rgba};
        `}
`;

export type SelectableItemProps = {
    hideItems?: boolean;
};

export const SelectableItem = styled.li<SelectableItemProps>`
    position: relative;
    background-color: transparent;

    :hover > ul {
        display: block;
    }

    ${(props): any =>
        props.hideItems &&
        css`
            display: none;
        `}
`;

export const TitleItem = styled.li`
    position: relative;
    background-color: transparent;
    &:focus {
        outline: none;
    }
`;

export const CascadingItem = styled.ul`
    display: none;
    background-color: transparent;
    left: 100%;
    top: -1px;
    border: none;
    width: max-content;
    align-items: center;
    margin-left: var(--grid-unit);
    div {
        margin-left: var(--grid-unit);
    }
    li {
        left: calc(var(--grid-unit) * -1);
    }
`;

export const Info = styled.div`
    background-color: ${tokens.colors.ui.background__default.rgba};
`;

export const ItemContent = styled.div<{
    readOnlyItem: boolean;
    greenText?: boolean;
}>`
    display: flex;
    align-items: center;
    padding: calc(var(--grid-unit) * 2);
    border: 0;
    font-weight: normal;
    background-color: ${tokens.colors.ui.background__default.rgba};

    ${(props): any =>
        !props.readOnlyItem &&
        css`
            cursor: pointer;
            :hover {
                background-color: ${tokens.colors.ui.background__light.rgba};
            }
        `}

    label > span {
        padding: 0px;
    }

    svg {
        margin-left: auto;
    }
    .radioButtons {
        display: flex;
        > div {
            display: flex;
            justify-content: center;
            width: calc(var(--grid-unit) * 4);
        }
        margin-right: var(--grid-unit);
        margin-left: 0px;
        .MuiButtonBase-root {
            width: calc(var(--grid-unit) * 3);
        }
        label {
            justify-content: center;
        }
        div,
        span,
        label {
            padding: 0px;
            margin: 0px;
        }
    }
    ${(props): any =>
        props.greenText &&
        css`
            color: ${tokens.colors.interactive.primary__resting.rgba};
        `}
`;

interface TitleContentProps {
    readonly borderTop: boolean;
    marginBottom?: boolean;
    hideToCc?: boolean;
}

export const TitleContent = styled.div<TitleContentProps>`
    display: flex;
    flex-direction: column;

    > div {
        display: flex;
    }

    ${(props): any =>
        props.marginBottom &&
        css`
            > div:first-child {
                margin-bottom: calc(var(--grid-unit) * 2);
            }
        `}

    ${(props): any =>
        props.hideToCc &&
        css`
            .toCc {
                display: none;
            }
        `}
    
    div {
        margin-left: 0px;
    }

    padding: var(--grid-unit) calc(var(--grid-unit) * 2);
    border: 0;
    font-weight: normal;
    background-color: ${tokens.colors.ui.background__default.rgba};
    margin-left: var(--grid-unit);
    ${(props): any =>
        props.borderTop &&
        css`
            border-top: 1px solid ${tokens.colors.ui.background__medium.rgba};
        `}

    .toCc {
        margin-top: var(--grid-unit);
        label,
        div,
        span {
            padding: 0px;
            margin: 0px;
        }

        > p {
            width: calc(var(--grid-unit) * 4);
            text-align: center;
        }
    }
`;

export const Label = styled.div<{ error?: boolean }>`
    font-size: 12px;
    ${(props): any =>
        props.error &&
        css`
            color: ${tokens.colors.interactive.danger__resting.rgba};
        `}
`;

export const FilterContainer = styled.li`
    overflow-x: hidden;
    box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.14);
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
