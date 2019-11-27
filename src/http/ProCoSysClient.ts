import ApiClient from './ApiClient';
import { AxiosRequestConfig } from 'axios';
import PascalCaseConverter from '../util/PascalCaseConverter';
import { RequestCanceler } from './HttpClient';
const Settings = require('../../settings.json');

export type PlantResponse = {
    id: string;
    title: string;
}

/**
 * API for interacting with data in ProCoSys.
 */
class ProCoSysClient extends ApiClient {

    constructor() {
        super(Settings.externalResources.procosysApi.scopes.join(' '), Settings.externalResources.procosysApi.url);
        this.client.interceptors.request.use((config) => {
            config.params = {
                ...config.params,
                'api-version': Settings.externalResources.procosysApi.version
            };
            return config;
        }, (error) => Promise.reject(error));
    }

    /**
     * Get all available plants for the currently logged in user
     */
    async getAllPlantsForUserAsync(setRequestCanceller?: RequestCanceler): Promise<PlantResponse[]> {
        const endpoint = '/plants';
        const settings: AxiosRequestConfig = {
        };
        this.setupRequestCanceler(settings, setRequestCanceller);
        const result = await this.client.get(endpoint, settings);
        return PascalCaseConverter.objectToCamelCase(result.data) as PlantResponse[];
    }
}


export default ProCoSysClient;
