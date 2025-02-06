import React, { PropsWithChildren, useMemo } from 'react';
import LibraryApiClient from '../http/LibraryApiClient';
import propTypes from 'prop-types';
import { useCurrentPlant } from '../../../core/PlantContext';
import { useProcosysContext } from '../../../core/ProcosysContext';
import PreservationApiClient from '@procosys/modules/Preservation/http/PreservationApiClient';

type PlantConfigContextProps = {
    libraryApiClient: LibraryApiClient;
    preservationApiClient: PreservationApiClient;
};

const PlantConfigContext = React.createContext<PlantConfigContextProps>(
    {} as PlantConfigContextProps
);

export const PlantConfigContextProvider = ({
    children,
}: PropsWithChildren): JSX.Element => {
    const { auth } = useProcosysContext();
    const { plant } = useCurrentPlant();
    const libraryApiClient = useMemo(() => new LibraryApiClient(auth), [auth]);
    const preservationApiClient = useMemo(
        () => new PreservationApiClient(auth),
        [auth]
    );

    useMemo(() => {
        libraryApiClient.setCurrentPlant(plant.id);
        preservationApiClient.setCurrentPlant(plant.id);
    }, [plant]);

    return (
        <PlantConfigContext.Provider
            value={{
                libraryApiClient: libraryApiClient,
                preservationApiClient: preservationApiClient,
            }}
        >
            {children}
        </PlantConfigContext.Provider>
    );
};

PlantConfigContextProvider.propTypes = {
    children: propTypes.node.isRequired,
};

export const usePlantConfigContext = (): PlantConfigContextProps =>
    React.useContext<PlantConfigContextProps>(PlantConfigContext);
