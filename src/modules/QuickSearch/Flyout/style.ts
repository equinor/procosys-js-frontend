import { SideSheet } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import { Breakpoints } from '@procosys/core/styling';
import styled from 'styled-components';

export const Tabs = styled.nav`
    border-bottom: 2px solid ${tokens.colors.ui.background__medium.rgba};

    a {
        cursor: pointer;
        display: inline-block;
        font-weight: 500;
        padding: calc(var(--grid-unit) * 2);
        text-decoration: none;

        &.active {
            color: ${tokens.colors.interactive.primary__resting.rgba};
            border-bottom: 2px solid
                ${tokens.colors.interactive.primary__resting.rgba};
            margin-bottom: -2px;
        }
    }
`;

export const StyledSideSheet = styled(SideSheet)`
    top: 116px;
    height: calc(100% - 116px);
    overflow: auto;
    ${Breakpoints.TABLET} {
        top: 66px;
    }
    ${Breakpoints.MOBILE} {
        width: 100%;
    }
`;
