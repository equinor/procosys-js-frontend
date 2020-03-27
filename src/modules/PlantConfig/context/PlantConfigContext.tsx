import React, { useEffect, useMemo } from 'react';
import PlantConfigApiClient from '../http/LibraryApiClient';
import propTypes from 'prop-types';
import { useCurrentPlant } from '../../../core/PlantContext';
import { useProcosysContext } from '../../../core/ProcosysContext';
import LibraryApiClient from '../http/LibraryApiClient';

const PlantConfigContext = React.createContext<PlantConfigContextProps>({} as PlantConfigContextProps);

type PlantConfigContextProps = {
    libraryApiClient: PlantConfigApiClient;
}

export const PlantConfigContextProvider: React.FC = ({ children }): JSX.Element => {

    const { auth } = useProcosysContext();
    const { plant } = useCurrentPlant();
    const libraryApiClient = useMemo(() => new LibraryApiClient(auth), [auth]);

    useEffect(() => {
        libraryApiClient.setCurrentPlant(plant.id);
    }, [plant]);

    return (
        <PlantConfigContext.Provider value={{
            libraryApiClient: libraryApiClient
        }}>
            {children}
        </PlantConfigContext.Provider>
    );
};

PlantConfigContextProvider.propTypes = {
    children: propTypes.node.isRequired
};

export const usePlantConfigContext = (): PlantConfigContextProps => React.useContext<PlantConfigContextProps>(PlantConfigContext);
