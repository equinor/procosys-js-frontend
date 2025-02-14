import { SubNav } from './style';
import { NavLink, useParams } from 'react-router-dom';

type ModuleTabsProps = {
    onClick?: () => void;
};
const ModuleTabs = (props: ModuleTabsProps): JSX.Element => {
    const params = useParams<any>();

    return (
        <SubNav>
            <a href={`/${params.plant}/Completion`}>Completion</a>
            <span onClick={props.onClick}>
                <NavLink
                    className={({ isActive }: { isActive: boolean }) =>
                        isActive ? 'active' : ''
                    }
                    to="Preservation"
                >
                    Preservation
                </NavLink>
            </span>
            <a href="WorkOrders">Work Orders</a>
            <a href="SWAP">Software Change Record</a>
            <a href={`/${params.plant}/PurchaseOrders#Projectslist`}>
                Purchase Orders
            </a>
            <a href="Documents">Document</a>
            <a href="Notification">Notification</a>
            {(import.meta as ImportMeta & { env: { MODE?: 'development' } })
                ?.env?.MODE === 'development' ? (
                <span onClick={props.onClick}>
                    <NavLink
                        className={({ isActive }: { isActive: boolean }) =>
                            isActive ? 'active' : ''
                        }
                        to="libraryv2"
                    >
                        Library
                    </NavLink>
                </span>
            ) : (
                <span onClick={props.onClick}>
                    <a href={`/${params.plant}/PlantConfig`}>
                        Plant Configuration
                    </a>
                </span>
            )}
        </SubNav>
    );
};

export default ModuleTabs;
