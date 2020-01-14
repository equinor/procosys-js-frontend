import ApiClient from '../../../http/ApiClient';
import {AxiosRequestConfig} from 'axios';
import {IAuthService} from '../../../auth/AuthService';
import { RequestCanceler } from '../../../http/HttpClient';

const Settings = require('../../../../settings.json');

export type TagResponse = {
    id: number;
};

/**
 * API for interacting with data in ProCoSys.
 */
class PreservationApiClient extends ApiClient {

    constructor(authService: IAuthService) {
        super(authService, Settings.externalResources.preservationApi.scope.join(' '), Settings.externalResources.preservationApi.url);
        this.client.interceptors.request.use((config) => {
            config.params = {
                ...config.params
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
        console.log('Setting current plant for preservation: ', plantId);
        if (this.plantIdInterceptorId) {
            this.client.interceptors.request.eject(this.plantIdInterceptorId);
            this.plantIdInterceptorId = null;
        }
        // const plant = plantId.replace('PCS$', '');
        this.plantIdInterceptorId = this.client.interceptors.request.use((config) => {

            config.headers = {
                ...config.headers,
                'x-plant': plantId
            };
            return config;
        }, (error) => Promise.reject(error));
    }

    /**
     * Get all available tags for currently logged in user in current plant context
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getTags(setRequestCanceller?: RequestCanceler): Promise<TagResponse[]> {
        const endpoint = '/Tags';
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        const result = await this.client.get<TagResponse[]>(endpoint,settings);
        return result.data;
    }
}


export default PreservationApiClient;
