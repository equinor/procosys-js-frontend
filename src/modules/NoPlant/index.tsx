import React, { useEffect, useState } from 'react';

import CacheService from '../../core/services/CacheService';
import { Container } from './style';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import { Typography } from '@equinor/eds-core-react';
import { useCurrentUser } from '../../core/UserContext';

const cache = new CacheService('default', localStorage);

const NoPlant = (): JSX.Element | null => {
    const [selectedPlant, setSelectedPlant] = useState<string | null>(null);
    const { plants } = useCurrentUser();
    const cachedPlant = cache.getCache('plant');
    const navigate = useNavigate();

    useEffect(() => {
        if (cachedPlant && !selectedPlant) {
            const plant = cachedPlant.data.id.replace('PCS$', '');
            setSelectedPlant(plant);
            navigate(`/${plant}`, { replace: true });
        }
    }, [cachedPlant, selectedPlant, navigate]);

    useEffect(() => {
        if (!cachedPlant) {
            const allPlants = plants;
            let plant = null;
            if (allPlants.length > 0) {
                plant = allPlants[0].id.replace('PCS$', '');
                setSelectedPlant(plant);
            }
            navigate(`/${plant}`, { replace: true });
        }
    }, [plants, cachedPlant, selectedPlant, navigate]);

    if (plants.length <= 0) {
        return (
            <Container>
                <Helmet>
                    <title>{'- NoPlants'}</title>
                </Helmet>
                <Typography variant="h1">
                    You dont have access to any plants
                </Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Helmet>
                <title>{'- Initializing'}</title>
            </Helmet>
            <div>
                <Spinner large />
            </div>
            <div>
                <Typography variant="h1">
                    Initializing application...
                </Typography>
            </div>
        </Container>
    );
};

export default NoPlant;
