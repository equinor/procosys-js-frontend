import { PreservedTag, SavedTagListFilter } from './types';

interface UpdateSavedTagListFiltersProps {
    setIsLoading: (isLoading: boolean) => void;
    setSavedTagListFilters: (filters: SavedTagListFilter[] | null) => void;
    project: { name: string };
    apiClient: {
        getSavedTagListFilters: (
            projectName: string
        ) => Promise<SavedTagListFilter[]>;
    };
    showSnackbarNotification: (message: string, duration: number) => void;
}

export const updateSavedTagListFilters = async ({
    setIsLoading,
    setSavedTagListFilters,
    project,
    apiClient,
    showSnackbarNotification,
}: UpdateSavedTagListFiltersProps): Promise<void> => {
    setIsLoading(true);
    try {
        const response = await apiClient.getSavedTagListFilters(project.name);
        setSavedTagListFilters(response);
        setIsLoading(false);
    } catch (error) {
        console.error('Get saved filters failed: ', error.message, error.data);
        showSnackbarNotification(error.message, 5000);
        setIsLoading(false);
    }
};
