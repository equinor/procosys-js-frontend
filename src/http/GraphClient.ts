import ApiClient from './ApiClient';
import { AxiosRequestConfig } from 'axios';
import {IAuthService} from '../auth/AuthService';
import {RequestCanceler} from './HttpClient';

const Settings = require('../../settings.json');

const RESOURCE_ID = JSON.parse(Settings.externalResources.graphApi.scope.replace(/'/g,'"')).join(' ');
const BASE_URL = `${Settings.externalResources.graphApi.url}${Settings.externalResources.graphApi.version}`;

export type ProfileResponse = {
    displayName: string;
    givenName: string;
    mail: string;
    mobilePhone: string;
    surname: string;
    id: string;
    jobTitle: string;
}

/**
 * Exposes the Azure AD Graph Api
 */
export default class GraphClient extends ApiClient {

    constructor(authService: IAuthService) {
        super(authService, RESOURCE_ID, BASE_URL);
    }

    /**
     * Get the current users profile data from the Graph API
     * @param setRequestCanceller Callback function used to receive the cancel token for executed request
     */
    async getProfileDataAsync(setRequestCanceller?: RequestCanceler): Promise<ProfileResponse> {
        const endpoint = '/me';

        const settings: AxiosRequestConfig = {
        };

        this.setupRequestCanceler(settings, setRequestCanceller);

        const response = await this.client.get(endpoint, settings);

        return response.data as ProfileResponse;
    }

    /**
     * Get the current users profile picture from Azure AD
     * @param setRequestCanceller Callback function used to receive the cancel token for executed request
     */
    async getProfilePictureAsync(setRequestCanceller?: RequestCanceler): Promise<Blob> {
        const endpoint = '/me/photo/$value';

        const settings: AxiosRequestConfig = {
            responseType: 'blob'
        };

        this.setupRequestCanceler(settings, setRequestCanceller);

        const response = await this.client.get(endpoint, settings);

        return response.data as Blob;
    }

}

