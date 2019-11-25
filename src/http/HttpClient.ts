import axios, { AxiosInstance, AxiosRequestConfig, Canceler } from 'axios';

import AuthService from '../auth/AuthService';

const axiosSettings: AxiosRequestConfig = {
};

/**
 * Callback for setting up request canceler
 */
export type RequestCanceler = ((callback: Canceler) => void);

/**
 * Generic HTTP Client with common configuration
 */
export default class HttpClient {

    protected client: AxiosInstance;

    /**
     * @param baseUrl Base URL for resource to interact with
     * @param customSettings Any custom <AxiosRequestConfig> for the client
     */
    constructor(baseUrl = '', customSettings: AxiosRequestConfig = {}) {
        const instance =  axios.create({
            ...axiosSettings,
            baseURL: baseUrl,
            ...customSettings
        });

        instance.interceptors.response.use((successResponse) => {
            return successResponse;
        }, (error) => {
            if (axios.isCancel(error)) {
                return Promise.reject('Cancelled');
            }
            return Promise.reject(error);
        });

        this.client = instance;
    }

    /**
     * Generic setup for canceling requests
     * @param settings Settings object to manipulate
     * @param cancelorCallback Callback function which received the cancel token
     */
    protected setupRequestCanceler(settings: AxiosRequestConfig, cancelorCallback?: RequestCanceler): void {
        if (cancelorCallback) {
            const cancelToken = new axios.CancelToken((c) => {
                cancelorCallback(c);
                return c;
            });
            settings.cancelToken = cancelToken;
        }
    }

}

/**
 * API Client that is setup to talk with protected resources
 * @extends <HttpClient>
 */
export class ApiClient extends HttpClient {

    /**
     * @param resource ResourceID/Scope which is required to interact with the API
     * @param baseUrl The Base URL for the API
     * @param customSettings Any Custom <AxiosRequestConfig> for the client
     */
    constructor(resource: string, baseUrl = '', customSettings: AxiosRequestConfig = {}) {
        super(baseUrl, customSettings);
        const service = new AuthService();

        this.client.interceptors.request.use(async (config): Promise<AxiosRequestConfig> => {
            const accessToken = await service.getAccessTokenAsync(resource);
            config.headers.common['Authorization'] = 'Bearer ' + accessToken.token;
            return config;
        });
    }

}
