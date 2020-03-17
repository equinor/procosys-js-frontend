import styled, { css } from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const TreeContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

interface NodeContainerProps {
    indentMultiplier: number;
}

export const NodeContainer = styled.div<NodeContainerProps>`
    display: flex;
    align-items: center;
    margin-bottom: var(--grid-unit);

    margin-left: ${(props): string => `calc(var(--grid-unit) * ${props.indentMultiplier} - 4px)`};
`;

interface ExpandCollapseIconProps {
    isExpanded: boolean;
}

export const ExpandCollapseIcon = styled.div<ExpandCollapseIconProps>`
    cursor: pointer;
    margin-right: var(--grid-unit);
    padding: var(--grid-unit) calc(var(--grid-unit) + 2px);

    :hover {
        background: ${tokens.colors.interactive.primary__selected_highlight.rgba};
        border-radius: 100%;
    }

    ${(props): any => props.isExpanded && css`
        svg path {
            fill: ${tokens.colors.interactive.primary__resting.rgba};
        }
    `}
`;

interface NodeNameProps {
    hasChildren: boolean;
    isExpanded: boolean;
}

export const NodeName = styled.div<NodeNameProps>`
    padding: var(--grid-unit) 0;
    font-weight: 500;

    ${(props): any => props.isExpanded && css`
        color: ${tokens.colors.interactive.primary__resting.rgba};
    `}

    /* add margin to nodes without children, to align with those that do (with expand/collapse icon) */
    margin-left: ${(props): string => !props.hasChildren ? 'calc(var(--grid-unit) * 6.5)' : '0'};
`;

export const NodeLink = styled.span`
    cursor: pointer;

    :hover {
        color: ${tokens.colors.interactive.primary__resting.rgba};
    }
`;