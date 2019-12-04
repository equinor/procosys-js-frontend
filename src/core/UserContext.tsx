import React, {useEffect, useState} from 'react';

import { Canceler } from '../http/HttpClient';
import Error from '../components/Error';
import Loading from '../components/Loading';
import ProCoSysClient from '../http/ProCoSysClient';
import propTypes from 'prop-types';
import { useProcosysContext } from './ProcosysContext';

type Plant = {
    id: string;
    title: string;
}

type Permission = string;

export type User = {
    name: string;
    permissions: Array<Permission>;
    plants: Array<Plant>;
    setName(name: string): void;
    setPermissions(permissions: Array<Permission>): void;
    setPlants(plants: Array<Plant>): void;
}

const UserContext = React.createContext<User>({} as User);

export const UserContextProvider: React.FC = (props): JSX.Element => {
    const {auth} = useProcosysContext();
    const {children} = props;
    const [name, setName] = useState(() => {
        const account = auth.getCurrentUser();
        return (account && account.fullname) || '';
    });
    const [loading, setLoading] = useState(true);
    const [permissions, setPermissions] = useState<User['permissions']>([]);
    const [plants, setPlants] = useState<User['plants']>([]);
    const apiClient = new ProCoSysClient(auth);
    let plantRequestCanceler: Canceler;

    async function fetchPlants(): Promise<void> {
        const plantResponse = await apiClient.getAllPlantsForUserAsync((c) => {plantRequestCanceler = c;});
        setPlants(plantResponse);
        setLoading(false);
    }

    useEffect(() => {
        fetchPlants();
        return (): void => plantRequestCanceler && plantRequestCanceler();
    },[]);

    if (loading) {
        return (<Loading title="Collecting information about your account" />);
    }

    if (name === '' || !plants.length) {
        return <Error title='You dont seem to have an account in ProCoSys - use AccessIT to request access' />;
    }

    return (
        <UserContext.Provider value={{
            name, permissions, plants, setName, setPermissions, setPlants
        }}>
            {children}
        </UserContext.Provider>
    );
};

UserContextProvider.propTypes = {
    children: propTypes.node.isRequired
};

export const useCurrentUser = (): User => React.useContext<User>(UserContext);
