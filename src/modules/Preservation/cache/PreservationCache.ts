import CacheService from '../../../core/CacheService';
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
    return localStorageCache.getCache(storageKeys.PROJECT)?.data;
};

export default {
    setDefaultProject,
    getDefaultProject
};
