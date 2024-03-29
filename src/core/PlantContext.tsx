import React, { useEffect, useState } from 'react';

import Axios from 'axios';
import CacheService from './services/CacheService';
import { Canceler } from '../http/HttpClient';
import ErrorComponent from '../components/Error';
import Loading from '../components/Loading';
import propTypes from 'prop-types';
import { useAnalytics } from './services/Analytics/AnalyticsContext';
import { useCurrentUser } from './UserContext';
import { useParams } from 'react-router-dom';
import { useProcosysContext } from './ProcosysContext';
import useRouter from '../hooks/useRouter';

type PlantContextDetails = {
    id: string;
    title: string;
    pathId: string;
};

const PlantContext = React.createContext<PlantContextProps>(
    {} as PlantContextProps
);
type PlantContextProps = {
    plant: PlantContextDetails;
    setCurrentPlant: (plantId: string) => void;
    permissions: string[];
};

type LoadingState = {
    permissions: boolean;
};

class InvalidParameterException extends Error {}

const cache = new CacheService('Default', localStorage);

export const PlantContextProvider: React.FC = ({ children }): JSX.Element => {
    const user = useCurrentUser();
    const { procosysApiClient } = useProcosysContext();
    const { history, location } = useRouter();
    const { plant: plantInPath } = useParams() as any;
    const [permissions, setPermissions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<LoadingState>({
        permissions: true,
    });
    const analytics = useAnalytics();

    if (!plantInPath || plantInPath === '') {
        return <ErrorComponent title="Missing plant in path" />;
    }

    const [currentPlant, setCurrentPlantInContext] =
        useState<PlantContextDetails>(() => {
            const plant = user.plants.filter(
                (plant) => plant.id === `PCS$${plantInPath}`
            )[0];
            return { id: plant.id, title: plant.title, pathId: plantInPath };
        });

    const setCurrentPlant = (plantId: string): void => {
        const normalizedPlantId =
            (plantId.indexOf('PCS$') != -1 && plantId.replace('PCS$', '')) ||
            plantId;
        const plantsFiltered = user.plants.filter(
            (plant) => plant.id === `PCS$${normalizedPlantId}`
        );
        if (plantsFiltered.length <= 0) {
            throw new InvalidParameterException(
                `PlantID: ${plantId} does not exist`
            );
        }
        const plant = plantsFiltered[0] as PlantContextDetails;
        plant.pathId = normalizedPlantId;
        cache.setCache('plant', plant);
        analytics.setCurrentPlant(plant.id);
        setCurrentPlantInContext(plant);
    };

    useEffect(() => {
        if (!currentPlant || currentPlant.pathId === plantInPath) return;
        let newPath = `/${currentPlant.pathId}`;
        newPath = location.pathname.replace(plantInPath, currentPlant.pathId);
        history.push(newPath);
    }, [currentPlant]);

    useEffect(() => {
        procosysApiClient.setCurrentPlant(currentPlant.id);
        let requestCanceler: Canceler;
        (async (): Promise<void> => {
            try {
                const permissions =
                    await procosysApiClient.getPermissionsForCurrentUser(
                        (e) => (requestCanceler = e)
                    );
                setPermissions(permissions);
            } catch (error) {
                if (Axios.isCancel(error)) return;
                console.error('Failed to load permissions', error);
                analytics.trackException(error);
            }
            setIsLoading((currentLoadingState) => ({
                ...currentLoadingState,
                permissions: false,
            }));
        })();
        return (): void => requestCanceler && requestCanceler();
    }, [currentPlant]);

    useEffect(() => {
        setCurrentPlant(plantInPath);
    }, [plantInPath]);

    if (!currentPlant) {
        return <Loading title="Loading plant information" />;
    }
    if (isLoading.permissions) {
        return <Loading title="Loading plant permissions" />;
    }

    return (
        <PlantContext.Provider
            value={{
                plant: currentPlant,
                setCurrentPlant,
                permissions,
            }}
        >
            {children}
        </PlantContext.Provider>
    );
};

PlantContextProvider.propTypes = {
    children: propTypes.node.isRequired,
};

export const useCurrentPlant = (): PlantContextProps =>
    React.useContext<PlantContextProps>(PlantContext);
