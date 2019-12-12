import { IconContainer, LogoContainer, MenuContainer, MenuItem, Nav, PlantSelector } from './style';
import { Info, Lock, Matrix, User } from '../../assets/icons';
import React, {useState} from 'react';
import Select, { SelectItem } from '../../components/Select';

import Dropdown from '../../components/Dropdown';
import { useCurrentPlant } from '../../core/PlantContext';
import { useCurrentUser } from '../../core/UserContext';
import { useParams } from 'react-router';

const Header: React.FC = (): JSX.Element => {

    const user = useCurrentUser();
    const plant = useCurrentPlant();
    const params = useParams<any>();
    console.log('Params: ', params);

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
                        <a href={`/${plant.plant.pathId}/Completion/NewCertificate`}>Certificate</a>
                        <a href={`/${plant.plant.pathId}/Completion#CommPkg|?bf=1`}>Commissioning Package</a>
                        <a href={`/${plant.plant.pathId}/Documents/New`}>Document</a>
                        <a href={`/${plant.plant.pathId}/Hookup/New`}>Certificate</a>
                        <a href={`/${plant.plant.pathId}/Documents/NewNotification`}>Notification</a>
                        <a href={`/${plant.plant.pathId}/Preservation#PreservationTag|`}>Preservation Area Tag</a>
                        <a href={`/${plant.plant.pathId}/PurchaseOrders#PurchaseOrder|`}>Purchase Order</a>
                        <a href={`/${plant.plant.pathId}/Documents/NewQuery`}>Query</a>
                        <a href={`/${plant.plant.pathId}/SWAP/New`}>Software Change Record</a>
                        <a href={`/${plant.plant.pathId}/Completion#Tag|`}>Tag</a>
                    </Dropdown>
                </MenuItem>
                <MenuItem>
                    <Dropdown text="Search">
                        <a href={`/${plant.plant.pathId}/Search?searchType=Action%20Log`}>Action Log</a>
                        <a href={`/${plant.plant.pathId}/Search?searchType=Certificates`}>Certificate</a>
                        <a href={`/${plant.plant.pathId}/Search?searchType=Check%20Lists`}>Check lists</a>
                        <a href={`/${plant.plant.pathId}/Search?searchType=Commissioning%20Packages`}>Commissioning Packages</a>
                        <a href={`/${plant.plant.pathId}/Search?searchType=Documents`}>Documents</a>
                        <a href={`/${plant.plant.pathId}/Search?searchType=Formular%20Types`}>Formular Types</a>
                        <a href={`/${plant.plant.pathId}/Search?searchType=Hookup%20items`}>Hookup Types</a>
                        <a href={`/${plant.plant.pathId}/Search?searchType=Libraries`}>Libraries</a>
                        <a href={`/${plant.plant.pathId}/Search?searchType=Manufacturer%2FModel`}>Manufacturer/Model</a>
                        <a href={`/${plant.plant.pathId}/Search?searchType=MC%20Packages`}>MC Packages</a>
                        <a href={`/${plant.plant.pathId}/Search?searchType=Notifications`}>Notifications</a>
                        <a href={`/${plant.plant.pathId}/Search?searchType=Operation`}>Operation</a>
                        <a href={`/${plant.plant.pathId}/Search?searchType=Preservation%20Tags`}>Preservation Tags</a>
                        <a href={`/${plant.plant.pathId}/Search?searchType=Projects`}>Projects</a>
                        <a href={`/${plant.plant.pathId}/Search?searchType=Punch%20List%20Items`}>Punch List Items</a>
                        <a href={`/${plant.plant.pathId}/Search?searchType=Purchase%20Orders`}>Purchase Orders</a>
                        <a href={`/${plant.plant.pathId}/Search?searchType=Query`}>Query</a>
                        <a href={`/${plant.plant.pathId}/Search?searchType=Software%20Change%20Records`}>Software Change Records</a>
                        <a href={`/${plant.plant.pathId}/Search?searchType=Tag%20Functions`}>Tag Functions</a>
                        <a href={`/${plant.plant.pathId}/Search?searchType=Tags`}>Tags</a>
                        <a href={`/${plant.plant.pathId}/Search?searchType=Work%20Orders`}>Work Orders</a>
                        <hr />
                        <a href={`/${plant.plant.pathId}/PersonalSearchSettings`}>My Saved Settings</a>
                    </Dropdown>
                </MenuItem>
                <MenuItem><a href={`/${plant.plant.pathId}/Reports`}>Reports</a></MenuItem>
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
