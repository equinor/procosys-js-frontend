import React, {useEffect, useState} from 'react';

import {Container} from './style';
import { Redirect } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import { useCurrentUser } from '../../core/UserContext';
import useRouter from '../../hooks/useRouter';

const NoPlant = (): JSX.Element => {

    const [selectedPlant, setSelectedPlant] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const {history} = useRouter();
    const {plants} = useCurrentUser();

    useEffect(() => {
        const allPlants = plants;
        let plant = null;
        if (allPlants.length > 0) {
            plant = allPlants[0].id.replace('PCS$','');
            setSelectedPlant(plant);
        }
        setLoading(false);
        plant && history.replace('/' + plant);
    },[plants]);

    if (loading) {
        return (
            <Container>
                <div><Spinner large /></div>
                <div><h1>Initializing application...</h1></div>
            </Container>);
    }
    if (selectedPlant) {
        return (
            <Redirect
                to={{
                    pathname: `/${selectedPlant}/`
                }}
            />
        );
    }

    return (<Container><h1>You dont have access to any plants</h1></Container>);
};

export default NoPlant;
