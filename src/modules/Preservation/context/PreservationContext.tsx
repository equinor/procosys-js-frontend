import React, { useEffect, useMemo, useState } from 'react';

import { Canceler } from '../../../http/HttpClient';
import Loading from '../../../components/Loading';
import PreservationApiClient from '../http/PreservationApiClient';
import { ProjectDetails } from '../types';
import preservationCache from '../cache/PreservationCache';
import propTypes from 'prop-types';
import { useCurrentPlant } from '../../../core/PlantContext';
import { useProcosysContext } from '../../../core/ProcosysContext';
import LibraryApiClient from '@procosys/modules/PlantConfig/http/LibraryApiClient';

const PreservationContext = React.createContext<PreservationContextProps>({} as PreservationContextProps);
type PreservationContextProps = {
    project: ProjectDetails;
    setCurrentProject: (projectName: string) => void;
    apiClient: PreservationApiClient;
    libraryApiClient: LibraryApiClient;
    availableProjects: ProjectDetails[];
}

class InvalidProjectException extends Error {
    constructor() {
        super('Invalid project selection');
        this.name = 'InvalidProject';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export const PreservationContextProvider: React.FC = ({ children }): JSX.Element => {

    const { procosysApiClient, auth } = useProcosysContext();
    const { plant } = useCurrentPlant();
    const preservationApiClient = useMemo(() => new PreservationApiClient(auth), [auth]);
    const libraryApiClient = useMemo(() => new LibraryApiClient(auth), [auth]);

    const [availableProjects, setAvailableProjects] = useState<ProjectDetails[]>([]);
    const [currentProject, setCurrentProjectInContext] = useState<ProjectDetails>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const setCurrentProject = async (projectName: string): Promise<void> => {
        if (!availableProjects || !projectName) {
            return;
        }
        setIsLoading(true);
        try {
            const project = await preservationApiClient.getProject(projectName, (cancelerCallback) => requestCanceler = cancelerCallback);
            if (project) {
                setCurrentProjectInContext(project);
            } else {
                throw new InvalidProjectException();
            }
        } catch (error) {
            throw new InvalidProjectException();
        }
        setIsLoading(false);
    };

    let requestCanceler: Canceler;

    useEffect(() => {
        (async (): Promise<void> => {
            const allProjects = await procosysApiClient.getAllProjectsForUserAsync((cancelerCallback) => requestCanceler = cancelerCallback)
                .then(projects => projects.map((project): ProjectDetails => {
                    return {
                        id: project.id,
                        name: project.name,
                        description: project.description,
                        isClosed: null
                    };
                }));
            setAvailableProjects(allProjects);
        })();
        return (): void => requestCanceler && requestCanceler();
    }, []);

    useEffect(() => {
        preservationApiClient.setCurrentPlant(plant.id);
        libraryApiClient.setCurrentPlant(plant.id);
    }, [plant]);

    useEffect(() => {
        const defaultProject = preservationCache.getDefaultProject();
        try {
            if (defaultProject) {
                setCurrentProject(defaultProject.name);
                return;
            }
            throw new InvalidProjectException();
        } catch (error) {
            if (error instanceof InvalidProjectException && availableProjects.length > 0) {
                setCurrentProject(availableProjects[0].name);
            }
        }

    }, [availableProjects]);

    useEffect(() => {
        if (!currentProject) return;
        preservationCache.setDefaultProject(currentProject);

    }, [currentProject]);

    if (isLoading) {
        return (<Loading title="Loading project information" />);
    }

    if (currentProject) {
        return (
            <PreservationContext.Provider value={{
                project: currentProject,
                libraryApiClient: libraryApiClient,
                setCurrentProject,
                apiClient: preservationApiClient,
                availableProjects,
            }}>
                {children}
            </PreservationContext.Provider>
        );
    };

    return (<></>);

};

PreservationContextProvider.propTypes = {
    children: propTypes.node.isRequired
};

export const usePreservationContext = (): PreservationContextProps => React.useContext<PreservationContextProps>(PreservationContext);
