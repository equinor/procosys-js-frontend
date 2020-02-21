import styled, { css } from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Header = styled.header`
    margin-bottom: calc(var(--grid-unit) * 4);
`;

export const ActionList = styled.div`
    margin: calc(var(--grid-unit) * 2);
    border-left: solid 1px ${tokens.colors.ui.background__medium.rgba};
    border-top: solid 1px ${tokens.colors.ui.background__medium.rgba};
    border-right: solid 1px ${tokens.colors.ui.background__medium.rgba};
`;

export const ActionContainer = styled.div`
    font-weight: 500;
    font-size: calc(var(--grid-unit) * 2);
    line-height: calc(var(--grid-unit) * 2);

    button:hover {
        background: ${tokens.colors.interactive.primary__hover_alt.rgba};
    }

    svg {
        padding-left: calc(var(--grid-unit) * 2);
        padding-right: calc(var(--grid-unit) * 2);
    }

    svg path {
        color: ${tokens.colors.interactive.primary__resting.rgba};
    }
`;

export const Collapse = styled.div`
    display: flex;
    border-bottom: solid 1px ${tokens.colors.ui.background__medium.rgba};

`;

export const CollapseInfo = styled.div<{ isExpanded: boolean }>`
    flex-grow: 1;
    padding-top: calc(var(--grid-unit) * 1 + 4px);
    padding-right: calc(var(--grid-unit) * 2);
    padding-bottom: calc(var(--grid-unit) * 1 + 4px);
    padding-left: calc(var(--grid-unit) * 2);    
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    ${(props): any => props.isExpanded && css`
        color:${tokens.colors.interactive.primary__resting.rgba};
    `}; 
`;


