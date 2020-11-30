import SettingsApiClient from '@procosys/http/SettingsApiClient';

const Settings = require('../../settings.json');
const settingsApiClient = new SettingsApiClient(Settings.configuratinEndpoint);
//#region types

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

export enum ConfigurationLoaderAsyncState {
    READY,
    INITIALIZING,
    ERROR
}
//#endregion types

class ProCoSysSettings {

    // remoteConfigurationResponse: ConfigResponse;
    /**
     * Validates the async state
     * INITIALIZING - Settings is not done initializing
     * ERROR - Settings initializer encountered an error while loading
     * READY - Settings are finished loading
     */
    state:ConfigurationLoaderAsyncState = ConfigurationLoaderAsyncState.INITIALIZING;

    /**
     * A random number to validate instance
     */
    private instanceId!: number;

    /**
     * Singleton instance of configuration
     */
    private static instance: ProCoSysSettings;

    /**
     * Cached response from server
     */
    private configurationResponse!: Promise<ConfigResponse>;

    /**
     * URI to the login authority
     */
    authority!:string;
    /**
     * Default scopes to ask for concent for when logging in
     */
    defaultScopes: Array<string> = [];

    /**
     * AAD Client ID
     */
    clientId!: string;

    /**
     * Application insight instrumentation key
     */
    instrumentationKey = '';

    procosysApi!: FeatureConfig;
    graphApi!: FeatureConfig;
    preservationApi!: FeatureConfig;
    ipoApi!: FeatureConfig;
    libraryApi!: FeatureConfig;

    featureIsEnabled(featureName: string): boolean {
        return true;
    }

    constructor() {
        if (ProCoSysSettings.instance instanceof ProCoSysSettings) {
            return ProCoSysSettings.instance;
        }

        this.instanceId = Math.floor(Math.random() * 9999);

        this.configurationResponse = settingsApiClient.getConfig();
        this.configurationResponse.catch((error) => {
            this.state = ConfigurationLoaderAsyncState.ERROR;
            console.error('Failed to load configuration from remote source', error);
        });

        this.configurationResponse.then((response) => {
            try {
                this.mapFromConfigurationResponse(response);
                this.state = ConfigurationLoaderAsyncState.READY;
            } catch (error) {
                this.state = ConfigurationLoaderAsyncState.ERROR;
                console.error('Failed to parse configuration from remote source' , error);
            }
        }).finally(() => {
            Object.freeze(this);
        });
        
        ProCoSysSettings.instance = this;
    }

    private mapFromConfigurationResponse(configurationResponse: ConfigResponse): void {
        try {
            this.authority = configurationResponse.authority;
            this.clientId = configurationResponse.clientId;
            this.defaultScopes = configurationResponse.defaultScopes;
            this.instrumentationKey = configurationResponse.instrumentationKey;

            this.graphApi = configurationResponse.externalResources.graphApi;
            this.preservationApi = configurationResponse.externalResources.preservationApi;
            this.ipoApi = configurationResponse.externalResources.ipoApi;
            this.libraryApi = configurationResponse.externalResources.libraryApi;
            this.procosysApi = configurationResponse.externalResources.procosysApi;
        } catch (error) {
            console.error('Failed to parse Configuration from remote server', error);
            throw error;
        }
    }

}

export default new ProCoSysSettings();
