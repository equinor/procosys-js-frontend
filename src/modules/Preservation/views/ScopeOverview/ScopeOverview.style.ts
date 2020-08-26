import styled, { css } from 'styled-components';
import { tokens } from '@equinor/eds-tokens';
import { Button } from '@equinor/eds-core-react';

export const Container = styled.div`
    display: flex;
`;

export const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    width: 100%;
    margin-top: -16px;
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
        margin-right: var(--grid-unit);
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
        color: ${tokens.colors.interactive.disabled__border.rgba};
        cursor: not-allowed;
    `}

`;

export const FilterDivider = styled.div`
    margin-top: calc(var(--margin-module--top) * -1);
    margin-bottom: -1000px;
    margin-right: calc(var(--grid-unit) * 2);
    margin-left: calc(var(--grid-unit) * 4);
    border-left: solid 1px ${tokens.colors.ui.background__medium.rgba};
`;

export const FilterContainer = styled.div`
    width: calc(var(--grid-unit) * 44);
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
