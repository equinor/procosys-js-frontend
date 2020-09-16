import React, { useMemo } from 'react';
import LibraryApiClient from '../http/LibraryApiClient';
import propTypes from 'prop-types';
import { useCurrentPlant } from '../../../core/PlantContext';
import { useProcosysContext } from '../../../core/ProcosysContext';
import PreservationApiClient from '@procosys/modules/Preservation/http/PreservationApiClient';
import InvitationForPunchOutApiClient from '@procosys/modules/InvitationForPunchOut/http/InvitationForPunchOutApiClient';

type PlantConfigContextProps = {
    libraryApiClient: LibraryApiClient;
    preservationApiClient: PreservationApiClient;
    invitationForPunchOutApiClient: InvitationForPunchOutApiClient
}

const PlantConfigContext = React.createContext<PlantConfigContextProps>({} as PlantConfigContextProps);

export const PlantConfigContextProvider: React.FC = ({ children }): JSX.Element => {

    const { auth } = useProcosysContext();
    const { plant } = useCurrentPlant();
    const libraryApiClient = useMemo(() => new LibraryApiClient(auth), [auth]);
    const preservationApiClient = useMemo(() => new PreservationApiClient(auth), [auth]);
    const invitationForPunchOutApiClient = useMemo(() => new InvitationForPunchOutApiClient(auth), [auth]);
    

    useMemo(() => {
        libraryApiClient.setCurrentPlant(plant.id);
        preservationApiClient.setCurrentPlant(plant.id);
        invitationForPunchOutApiClient.setCurrentPlant(plant.id);
    }, [plant]);


    return (
        <PlantConfigContext.Provider value={{
            libraryApiClient: libraryApiClient,
            preservationApiClient: preservationApiClient,
            invitationForPunchOutApiClient: invitationForPunchOutApiClient
        }}>
            {children}
        </PlantConfigContext.Provider>
    );
};

PlantConfigContextProvider.propTypes = {
    children: propTypes.node.isRequired
};

export const usePlantConfigContext = (): PlantConfigContextProps => React.useContext<PlantConfigContextProps>(PlantConfigContext);
