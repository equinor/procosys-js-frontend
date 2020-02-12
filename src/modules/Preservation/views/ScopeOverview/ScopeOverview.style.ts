import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

export const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: row;
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
`;

export const TableToolbar = styled.div`
    font-size: calc(var(--grid-unit) * 2);
    line-height: calc(var(--grid-unit) * 3);
    margin-top: calc(var(--grid-unit) * 2);
    margin-bottom: var(--grid-unit);
    color: ${tokens.colors.text.static_icons__secondary.rgba};
`;

export const DropdownItem = styled.div`
    padding: calc(var(--grid-unit) * 2) calc(var(--grid-unit) * 3);
    :hover {
        background-color: ${tokens.colors.ui.background__light.rgba}
    }
`;

export const TagLink = styled.span`
    color: ${tokens.colors.interactive.primary__resting.rgba};
    text-decoration: underline;
    cursor: pointer;
`;