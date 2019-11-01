import styled from 'styled-components';

export const Nav = styled.nav`
    display: grid;
    grid-template-columns: auto auto auto 1fr auto;
    grid-column-gap: 10px;
    grid-template-rows: 64px;
`;

export const IconContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
`

export const LogoContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

export const PlantSelector = styled.div`
    display: flex;
    align-items: center;
`
export const PlantSelectorDropdown = styled.div`
    border-left: 1px solid #E6E6E6;
    color: ${(props: any) => props.theme.colors.green};
    padding-left: 16px;
    font-weight: 500;
`

export const MenuContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

export const MenuItem = styled.div`
    padding: 0px 16px;
`
