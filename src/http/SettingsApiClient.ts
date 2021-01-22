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
        ipoApi: FeatureConfig
        libraryApi: FeatureConfig
        instrumentationKey: string
    }
    featureFlags: {
        ipo: boolean
        library: boolean
        preservation: boolean
        main: boolean
    } 
    
}

interface AuthConfigResponse {
    clientId: string
    authority: string
    scopes: Array<string>
}

// function overrideWithLocalSettings(remoteConfig: ConfigResponse): ConfigResponse {

//     //Clone it
//     const configuration: ConfigResponse = {
//         ...remoteConfig,
//         externalResources: {
//             graphApi: {...remoteConfig.externalResources.graphApi},
//             preservationApi: {...remoteConfig.externalResources.preservationApi},
//             libraryApi: {...remoteConfig.externalResources.libraryApi},
//             procosysApi: {...remoteConfig.externalResources.procosysApi},
//             ipoApi: {...remoteConfig.externalResources.ipoApi},
//         }
//     };

//     // Alter
//     try {
//         LocalSettings.authority && (configuration.authority = LocalSettings.authority);
//         LocalSettings.clientId && (configuration.clientId = LocalSettings.clientId);
//         LocalSettings.defaultScopes && (configuration.defaultScopes = LocalSettings.defaultScopes);
//         LocalSettings.instrumentationKey && (configuration.instrumentationKey = LocalSettings.instrumentationKey);

//         if (LocalSettings.externalResources) {
//             LocalSettings.externalResources.graphApi && (configuration.externalResources.graphApi = LocalSettings.externalResources.graphApi);
//             LocalSettings.externalResources.preservationApi && (configuration.externalResources.preservationApi = LocalSettings.externalResources.preservationApi);
//             LocalSettings.externalResources.ipoApi && (configuration.externalResources.ipoApi = LocalSettings.externalResources.ipoApi);
//             LocalSettings.externalResources.libraryApi && (configuration.externalResources.libraryApi = LocalSettings.externalResources.libraryApi);
//             LocalSettings.externalResources.procosysApi && (configuration.externalResources.procosysApi = LocalSettings.externalResources.procosysApi);
//         }
        
//     } catch (error) {
//         console.error('An error occured while parsing the local configuration overrides', error);
//     }

//     // return
//     return configuration;
// }

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

    // getFeatureFlagConfig(): Promise<FeatureFlagResponse> {
    //     return Promise.resolve(featureFlagMock);
    // }
}
