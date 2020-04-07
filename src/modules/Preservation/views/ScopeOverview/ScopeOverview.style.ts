import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';
import { Button } from '@equinor/eds-core-react';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

export const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    margin-bottom: var(--grid-unit);
`;

export const Header = styled.header`
    display: flex;
    align-items: baseline;

    h1 {
        display: inline-block;
        margin-right: calc(var(--grid-unit) * 2);
    }

    > div {
        margin-right: calc(var(--grid-unit) * 2);
    }

    a {
        text-decoration: none;
    }
`;

export const IconBar = styled.div`
    display: flex;
    align-items: center;

    button:first-of-type {
        margin-right: calc(var(--grid-unit) * 8);
    }

    button {
        margin-left: var(--grid-unit);
    }
`;

export const StyledButton = styled(Button)`
    padding-top: 5px;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
        margin-right: 8px;
    }

    svg path {
        color: ${(props): string => props.disabled ? tokens.colors.interactive.disabled__border.rgba : tokens.colors.interactive.primary__resting.rgba};
    }
`;

export const DropdownItem = styled.div`
    padding: calc(var(--grid-unit) * 2) calc(var(--grid-unit) * 3);
    :hover {
        background-color: ${tokens.colors.ui.background__light.rgba}
    }
`;
