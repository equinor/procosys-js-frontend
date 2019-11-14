import React from 'react';
import { Nav, IconContainer, LogoContainer, PlantSelector, Spacer, MenuContainer, MenuItem } from './style';
import { Matrix, User, Lock, Info } from '../../assets/icons';
import { Dropdown } from './../../components';

const plants = [{
    text: "JOHAN SVERDRUP",
    value: "JOHAN_SVERDRUP"
},
{
    text: "JOHAN CASTBERG",
    value: "JOHAN_CASTBERG"
}];


const Header = () => {
    return (
        <Nav>
            <IconContainer><img src={Matrix} /></IconContainer>
            <LogoContainer><span>ProCoSys</span></LogoContainer>
            <PlantSelector>
                <Dropdown data={plants} />
            </PlantSelector>
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
