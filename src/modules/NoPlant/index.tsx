import React, {useEffect, useState} from 'react';

import CacheService from '../../core/CacheService';
import {Container} from './style';
import { Redirect } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import { useCurrentUser } from '../../core/UserContext';
import useRouter from '../../hooks/useRouter';

const cache = new CacheService('default', localStorage);

const NoPlant = (): JSX.Element => {

    const [selectedPlant, setSelectedPlant] = useState<string|null>(null);
    const {history} = useRouter();
    const {plants} = useCurrentUser();
    const cachedPlant = cache.getCache('plant');

    if (cachedPlant && !selectedPlant) {
        const plant = cachedPlant.data.id.replace('PCS$','');
        history.replace('/' + plant);
        setSelectedPlant(plant);
    }

    useEffect(() => {
        if (!cachedPlant) {
            const allPlants = plants;
            let plant = null;
            if (allPlants.length > 0) {
                plant = allPlants[0].id.replace('PCS$','');
                setSelectedPlant(plant);
            }
            plant && history.replace('/' + plant);
        }
    },[plants]);

    if (plants.length <= 0) {
        return (<Container><h1>You dont have access to any plants</h1></Container>);
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

    return (
        <Container>
            <div><Spinner large /></div>
            <div><h1>Initializing application...</h1></div>
        </Container>);

};

export default NoPlant;
