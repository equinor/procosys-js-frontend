import React, { useMemo, useEffect, useState } from 'react';
import LibraryApiClient from '@procosys/modules/PlantConfig/http/LibraryApiClient';
import propTypes from 'prop-types';
import { useCurrentPlant } from '../../../core/PlantContext';
import { useProcosysContext } from '../../../core/ProcosysContext';
import { Canceler } from '../../../http/HttpClient';
import { ProjectDetails } from '@procosys/modules/CallForPunchOut/types';

type CallForPunchOutContextProps = {
    libraryApiClient: LibraryApiClient;
    availableProjects: ProjectDetails[];
}

const CallForPunchOutContext = React.createContext<CallForPunchOutContextProps>({} as CallForPunchOutContextProps);

export const CallForPunchOutContextProvider: React.FC = ({ children }): JSX.Element => {

    const {procosysApiClient, auth} = useProcosysContext();
    const { plant } = useCurrentPlant();
    const libraryApiClient = useMemo(() => new LibraryApiClient(auth), [auth]);
    const [availableProjects, setAvailableProjects] = useState<ProjectDetails[]>([]);

    useMemo(() => {
        libraryApiClient.setCurrentPlant(plant.id);
    }, [plant]);
    
    let requestCanceler: Canceler;

    useEffect(() => {
        (async (): Promise<void> => {
            const allProjects = await procosysApiClient.getAllProjectsForUserAsync((cancelerCallback) => requestCanceler = cancelerCallback)
                .then(projects => projects.map((project): ProjectDetails => {
                    return {
                        id: project.id,
                        name: project.name,
                        description: project.description
                    };
                }));
            setAvailableProjects(allProjects);
        })();
        return (): void => requestCanceler && requestCanceler();
    },[]);

    return (
        <CallForPunchOutContext.Provider value={{
            libraryApiClient: libraryApiClient,
            availableProjects: availableProjects
        }}>
            {children}
        </CallForPunchOutContext.Provider>
    );
};

CallForPunchOutContextProvider.propTypes = {
    children: propTypes.node.isRequired
};

export const useCallForPunchOutContext = (): CallForPunchOutContextProps => React.useContext<CallForPunchOutContextProps>(CallForPunchOutContext);
