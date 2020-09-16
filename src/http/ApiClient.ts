import { AxiosRequestConfig } from 'axios';
import HttpClient from './HttpClient';
import { IAuthService } from '../auth/AuthService';

/**
 * API Client that is setup to talk with protected resources
 * @extends <HttpClient>
 */
export default class ApiClient extends HttpClient {
    /**
     * @hidden
     */
    private authService: IAuthService;

    /**
     * @param resource ResourceID/Scope which is required to interact with the API
     * @param baseUrl The Base URL for the API
     * @param customSettings Any Custom <AxiosRequestConfig> for the client
     */
    constructor(authService: IAuthService, resource: string, baseUrl = '', customSettings: AxiosRequestConfig = {}) {
        super(baseUrl, customSettings);
        this.authService = authService;
        this.client.interceptors.request.use(async (config): Promise<AxiosRequestConfig> => {
            if (!this.authService) throw 'Missing authService initialization in API client';
            try {
                const accessToken = await this.authService.getAccessTokenAsync(resource);
                if (!accessToken) throw 'Failed to get AccessToken';
                config.headers.common['Authorization'] = 'Bearer ' + accessToken.token;
            } catch (authError) {
                console.error('Failed to aquire token', authError);
                throw authError;
            }

            return config;
        });
    }
}
