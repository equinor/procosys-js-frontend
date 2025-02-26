import styled, { css } from 'styled-components';
import { tokens } from '@equinor/eds-tokens';
import { NavLink } from 'react-router-dom';

export const TreeContainer = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 100%;
`;

interface NodeContainerProps {
    indentMultiplier: number;
}

export const NodeContainer = styled.div<NodeContainerProps>`
    display: flex;
    align-items: center;
    margin-bottom: var(--grid-unit);

    margin-left: ${(props): string =>
        `calc(var(--grid-unit) * ${props.indentMultiplier} - 4px)`};
    margin-left: ${(props): string =>
        `calc(var(--grid-unit) * ${props.indentMultiplier} - 4px)`};
`;

interface ExpandCollapseIconProps {
    isExpanded: boolean;
    spinner?: boolean;
}

export const ExpandCollapseIcon = styled.div<ExpandCollapseIconProps>`
    cursor: pointer;
    margin-right: var(--grid-unit);
    padding: var(--grid-unit) calc(var(--grid-unit) + 2px);
    height: 24px;
    width: 24px;

    :hover {
        background: ${tokens.colors.interactive.primary__selected_highlight
            .rgba};
        border-radius: 100%;
    }

    ${(props): any =>
        props.isExpanded &&
        css`
            svg path {
                fill: ${tokens.colors.interactive.primary__resting.rgba};
            }
        `}

    ${(props): any =>
        props.spinner &&
        css`
            svg {
                padding: 2px;
            }
        `}
`;

interface NodeNameProps {
    hasChildren: boolean;
    isExpanded: boolean;
    isVoided: boolean;
    isSelected: boolean;
}

export const NodeName = styled.div<NodeNameProps>`
    padding: var(--grid-unit) 0;
    font-weight: 500;
    white-space: nowrap;
    max-width: 400px;
    overflow: hidden;
    text-overflow: ellipsis;

    ${(props): any =>
        props.isExpanded &&
        css`
            color: ${tokens.colors.interactive.primary__resting.rgba};
        `}

    ${(props): any =>
        props.isVoided &&
        css`
            opacity: 0.5;
        `}

    /* add margin to nodes without children, to align with those that do (with expand/collapse icon) */
    margin-left: ${(props): string =>
        !props.hasChildren ? 'calc(var(--grid-unit) * 6.5)' : '0'};
`;

interface NodeLinkProps {
    isExpanded: boolean;
    isVoided: boolean;
    isSelected: boolean;
}

export const NodeLink = styled.span<NodeLinkProps>`
    cursor: pointer;
    text-decoration: none;
    color: inherit;

    ${(props): any =>
        props.isExpanded &&
        css`
            color: ${tokens.colors.interactive.primary__resting.rgba};
        `}

    ${(props): any =>
        props.isVoided &&
        css`
            opacity: 0.5;
        `}

    ${(props): any =>
        props.isSelected &&
        css`
            color: ${tokens.colors.interactive.primary__resting.rgba};
            background: ${tokens.colors.ui.background__light.rgba};
        `}


    :hover {
        color: ${(props): string =>
            !props.isVoided
                ? tokens.colors.interactive.primary__resting.rgba
                : ''};
    }
`;
