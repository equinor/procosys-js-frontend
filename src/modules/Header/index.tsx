import React from 'react';
import { Nav, IconContainer, LogoContainer, PlantSelector, PlantSelectorDropdown, MenuContainer, MenuItem } from './style';
import { Matrix, User, Lock, Info } from '../../assets/icons';


const Header = () => {
    return (
        <Nav>
            <IconContainer><img src={Matrix} /></IconContainer>
            <LogoContainer>ProCoSys</LogoContainer>
            <PlantSelector><PlantSelectorDropdown>Plant Selector</PlantSelectorDropdown></PlantSelector>
            <MenuContainer>
                <MenuItem>New</MenuItem>
                <MenuItem>Reports</MenuItem>
                <MenuItem>Search</MenuItem>
            </MenuContainer>
            <MenuContainer>
                <MenuItem><img src={Info} /></MenuItem>
                <MenuItem><img src={Lock} /></MenuItem>
                <MenuItem><img src={User} /></MenuItem>
            </MenuContainer>

        </Nav>
    )
}

export default Header
