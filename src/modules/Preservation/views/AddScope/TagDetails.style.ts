import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    /* display: flex;
    flex-direction: column; */
`;

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
    font-size: 16px;
    line-height: 24px;

    button:hover {
        background: ${tokens.colors.interactive.primary__hover_alt.rgba};
    }

    svg {
        padding: 16px;
    }

    svg path {
        color: ${tokens.colors.interactive.primary__resting.rgba};
    }

    /* display: flex;
    flex-direction: column; */
`;

export const Collapse = styled.div`
    display: flex;
    border-bottom: solid 2px ${tokens.colors.ui.background__medium.rgba};
`;

export const CollapseInfo = styled.div`
    padding: 20px 16px 16px 16px;
    /* flex-grow: 0; */
    /* flex-basis: 200px; */

    /* word-wrap: none; */
    /* text-overflow: ellipsis; */
    /* overflow: hidden; */
`;

export const Expand = styled.div`
    border-bottom: solid 2px ${tokens.colors.ui.background__medium.rgba};
    padding: 0px 16px 16px 16px;
    font-weight: normal;
`;

export const ExpandHeader = styled.div`
    font-size: 12px;
    line-height: 16px;
`;

export const ExpandSection = styled.div`
    margin-top: 16px;
`;