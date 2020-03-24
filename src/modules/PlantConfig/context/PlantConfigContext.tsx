import React, { useEffect, useMemo } from 'react';

//import { Canceler } from '../../../http/HttpClient';
//import Loading from '../../../components/Loading';
import PlantConfigApiClient from '../http/PlantConfigApiClient';
import propTypes from 'prop-types';
import { useCurrentPlant } from '../../../core/PlantContext';
//import { useProcosysContext } from '../../../core/ProcosysContext';


const PlantConfigContext = React.createContext<PlantConfigContextProps>({} as PlantConfigContextProps);
type PlantConfigContextProps = {
    apiClient: PlantConfigApiClient;
}


export const PlantConfigContextProvider: React.FC = ({ children }): JSX.Element => {

    //const { procosysApiClient, auth } = useProcosysContext();
    const { plant } = useCurrentPlant();
    const plantConfigApiClient = useMemo(() => new PlantConfigApiClient(auth), [auth]);

    //let requestCanceler: Canceler;

    useEffect(() => {
        plantConfigApiClient.setCurrentPlant(plant.id);
    }, [plant]);

    return (
        <PlantConfigContext.Provider value={{
            apiClient: plantConfigApiClient
        }}>
            {children}
        </PlantConfigContext.Provider>
    );
};

PlantConfigContextProvider.propTypes = {
    children: propTypes.node.isRequired
};

export const usePlantConfigContext = (): PlantConfigContextProps => React.useContext<PlantConfigContextProps>(PlantConfigContext);
