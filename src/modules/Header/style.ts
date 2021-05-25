import { Breakpoints } from '@procosys/core/styling';
import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';
import { Search } from '@equinor/eds-core-react';

export const Nav = styled.nav`
    display: grid;
    grid-template-columns: auto auto 200px 1fr auto;
    grid-column-gap: 10px;
    grid-template-rows: 64px;
    border-bottom: 2px solid ${tokens.colors.ui.background__light.rgba};
    font-weight: 500;
    button {
        font-size: calc(var(--grid-unit)*2);
        font-weight: 500;
    }
`;

export const SubNav = styled.nav`
    border-bottom: 2px solid ${tokens.colors.ui.background__medium.rgba};
    font-weight: 500;
    a {
        display: inline-block;
        
        ${Breakpoints.TABLET} {
            display: flex;
            flex-direction: column;            
        };
        
        padding: 16px;
        text-decoration: none;
        color: var(--text--default);
        &.active, &:hover {
            background-color: rgba(222,237,238,1);
            border-bottom: 2px solid ${tokens.colors.interactive.primary__resting.rgba};
            margin-bottom: -2px;
        }
    }
`;

export const IconContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0 10px 10px;
    color: #ee3c3c;
    font-size: 28px;
    font-weight: 1000;
    
    button {display: none; }
    ${Breakpoints.TABLET} {
        button {display: inline-block;}
        #logo {display: none;}
    }
`;

export const LogoContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    a {
        padding-right: 16px;
        border-right: 1px solid #E6E6E6;
        text-decoration: none;
        color: var(--text--default);
    }
`;

export const PlantSelector = styled.div`
    display: flex;
    align-items: center;
    button {
        color: ${tokens.colors.interactive.primary__resting.rgba};
    }
`;

export const DropdownItem = styled.div`
    padding: calc(var(--grid-unit) * 1) calc(var(--grid-unit) * 2);
    font-weight: 500;
    :hover {
        background-color: ${tokens.colors.ui.background__light.rgba}
    }
`;

export const MenuContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    .compact {
        margin: 0;
    }

    .lastButton {
        margin-right: calc(var(--grid-unit) * 2);
    }
`;

export const MenuContainerItem = styled.div`
    margin: 0px 16px;
    &:hover {
        background-color: rgba(222,237,238,1);
        border-radius: calc(var(--grid-unit) / 2);
    }
    
    a {
        text-decoration: none;
    }
`;

export const ShowOnMobile = styled.div`
    display:none;    
    ${Breakpoints.TABLET} {
        display: unset;            
    } 
`;

export const ShowOnDesktop = styled.div`
    ${Breakpoints.TABLET} {
        display: none;            
    } 
`;

export const StyledSearch = styled(Search)`
    display: flex;
    max-width: 500px;
    min-width: 250px;
`;