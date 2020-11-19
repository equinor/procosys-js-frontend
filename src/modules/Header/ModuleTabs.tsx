import { SubNav } from './style';
import { NavLink, useParams } from 'react-router-dom';
import React from 'react';

type ModuleTabsProps = {
    close?: () => void;
}

const ModuleTabs = (props: ModuleTabsProps): JSX.Element => {
    const params = useParams<any>();

    return (
        <SubNav>
            <a href={`/${params.plant}/Completion`}>Completion</a>
            <div onClick={props.close}>
                <NavLink
                    activeClassName={'active'}
                    to={`/${params.plant}/Preservation`}
                >
                    Preservation
                </NavLink>
            </div>
            <a href={`/${params.plant}/WorkOrders`}>Work Orders</a>
            <a href={`/${params.plant}/SWAP`}>Software Change Record</a>
            <a href={`/${params.plant}/PurchaseOrders#Projectslist`}>
                Purchase Orders
            </a>
            <a href={`/${params.plant}/Documents`}>Document</a>
            <a href={`/${params.plant}/Notification`}>Notification</a>
            <a href={`/${params.plant}/Hookup`}>Hookup</a>
            {
                __DEV__ && (
                    <div onClick={props.close}>

                        <NavLink
                            activeClassName={'active'}
                            to={`/${params.plant}/libraryv2`}
                        >
                            Plant Configuration
                        </NavLink>
                    </div>
                )
            }
            {
                !__DEV__ && (
                    <a href={`/${params.plant}/PlantConfig`}>
                        Plant Configuration
                    </a>
                )
            }
        </SubNav >
    );
};

export default ModuleTabs;
