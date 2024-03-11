import { SavedTagListFilter, TagListFilter } from './types';

import {
    moduleAreaHeight,
    moduleHeaderHeight,
    refreshScopeListCallback,
} from './useRefHooksAndStates';

interface RefreshScopeListParams {
    refreshScopeListCallback: React.MutableRefObject<
        ((height: number, refreshOnResize?: boolean) => void) | undefined
    >;
    moduleAreaHeight: number;
    moduleHeaderHeight: number;
}
interface RefreshFilterValuesParams {
    triggerFilterValuesRefresh: number;
    setTriggerFilterValuesRefresh: React.Dispatch<React.SetStateAction<number>>;
}

export const getDefaultFilter = (
    savedTagListFilters: SavedTagListFilter[] | null,
    analytics: { trackException: (error: any) => void }
): TagListFilter | null => {
    if (savedTagListFilters) {
        const defaultFilter = savedTagListFilters.find(
            (filter) => filter.defaultFilter
        );
        if (defaultFilter) {
            try {
                return JSON.parse(defaultFilter.criteria);
            } catch (error) {
                console.error('Failed to parse default filter');
                analytics.trackException(error);
            }
        }
    }
    return null;
};

export const refreshScopeList = (
    {
        refreshScopeListCallback,
        moduleAreaHeight,
        moduleHeaderHeight,
    }: RefreshScopeListParams,
    refreshOnResize?: boolean
): void => {
    refreshScopeListCallback.current &&
        refreshScopeListCallback.current(
            moduleAreaHeight - moduleHeaderHeight - 115,
            refreshOnResize
        );
};

export type ProjectDetails = {
    id: number;
    name: string;
    description: string;
};

interface ChangeProjectParams {
    event: React.MouseEvent;
    index: number;
    filteredProjects: ProjectDetails[];
    setCurrentProject: (projectId: number) => void;
    setResetTablePaging: (resetPaging: boolean) => void;
    deleteCachedFilter: (projectId: number) => void;
    tagListFilter: TagListFilter;
    setTagListFilter: (filter: TagListFilter) => void;
    refreshScopeList: (params: {
        refreshScopeListCallback: React.MutableRefObject<
            ((height: number, refreshOnResize?: boolean) => void) | undefined
        >;
        moduleAreaHeight: number;
        moduleHeaderHeight: number;
    }) => void;
    numberOfFilters: (filter: TagListFilter) => number;
    displayFilter: boolean;
    project: { id: number }; // Assuming project has an id of type number
    emptyTagListFilter: TagListFilter;
}

export const changeProject = ({
    event,
    index,
    filteredProjects,
    setCurrentProject,
    setResetTablePaging,
    deleteCachedFilter,
    tagListFilter,
    setTagListFilter,
    refreshScopeList,
    numberOfFilters,
    displayFilter,
    project,
    emptyTagListFilter,
}: ChangeProjectParams): void => {
    event.preventDefault();

    setCurrentProject(filteredProjects[index].id);
    setResetTablePaging(true);
    deleteCachedFilter(project.id);

    if (numberOfFilters(tagListFilter) > 0) {
        // Reset filters on project change:
        // When the filter is hidden, we reset the selected filters here, which further triggers a refresh of the scope list.
        // When the filter is displayed, the filter reset and scope list refresh is handled by the filter component.

        if (!displayFilter) {
            setTagListFilter({ ...emptyTagListFilter });
        }
    } else {
        // No filters, regular scope list refresh.
        refreshScopeList({
            refreshScopeListCallback,
            moduleAreaHeight,
            moduleHeaderHeight,
        });
    }
};

export const refreshFilterValues = ({
    triggerFilterValuesRefresh,
    setTriggerFilterValuesRefresh,
}: RefreshFilterValuesParams): void => {
    setTriggerFilterValuesRefresh(triggerFilterValuesRefresh + 1);
};
