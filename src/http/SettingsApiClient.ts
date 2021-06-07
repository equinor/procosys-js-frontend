import { AxiosRequestConfig } from 'axios';
import HttpClient from './HttpClient';
import { IAuthService } from 'src/auth/AuthService';

interface FeatureConfig {
    url: string
    scope: Array<string>
    version?: string
}

interface ConfigResponse {
    configuration: {
        procosysApi: FeatureConfig
        graphApi: FeatureConfig
        preservationApi: FeatureConfig
        searchApi: FeatureConfig
        ipoApi: FeatureConfig
        libraryApi: FeatureConfig
        instrumentationKey: string
    }
    featureFlags: {
        IPO: boolean
        library: boolean
        preservation: boolean
        main: boolean
        quickSearch: boolean
    } 
    
}

interface AuthConfigResponse {
    clientId: string
    authority: string
    scopes: Array<string>
}

/**
 * API Client that is setup to talk with protected resources
 * @extends <HttpClient>
 */
export default class SettingsApiClient extends HttpClient {

    /**
     * @param customSettings Any Custom <AxiosRequestConfig> for the client
     */
    constructor(endpoint: string, customSettings: AxiosRequestConfig = {}) {
        const baseUrl = endpoint;
        super(baseUrl, customSettings);
    }
    async getAuthConfig(): Promise<AuthConfigResponse> {
        const response = await this.client.get('/Auth');
        return response.data;
    }

    async getConfig(authService: IAuthService, scope: string): Promise<ConfigResponse> {
        if (!authService || !scope) {
            throw 'Missing Authservice or scope';
        }
        const accessToken = await authService.getAccessTokenAsync(scope);
        if (!accessToken) throw 'Failed to get Access Token';
        const result = await this.client.get('/Configuration', {
            headers: {
                'Authorization': `Bearer ${accessToken.token}`
            }
        });
        return result.data;
    }
}
