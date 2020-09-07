import styled, { css } from 'styled-components';

import { Button } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    display: flex;
    margin-left: var(--margin-module--left);
    margin-right: var(--margin-module--right);
    height: 100%;
`;

export const ContentContainer = styled.div<{ withSidePanel?: boolean }>`
    display: flex;
    width: ${({ withSidePanel }): string => {
        return withSidePanel ? 'calc(100% - 300px)' : '100%';
    }};
    overflow: hidden;
    flex-direction: column;
    margin-top: var(--margin-module--top);
    min-height: 400px; /* min-height to ensure that project dropdown (max 300px) is not cut off if empty table */
`;

export const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    > div {
        margin-bottom: var(--grid-unit);
    }
`;

export const Header = styled.header`
    display: flex;
    align-items: baseline;

    > div {	
        margin-right: calc(var(--grid-unit) * 2);	
    }

    h1 {
        display: inline-block;
        margin-right: calc(var(--grid-unit) * 2);
    }

    a {
        text-decoration: none;
    }

    button {
        color: ${tokens.colors.interactive.primary__resting.rgba};

        path {
            fill: ${tokens.colors.interactive.primary__resting.rgba};
        }
    }
`;

export const IconBar = styled.div`
    display: flex;
    align-items: center;

    #filterButton {
        margin-right: 0px;
    }

    button {	
        margin-right: var(--grid-unit);	
    }
`;

export const StyledButton = styled(Button)`
    display: flex;
    align-items: center;
    justify-content: center;

    .iconNextToText {
        height: calc(var(--grid-unit) * 2);
    }
`;

interface DropdownProps {
    disabled?: boolean;
}

export const DropdownItem = styled.div<DropdownProps>`
    padding: calc(var(--grid-unit) * 2) calc(var(--grid-unit) * 3);
    ${(props): any => !props.disabled && css`
        :hover {
            background-color: ${tokens.colors.ui.background__light.rgba}
        }
    `}

    ${(props): any => props.disabled && css`
        color: ${tokens.colors.interactive.disabled__border.rgba} !important;
        cursor: not-allowed;
    `}

`;

export const FilterContainer = styled.div<{ maxHeight: number }>`
    border-left: solid 1px ${tokens.colors.ui.background__medium.rgba};
    padding-left: calc(var(--grid-unit) * 2);
    margin-left: calc(var(--grid-unit) * 2);
    padding-right: calc(var(--grid-unit) * 2);
    overflow-y: auto;
    height: ${(props): number => props.maxHeight}px;
`;

export const TooltipText = styled.span`
    text-align: center;
    p {
        color: white;
    }
`;

export const OldPreservationLink = styled.div`
    display: flex;
    padding-bottom: var(--grid-unit);
    justify-content: flex-end;
    color: ${tokens.colors.interactive.primary__resting.rgba};
    text-decoration: underline;
    cursor: pointer;
    a {
        color: var(--text--default);
    }
`;
