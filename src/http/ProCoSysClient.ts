import ApiClient from './ApiClient';
const Settings = require('../../settings.json');

export type PlantResponse = {
    Id: string;
    Title: string;
}

class ProCoSysClient extends ApiClient {
    constructor() {
        super(Settings.externalResources.procosysApi.scopes.join(' '), Settings.externalResources.procosysApi.url);
        this.client.interceptors.request.use((config) => {
            config.params = {
                ...config.params,
                'api-version': Settings.externalResources.procosysApi.version
            };
            return config;
        }, (error) => Promise.reject(error));
    }

    async getAllPlantsForUserAsync(): Promise<PlantResponse[]> {
        const endpoint = '/plants';
        const result = await this.client.get(endpoint);
        return result.data as PlantResponse[];
    }
}


export default ProCoSysClient;
