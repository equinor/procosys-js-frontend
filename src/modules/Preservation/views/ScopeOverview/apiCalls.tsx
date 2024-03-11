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

interface TransferParams {
    apiClient: {
        transfer: (tags: { id: number; rowVersion: string }[]) => Promise<void>;
    };
    transferableTags: PreservedTag[];
    refreshScopeList: () => void;
    refreshFilterValues: () => void;
    showSnackbarNotification: (message: string, duration?: number) => void;
}

interface StartPreservationParams {
    apiClient: {
        startPreservation: (tagIds: number[]) => Promise<void>;
    };
    startableTags: PreservedTag[];
    refreshScopeList: () => void;
    refreshFilterValues: () => void;
    showSnackbarNotification: (message: string, duration?: number) => void;
}

interface PreserveParams {
    apiClient: {
        preserve: (tagIds: number[]) => Promise<void>;
    };
    preservableTags: PreservedTag[];
    refreshScopeList: (refreshOnResize?: boolean) => void;
    showSnackbarNotification: (message: string, duration?: number) => void;
}

interface CompleteParams {
    apiClient: {
        complete: (tags: { id: number; rowVersion: string }[]) => Promise<void>;
    };
    selectedTags: PreservedTag[];
    refreshScopeList: (refreshOnResize?: boolean) => void;
    refreshFilterValues: () => void;
    showSnackbarNotification: (message: string, duration?: number) => void;
}
interface RemoveParams {
    apiClient: {
        remove: (tags: { id: number; rowVersion: string }[]) => Promise<void>;
    };
    removableTags: PreservedTag[];
    refreshScopeList: (refreshOnResize?: boolean) => void;
    refreshFilterValues: () => void;
    showSnackbarNotification: (message: string, duration?: number) => void;
}

interface UnvoidTagsParams {
    apiClient: {
        unvoidTag: (tagId: number, rowVersion: string) => Promise<void>;
    };
    unvoidableTags: PreservedTag[];
    refreshScopeList: (refreshOnResize?: boolean) => void;
    showSnackbarNotification: (message: string, duration?: number) => void;
}
interface UnStartPreservationParams {
    apiClient: {
        undoStartPreservation: (
            unstartableTags: PreservedTag[]
        ) => Promise<void>;
    };
    unstartableTags: PreservedTag[];
    refreshScopeList: (refreshOnResize?: boolean) => void;
    refreshFilterValues: () => void;
    showSnackbarNotification: (message: string, duration?: number) => void;
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

export const transfer = async ({
    apiClient,
    transferableTags,
    refreshScopeList,
    refreshFilterValues,
    showSnackbarNotification,
}: TransferParams): Promise<void> => {
    try {
        await apiClient.transfer(
            transferableTags.map((t) => ({
                id: t.id,
                rowVersion: t.rowVersion,
            }))
        );
        refreshScopeList();
        refreshFilterValues();
        showSnackbarNotification(
            `${transferableTags.length} tag(s) have been successfully transferred.`
        );
    } catch (error) {
        console.error('Transfer failed: ', error.message, error.data);
        showSnackbarNotification(error.message);
    }
    return Promise.resolve();
};
interface VoidTagsParams {
    apiClient: {
        voidTag: (tagId: number, rowVersion: string) => Promise<void>;
    };
    voidableTags: PreservedTag[];
    refreshScopeList: (refreshOnResize?: boolean) => void;
    showSnackbarNotification: (message: string, duration?: number) => void;
}

export const startPreservation = async ({
    apiClient,
    startableTags,
    refreshScopeList,
    refreshFilterValues,
    showSnackbarNotification,
}: StartPreservationParams): Promise<void> => {
    try {
        await apiClient.startPreservation(startableTags.map((t) => t.id));
        refreshScopeList();
        refreshFilterValues();
        showSnackbarNotification(
            "Status was set to 'Active' for selected tag(s)."
        );
    } catch (error) {
        console.error('Start preservation failed: ', error.message, error.data);
        showSnackbarNotification(error.message);
    }
    return Promise.resolve();
};

export const preservedThisWeek = async ({
    apiClient,
    preservableTags,
    refreshScopeList,
    showSnackbarNotification,
}: PreserveParams): Promise<void> => {
    try {
        await apiClient.preserve(preservableTags.map((t) => t.id));
        refreshScopeList();
        showSnackbarNotification(
            'Selected tag(s) have been preserved for this week.'
        );
    } catch (error) {
        console.error('Preserve failed: ', error.message, error.data);
        showSnackbarNotification(error.message);
    }
    return Promise.resolve();
};

export const complete = async ({
    apiClient,
    selectedTags,
    refreshScopeList,
    refreshFilterValues,
    showSnackbarNotification,
}: CompleteParams): Promise<void> => {
    try {
        const tags = selectedTags.filter((tag) => tag.readyToBeCompleted);
        await apiClient.complete(
            tags.map((t) => ({
                id: t.id,
                rowVersion: t.rowVersion,
            }))
        );
        refreshScopeList();
        refreshFilterValues();
        showSnackbarNotification('Selected tag(s) have been completed.');
    } catch (error) {
        console.error('Complete failed: ', error.message, error.data);
        showSnackbarNotification(error.message);
    }
    return Promise.resolve();
};

export const remove = async ({
    apiClient,
    removableTags,
    refreshScopeList,
    refreshFilterValues,
    showSnackbarNotification,
}: RemoveParams): Promise<void> => {
    try {
        await apiClient.remove(
            removableTags.map((t) => ({
                id: t.id,
                rowVersion: t.rowVersion,
            }))
        );
        refreshScopeList();
        refreshFilterValues();
        showSnackbarNotification('Selected tag(s) have been removed.');
    } catch (error) {
        console.error('Remove failed: ', error.message, error.data);
        showSnackbarNotification(error.message);
    }
};

export const voidTags = async ({
    apiClient,
    voidableTags,
    refreshScopeList,
    showSnackbarNotification,
}: VoidTagsParams): Promise<void> => {
    try {
        for (const tag of voidableTags) {
            await apiClient.voidTag(tag.id, tag.rowVersion);
        }
        refreshScopeList();
        showSnackbarNotification('Selected tag(s) have been voided.');
    } catch (error) {
        console.error('Voiding failed: ', error.message, error.data);
        showSnackbarNotification(error.message);
    }
    return Promise.resolve();
};

export const unVoidTags = async ({
    apiClient,
    unvoidableTags,
    refreshScopeList,
    showSnackbarNotification,
}: UnvoidTagsParams): Promise<void> => {
    try {
        for (const tag of unvoidableTags) {
            await apiClient.unvoidTag(tag.id, tag.rowVersion);
        }
        refreshScopeList();
        showSnackbarNotification('Selected tag(s) have been unvoided.');
    } catch (error) {
        console.error('Unvoid failed: ', error.message, error.data);
        showSnackbarNotification(error.message);
    }
    return Promise.resolve();
};

export const unStartPreservation = async ({
    apiClient,
    unstartableTags,
    refreshScopeList,
    refreshFilterValues,
    showSnackbarNotification,
}: UnStartPreservationParams): Promise<void> => {
    try {
        await apiClient.undoStartPreservation(unstartableTags);
        refreshScopeList();
        refreshFilterValues();
        showSnackbarNotification(
            "Status was set to 'Not started' for selected tag(s)."
        );
    } catch (error) {
        console.error(
            'Undo start preservation failed: ',
            error.message,
            error.data
        );
        showSnackbarNotification(error.message);
    }
    return Promise.resolve();
};
