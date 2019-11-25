import AuthService from '../auth/AuthService';
import { AxiosRequestConfig } from 'axios';
import HttpClient from './HttpClient';

/**
 * API Client that is setup to talk with protected resources
 * @extends <HttpClient>
 */
export default class ApiClient extends HttpClient {
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
