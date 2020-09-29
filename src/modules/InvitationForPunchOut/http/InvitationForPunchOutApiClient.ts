import { AxiosRequestConfig, AxiosError } from 'axios';

import ApiClient from '../../../http/ApiClient';
import { IAuthService } from '../../../auth/AuthService';
import { RequestCanceler } from '../../../http/HttpClient';
import {ProCoSysSettings} from '../../../core/ProCoSysSettings';
import {ProCoSysApiError} from '../../../core/ProCoSysApiError';

export class IpoApiError extends ProCoSysApiError {
    constructor(error: AxiosError)
    {
        super(error);
        this.name = 'IpoApiError';
    }
}

export type ProjectResponse = {
    id: number;
    name: string;
    description: string;
}

export interface CommPkgResponse {
    id: number;
    commPkgNo: string;
    description: string;
    status: string;
}

export interface McPkgResponse {
    id: number;
    mcPkgNo: string;
    description: string;
}

export interface FunctionalRoleResponse {
    code: string;
    description: string;
    email: string;
    informationalEmail: string;
    usePersonalEmail: boolean;
    persons: [
        {
            azureOid: string;
            firstName: string;
            lastName: string;
            email: string;
        }
    ];
}

/**
 * API for interacting with data in InvitationForPunchOut API.
 */
class InvitationForPunchOutApiClient extends ApiClient {

    constructor(authService: IAuthService) {
        super(
            authService,
            ProCoSysSettings.ipo.scopes.join(' '),
            ProCoSysSettings.ipo.url
        );
        this.client.interceptors.request.use(
            config => {
                config.params = {
                    ...config.params,
                };
                return config;
            },
            error => Promise.reject(error)
        );
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
        console.log('Setting current plant for IPO: ', plantId);
        if (this.plantIdInterceptorId) {
            this.client.interceptors.request.eject(this.plantIdInterceptorId);
            this.plantIdInterceptorId = null;
        }
        this.plantIdInterceptorId = this.client.interceptors.request.use(
            config => {
                config.headers = {
                    ...config.headers,
                    'x-plant': plantId,
                };
                return config;
            },
            error => Promise.reject(error)
        );
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
        
        try {
            const result = await this.client.get<ProjectResponse[]>(endpoint,settings);
            return result.data;
        } catch (error) {
            throw new IpoApiError(error);
        }
    }

    /**
     * Get comm pkgs starting with comm pkg no in project
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getCommPkgsAsync(projectId: number, startWith: string, setRequestCanceller?: RequestCanceler): Promise<CommPkgResponse[]> {
        const endpoint = '/CommPkgs';
        const settings: AxiosRequestConfig = {params: {
            projectId: projectId,
            startsWithCommPkgNo: startWith
        },};
        this.setupRequestCanceler(settings, setRequestCanceller);
        
        try {
            const result = await this.client.get<CommPkgResponse[]>(endpoint, settings);
            return result.data;
        } catch (error) {
            throw new IpoApiError(error);
        }
    }

    /**
     * Get mc pkgs under a comm pgk in project
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getMcPkgsAsync(projectName: string, commPkgNo: string, setRequestCanceller?: RequestCanceler): Promise<McPkgResponse[]> {
        const endpoint = '/McPkgs';
        const settings: AxiosRequestConfig = {params: {
            projectName: projectName,
            CommPkgNo: commPkgNo
        },};
        this.setupRequestCanceler(settings, setRequestCanceller);
        
        try {
            const result = await this.client.get<McPkgResponse[]>(endpoint, settings);
            return result.data;
        } catch (error) {
            throw new IpoApiError(error);
        }
    }

    /**
     * Get functional roles for IPO
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getFunctionalRolesAsync(setRequestCanceller?: RequestCanceler): Promise<FunctionalRoleResponse[]> {
        const endpoint = '/FunctionalRoles';
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        
        try {
            const result = await this.client.get<FunctionalRoleResponse[]>(endpoint, settings);
            return result.data;
        } catch (error) {
            throw new IpoApiError(error);
        }
    }

} export default InvitationForPunchOutApiClient;
