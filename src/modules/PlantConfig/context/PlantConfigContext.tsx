import React, { useEffect, useMemo, useState } from 'react';
import LibraryApiClient from '../http/LibraryApiClient';
import propTypes from 'prop-types';
import { useCurrentPlant } from '../../../core/PlantContext';
import { useProcosysContext } from '../../../core/ProcosysContext';
import PreservationApiClient from '@procosys/modules/Preservation/http/PreservationApiClient';
import { ProjectDetails } from '@procosys/modules/Preservation/types';

type PlantConfigContextProps = {
    libraryApiClient: LibraryApiClient;
    preservationApiClient: PreservationApiClient;
    projects?: ProjectDetails[];
};

const PlantConfigContext = React.createContext<PlantConfigContextProps>(
    {} as PlantConfigContextProps
);

export const PlantConfigContextProvider: React.FC = ({
    children,
}): JSX.Element => {
    const { auth, procosysApiClient } = useProcosysContext();
    const { plant } = useCurrentPlant();
    const libraryApiClient = useMemo(() => new LibraryApiClient(auth), [auth]);
    const [projects, setProjects] = useState<ProjectDetails[] | undefined>(
        undefined
    );
    const preservationApiClient = useMemo(
        () => new PreservationApiClient(auth),
        [auth]
    );

    useMemo(() => {
        const fetchProjects = async () => {
            const projects =
                await procosysApiClient.getAllProjectsForUserAsync();
            setProjects(projects);
        };
        fetchProjects();
        console.log('fetchProjects', projects);
    }, [plant]);

    useMemo(() => {
        libraryApiClient.setCurrentPlant(plant.id);
        preservationApiClient.setCurrentPlant(plant.id);
    }, [plant]);

    return (
        <PlantConfigContext.Provider
            value={{
                libraryApiClient: libraryApiClient,
                preservationApiClient: preservationApiClient,
                projects: projects,
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
