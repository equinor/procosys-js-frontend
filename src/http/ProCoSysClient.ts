import ApiClient from './ApiClient';
import { AxiosRequestConfig } from 'axios';
import { IAuthService } from '../auth/AuthService';
import PascalCaseConverter from '../util/PascalCaseConverter';
import { RequestCanceler } from './HttpClient';

const Settings = require('../../settings.json');
const scopes = JSON.parse(Settings.externalResources.procosysApi.scope.replace(/'/g, '"'));

export type PlantResponse = {
    id: string;
    title: string;
}

export type ProjectResponse = {
    id: number;
    name: string;
    description: string;
    parentDescription: string;
}

export type SingleProjectResponse = {
    id: number;
    name: string;
    description: string;
    isClosed: boolean;
}

interface TagFunctionResponse {
    id: number;
    code: string;
    description: string;
    registerDescription: string;
}

interface PurchaseOrderResponse {
    title: string;
    description: string;
}

interface TagIdResponse {
    id: number;
    tagNo: string;
}

/**
 * API for interacting with data in ProCoSys.
 */
class ProCoSysClient extends ApiClient {

    constructor(authService: IAuthService) {
        super(authService, scopes.join(' '), Settings.externalResources.procosysApi.url);
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

    async getPermissionsForCurrentUser(setRequestCanceller?: RequestCanceler): Promise<string[]> {
        const endpoint = '/permissions';
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        const result = await this.client.get<string[]>(endpoint, settings);
        return result.data;
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
        const result = await this.client.get(endpoint, settings);
        return PascalCaseConverter.objectToCamelCase(result.data) as ProjectResponse[];
    }

    /**
     * Get project 
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getProjectAsync(projectId: number, setRequestCanceller?: RequestCanceler): Promise<SingleProjectResponse> {
        const endpoint = '/project';

        const settings: AxiosRequestConfig = {
            params: {
                projectId
            }
        };
        this.setupRequestCanceler(settings, setRequestCanceller);
        const result = await this.client.get(endpoint, settings);
        return PascalCaseConverter.objectToCamelCase(result.data) as SingleProjectResponse;
    }

    /**
     * Returns Tag function details
     *
     * @param tagFunctionCode Tag Function Code
     * @param registerCode Register Code
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getTagFunction(tagFunctionCode: string, registerCode: string, setRequestCanceller?: RequestCanceler): Promise<TagFunctionResponse> {
        const endpoint = '/Library/TagFunction';
        const settings: AxiosRequestConfig = {
            params: {
                tagFunctionCode,
                registerCode
            }
        };
        this.setupRequestCanceler(settings, setRequestCanceller);
        const result = await this.client.get(endpoint, settings);
        return PascalCaseConverter.objectToCamelCase(result.data) as TagFunctionResponse;
    }

    /**
     * Returns Tag no
     *
     * @param tagNo Tag no
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getTagId(tagNos: string[], projectName: string, setRequestCanceller?: RequestCanceler): Promise<TagIdResponse[]> {
        const endpoint = '/Tag/ByTagNos';
        const settings: AxiosRequestConfig = {
            params: {
                tagNos,
                projectName
            }
        };
        this.setupRequestCanceler(settings, setRequestCanceller);
        const result = await this.client.get(endpoint, settings);
        return PascalCaseConverter.objectToCamelCase(result.data) as TagIdResponse[];
    }

    /**
    * Get Purchase orders
    *
    * @param setRequestCanceller Returns a function that can be called to cancel the request
    */
    async getPurchaseOrders(projectName: string, setRequestCanceller?: RequestCanceler): Promise<PurchaseOrderResponse[]> {
        const endpoint = '/PurchaseOrders';
        const settings: AxiosRequestConfig = {
            params: {
                projectName: projectName
            }
        };
        this.setupRequestCanceler(settings, setRequestCanceller);
        const result = await this.client.get(endpoint, settings);
        return PascalCaseConverter.objectToCamelCase(result.data) as PurchaseOrderResponse[];
    }

    /**
     * Mark tags as migrated.  
     */
    async markTagsAsMigrated(
        projectName: string,
        tags: number[],
        setRequestCanceller?: RequestCanceler
    ): Promise<void> {
        const endpoint = '/PreservationTags';
        const settings: AxiosRequestConfig = {
            params: {
                projectName: projectName,
            },
        };
        this.setupRequestCanceler(settings, setRequestCanceller);
        await this.client.put(endpoint, tags, settings);
    }
}

export default ProCoSysClient;
