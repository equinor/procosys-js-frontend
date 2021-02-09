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
    margin-top: var(--margin-module--top);

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
            font-weight: bold;
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


