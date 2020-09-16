import { AxiosRequestConfig } from 'axios';

import ApiClient from '../../../http/ApiClient';
import { IAuthService } from '../../../auth/AuthService';
import { RequestCanceler } from '../../../http/HttpClient';
import {ProCoSysSettings} from '../../../core/ProCoSysSettings';


export type ProjectResponse = {
    id: number;
    name: string;
    description: string;
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
        
        const result = await this.client.get<ProjectResponse[]>(endpoint,settings);
        return result.data;
    }
} export default InvitationForPunchOutApiClient;