import { AxiosRequestConfig } from 'axios';
import HttpClient from './HttpClient';
import { IAuthService } from '../auth/AuthService';

interface FeatureConfig {
    url: string;
    scope: Array<string>,
    version: string | null;
}

interface ConfigResponse {
    clientId: string;
    authority: string;
    defaultScopes: Array<string>;
    externalResources: {
        procosysApi: FeatureConfig,
        graphApi: FeatureConfig,
        preservationApi: FeatureConfig,
        ipoApi: FeatureConfig,
        libraryApi: FeatureConfig
    },
    instrumentationKey: string;
}

interface FeatureFlagResponse {
    ipo: boolean;
    library: boolean,
    preservervation: boolean,
    graph: boolean,
    main: boolean
}

const configMock: ConfigResponse = {
    clientId: 'b1147d7a-30bc-40c1-8b51-f818ae4e8bf7',
    authority: 'https://login.microsoftonline.com/3aa4a235-b6e2-48d5-9195-7fcf05b459b0',
    defaultScopes: ['api://47641c40-0135-459b-8ab4-459e68dc8d08/web_api', 'https://graph.microsoft.com/User.Read'],
    externalResources: {
        procosysApi: {
            url: 'https://procosyswebapidev.equinor.com/api',
            scope: ['api://47641c40-0135-459b-8ab4-459e68dc8d08/web_api'],
            version: '4.1'
        },
        graphApi: {
            url: 'https://graph.microsoft.com/',
            scope: ['https://graph.microsoft.com/User.Read'],
            version: 'v1.0'
        },
        preservationApi: {
            url: 'https://preservation-dev-api.pcs-dev.net/',
            scope: ['api://67b2f053-30bf-4ffc-9206-ef57f631efcb/ReadWrite'],
            version: null
        },
        ipoApi: {
            url: 'https://ipo-dev-api.pcs-dev.net/',
            scope: ['api://2e1868db-3024-45a9-b3f1-568e85586244/ReadWrite'],
            version: null
        },
        libraryApi: {
            url: 'https://library-dev-api.pcs-dev.net/',
            scope: ['api://fdf5086c-009f-4407-b7bb-d2ece26dea45/Procosys.Library'],
            version: null
        }
    },
    instrumentationKey: ''
};

const featureFlagMock: FeatureFlagResponse = {
    ipo: true,
    library: true,
    preservervation: true,
    graph: true,
    main: true
};

/**
 * API Client that is setup to talk with protected resources
 * @extends <HttpClient>
 */
export default class SettingsApiClient extends HttpClient {

    /**
     * @param resource ResourceID/Scope which is required to interact with the API
     * @param baseUrl The Base URL for the API
     * @param customSettings Any Custom <AxiosRequestConfig> for the client
     */
    constructor(baseUrl = '', customSettings: AxiosRequestConfig = {}) {
        super(baseUrl, customSettings);
    }

    getConfig(): Promise<ConfigResponse> {
        return Promise.resolve(configMock);
    }

    getFeatureFlagConfig(): Promise<FeatureFlagResponse> {
        return Promise.resolve(featureFlagMock);
    }
}
