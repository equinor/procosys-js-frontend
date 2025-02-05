import { IAuthService } from 'src/auth/AuthService';
import SettingsApiClient from '@procosys/http/SettingsApiClient';

import localSettings from '../settings.json';

const settings = localSettings as Partial<ConfigResponse & {configurationEndpoint: string, configurationScope: string, defaultScopes: string[]}>;
//#region types

interface FeatureConfig {
    url: string;
    scope: Array<string>;
    version?: string;
}

interface FeatureFlags {
    IPO: boolean;
    library: boolean;
    preservation: boolean;
    main: boolean;
    quickSearch: boolean;
}

interface ConfigResponse {
    configuration: {
        procosysApi: FeatureConfig;
        graphApi: FeatureConfig;
        preservationApi: FeatureConfig;
        searchApi: FeatureConfig;
        ipoApi: FeatureConfig;
        libraryApi: FeatureConfig;
        instrumentationKey: string;
    };
    featureFlags: FeatureFlags;
}

interface AuthConfigResponse {
    clientId: string;
    scopes: Array<string>;
}

export enum AsyncState {
    READY,
    INITIALIZING,
    ERROR,
}
//#endregion types

class ProCoSysSettings {
    private settingsConfigurationApiClient!: SettingsApiClient;
    configurationEndpoint!: string;
    configurationScope!: string;

    // remoteConfigurationResponse: ConfigResponse;
    /**
     * Validates the async state
     * INITIALIZING - Settings is not done initializing
     * ERROR - Settings initializer encountered an error while loading
     * READY - Settings are finished loading
     */
    configState: AsyncState = AsyncState.INITIALIZING;

    /**
     * Validates the async state
     * INITIALIZING - Settings is not done initializing
     * ERROR - Settings initializer encountered an error while loading
     * READY - Settings are finished loading
     */
    authConfigState: AsyncState = AsyncState.INITIALIZING;

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
     * Cached response from server
     */
    private authConfigResponse!: Promise<AuthConfigResponse>;

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
    searchApi!: FeatureConfig;
    ipoApi!: FeatureConfig;
    libraryApi!: FeatureConfig;

    featureFlags!: FeatureFlags;

    /**
     * Returns true or false based on if the feature is enabled or disabled.
     * @returns TRUE: feature is enabled
     * @returns FALSE: feature is disabled
     * @default false - if the feature is not configured
     * @param feature key for feature
     */
    featureIsEnabled(feature: string): boolean {
        return this.featureFlags[feature as keyof FeatureFlags] || false;
    }

    constructor() {
        if (ProCoSysSettings.instance instanceof ProCoSysSettings) {
            return ProCoSysSettings.instance;
        }

        this.instanceId = Math.floor(Math.random() * 9999);
        if (
            !settings.configurationEndpoint ||
            !settings.configurationScope
        ) {
            console.error(
                'Missing local configuration for Config API',
                settings
            );
            throw 'Missing local configuration for Config API';
        }
        this.featureFlags = {
            IPO: true,
            preservation: true,
            main: true,
            library: true,
            quickSearch: true,
        };
        this.settingsConfigurationApiClient = new SettingsApiClient(
            settings.configurationEndpoint
        );

        ProCoSysSettings.instance = this;
    }

    async loadAuthConfiguration(): Promise<void> {
        this.authConfigState = AsyncState.INITIALIZING;
        try {
            this.authConfigResponse =
                this.settingsConfigurationApiClient.getAuthConfig();
            const response = await this.authConfigResponse;
            this.mapFromAuthConfigResponse(response);
            this.authConfigState = AsyncState.READY;
        } catch (error) {
            this.authConfigState = AsyncState.ERROR;
            console.error(
                'Failed to load auth configuration from remote source',
                error
            );
        }
    }

    async loadConfiguration(authService: IAuthService): Promise<void> {
        if(!settings.configurationScope){
            throw new Error('Missing configuration scope');
        }
        this.configurationResponse =
            this.settingsConfigurationApiClient.getConfig(
                authService,
                settings.configurationScope
            );

        try {
            const configResponse = await this.configurationResponse;
            try {
                this.mapFromConfigurationResponse(configResponse);
                this.configState = AsyncState.READY;
            } catch (error) {
                this.configState = AsyncState.ERROR;
                console.error(
                    'Failed to parse configuration from remote source',
                    error
                );
            }
        } catch (error) {
            this.configState = AsyncState.ERROR;
            console.error(
                'Failed to load configuration from remote source',
                error
            );
        }
    }

    private mapFromAuthConfigResponse(
        authConfigResponse: AuthConfigResponse
    ): void {
        this.clientId = authConfigResponse.clientId;
        this.defaultScopes = authConfigResponse.scopes;
    }

    private mapFromConfigurationResponse(
        configurationResponse: ConfigResponse
    ): void {
        try {
            this.instrumentationKey =
                configurationResponse.configuration.instrumentationKey;

            this.graphApi = configurationResponse.configuration.graphApi;
            this.preservationApi =
                configurationResponse.configuration.preservationApi;
            this.searchApi = configurationResponse.configuration.searchApi;
            this.ipoApi = configurationResponse.configuration.ipoApi;
            this.libraryApi = configurationResponse.configuration.libraryApi;
            this.procosysApi = configurationResponse.configuration.procosysApi;

            // Feature flags
            this.featureFlags.IPO = configurationResponse.featureFlags.IPO;
            this.featureFlags.main = configurationResponse.featureFlags.main;
            this.featureFlags.library =
                configurationResponse.featureFlags.library;
            this.featureFlags.preservation =
                configurationResponse.featureFlags.preservation;
            this.featureFlags.quickSearch =
                configurationResponse.featureFlags.quickSearch;
        } catch (error) {
            console.error(
                'Failed to parse Configuration from remote server',
                error
            );
            throw error;
        }

        try {
            this.overrideFromLocalConfiguration();
        } catch (error) {
            console.error('Failed to override with local configuration', error);
            throw error;
        }
    }

    private overrideFromLocalConfiguration(): void {
        if (settings.configuration) {
            // Configuration elements
            console.info(
                'Overriding configuration from settings: ',
                settings.configuration
            );
            settings.configuration.instrumentationKey &&
                (this.instrumentationKey =
                    settings.configuration.instrumentationKey);
            settings.configuration.graphApi &&
                (this.graphApi = settings.configuration.graphApi);
            settings.configuration.preservationApi &&
                (this.preservationApi =
                    settings.configuration.preservationApi);
            settings.configuration.searchApi &&
                (this.searchApi = settings.configuration.searchApi);
            settings.configuration.ipoApi &&
                (this.ipoApi = settings.configuration.ipoApi);
            settings.configuration.libraryApi &&
                (this.libraryApi = settings.configuration.libraryApi);
            settings.configuration.procosysApi &&
                (this.procosysApi = settings.configuration.procosysApi);
        }

        // Feature flags
        if (settings.featureFlags) {
            console.info(
                'Overriding feature flags from settings: ',
                settings.featureFlags
            );

            settings.featureFlags.main != undefined &&
                (this.featureFlags.main = settings.featureFlags.main);
            settings.featureFlags.IPO != undefined &&
                (this.featureFlags.IPO = settings.featureFlags.IPO);
            settings.featureFlags.library != undefined &&
                (this.featureFlags.library =
                    settings.featureFlags.library);
            settings.featureFlags.preservation != undefined &&
                (this.featureFlags.preservation =
                    settings.featureFlags.preservation);
            settings.featureFlags.quickSearch != undefined &&
                (this.featureFlags.quickSearch =
                    settings.featureFlags.quickSearch);
        }
    }
}

export default new ProCoSysSettings();
