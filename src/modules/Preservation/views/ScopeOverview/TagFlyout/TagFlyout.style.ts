import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    background: ${tokens.colors.ui.background__scrim.rgba};
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    /* z-index must be larger than 10 in order to get on top of the material-table header */
    z-index: 20;
`;

export const Flyout = styled.div`
    display: flex;
    flex-direction: column;
    position: fixed;
    right: 0;
    top: 0;
    width: 30%;
    height: 100%;
    background: ${tokens.colors.ui.background__default.rgba};

    /* transition: width 0.5s; */
`;

export const FlyoutHeader = styled.div`
    padding: calc(var(--grid-unit) * 4) calc(var(--grid-unit) * 2);

    h1 {
        font-size: calc(var(--grid-unit) * 3);
        line-height: calc(var(--grid-unit) * 5);
        color: ${tokens.colors.interactive.primary__resting.rgba};
        text-decoration: underline;
    }
`;

export const FlyoutTabs = styled.nav`
    border-bottom: 2px solid ${tokens.colors.ui.background__medium.rgba};

    a {
        cursor: pointer;
        display: inline-block;
        font-weight: 500;
        padding: calc(var(--grid-unit) * 2);
        text-decoration: none;

        &.active {
            color: ${tokens.colors.interactive.primary__resting.rgba};
            border-bottom: 2px solid ${tokens.colors.interactive.primary__resting.rgba};
            margin-bottom: -2px;
        }
    }
`;
