import React, {useEffect, useState} from 'react';

import CacheService from './CacheService';
import ErrorComponent from '../components/Error';
import Loading from '../components/Loading';
import propTypes from 'prop-types';
import { useCurrentUser } from './UserContext';
import { useParams } from 'react-router-dom';
import { useProcosysContext } from './ProcosysContext';
import useRouter from '../hooks/useRouter';
import { Canceler } from '../http/HttpClient';

type PlantContextDetails = {
    id: string;
    title: string;
    pathId: string;
}

const PlantContext = React.createContext<PlantContextProps>({} as PlantContextProps);
type PlantContextProps = {
    plant: PlantContextDetails;
    setCurrentPlant: (plantId: string) => void;
    permissions: string[];
}

class InvalidParameterException extends Error {}

const cache = new CacheService('Default', localStorage);

export const PlantContextProvider: React.FC = ({children}): JSX.Element => {
    const user = useCurrentUser();
    const {procosysApiClient} = useProcosysContext();
    const {history, location} = useRouter();
    const {plant: plantInPath} = useParams() as any;
    const [permissions, setPermissions] = useState<string[]>([]);

    if (!plantInPath || plantInPath === '') {
        return <ErrorComponent title='Missing plant in path' />;
    }

    const [currentPlant, setCurrentPlantInContext] = useState<PlantContextDetails>(() => {
        const plant = user.plants.filter(plant => plant.id === `PCS$${plantInPath}`)[0];
        return {id: plant.id, title: plant.title, pathId: plantInPath};
    });

    const setCurrentPlant = (plantId: string): void => {
        const normalizedPlantId = (plantId.indexOf('PCS$') != -1 && plantId.replace('PCS$','')) || plantId;
        const plantsFiltered = user.plants.filter(plant => plant.id === `PCS$${normalizedPlantId}`);
        if (plantsFiltered.length <= 0) {
            throw new InvalidParameterException(`PlantID: ${plantId} does not exist`);
        }
        const plant = plantsFiltered[0] as PlantContextDetails;
        plant.pathId = normalizedPlantId;
        cache.setCache('plant', plant);
        setCurrentPlantInContext(plant);
    };

    useEffect(() => {
        if (!currentPlant || currentPlant.pathId === plantInPath) return;
        let newPath = `/${currentPlant.pathId}`;
        newPath = location.pathname.replace(plantInPath,currentPlant.pathId);
        history.push(newPath);
    }, [currentPlant]);

    useEffect(() => {
        procosysApiClient.setCurrentPlant(currentPlant.id);
        let requestCanceler: Canceler;
        (async (): Promise<void> => {
            const permissions = await procosysApiClient.getPermissionsForCurrentUser((e) => requestCanceler = e);
            setPermissions(permissions);
        })();
        return (): void => requestCanceler && requestCanceler();
    },[currentPlant]);

    useEffect(() => {
        setCurrentPlant(plantInPath);
    }, [plantInPath]);

    if (!currentPlant) {
        return (<Loading title="Loading plant information" />);
    }

    return (
        <PlantContext.Provider value={{
            plant: currentPlant, setCurrentPlant, permissions
        }}>
            {children}
        </PlantContext.Provider>
    );
};

PlantContextProvider.propTypes = {
    children: propTypes.node.isRequired
};

export const useCurrentPlant = (): PlantContextProps => React.useContext<PlantContextProps>(PlantContext);
