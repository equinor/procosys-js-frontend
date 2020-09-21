import CacheService from '../../../core/services/CacheService';
import { ProjectDetails } from '../types';

enum storageKeys {
    PRESERVATION = 'PRESERVATION',
    PROJECT = 'PROJECT'
}

const localStorageCache = new CacheService(storageKeys.PRESERVATION, localStorage);

const setDefaultProject = (project: ProjectDetails): void => {
    localStorageCache.setCache(storageKeys.PROJECT, project);
};

const getDefaultProject = (): ProjectDetails | null => {
    const cache = localStorageCache.getCache(storageKeys.PROJECT);
    return cache && cache.data || null;
};

export default {
    setDefaultProject,
    getDefaultProject
};
