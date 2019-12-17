import ApiClient from '../../../http/ApiClient';
import {IAuthService} from '../../../auth/AuthService';

const Settings = require('../../settings.json');

/**
 * API for interacting with the Preservation API service.
 */
class PreservationApiClient extends ApiClient {

    constructor(authService: IAuthService, plant: string) {
        super(authService, Settings.externalResources.procosysApi.scope.join(' '), Settings.externalResources.procosysApi.url);
        this.client.interceptors.request.use((config) => {
            config.headers = {...config.headers, 'X-PLANT': plant};
            return config;
        }, (error) => Promise.reject(error));
    }
}


export default PreservationApiClient;
