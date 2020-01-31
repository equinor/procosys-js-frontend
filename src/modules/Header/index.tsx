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
import React, { useMemo } from 'react';

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

    const plants = useMemo<PlantItem[]>(() => {
        return user.plants.map(plant => ({
            text: plant.title,
            value: plant.id,
        }));
    }, [user.plants]);

    const changePlant = (event: React.MouseEvent, plantIndex: number): void => {
        event.preventDefault();
        setCurrentPlant(plants[plantIndex].value as string);
    };

    const logout = (): void => {
        auth.logout();
    };

    return (
        <div>
            <Nav>
                <IconContainer>
                    <AppsOutlinedIcon />
                </IconContainer>
                <LogoContainer>
                    <span>ProCoSys</span>
                </LogoContainer>
                <PlantSelector>
                    <Dropdown text={plant.title}>
                        {plants.map((plantItem, index) => {
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
                                Certificate
                            </a>
                            <a
                                href={`/${params.plant}/Completion#CommPkg|?bf=1`}
                            >
                                Commissioning Package
                            </a>
                            <a href={`/${params.plant}/Documents/New`}>
                                Document
                            </a>
                            <a href={`/${params.plant}/Hookup/New`}>
                                Certificate
                            </a>
                            <a
                                href={`/${params.plant}/Documents/NewNotification`}
                            >
                                Notification
                            </a>
                            <a
                                href={`/${params.plant}/Preservation#PreservationTag|`}
                            >
                                Preservation Area Tag
                            </a>
                            <a
                                href={`/${params.plant}/PurchaseOrders#PurchaseOrder|`}
                            >
                                Purchase Order
                            </a>
                            <a href={`/${params.plant}/Documents/NewQuery`}>
                                Query
                            </a>
                            <a href={`/${params.plant}/SWAP/New`}>
                                Software Change Record
                            </a>
                            <a href={`/${params.plant}/Completion#Tag|`}>Tag</a>
                        </Dropdown>
                    </MenuItem>
                    <MenuItem>
                        <Dropdown text="Search">
                            <a
                                href={`/${params.plant}/Search?searchType=Action%20Log`}
                            >
                                Action Log
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Certificates`}
                            >
                                Certificate
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Check%20Lists`}
                            >
                                Check lists
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Commissioning%20Packages`}
                            >
                                Commissioning Packages
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Documents`}
                            >
                                Documents
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Formular%20Types`}
                            >
                                Formular Types
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Hookup%20items`}
                            >
                                Hookup Types
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Libraries`}
                            >
                                Libraries
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Manufacturer%2FModel`}
                            >
                                Manufacturer/Model
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=MC%20Packages`}
                            >
                                MC Packages
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Notifications`}
                            >
                                Notifications
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Operation`}
                            >
                                Operation
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Preservation%20Tags`}
                            >
                                Preservation Tags
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Projects`}
                            >
                                Projects
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Punch%20List%20Items`}
                            >
                                Punch List Items
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Purchase%20Orders`}
                            >
                                Purchase Orders
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Query`}
                            >
                                Query
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Software%20Change%20Records`}
                            >
                                Software Change Records
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Tag%20Functions`}
                            >
                                Tag Functions
                            </a>
                            <a href={`/${params.plant}/Search?searchType=Tags`}>
                                Tags
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Work%20Orders`}
                            >
                                Work Orders
                            </a>
                            <hr />
                            <a href={`/${params.plant}/PersonalSearchSettings`}>
                                My Saved Settings
                            </a>
                        </Dropdown>
                    </MenuItem>
                    <MenuItem>
                        <a href={`/${params.plant}/Reports`}>Reports</a>
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
                        <Dropdown Icon={<AccountCircleOutlinedIcon />} openLeft>
                            <DropdownItem title="Logout" onClick={logout}>
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
                <a href={`/${params.plant}/PlantConfig`}>Plant Configuration</a>
            </SubNav>
        </div>
    );
};

export default Header;
