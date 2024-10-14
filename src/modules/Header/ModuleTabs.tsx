import { SubNav } from './style';
import { Link, NavLink, useParams } from 'react-router-dom';
import React from 'react';

type ModuleTabsProps = {
    onClick?: () => void;
};

const ModuleTabs = (props: ModuleTabsProps): JSX.Element => {
    const params = useParams<any>();

    return (
        <SubNav>
            <a href='Completion'>Completion</a>
            <span onClick={props.onClick}>
                <NavLink
                   className={({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '')}
                    to='Preservation'
                >
                    Preservation
                </NavLink>
            </span>
            <a href='WorkOrders'>Work Orders</a>
            <a href='SWAP'>Software Change Record</a>
            <a href={`PurchaseOrders#'Projectslist`}>
                Purchase Orders
            </a>
            <a href='Documents'>Document</a>
            <a href='Notification'>Notification</a>
            <a href='Hookup'>Hookup</a>
            {__DEV__ && (
                <span onClick={props.onClick}>
                    <NavLink
                        className={({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '')}
                        to='libraryv2'
                    >
                        Plant Configuration
                    </NavLink>
                </span>
            )}
            {!__DEV__ && (
                <span onClick={props.onClick}>
                    <a href='PlantConfig'>
                        Plant Configuration
                    </a>
                </span>
            )}
        </SubNav>
    );
};

export default ModuleTabs;
