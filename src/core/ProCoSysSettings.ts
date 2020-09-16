const Settings = require('../../settings.json');

export interface Feature {
    scopes: Array<string>,
    url: string,
    version: string,
    enabled: boolean
}

export class ProCoSysSettings {
    static featureIsEnabled(item: string): boolean {
        if (item != undefined){
            if (item === 'IPO') return this.ipo.enabled;
            if (item === 'LIBRARY') return this.library.enabled;
            if (item === 'PRESERVATION') return this.preservation.enabled;
            if (item === 'GRAPH') return this.graph.enabled;
            if (item === 'MAIN') return this.main.enabled;
        }
        
        return false;
    }

    static auth = {
        clientId: Settings.auth.clientId,
        authority: Settings.auth.authority,
        defaultScopes: JSON.parse(Settings.auth.defaultScopes.replace(/'/g, '"'))
    };

    static ipo : Feature =  {
        scopes: JSON.parse(Settings.externalResources.ipoApi.scope.replace(/'/g, '"')),
        url: Settings.externalResources.ipoApi.url,
        version: Settings.externalResources.ipoApi.version,
        enabled: (Settings.enabledFeatures.ipo == 'true'),
    };

    static library : Feature =  {
        scopes: JSON.parse(Settings.externalResources.libraryApi.scope.replace(/'/g, '"')),
        url: Settings.externalResources.libraryApi.url,
        version: Settings.externalResources.libraryApi.version,
        enabled: (Settings.enabledFeatures.library == 'true'),
    };

    static preservation : Feature =  {
        scopes: JSON.parse(Settings.externalResources.preservationApi.scope.replace(/'/g, '"')),
        url: Settings.externalResources.preservationApi.url,
        version: Settings.externalResources.preservationApi.version,
        enabled: (Settings.enabledFeatures.preservation == 'true'),
    };

    static main : Feature =  {
        scopes: JSON.parse(Settings.externalResources.procosysApi.scope.replace(/'/g, '"')),
        url: Settings.externalResources.procosysApi.url,
        version: Settings.externalResources.procosysApi.version,
        enabled: (Settings.enabledFeatures.main == 'true'),
    };

    static graph : Feature =  {
        scopes: JSON.parse(Settings.externalResources.graphApi.scope.replace(/'/g, '"')),
        url: Settings.externalResources.graphApi.url,
        version: Settings.externalResources.graphApi.version,
        enabled: (Settings.enabledFeatures.graph == 'true'),
    };
}