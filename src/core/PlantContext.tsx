import React, {useEffect, useState} from 'react';

import CacheService from './CacheService';
import ErrorComponent from '../components/Error';
import Loading from '../components/Loading';
import propTypes from 'prop-types';
import { useCurrentUser } from './UserContext';
import { useParams } from 'react-router';
import useRouter from '../hooks/useRouter';

type Plant = {
    id: string;
    title: string;
}

const PlantContext = React.createContext<PlantContextProps>({} as PlantContextProps);
type PlantContextProps = {
    plant: Plant;
    setCurrentPlant: (plantId: string) => void;
}

class InvalidParameterException extends Error {}

const cache = new CacheService('Default', localStorage);

export const PlantContextProvider: React.FC = ({children}): JSX.Element => {
    const user = useCurrentUser();
    const {history} = useRouter();
    const {plant: plantInPath} = useParams();

    if (!plantInPath || plantInPath === '') {
        return <ErrorComponent title='Missing plant in path' />;
    }

    const [currentPlant, setCurrentPlantInContext] = useState<Plant>(() => {
        const plant = user.plants.filter(plant => plant.id === `PCS$${plantInPath}`)[0];
        return plant;
    });

    const setCurrentPlant = (plantId: string): void => {
        const normalizedPlantId = (plantId.indexOf('PCS$') != -1 && plantId.replace('PCS$','')) || plantId;
        const plantsFiltered = user.plants.filter(plant => plant.id === `PCS$${normalizedPlantId}`);
        if (plantsFiltered.length <= 0) {
            throw new InvalidParameterException(`PlantID: ${plantId} does not exist`);
        }
        const plant = plantsFiltered[0];
        cache.setCache('plant', plant);
        setCurrentPlantInContext(plant);
    };

    useEffect(() => {
        // const defaultPlantCache = cache.getCache('plant');

        // // From Cache
        // if (defaultPlantCache) {
        //     const defaultPlant = defaultPlantCache.data as Plant;
        //     if (defaultPlant) {
        //         const userHasAccessToDefaultPlant = user.plants.filter(plant => plant.id === defaultPlant.id);
        //         if (userHasAccessToDefaultPlant) {
        //             setCurrentPlant(defaultPlant);
        //         }
        //     }
        // }
        if (!currentPlant) return;
        history.push(`/${currentPlant.id.replace('PCS$','')}`);
    }, [currentPlant]);

    useEffect(() => {
        setCurrentPlant(plantInPath);
    }, [plantInPath]);

    if (!currentPlant) {
        return (<Loading title="Loading plant information" />);
    }

    return (
        <PlantContext.Provider value={{
            plant: currentPlant, setCurrentPlant
        }}>
            {children}
        </PlantContext.Provider>
    );
};

PlantContextProvider.propTypes = {
    children: propTypes.node.isRequired
};

export const useCurrentPlant = (): PlantContextProps => React.useContext<PlantContextProps>(PlantContext);
