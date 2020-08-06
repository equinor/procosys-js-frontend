import styled, { css } from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

interface FilterProps {
    isExpanded?: boolean;
    filterActive?: boolean;
}

export const Header = styled.header<FilterProps>`
    display: flex;
    justify-content: space-between;
    padding-bottom: calc(var(--grid-unit) * 4);
    margin-left: var(--grid-unit);

    ${({ filterActive }): any => filterActive && css`
        h1 {
            color: ${tokens.colors.interactive.primary__resting.rgba};
        }
    `}`;

export const Collapse = styled.div<FilterProps>`
    display: flex;
    margin-bottom: 6px;
    padding: calc(var(--grid-unit) + 4px) var(--grid-unit);
    cursor: pointer;
    align-items: center;
    ${ ({ isExpanded }): any => isExpanded && css`
        color: ${tokens.colors.interactive.primary__resting.rgba};
        background:${tokens.colors.interactive.primary__selected_highlight.rgba};
    `};
    ${({ filterActive }): any => filterActive && css`
        div {
            color: ${tokens.colors.interactive.primary__resting.rgba};
        }
        path {
            fill: ${tokens.colors.interactive.primary__resting.rgba};
        }
    `}
    ${({ filterActive }): any => !filterActive && css`
        path {
            fill: ${tokens.colors.text.static_icons__tertiary.rgba};
        }
    `}
`;

export const CollapseInfo = styled.div`
    flex-grow: 1;
    padding-left: calc(var(--grid-unit) * 2);
`;

export const Section = styled.div`
    display: flex;
    justify-content: space-between;
    padding-bottom: calc(var(--grid-unit) * 2);
`;

export const Link = styled.span<FilterProps>`
    cursor: ${(props): string => props.filterActive ? 'pointer' : 'not-allowed'};
    p {
        color: ${(props): string => props.filterActive ? tokens.colors.interactive.primary__resting.rgba : tokens.colors.interactive.disabled__border.rgba};
    }
`;

export const ExpandedContainer = styled.div`
    padding-left: calc(var(--grid-unit) * 4);
`;

export const SavedFilterListContainer = styled.div`
    display: grid;
    grid-template-columns: auto auto; 
    justify-content: space-between;
    width: 100%;
    padding: var(--grid-unit);
    align-items:flex-end;
    svg {
        padding: calc(var(--grid-unit) * 2);
    }
`;

export const SavedFilterContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: calc(var(--grid-unit) * 2);
    min-width: 300px;
`;

export const Divider = styled.div`
    border-top: 1px solid ${tokens.colors.interactive.disabled__border.rgba};      
    box-sizing: border-box;
    margin-top: var(--grid-unit);
    padding-bottom: var(--grid-unit);
`;

export const Column = styled.div`
    display: flex;
    padding-bottom: var(--grid-unit);
    svg {
        padding: calc(var(--grid-unit) * 2);
    } 
`;


