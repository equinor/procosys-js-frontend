import TreeView, {
    TreeViewNode,
} from '../../../../../components/TreeView/TreeView';

import { Container } from './LibraryTreeview.style';
import { LibraryType } from '../Library';
import React, { createContext, useContext, useState } from 'react';
import { showSnackbarNotification } from '../../../../../core/services/NotificationService';
import { usePlantConfigContext } from '../../../context/PlantConfigContext';
import {
    unsavedChangesConfirmationMessage,
    useDirtyContext,
} from '@procosys/core/DirtyContext';
import { Journey } from '../PreservationJourney/types/Journey';

type LibraryTreeviewProps = {
    forceUpdate: React.DispatchWithoutAction;
    setSelectedLibraryType: (libraryType: string) => void;
    setSelectedLibraryItem: (libraryItem: string) => void;
    dirtyLibraryType: string;
    resetDirtyLibraryType: () => void;
    selectedLibraryItem: string;
};

const LibraryTreeview = (props: LibraryTreeviewProps): JSX.Element => {
    const { isDirty } = useDirtyContext();

    const { libraryApiClient, preservationApiClient } = usePlantConfigContext();

    const handleTreeviewClick = (
        libraryType: LibraryType,
        libraryItem: string
    ): void => {
        if (!libraryItem) {
            props.forceUpdate();
        }
        props.setSelectedLibraryType(libraryType);
        props.setSelectedLibraryItem(libraryItem);
    };

    const getModes = async (): Promise<TreeViewNode[]> => {
        const children: TreeViewNode[] = [];
        try {
            return await preservationApiClient
                .getModes(true)
                .then((response) => {
                    if (response) {
                        response.forEach((mode) =>
                            children.push({
                                id: 'mode_' + mode.id,
                                name: mode.title,
                                isVoided: mode.isVoided,
                                onClick: (): void =>
                                    handleTreeviewClick(
                                        LibraryType.MODE,
                                        mode.id.toString()
                                    ),
                            })
                        );
                    }
                    return children;
                });
        } catch (error) {
            console.error('Get modes failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
        }
        return children;
    };

    const getPresJourneyTreeNodes = async (): Promise<TreeViewNode[]> => {
        const children: TreeViewNode[] = [];
        try {
            const journeys = await preservationApiClient.getJourneys(true);
            const groupedJourneys = journeys.reduce(
                (acc: { [key: string]: Journey[] }, journey) => {
                    const projectDescription = journey?.project
                        ? `${journey.project.name} ${journey.project.description}`
                        : 'Journey available across projects';
                    if (!acc[projectDescription]) {
                        acc[projectDescription] = [];
                    }
                    acc[projectDescription].push(journey);
                    return acc;
                },
                {} as { [key: string]: Journey[] }
            );
            Object.keys(groupedJourneys).forEach((projectDescription) => {
                const projectNode: TreeViewNode = {
                    id: `project_${projectDescription}`,
                    name: projectDescription,
                    getChildren: async (): Promise<TreeViewNode[]> => {
                        return groupedJourneys[projectDescription].map(
                            (journey) => ({
                                id: `journey_${journey.id}`,
                                name: journey.title,
                                isVoided: journey.isVoided,
                                onClick: (): void =>
                                    handleTreeviewClick(
                                        LibraryType.PRES_JOURNEY,
                                        journey.id.toString()
                                    ),
                            })
                        );
                    },
                };
                children.push(projectNode);
            });
            return children;
        } catch (error) {
            console.error(
                'Get preservation journeys failed: ',
                error.message,
                error.data
            );
            showSnackbarNotification(error.message, 5000);
        }
        return children;
    };

    const getRequirementTreeNodes = async (): Promise<TreeViewNode[]> => {
        const children: TreeViewNode[] = [];
        try {
            const requirementTypes =
                await preservationApiClient.getRequirementTypes(true);
            requirementTypes.forEach((requirementType) => {
                children.push({
                    id: `rt_${requirementType.id}`,
                    name: requirementType.title,
                    isVoided: requirementType.isVoided,
                    onClick: (): void =>
                        handleTreeviewClick(
                            LibraryType.PRES_REQUIREMENT_TYPE,
                            requirementType.id.toString()
                        ),
                    getChildren: (): Promise<TreeViewNode[]> => {
                        const withInputNodes =
                            requirementType.requirementDefinitions
                                .filter((itm) => itm.needsUserInput)
                                .map((itm) => {
                                    return {
                                        id: `field_withinput_${itm.id}`,
                                        name: itm.title,
                                        isVoided: itm.isVoided,
                                        onClick: (): void =>
                                            handleTreeviewClick(
                                                LibraryType.PRES_REQUIREMENT_DEFINITION,
                                                itm.id.toString()
                                            ),
                                    };
                                });
                        const withoutInput =
                            requirementType.requirementDefinitions
                                .filter((itm) => !itm.needsUserInput)
                                .map((itm) => {
                                    return {
                                        id: `field_withoutinput_${itm.id}`,
                                        name: itm.title,
                                        isVoided: itm.isVoided,
                                        onClick: (): void =>
                                            handleTreeviewClick(
                                                LibraryType.PRES_REQUIREMENT_DEFINITION,
                                                itm.id.toString()
                                            ),
                                    };
                                });
                        const nodes: TreeViewNode[] = [];

                        if (withInputNodes.length) {
                            nodes.push({
                                id: `header_rt_${requirementType.id}_rd_withInput`,
                                name: 'Requirements with required user input',
                                getChildren: () =>
                                    Promise.resolve(withInputNodes),
                            });
                        }
                        if (withoutInput.length) {
                            nodes.push({
                                id: `header_rt_${requirementType.id}_rd_withoutInput`,
                                name: 'Mass update requirements',
                                getChildren: () =>
                                    Promise.resolve(withoutInput),
                            });
                        }
                        return Promise.resolve(nodes);
                    },
                });
            });
        } catch (error) {
            console.error(
                'Failed to fetch treenodes for requirements: ',
                error.message,
                error.data
            );
            showSnackbarNotification(error.message, 5000);
        }
        return children;
    };

    const getTagFunctionNodes = async (
        registerCode: string
    ): Promise<TreeViewNode[]> => {
        const children: TreeViewNode[] = [];

        try {
            const tagFunctions =
                await libraryApiClient.getTagFunctions(registerCode);
            tagFunctions.map((tf) => {
                children.push({
                    id: `?registerCode=${registerCode}&tagFunctionCode=${tf.code}`,
                    name: `${tf.code}, ${tf.description}`,
                    // TODO: isVoided (need data from API)
                    onClick: (): void =>
                        handleTreeviewClick(
                            LibraryType.TAG_FUNCTION,
                            `${registerCode}|${tf.code}`
                        ),
                });
            });
        } catch (error) {
            console.error(
                'Failed to process tag function nodes',
                error.message,
                error.data
            );
            showSnackbarNotification('Failed to process tag function nodes');
        }

        return children;
    };

    const getRegisterNodes = async (): Promise<TreeViewNode[]> => {
        const children: TreeViewNode[] = [];

        try {
            const registers = await libraryApiClient.getRegisters();
            registers.map((reg) => {
                children.push({
                    id: `tf_register_${reg.code}`,
                    name: `${reg.code}, ${reg.description}`,
                    // TODO: isVoided (need data from API)
                    getChildren: () => getTagFunctionNodes(reg.code),
                });
            });
        } catch (error) {
            console.error(
                'Failed to process register nodes',
                error.message,
                error.data
            );
            showSnackbarNotification('Failed to process register nodes');
        }
        return children;
    };

    const rootNodes: TreeViewNode[] = [
        {
            id: LibraryType.TAG_FUNCTION,
            name: 'Tag functions',
            getChildren: getRegisterNodes,
        },
        {
            id: LibraryType.MODE,
            name: 'Modes',
            getChildren: getModes,
            onClick: (): void => {
                handleTreeviewClick(LibraryType.MODE, '');
            },
        },
        {
            id: LibraryType.PRES_JOURNEY,
            name: 'Preservation journeys',
            getChildren: getPresJourneyTreeNodes,
            onClick: (): void => {
                handleTreeviewClick(LibraryType.PRES_JOURNEY, '');
            },
        },
        {
            id: LibraryType.PRES_REQUIREMENT,
            name: 'Preservation requirements',
            getChildren: getRequirementTreeNodes,
            onClick: (): void => {
                handleTreeviewClick(LibraryType.PRES_REQUIREMENT, '');
            },
        },
    ];

    return (
        <Container>
            <TreeView
                rootNodes={rootNodes}
                selectedLibraryItem={props.selectedLibraryItem}
                dirtyNodeId={props.dirtyLibraryType}
                resetDirtyNode={props.resetDirtyLibraryType}
                hasUnsavedChanges={isDirty}
                unsavedChangesConfirmationMessage={
                    unsavedChangesConfirmationMessage
                }
            />
        </Container>
    );
};

export default LibraryTreeview;

interface LibraryContextType {
    newJourney: Journey;
    setNewJourney: (journey: Journey) => void;
    saveTriggered: boolean;
    setSaveTriggered: (value: boolean) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [newJourney, setNewJourney] = useState<Journey>({
        id: -1,
        title: '',
        isVoided: false,
        isInUse: false,
        steps: [],
        rowVersion: '',
    });

    const [saveTriggered, setSaveTriggered] = useState(false);

    return (
        <LibraryContext.Provider
            value={{
                newJourney,
                setNewJourney,
                saveTriggered,
                setSaveTriggered,
            }}
        >
            {children}
        </LibraryContext.Provider>
    );
};

export const useLibraryContext = (): LibraryContextType => {
    const context = useContext(LibraryContext);
    if (!context) {
        throw new Error(
            'useLibraryContext must be used within a LibraryProvider'
        );
    }
    return context;
};
