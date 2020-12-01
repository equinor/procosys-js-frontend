/* eslint-disable react/jsx-no-target-blank */
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

import { Button } from '@equinor/eds-core-react';
import Dropdown from '../../components/Dropdown';
import EdsIcon from '@procosys/components/EdsIcon';
import OptionsDropdown from '../../components/OptionsDropdown';
import { ProCoSysSettings } from '@procosys/core/ProCoSysSettings';
import ProcosysLogo from '../../assets/icons/ProcosysLogo';
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
                    <ProcosysLogo fontSize='inherit'/>
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
                                <DropdownItem>Commissioning package</DropdownItem>
                            </a>
                            <a href={`/${params.plant}/Documents/New`}>
                                <DropdownItem>Document</DropdownItem>
                            </a>
                            { (ProCoSysSettings.ipo.enabled) &&
                                <a href={`/${params.plant}/InvitationForPunchOut/CreateIPO`}>
                                    <DropdownItem>Invitation for punch out</DropdownItem>
                                </a>
                            }
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
                                <DropdownItem>Preservation area tag</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/PurchaseOrders#PurchaseOrder|`}
                            >
                                <DropdownItem>Purchase order</DropdownItem>
                            </a>
                            <a href={`/${params.plant}/Documents/NewQuery`}>
                                <DropdownItem>Query</DropdownItem>
                            </a>
                            <a href={`/${params.plant}/SWAP/New`}>
                                <DropdownItem>Software change record</DropdownItem>
                            </a>
                            <a href={`/${params.plant}/Completion#Tag|`}><DropdownItem>Tag</DropdownItem></a>
                        </Dropdown>
                    </MenuItem>
                    <MenuItem>
                        <Dropdown text="Search">
                            <a
                                href={`/${params.plant}/Search?searchType=Action%20Log`}
                            >
                                <DropdownItem>Action log</DropdownItem>
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
                                <DropdownItem>Commissioning packages</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Documents`}
                            >
                                <DropdownItem>Documents</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Formular%20Types`}
                            >
                                <DropdownItem>Formular types</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Hookup%20items`}
                            >
                                <DropdownItem>Hookup types</DropdownItem>
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
                                <DropdownItem>MC packages</DropdownItem>
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
                                <DropdownItem>Preservation tags</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Projects`}
                            >
                                <DropdownItem>Projects</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Punch%20List%20Items`}
                            >
                                <DropdownItem>Punch list items</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Purchase%20Orders`}
                            >
                                <DropdownItem>Purchase orders</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Query`}
                            >
                                <DropdownItem>Query</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Software%20Change%20Records`}
                            >
                                <DropdownItem>Software change records</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Tag%20Functions`}
                            >
                                <DropdownItem>Tag functions</DropdownItem>
                            </a>
                            <a href={`/${params.plant}/Search?searchType=Tags`}>
                                <DropdownItem>Tags</DropdownItem>
                            </a>
                            <a
                                href={`/${params.plant}/Search?searchType=Work%20Orders`}
                            >
                                <DropdownItem>Work orders</DropdownItem>
                            </a>
                            <hr />
                            <a href={`/${params.plant}/PersonalSearchSettings`}>
                                <DropdownItem>My saved settings</DropdownItem>
                            </a>
                        </Dropdown>
                    </MenuItem>
                    <MenuItem>
                        <a href={`/${params.plant}/Reports`}>
                            <Button variant={'ghost'}>
                                Reports
                            </Button>
                        </a>
                    </MenuItem>
                </MenuContainer>
                <MenuContainer>
                    <MenuItem className='compact'>
                        <OptionsDropdown variant={'ghost'} icon='link'>
                            <a href="https://statoilsrm.sharepoint.com/sites/PRDConstructionandCommissioning/SitePages/CCH-DIGITAL.aspx" target="_blank">
                                <DropdownItem>
                                    C&amp;C digital toolbox
                                </DropdownItem>
                            </a>                            
                            <a href="https://dcp.equinor.com" target="_blank">
                                <DropdownItem>
                                    DCP – Digitalized Commissioning Procedure
                                </DropdownItem>
                            </a>
                            <a href="https://fusion.equinor.com" target="_blank">
                                <DropdownItem>
                                    FUSION – Project information portal
                                </DropdownItem>
                            </a>
                            <a href="https://echo.equinor.com" target="_blank">
                                <DropdownItem>
                                    Echo inField – Technical data and status
                                </DropdownItem>
                            </a>
                            <a href="https://stid.equinor.com" target="_blank">
                                <DropdownItem>
                                    STID - Technical Information Portal
                                </DropdownItem>
                            </a>
                            <a href="https://accessit.equinor.com" target="_blank">
                                <DropdownItem>
                                    Access IT – Access Managing Control System for Equinor
                                </DropdownItem>
                            </a>                                                                                                                                                                        
                        </OptionsDropdown>
                    </MenuItem >                    
                    <MenuItem className='compact'>
                        <OptionsDropdown variant={'ghost'} icon='info_circle' iconSize={24}>
                            <a href={'https://procosyspublictoc.azurewebsites.net/'}>
                                <DropdownItem>
                                    ProCoSys Help
                                </DropdownItem>
                            </a>
                            <a href={'https://equinor.service-now.com/selfservice?id=sc_cat_item&sys_id=67053df4dbe82b008a0f9407db9619d1'}>
                                <DropdownItem>
                                    Open a Request Item
                                </DropdownItem>
                            </a>
                            <a href={'https://equinor.service-now.com/selfservice/?id=sc_cat_item&sys_id=3373cf4cdb97f200bc7af7461d96195b'}>
                                <DropdownItem>
                                    Report an error
                                </DropdownItem>
                            </a>
                        </OptionsDropdown>
                    </MenuItem>
                    <MenuItem className='compact'>
                        <OptionsDropdown variant={'ghost'} icon='lock'>
                            <a href={`/${params.plant}/Security/User`}>
                                <DropdownItem>
                                    Users
                                </DropdownItem>
                            </a>
                            <a href={`/${params.plant}/Security/UserRole`}>
                                <DropdownItem>
                                    User Roles
                                </DropdownItem>
                            </a>
                            <a href={`/${params.plant}/Security/PrivilegeGroup`}>
                                <DropdownItem>
                                    Privilige Groups
                                </DropdownItem>
                            </a>
                            <a href={`/${params.plant}/Security/RestrictionRole`}>
                                <DropdownItem>
                                    Restriction Roles
                                </DropdownItem>
                            </a>
                        </OptionsDropdown>
                    </MenuItem >
                    <MenuItem className={'compact'}>
                        <a href={`/${params.plant}/Security/User/EditSelf`}>
                            <Button variant={'ghost'} >
                                <EdsIcon name='account_circle' />
                                {user.name}
                            </Button>
                        </a>
                    </MenuItem>
                    <MenuItem className='compact lastButton'>
                        <Button variant={'ghost'} onClick={(): void => auth.logout()}>
                            Logout
                        </Button>
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
                {__DEV__ && (
                    <NavLink
                        activeClassName={'active'}
                        to={`/${params.plant}/libraryv2`}
                    >
                        Plant Configuration
                    </NavLink>
                )}
                {!__DEV__ && (
                    <a href={`/${params.plant}/PlantConfig`}>
                        Plant Configuration
                    </a>
                )}
            </SubNav>
        </div>
    );
};

export default Header;
