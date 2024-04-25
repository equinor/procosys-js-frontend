import { PreservedTag, Requirement, TagListFilter } from './types';
import CacheService from '@procosys/core/services/CacheService';
import { showSnackbarNotification } from '../../../../core/services/NotificationService';

const ScopeOverviewCache = new CacheService('ScopeOverview');

export const getFirstUpcomingRequirement = (
    tag: PreservedTag
): Requirement | null => {
    if (!tag.requirements || tag.requirements.length === 0) {
        return null;
    }
    return tag.requirements[0];
};

export const isTagOverdue = (tag: PreservedTag): boolean => {
    const requirement = getFirstUpcomingRequirement(tag);
    return requirement ? requirement.nextDueWeeks < 0 : false;
};

export const isTagVoided = (tag: PreservedTag): boolean => {
    return tag.isVoided;
};

export function getCachedFilter(projectId: number): TagListFilter | null {
    try {
        const cacheItem = ScopeOverviewCache.getCache(projectId + '-filter');
        if (cacheItem) {
            return cacheItem.data;
        }
    } catch (error) {
        showSnackbarNotification(
            'An error occurred retrieving default filter values'
        );
        console.error('Error while retrieving cached filter values: ', error);
    }
    return null;
}

export function setCachedFilter(
    projectId: number,
    filter: TagListFilter
): void {
    try {
        ScopeOverviewCache.setCache(projectId + '-filter', filter);
    } catch (error) {
        showSnackbarNotification(
            'An error occurred when saving default filter values'
        );
        console.error('Error while caching filter values: ', error);
    }
}

export function deleteCachedFilter(projectId: number): void {
    ScopeOverviewCache.delete(projectId + '-filter');
}
