import { AxiosRequestConfig } from 'axios';
import HttpClient from './HttpClient';
const LocalSettings = require('../../settings.json');


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

function overrideWithLocalSettings(remoteConfig: ConfigResponse): ConfigResponse {

    //Clone it
    const configuration: ConfigResponse = {
        ...remoteConfig,
        externalResources: {
            graphApi: {...remoteConfig.externalResources.graphApi},
            preservationApi: {...remoteConfig.externalResources.preservationApi},
            libraryApi: {...remoteConfig.externalResources.libraryApi},
            procosysApi: {...remoteConfig.externalResources.procosysApi},
            ipoApi: {...remoteConfig.externalResources.ipoApi},
        }
    };

    // Alter
    try {
        LocalSettings.authority && (configuration.authority = LocalSettings.authority);
        LocalSettings.clientId && (configuration.clientId = LocalSettings.clientId);
        LocalSettings.defaultScopes && (configuration.defaultScopes = LocalSettings.defaultScopes);
        LocalSettings.instrumentationKey && (configuration.instrumentationKey = LocalSettings.instrumentationKey);

        if (LocalSettings.externalResources) {
            LocalSettings.externalResources.graphApi && (configuration.externalResources.graphApi = LocalSettings.externalResources.graphApi);
            LocalSettings.externalResources.preservationApi && (configuration.externalResources.preservationApi = LocalSettings.externalResources.preservationApi);
            LocalSettings.externalResources.ipoApi && (configuration.externalResources.ipoApi = LocalSettings.externalResources.ipoApi);
            LocalSettings.externalResources.libraryApi && (configuration.externalResources.libraryApi = LocalSettings.externalResources.libraryApi);
            LocalSettings.externalResources.procosysApi && (configuration.externalResources.procosysApi = LocalSettings.externalResources.procosysApi);
        }
        
    } catch (error) {
        console.error('An error occured while parsing the local configuration overrides', error);
    }

    // return
    return configuration;
}

/**
 * API Client that is setup to talk with protected resources
 * @extends <HttpClient>
 */
export default class SettingsApiClient extends HttpClient {

    /**
     * @param customSettings Any Custom <AxiosRequestConfig> for the client
     */
    constructor(customSettings: AxiosRequestConfig = {}) {
        const baseUrl = LocalSettings.configurationEndpoint;
        super(baseUrl, customSettings);
    }

    getConfig(): Promise<ConfigResponse> {
        return new Promise((resolve, reject)  => {
            const response = {...configMock};
            const configuration = overrideWithLocalSettings(response);

            setTimeout(() => resolve(configuration), 1000*5);
        });
    }

    getFeatureFlagConfig(): Promise<FeatureFlagResponse> {
        return Promise.resolve(featureFlagMock);
    }
}
