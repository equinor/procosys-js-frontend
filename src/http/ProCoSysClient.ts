import ApiClient from './ApiClient';
import {AxiosRequestConfig} from 'axios';
import {IAuthService} from '../auth/AuthService';
import PascalCaseConverter from '../util/PascalCaseConverter';
import { RequestCanceler } from './HttpClient';

const Settings = require('../../settings.json');

export type PlantResponse = {
    id: string;
    title: string;
}

export type ProjectResponse = {
    id: number;
    description: string;
    parentDescription: string;
}

/**
 * API for interacting with data in ProCoSys.
 */
class ProCoSysClient extends ApiClient {

    constructor(authService: IAuthService) {
        super(authService, Settings.externalResources.procosysApi.scope.join(' '), Settings.externalResources.procosysApi.url);
        this.client.interceptors.request.use((config) => {
            config.params = {
                ...config.params,
                'api-version': Settings.externalResources.procosysApi.version
            };
            return config;
        }, (error) => Promise.reject(error));
    }

    /**
     * Holds a reference to an internal callbackID used to set the plantId on requests.
     */
    private plantIdInterceptorId: number | null = null;

    /**
     * Sets the current context for relevant api requests
     *
     * @param plantId Plant ID
     */
    setCurrentPlant(plantId: string): void {
        if (this.plantIdInterceptorId) {
            this.client.interceptors.request.eject(this.plantIdInterceptorId);
            this.plantIdInterceptorId = null;
        }
        // const plant = plantId.replace('PCS$', '');
        this.plantIdInterceptorId = this.client.interceptors.request.use((config) => {

            config.params = {
                ...config.params,
                'plantId': plantId
            };
            return config;
        }, (error) => Promise.reject(error));
    }

    /**
     * Get all available plants for the currently logged in user
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getAllPlantsForUserAsync(setRequestCanceller?: RequestCanceler): Promise<PlantResponse[]> {
        const endpoint = '/plants';
        const settings: AxiosRequestConfig = {
        };
        this.setupRequestCanceler(settings, setRequestCanceller);
        const result = await this.client.get(endpoint, settings);
        return PascalCaseConverter.objectToCamelCase(result.data) as PlantResponse[];
    }

    /**
     * Get all available projects for currently logged in user in current plant context
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getAllProjectsForUserAsync(setRequestCanceller?: RequestCanceler): Promise<ProjectResponse[]> {
        const endpoint = '/projects';
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        const result = await this.client.get(endpoint,settings);
        return PascalCaseConverter.objectToCamelCase(result.data) as ProjectResponse[];
    }
}


export default ProCoSysClient;
