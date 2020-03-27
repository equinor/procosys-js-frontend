import React from 'react';
import { LibraryType } from '../Library';
import TreeView, { TreeViewNode } from '../../../../../components/TreeView';
import { usePlantConfigContext } from '../../../context/PlantConfigContext';
import { showSnackbarNotification } from '../../../../../core/services/NotificationService';
import { Container } from './LibraryTreeview.style';

type LibraryTreeviewProps = {
    setSelectedLibraryType: (libraryType: string) => void;
    setSelectedLibraryItem: (libraryItem: string) => void;
};

const LibraryTreeview = (props: LibraryTreeviewProps): JSX.Element => {

    interface Mode {
        id: number;
        title: string;
    }

    const {
        libraryApiClient
    } = usePlantConfigContext();


    const handleTreeviewClick = (libraryType: LibraryType, libraryItem: string): void => {
        props.setSelectedLibraryType(libraryType);
        props.setSelectedLibraryItem(libraryItem);
    };

    const getModes = async (): Promise<TreeViewNode[]> => {
        const children: TreeViewNode[] = [];
        try {
            return await libraryApiClient.getModes().then(
                (response) => {
                    if (response) {
                        response.forEach(mode => children.push(
                            {
                                id: mode.id,
                                name: mode.title,
                                onClick: (): void => handleTreeviewClick(LibraryType.MODE, mode.id.toString())
                            }));
                    }
                    return children;
                }
            );
        } catch (error) {
            console.error('Get modes failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message, 5000);
        }
        return children;
    };

    const getPresJourneys = async (): Promise<TreeViewNode[]> => {
        const children: TreeViewNode[] = [];
        try {
            return await libraryApiClient.getPresJourneys().then(
                (response) => {
                    if (response) {
                        response.forEach(journey => children.push(
                            {
                                id: journey.id,
                                name: journey.title,
                                onClick: (): void => handleTreeviewClick(LibraryType.PRES_JOURNEY, journey.id.toString())
                            }));
                    }
                    return children;
                }
            );
        } catch (error) {
            console.error('Get preservation journeys failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message, 5000);
        }
        return children;
    };

    const rootNodes: TreeViewNode[] = [
        {
            id: LibraryType.TAG_FUNCTION,
            name: 'Tag Functions',
        },
        {
            id: LibraryType.MODE,
            name: 'Modes',
            getChildren: getModes
        },
        {
            id: LibraryType.PRES_JOURNEY,
            name: 'Preservation Journeys',
            getChildren: getPresJourneys
        },
        {
            id: LibraryType.PRES_REQUIREMENT_TYPE,
            name: 'Pres. Requirement types',
        },
        {
            id: LibraryType.PRES_REQUIREMENT_DEFINITION,
            name: 'Pres. Requirement definitions',
        }
    ];

    return (

        <Container>
            <TreeView rootNodes={rootNodes}></TreeView>
        </Container>
    );
};

export default LibraryTreeview;
