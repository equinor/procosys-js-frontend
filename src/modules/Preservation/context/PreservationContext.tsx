import React, {useEffect, useState} from 'react';

import { Canceler } from '../../../http/HttpClient';
import Loading from '../../../components/Loading';
import PreservationApiClient from '../http/PreservationApiClient';
import { ProjectDetails } from '../types';
import preservationCache from '../cache/PreservationCache';
import propTypes from 'prop-types';
import { useProcosysContext } from '../../../core/ProcosysContext';

const PreservationContext = React.createContext<PreservationContextProps>({} as PreservationContextProps);
type PreservationContextProps = {
    project: ProjectDetails;
    setCurrentProject: (projectId: number) => void;
    apiClient: PreservationApiClient | null;
    availableProjects: ProjectDetails[];
}

class InvalidProjectException extends Error {
    constructor() {
        super('Invalid project selection');
        this.name = 'InvalidProject';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export const PreservationContextProvider: React.FC = ({children}): JSX.Element => {

    const {procosysApiClient} = useProcosysContext();

    const [availableProjects, setAvailableProjects] = useState<ProjectDetails[]>([]);

    const [currentProject, setCurrentProjectInContext] = useState<ProjectDetails>();

    const setCurrentProject = (projectId: number): void => {
        console.log('Settings current project: ', projectId);
        if (!availableProjects) {
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
                        description: project.description
                    };
                }));
            setAvailableProjects(allProjects);
        })();
        return (): void => requestCanceler && requestCanceler();
    },[]);

    useEffect(() => {
        const defaultProject = preservationCache.getDefaultProject();
        try {
            if (defaultProject) {
                setCurrentProject(defaultProject.id);
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

    },[currentProject]);

    if (!currentProject) {
        return (<Loading title="Loading project information" />);
    }

    return (
        <PreservationContext.Provider value={{
            project: currentProject, setCurrentProject, apiClient: null, availableProjects
        }}>
            {children}
        </PreservationContext.Provider>
    );
};

PreservationContextProvider.propTypes = {
    children: propTypes.node.isRequired
};

export const usePreservationContext = (): PreservationContextProps => React.useContext<PreservationContextProps>(PreservationContext);
