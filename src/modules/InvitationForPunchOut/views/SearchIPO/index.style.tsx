import styled, { FlattenSimpleInterpolation, css } from 'styled-components';

import { Button } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    display: flex;
    margin-left: var(--margin-module--left);
    height: 100%;
    width: calc(100% - var(--margin-module--left));
`;

export const ContentContainer = styled.div<{ withSidePanel?: boolean }>`
    display: flex;
    margin-right: var(--margin-module--right);
    width: 100%;
    ${({ withSidePanel }): FlattenSimpleInterpolation | undefined => {
        if (withSidePanel) {
            return css`
                width: calc(100% - 300px);
                margin-right: var(--grid-unit);
            `;
        }
    }};
    overflow: hidden;
    flex-direction: column;
    margin-top: var(--margin-module--top);
    min-height: 400px; /* min-height to ensure that project dropdown (max 300px) is not cut off if empty table */
`;

export const HeaderContainer = styled.div`
    display: flex;
    justify-content:space-between;
    width:100%;
    flex-wrap: wrap;     
`;


export const Header = styled.header`
    display: block;
    align-items: center;
    h1 {
        display: inline-block;
        margin-right: calc(var(--grid-unit) * 2);
    }
`;



export const StyledButton = styled(Button)`
    display: flex;
    align-items: center;
    justify-content: center;
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
    height: ${(props): number => props.maxHeight} px;
    min-width: 300px;
`;

export const TooltipText = styled.span`
    text-align: center;
    p {
        color: white;
    }
`;


