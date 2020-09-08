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
    setCurrentProject: (projectId: number) => void;
    apiClient: PreservationApiClient;
    libraryApiClient: LibraryApiClient;
    availableProjects: ProjectDetails[];
    fixedPONumber: string;
    setFixedPONumber: (pono: string) => void;
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
    const [fixedPONumber, setFixedPONumber] = useState<string>('');

    const [currentProject, setCurrentProjectInContext] = useState<ProjectDetails>();

    const setCurrentProject = (projectId: number): void => {
        if (!availableProjects || !projectId) {
            return;
        }

        const project = availableProjects.find(el => el.id === projectId);
        if (project) {
            setCurrentProjectInContext(project);
            return;
        }
        throw new InvalidProjectException();
    };

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
    }, []);

    useEffect(() => {
        preservationApiClient.setCurrentPlant(plant.id);
        libraryApiClient.setCurrentPlant(plant.id);
    }, [plant]);

    useEffect(() => {
        const defaultProject = preservationCache.getDefaultProject();
        try {
            if (defaultProject) {
                setCurrentProject(defaultProject.id);
                return;
            }
            throw new InvalidProjectException();
        } catch (error) {
            if (error instanceof InvalidProjectException && availableProjects.length > 0) {
                setCurrentProject(availableProjects[0].id);
            }
        }

    }, [availableProjects]);

    useEffect(() => {
        if (!currentProject) return;
        preservationCache.setDefaultProject(currentProject);

    }, [currentProject]);

    if (!currentProject) {
        return (<Loading title="Loading project information" />);
    }

    return (
        <PreservationContext.Provider value={{
            project: currentProject,
            libraryApiClient: libraryApiClient,
            setCurrentProject,
            apiClient: preservationApiClient,
            availableProjects,
            fixedPONumber,
            setFixedPONumber
        }}>
            {children}
        </PreservationContext.Provider>
    );
};

PreservationContextProvider.propTypes = {
    children: propTypes.node.isRequired
};

export const usePreservationContext = (): PreservationContextProps => React.useContext<PreservationContextProps>(PreservationContext);
