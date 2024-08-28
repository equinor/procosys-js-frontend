import React, { useEffect, useMemo, useState } from 'react';
import propTypes from 'prop-types';
import InvitationForPunchOutApiClient from '../http/InvitationForPunchOutApiClient';
import { useCurrentPlant } from '../../../core/PlantContext';
import { useProcosysContext } from '../../../core/ProcosysContext';
import { ProjectDetails } from '../types';
import { Canceler } from '@procosys/http/HttpClient';
import Loading from '@procosys/components/Loading';
import invitationForPunchOutCache from '../cache/InvitationForPunchOutCache';

type InvitationForPunchOutContextProps = {
    apiClient: InvitationForPunchOutApiClient;
    project: ProjectDetails;
    setCurrentProject: (projectId: number) => void;
    availableProjects: ProjectDetails[];
};

const InvitationForPunchOutContext =
    React.createContext<InvitationForPunchOutContextProps>(
        {} as InvitationForPunchOutContextProps
    );

class InvalidProjectException extends Error {
    constructor() {
        super('Invalid project selection');
        this.name = 'InvalidProject';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export const InvitationForPunchOutContextProvider: React.FC = ({
    children,
}): JSX.Element => {
    const { procosysApiClient, auth } = useProcosysContext();
    const { plant } = useCurrentPlant();
    const invitationForPunchOutApiClient = useMemo(
        () => new InvitationForPunchOutApiClient(auth),
        [auth]
    );
    const [availableProjects, setAvailableProjects] = useState<
        ProjectDetails[] | null
    >(null);

    const [currentProject, setCurrentProjectInContext] =
        useState<ProjectDetails>();

    const setCurrentProject = (projectId: number): void => {
        if (!availableProjects || !projectId) {
            return;
        }

        if (availableProjects.length === 0) {
            setCurrentProjectInContext({
                id: -10,
                name: 'No projects available',
                description: 'No projects available',
            });
            return;
        }

        if (projectId === -1) {
            setCurrentProjectInContext({
                id: -1,
                name: 'All projects',
                description: 'All projects in plant ',
            });
        }

        const project = availableProjects.find((el) => el.id === projectId);
        if (project) {
            setCurrentProjectInContext(project);
        } else if (projectId !== -1) {
            throw new InvalidProjectException();
        }
    };

    let requestCanceler: Canceler;

    useEffect(() => {
        (async (): Promise<void> => {
            const allProjects = await procosysApiClient
                .getAllProjectsForUserAsync(
                    (cancelerCallback) => (requestCanceler = cancelerCallback)
                )
                .then((projects) =>
                    projects.map((project): ProjectDetails => {
                        return {
                            id: project.id,
                            name: project.name,
                            description: project.description,
                        };
                    })
                );
            setAvailableProjects(allProjects);
        })();
        return (): void => requestCanceler && requestCanceler();
    }, []);

    useMemo(() => {
        invitationForPunchOutApiClient.setCurrentPlant(plant.id);
    }, [plant]);

    useEffect(() => {
        const defaultProject = invitationForPunchOutCache.getDefaultProject();
        try {
            if (defaultProject) {
                setCurrentProject(defaultProject.id);
                return;
            }
            throw new InvalidProjectException();
        } catch (error) {
            if (
                error instanceof InvalidProjectException &&
                availableProjects &&
                availableProjects.length > 0
            ) {
                setCurrentProject(-1);
            }
        }
    }, [availableProjects]);

    useEffect(() => {
        if (!currentProject) return;
        invitationForPunchOutCache.setDefaultProject(currentProject);
    }, [currentProject]);

    if (!currentProject || !availableProjects) {
        return <Loading title="Loading project information" />;
    }

    return (
        <InvitationForPunchOutContext.Provider
            value={{
                apiClient: invitationForPunchOutApiClient,
                project: currentProject,
                setCurrentProject,
                availableProjects,
            }}
        >
            {children}
        </InvitationForPunchOutContext.Provider>
    );
};

InvitationForPunchOutContextProvider.propTypes = {
    children: propTypes.node.isRequired,
};

export const useInvitationForPunchOutContext =
    (): InvitationForPunchOutContextProps =>
        React.useContext<InvitationForPunchOutContextProps>(
            InvitationForPunchOutContext
        );
