import styled, { css } from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

export const Header = styled.header`
    display: flex;
    justify-content: space-between;
    padding-bottom: calc(var(--grid-unit) * 4);
    margin-left: var(--grid-unit);
`;

export const Collapse = styled.div<{ isExpanded: boolean }>`
    display: flex;
    margin-bottom: 6px;
    padding-top: calc(var(--grid-unit) * 2);
    padding-right: var(--grid-unit);
    padding-bottom: calc(var(--grid-unit) - 4px);
    padding-left: var(--grid-unit);    
    cursor: pointer;

    svg {
        margin-bottom: 4px;
    }

    ${ (props): any => props.isExpanded && css`
        color:${tokens.colors.interactive.primary__resting.rgba};
        background:${tokens.colors.interactive.primary__selected_highlight.rgba};
    `}; 
`;

export const CollapseInfo = styled.div`
    flex-grow: 1;
`;

export const Section = styled.div`
    display: flex;
    padding-bottom: calc(var(--grid-unit) * 2);
`;

export const Link = styled.span`
    color: ${tokens.colors.interactive.primary__resting.rgba};
    cursor: pointer;
`;
