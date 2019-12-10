import { IconContainer, LogoContainer, MenuContainer, MenuItem, Nav, PlantSelector } from './style';
import { Info, Lock, Matrix, User } from '../../assets/icons';
import React, {useState} from 'react';
import Select, { SelectItem } from '../../components/Select';

import Dropdown from '../../components/Dropdown';
import { useCurrentPlant } from '../../core/PlantContext';
import { useCurrentUser } from '../../core/UserContext';

const Header: React.FC = (): JSX.Element => {

    const user = useCurrentUser();
    const plant = useCurrentPlant();

    const [plants] = useState(() => {
        return user.plants.map(plant => ({text: plant.title, value: plant.id}));
    });

    const changePlant = (plantOption: SelectItem): void => {
        plant.setCurrentPlant(plantOption.value as string);
    };

    return (
        <Nav>
            <IconContainer><img src={Matrix} /></IconContainer>
            <LogoContainer><span>ProCoSys</span></LogoContainer>
            <PlantSelector>
                <Select data={plants} selected={{text: plant.plant.title, value: plant.plant.title}} onChange={changePlant} />
            </PlantSelector>
            <MenuContainer>
                <MenuItem>
                    <Dropdown text='New'>
                        <h2>Hello World</h2>
                    </Dropdown>
                </MenuItem>
                <MenuItem>Reports</MenuItem>
                <MenuItem>Search</MenuItem>
            </MenuContainer>
            <MenuContainer>
                <MenuItem><img src={Info} /></MenuItem>
                <MenuItem><img src={Lock} /></MenuItem>
                <MenuItem><img src={User} /></MenuItem>
            </MenuContainer>

        </Nav>
    );
};

export default Header;
