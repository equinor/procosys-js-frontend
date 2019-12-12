import styled from 'styled-components';

export const Nav = styled.nav`
    display: grid;
    grid-template-columns: auto auto 200px 1fr auto;
    grid-column-gap: 10px;
    grid-template-rows: 64px;
    border-bottom: 2px solid #E6E6E6;
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
    span {
        padding-right: 16px;
        border-right: 1px solid #E6E6E6;
    }
`;

export const PlantSelector = styled.div`
    display: flex;
    align-items: center;
    button {
        color: var(--interactive-primary--resting);
    }
    font-weight: 500;
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
