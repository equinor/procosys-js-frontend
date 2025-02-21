import React, { useEffect, useState } from 'react';

import Axios from 'axios';
import CacheService from './services/CacheService';
import { Canceler } from '../http/HttpClient';
import ErrorComponent from '../components/Error';
import Loading from '../components/Loading';
import propTypes from 'prop-types';
import { useAnalytics } from './services/Analytics/AnalyticsContext';
import { useCurrentUser } from './UserContext';
import { useNavigate, useParams } from 'react-router-dom';
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
    const navigate = useNavigate();

    // Validate user plants
    if (!user || !user.plants || user.plants.length === 0) {
        console.error(
            'User has no plants assigned or user.plants is undefined'
        );
        // return <ErrorComponent title="No plants available for the user" />;
    }

    // Validate plant in path
    if (!plantInPath || plantInPath === '' || typeof plantInPath !== 'string') {
        console.warn('Invalid plantInPath:', plantInPath);
        return (
            <ErrorComponent
                title={`Invalid or missing plant ID in path: ${
                    plantInPath || 'undefined'
                }`}
            />
        );
    }

    const [currentPlant, setCurrentPlantInContext] =
        useState<PlantContextDetails>(() => {
            //TODO:  to remove log in the future
            if (!user || !Array.isArray(user.plants)) {
                const plantsValue = user?.plants
                    ? `Actual value of 'user.plants': ${JSON.stringify(
                          user.plants,
                          null,
                          2
                      )}`
                    : "'user.plants' is undefined or null.";

                throw new Error(
                    `Invalid user object: 'user.plants' is not defined or not an array. ${plantsValue}`
                );
            }

            const plant = user.plants.filter(
                (plant) => plant.id === `PCS$${plantInPath}`
            )[0];

            if (!plant) {
                //TODO:  to remove log in the future
                console.warn(
                    `No plant found for path ID: ${plantInPath}. Using default fallback.`
                );
                return { id: '', title: '', pathId: plantInPath || 'unknown' };
            }

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
            console.error(
                `PlantID: ${plantId} does not exist. Available plants:`,
                user.plants
            );
            // TODO:
            // The changes added to this branch will need to be removed in the near future.
            // The changes here involve adding more console logs aimed at identifying and diagnosing
            // errors occurring only in production. The console logs will be removed once enough
            // information has been gathered.
            throw new InvalidParameterException(
                `Available plants: ${user.plants}, PlantID: ${plantId} does not exist. , plantInPath: ${plantInPath}`
            );
        }
        const plant = plantsFiltered[0] as PlantContextDetails;
        plant.pathId = normalizedPlantId;
        cache.setCache('plant', plant);
        analytics.setCurrentPlant(plant.id);
        setCurrentPlantInContext(plant);
    };

    // Update path if plant changes
    useEffect(() => {
        if (!currentPlant || currentPlant.pathId === plantInPath) return;
        let newPath = `/${currentPlant.pathId}`;
        newPath = location.pathname.replace(plantInPath, currentPlant.pathId);
        navigate(newPath);
    }, [currentPlant]);

    // Fetch permissions
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

    // Set plant on path change
    useEffect(() => {
        if (!plantInPath || typeof plantInPath !== 'string') {
            console.warn('Invalid plantInPath:', plantInPath);
            return;
        }
        try {
            setCurrentPlant(plantInPath);
        } catch (error) {
            console.error(`Failed to set current plant: ${error.message}`);
            console.error('Failed to set current plant:', error);
            console.error('Error stack:', error.stack);
        }
    }, [plantInPath]);

    useEffect(() => {
        if (!user || !user.plants) {
            console.error(
                'User data is not available. Cannot set current plant.'
            );
            return;
        }

        if (!plantInPath || typeof plantInPath !== 'string') {
            console.warn('Invalid or missing plantInPath:', plantInPath);
            return;
        }

        try {
            setCurrentPlant(plantInPath);
        } catch (error) {
            console.error(`Failed to set current plant: ${error.message}`);
        }
    }, [plantInPath, user]);

    if (!currentPlant || !currentPlant.id) {
        // return <ErrorComponent title="Invalid or missing plant information" />;
        // return <Loading title="Loading plant information" />;
        return <ErrorComponent title="Invalid or missing plant information" />;
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
