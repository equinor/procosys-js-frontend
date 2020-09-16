import React, { useEffect, useMemo } from 'react';
import propTypes from 'prop-types';
import InvitationForPunchOutApiClient from '../http/InvitationForPunchOutApiClient';
import { useCurrentPlant } from '../../../core/PlantContext';
import { useProcosysContext } from '../../../core/ProcosysContext';

type InvitationForPunchOutContextProps = {
    apiClient: InvitationForPunchOutApiClient;
}

const InvitationForPunchOutContext = React.createContext<InvitationForPunchOutContextProps>({} as InvitationForPunchOutContextProps);

export const InvitationForPunchOutContextProvider: React.FC = ({ children }): JSX.Element => {
    const { auth } = useProcosysContext();
    const { plant } = useCurrentPlant();
    const invitationForPunchOutApiClient = useMemo(() => new InvitationForPunchOutApiClient(auth), [auth]);

    useEffect(() => {
        invitationForPunchOutApiClient.setCurrentPlant(plant.id);
    }, [plant]);

    return (
        <InvitationForPunchOutContext.Provider value={{
            apiClient: invitationForPunchOutApiClient
        }}>
            {children}
        </InvitationForPunchOutContext.Provider>
    );
};

InvitationForPunchOutContextProvider.propTypes = {
    children: propTypes.node.isRequired
};

export const useInvitationForPunchOutContext = (): InvitationForPunchOutContextProps => React.useContext<InvitationForPunchOutContextProps>(InvitationForPunchOutContext);
