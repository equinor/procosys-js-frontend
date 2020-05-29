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

interface FilterProps {
    isExpanded: boolean;
    filterActive?: boolean;
}

export const Collapse = styled.div<FilterProps>`
    display: flex;
    margin-bottom: 6px;
    padding: calc(var(--grid-unit) + 4px) var(--grid-unit);
    cursor: pointer;
    align-items: center;
    ${ ({isExpanded}): any => isExpanded && css`
        color: ${tokens.colors.interactive.primary__resting.rgba};
        background:${tokens.colors.interactive.primary__selected_highlight.rgba};
    `};
    ${({filterActive}): any => filterActive && css`
        div {
            color: ${tokens.colors.interactive.primary__resting.rgba};
        }
        path {
            fill: ${tokens.colors.interactive.primary__resting.rgba};
        }
    `}
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
