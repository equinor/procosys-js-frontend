import React, {useEffect, useState} from 'react';

import {Container} from './style';
import ProcosysClient from '../../http/ProCoSysClient';
import { Redirect } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import useRouter from '../../hooks/useRouter';

const NoPlant = (): JSX.Element => {

    const [selectedPlant, setSelectedPlant] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const {history} = useRouter();

    useEffect(() => {
        (async (): Promise<void> => {
            const client = new ProcosysClient();
            const plantsResponse = await client.getAllPlantsForUserAsync();
            let plant = null;
            if (plantsResponse.length > 0) {
                plant = plantsResponse[0].Id.replace('PCS$','');
                setSelectedPlant(plant);
            }
            setLoading(false);
            plant && history.replace('/' + plant);
        })();
    },[]);

    if (loading) {
        return (<Container>
            <div><Spinner large /></div>
            <div><h1>Initializing application...</h1></div></Container>);
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
