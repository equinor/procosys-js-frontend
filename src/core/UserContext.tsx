import React, { PropsWithChildren, useEffect, useState } from 'react';

import { Canceler } from '../http/HttpClient';
import Error from '../components/Error';
import Loading from '../components/Loading';
import propTypes from 'prop-types';
import styled from 'styled-components';
import { useProcosysContext } from './ProcosysContext';

type Plant = {
    id: string;
    title: string;
};

export type User = {
    name: string;
    id: string;
    plants: Array<Plant>;
    setName(name: string): void;
    setId(id: string): void;
    setPlants(plants: Array<Plant>): void;
};

const UserContext = React.createContext<User>({} as User);

const Container = styled.div`
    height: 200px;
`;

export const UserContextProvider = (props: PropsWithChildren): JSX.Element => {
    const { auth, procosysApiClient } = useProcosysContext();
    const { children } = props;
    const [name, setName] = useState(() => {
        const account = auth.getCurrentUser();
        return (account && account.fullname) || '';
    });
    const [id, setId] = useState(() => {
        const account = auth.getCurrentUser();
        return (account && account.id) || '';
    });
    const [loading, setLoading] = useState(true);
    const [plants, setPlants] = useState<User['plants']>([]);
    const [errorEncountered, setErrorEncountered] = useState(false);
    let plantRequestCanceler: Canceler;

    async function fetchPlants(): Promise<void> {
        try {
            const plantResponse =
                await procosysApiClient.getAllPlantsForUserAsync((c) => {
                    plantRequestCanceler = c;
                });
            setPlants(plantResponse);
        } catch (error) {
            console.error(error);
            setErrorEncountered(true);
        }

        setLoading(false);
    }

    useEffect(() => {
        fetchPlants();
        return (): void => plantRequestCanceler && plantRequestCanceler();
    }, []);

    if (loading) {
        return (
            <Container>
                <Loading title="Collecting information about your account" />
            </Container>
        );
    }

    if (errorEncountered) {
        return (
            <Container>
                <Error
                    large
                    title="We encountered an unexpected error, try again or contact support for further assistance"
                />
            </Container>
        );
    }

    if (name === '' || !plants.length) {
        return (
            <Container>
                <Error
                    large
                    title="You dont seem to have an account in ProCoSys - use AccessIT to request access"
                />
            </Container>
        );
    }

    return (
        <UserContext.Provider
            value={{
                name,
                id,
                plants,
                setName,
                setId,
                setPlants,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

UserContextProvider.propTypes = {
    children: propTypes.node.isRequired,
};

export const useCurrentUser = (): User => React.useContext<User>(UserContext);
