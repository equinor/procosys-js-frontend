import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Nav = styled.nav`
    display: grid;
    grid-template-columns: auto auto 200px 1fr auto;
    grid-column-gap: 10px;
    grid-template-rows: 64px;
    border-bottom: 2px solid ${tokens.colors.ui.background__light.rgba};
`;

export const SubNav = styled.nav`
    border-bottom: 2px solid ${tokens.colors.ui.background__medium.rgba};
    a {
        display: inline-block;
        padding: 16px;
        text-decoration: none;
        &.active {
            border-bottom: 2px solid ${tokens.colors.interactive.primary__resting.rgba};
            margin-bottom: -2px;
        }
    }
`;

export const IconContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
`;

export const LogoContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    a {
        padding-right: 16px;
        border-right: 1px solid #E6E6E6;
        text-decoration: none;
    }
`;

export const PlantSelector = styled.div`
    display: flex;
    align-items: center;
    button {
        color: ${tokens.colors.interactive.primary__resting.rgba};
    }
    font-weight: 500;
`;

export const DropdownItem = styled.div`
    padding: calc(var(--grid-unit) * 2) calc(var(--grid-unit) * 3);
    :hover {
        background-color: ${tokens.colors.ui.background__light.rgba}
    }
`;

export const MenuContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const MenuItem = styled.div`
    padding: 0px 16px;
    a {
        text-decoration: none;
    }
`;
