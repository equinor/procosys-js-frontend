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
            <a href="Hookup">Hookup</a>
            {Object.hasOwn(import.meta, "mode") && (import.meta as ImportMeta & {mode: "development"}).mode === 'development' ? (
                <span onClick={props.onClick}>
                    <NavLink
                        className={({ isActive }: { isActive: boolean }) =>
                            isActive ? 'active' : ''
                        }
                        to="libraryv2"
                    >
                        Plant Configuration
                    </NavLink>
                </span>
            ) : (
                <span onClick={props.onClick}>
                    <a href="PlantConfig">Plant Configuration</a>
                </span>
            )}
        </SubNav>
    );
};

export default ModuleTabs;
