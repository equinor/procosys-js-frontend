import styled from 'styled-components';
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
    margin-bottom: calc(var(--grid-unit) * 2);

    margin-left: ${(props): string => `calc(var(--grid-unit) * ${props.indentMultiplier})`};
`;

export const ExpandCollapseIcon = styled.div`
    cursor: pointer;
    margin-right: var(--grid-unit);
    padding: var(--grid-unit) calc(var(--grid-unit) + 2px);

    :hover {
        background: ${tokens.colors.interactive.primary__selected_highlight.rgba};
        border-radius: 100%;
    }
`;

interface NodeNameProps {
    hasChildren: boolean;
}

export const NodeName = styled.div<NodeNameProps>`
    padding: var(--grid-unit) 0;

    /* add margin to nodes without children, to align with those that do (with expand/collapse icon) */
    margin-left: ${(props): string => !props.hasChildren ? 'calc(var(--grid-unit) * 6.5)' : '0'};
`;