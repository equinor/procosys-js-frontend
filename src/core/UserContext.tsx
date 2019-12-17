import React, {useEffect, useState} from 'react';

import { Canceler } from '../http/HttpClient';
import Error from '../components/Error';
import Loading from '../components/Loading';
import propTypes from 'prop-types';
import styled from 'styled-components';
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

const Container = styled.div`
    height: 200px;
`;

export const UserContextProvider: React.FC = (props): JSX.Element => {
    const {auth, procosysApiClient} = useProcosysContext();
    const {children} = props;
    const [name, setName] = useState(() => {
        const account = auth.getCurrentUser();
        return (account && account.fullname) || '';
    });
    const [loading, setLoading] = useState(true);
    const [permissions, setPermissions] = useState<User['permissions']>([]);
    const [plants, setPlants] = useState<User['plants']>([]);
    const [errorEncountered, setErrorEncountered] = useState(false);
    let plantRequestCanceler: Canceler;

    async function fetchPlants(): Promise<void> {
        try {
            const plantResponse = await procosysApiClient.getAllPlantsForUserAsync((c) => {plantRequestCanceler = c;});
            setPlants(plantResponse);
        } catch (error) {
            setErrorEncountered(true);
        }

        setLoading(false);
    }

    useEffect(() => {
        fetchPlants();
        return (): void => plantRequestCanceler && plantRequestCanceler();
    },[]);

    if (loading) {
        return (<Container><Loading title="Collecting information about your account" /></Container>);
    }

    if (errorEncountered) {
        return (<Container><Error large title='We encountered an unexpected error, try again or contact support for further assistance' /></Container>);
    }

    if (name === '' || !plants.length) {
        return (<Container><Error large title='You dont seem to have an account in ProCoSys - use AccessIT to request access' /></Container>);
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
