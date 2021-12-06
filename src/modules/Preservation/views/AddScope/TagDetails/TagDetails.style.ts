import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Header = styled.header`
    margin-bottom: calc(var(--grid-unit) * 4);
`;

export const TagList = styled.div`
    margin-top: calc(var(--grid-unit) * 2);
    border-left: solid 2px ${tokens.colors.ui.background__medium.rgba};
    border-top: solid 2px ${tokens.colors.ui.background__medium.rgba};
    border-right: solid 2px ${tokens.colors.ui.background__medium.rgba};
`;

export const TagContainer = styled.div`
    font-weight: 500;
    font-size: calc(var(--grid-unit) * 2);
    line-height: calc(var(--grid-unit) * 3);

    button:hover {
        background: ${tokens.colors.interactive.primary__hover_alt.rgba};
    }

    svg {
        padding: calc(var(--grid-unit) * 2);
    }

    svg path {
        color: ${tokens.colors.interactive.primary__resting.rgba};
    }
`;

export const Collapse = styled.div`
    display: flex;
    border-bottom: solid 2px ${tokens.colors.ui.background__medium.rgba};
`;

export const CollapseInfo = styled.div`
    flex-grow: 1;
    padding-top: calc(var(--grid-unit) * 2 + 4px);
    padding-right: calc(var(--grid-unit) * 2);
    padding-bottom: calc(var(--grid-unit) * 2);
    padding-left: calc(var(--grid-unit) * 2);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`;

export const Expand = styled.div`
    border-bottom: solid 2px ${tokens.colors.ui.background__medium.rgba};
    padding-top: 0px;
    padding-right: calc(var(--grid-unit) * 2);
    padding-bottom: calc(var(--grid-unit) * 2);
    padding-left: calc(var(--grid-unit) * 2);
    font-weight: normal;
`;

export const ExpandHeader = styled.div`
    font-size: calc(var(--grid-unit) + 4px);
    line-height: calc(var(--grid-unit) * 2);
`;

export const ExpandSection = styled.div`
    margin-top: calc(var(--grid-unit) * 2);
`;
