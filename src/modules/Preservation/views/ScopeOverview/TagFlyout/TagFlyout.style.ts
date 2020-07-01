import styled, { css } from 'styled-components';
import { tokens } from '@equinor/eds-tokens';
import { Button } from '@equinor/eds-core-react';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

export const Header = styled.div`
    display: flex;
    align-items: center;
    padding:
        calc(var(--grid-unit) * 4)
        calc(var(--grid-unit) * 2)
        var(--grid-unit)
        var(--grid-unit);

    h1 {
        font-size: calc(var(--grid-unit) * 3);
        line-height: calc(var(--grid-unit) * 5);
        color: ${tokens.colors.interactive.primary__resting.rgba};
        text-decoration: underline;
    }
`;

export const HeaderNotification = styled.div`
    display: flex;
    align-items: center;
    padding: calc(var(--grid-unit) * 2);
    border-bottom: 2px solid ${tokens.colors.infographic.primary__energy_red_13.rgba};
`;

export const NotificationIcon = styled.div`
    border-radius: 50%;
    padding: var(--grid-unit) calc(var(--grid-unit) + 2px);
    background: ${tokens.colors.infographic.primary__energy_red_13.rgba};

    svg path {
        color: ${tokens.colors.interactive.danger__resting.rgba}
    }
`;

export const StatusLabel = styled.div<{ status?: string | null }>`
    margin-left: calc(var(--grid-unit) * 2);
    margin-right: auto;
    padding: var(--grid-unit);
    border-radius: calc(var(--grid-unit) * 2);

    /* todo: conditional formatting when "overdue" */
    background: ${(props): any => props.status === 'Active'
        ? tokens.colors.interactive.primary__selected_highlight.rgba
        : tokens.colors.ui.background__light.rgba};

    span {
        color: ${tokens.colors.interactive.primary__resting.rgba};
        font-size: calc(var(--grid-unit) * 1.5);
    }
`;

export const HeaderActions = styled.div`
    display: flex;
    align-items: center;
    margin-left: auto;

    button {
        margin-left: var(--grid-unit);
    }

    svg path {
        color: ${tokens.colors.interactive.primary__resting.rgba};
    }
`;

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
            border-bottom: 2px solid ${tokens.colors.interactive.primary__resting.rgba};
            margin-bottom: -2px;
        }
    }
`;

export const StyledButton = styled(Button)`
    svg {
        height: 20px;
        width: 20px;
    }
`;

interface TagProps {
    isStandardTag: boolean;
}
export const TagNoContainer = styled.div<TagProps>`
    padding: 0px var(--grid-unit);
    
    ${(props): any => !props.isStandardTag && css`
        pointer-events: none;
    `}

    ${(props): any => props.isStandardTag && css`
        :hover {
            background-color: ${tokens.colors.ui.background__light.rgba}
        }
        cursor: pointer;
    `}
`;
