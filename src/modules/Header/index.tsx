import {
    DropdownItem,
    IconContainer,
    LogoContainer,
    MenuContainer,
    MenuItem,
    Nav,
    PlantSelector,
    SubNav
} from './style';
import { NavLink, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import AppsOutlinedIcon from '@material-ui/icons/AppsOutlined';
import Dropdown from '../../components/Dropdown';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useCurrentPlant } from '../../core/PlantContext';
import { useCurrentUser } from '../../core/UserContext';
import { useProcosysContext } from '../../core/ProcosysContext';

type PlantItem = {
    text: string;
    value: string;
};

const Header: React.FC = (): JSX.Element => {
    const user = useCurrentUser();
    const { auth } = useProcosysContext();
    const { plant, setCurrentPlant } = useCurrentPlant();
    const params = useParams<any>();
    const [filterForPlants, setFilterForPlants] = useState<string>('');
    const [allPlants] = useState<PlantItem[]>(() => {
        return user.plants.map(plant => ({
            text: plant.title,
            value: plant.id,
        }));
    });
    const [filteredPlants, setFilteredPlants] = useState<PlantItem[]>(allPlants);



    const changePlant = (event: React.MouseEvent, plantIndex: number): void => {
        event.preventDefault();
        setCurrentPlant(filteredPlants[plantIndex].value as string);
    };


    useEffect(() => {
        if (filterForPlants.length <= 0) {
            setFilteredPlants(allPlants);
            return;
        }
        setFilteredPlants(allPlants.filter(p => p.text.toLowerCase().indexOf(filterForPlants.toLowerCase()) > -1));
    }, [filterForPlants]);

    return (
        <div>
            <Nav>
                <IconContainer>
                    <AppsOutlinedIcon />
                </IconContainer>
                <LogoContainer>
                    <a
                        href={`/${params.plant}/`}
                    >
                        ProCoSys
                    </a>
                </LogoContainer>
                <PlantSelector>
                    <Dropdown text={plant.title} onFilter={setFilterForPlants}>
                        {filteredPlants.map((plantItem, index) => {
                            return (
                                <DropdownItem
                                    key={index}
                                    onClick={(event): void =>
                                        changePlant(event, index)
                                    }
                                >
                                    {plantItem.text}
                                </DropdownItem>
                            );
                        })}
                    </Dropdown>
                </PlantSelector>
                <MenuContainer>
                    <MenuItem>
                        <Dropdown text="New">

                            <a
                                href={`/${params.plant}/Completion/NewCertificate`}
                            >
                                <DropdownItem>Certificate</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Completion#CommPkg|?bf=1`}
                            >
                                <DropdownItem>Commissioning Package</DropdownItem>
                            </a>
                            <a href={`/${params.plant}/Documents/New`}>
                                <DropdownItem>Document</DropdownItem>
                            </a>
                            <a href={`/${params.plant}/Hookup/New`}>
                                <DropdownItem>Certificate</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Documents/NewNotification`}
                            >
                                <DropdownItem>Notification</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Preservation#PreservationTag|`}
                            >
                                <DropdownItem>Preservation Area Tag</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/PurchaseOrders#PurchaseOrder|`}
                            >
                                <DropdownItem>Purchase Order</DropdownItem>
                            </a>
                            <a href={`/${params.plant}/Documents/NewQuery`}>
                                <DropdownItem>Query</DropdownItem>
                            </a>
                            <a href={`/${params.plant}/SWAP/New`}>
                                <DropdownItem>Software Change Record</DropdownItem>
                            </a>
                            <a href={`/${params.plant}/Completion#Tag|`}><DropdownItem>Tag</DropdownItem></a>
                        </Dropdown>
                    </MenuItem>
                    <MenuItem>
                        <Dropdown text="Search">
                            <a
                                href={`/${params.plant}/Search?searchType=Action%20Log`}
                            >
                                <DropdownItem>Action Log</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Certificates`}
                            >
                                <DropdownItem>Certificate</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Check%20Lists`}
                            >
                                <DropdownItem>Check lists</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Commissioning%20Packages`}
                            >
                                <DropdownItem>Commissioning Packages</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Documents`}
                            >
                                <DropdownItem>Documents</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Formular%20Types`}
                            >
                                <DropdownItem>Formular Types</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Hookup%20items`}
                            >
                                <DropdownItem>Hookup Types</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Libraries`}
                            >
                                <DropdownItem>Libraries</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Manufacturer%2FModel`}
                            >
                                <DropdownItem>Manufacturer/Model</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=MC%20Packages`}
                            >
                                <DropdownItem>MC Packages</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Notifications`}
                            >
                                <DropdownItem>Notifications</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Operation`}
                            >
                                <DropdownItem>Operation</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Preservation%20Tags`}
                            >
                                <DropdownItem>Preservation Tags</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Projects`}
                            >
                                <DropdownItem>Projects</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Punch%20List%20Items`}
                            >
                                <DropdownItem>Punch List Items</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Purchase%20Orders`}
                            >
                                <DropdownItem>Purchase Orders</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Query`}
                            >
                                <DropdownItem>Query</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Software%20Change%20Records`}
                            >
                                <DropdownItem>Software Change Records</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Tag%20Functions`}
                            >
                                <DropdownItem>Tag Functions</DropdownItem>
                            </a>
                            <a href={`/${params.plant}/Search?searchType=Tags`}>
                                <DropdownItem>Tags</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Work%20Orders`}
                            >
                                <DropdownItem>Work Orders</DropdownItem>
                            </a>
                            <hr />
                            <a href={`/${params.plant}/PersonalSearchSettings`}>
                                <DropdownItem>My Saved Settings</DropdownItem>
                            </a>
                        </Dropdown>
                    </MenuItem>
                    <MenuItem>
                        <a href={`/${params.plant}/Reports`}><DropdownItem>Reports</DropdownItem></a>
                    </MenuItem>
                </MenuContainer>
                <MenuContainer>
                    <MenuItem>
                        <InfoOutlinedIcon />
                    </MenuItem>
                    <MenuItem>
                        <LockOutlinedIcon />
                    </MenuItem>
                    <MenuItem>
                        <Dropdown Icon={<AccountCircleOutlinedIcon />}>
                            <DropdownItem title="Logout" onClick={(): void => auth.logout()}>
                                Logout
                            </DropdownItem>
                        </Dropdown>
                    </MenuItem>
                </MenuContainer>
            </Nav>
            <SubNav>
                <a href={`/${params.plant}/Completion`}>Completion</a>
                <NavLink
                    activeClassName={'active'}
                    to={`/${params.plant}/Preservation`}
                >
                    Preservation
                </NavLink>
                <a href={`/${params.plant}/WorkOrders`}>Work Orders</a>
                <a href={`/${params.plant}/SWAP`}>Software Change Record</a>
                <a href={`/${params.plant}/PurchaseOrders#Projectslist`}>
                    Purchase Orders
                </a>
                <a href={`/${params.plant}/Documents`}>Document</a>
                <a href={`/${params.plant}/Notification`}>Notification</a>
                <a href={`/${params.plant}/Hookup`}>Hookup</a>
                <NavLink
                    activeClassName={'active'}
                    to={`/${params.plant}/PlantConfig`}
                >
                    Plant Configuration
                </NavLink>
            </SubNav>
        </div>
    );
};

export default Header;
