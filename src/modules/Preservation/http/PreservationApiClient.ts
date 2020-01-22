import ApiClient from '../../../http/ApiClient';
import { AxiosRequestConfig } from 'axios';
import { IAuthService } from '../../../auth/AuthService';
import { RequestCanceler } from '../../../http/HttpClient';

const Settings = require('../../../../settings.json');

export type TagResponse = {
    id: number;
};

export type Journey = {
    id: number;
    text: string;
}

export type Step = {
    id: number;
    text: string;
}

export type TagData = {
    tagId: number;
    tagNo: string;
    description: string;
}


/**
 * Wraps the data return in a promise and delays the response.
 *
 * @param data Any data that is to be returned by the promise
 * @param fail Should the promise be rejected? Default: false
 */
function DelayData(data: any, fail = false): Promise<any> {
    return new Promise((resolve, reject) => {
        if (fail) {
            setTimeout(() => reject(data), 3000);
        } else {
            setTimeout(() => resolve(data), 3000);
        }
    });
}

/**
 * API for interacting with data in ProCoSys.
 */
class PreservationApiClient extends ApiClient {

    constructor(authService: IAuthService) {
        super(authService, Settings.externalResources.preservationApi.scope.join(' '), Settings.externalResources.preservationApi.url);
        this.client.interceptors.request.use((config) => {
            config.params = {
                ...config.params
            };
            return config;
        }, (error) => Promise.reject(error));
    }

    /**
     * Holds a reference to an internal callbackID used to set the plantId on requests.
     */
    private plantIdInterceptorId: number | null = null;

    /**
     * Sets the current context for relevant api requests
     *
     * @param plantId Plant ID
     */
    setCurrentPlant(plantId: string): void {
        console.log('Setting current plant for preservation: ', plantId);
        if (this.plantIdInterceptorId) {
            this.client.interceptors.request.eject(this.plantIdInterceptorId);
            this.plantIdInterceptorId = null;
        }
        // const plant = plantId.replace('PCS$', '');
        this.plantIdInterceptorId = this.client.interceptors.request.use((config) => {

            config.headers = {
                ...config.headers,
                'x-plant': plantId
            };
            return config;
        }, (error) => Promise.reject(error));
    }

    /**
     * Get all available tags for currently logged in user in current plant context
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getTags(setRequestCanceller?: RequestCanceler): Promise<TagResponse[]> {
        const endpoint = '/Tags';
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        const result = await this.client.get<TagResponse[]>(endpoint, settings);
        return result.data;
    }

    async getPreservationJourneys(setRequestCanceller?: RequestCanceler): Promise<Journey[]> {
        // const endpoint = '/Journeys';
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        return DelayData([{
            text: 'Journey 1',
            id: 1
        },
        {
            text: 'Journey 2',
            id: 2
        }]);
    }

    async getPreservationSteps(setRequestCanceller?: RequestCanceler): Promise<Step[]> {
        // const endpoint = '/Steps';
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        return DelayData([{
            text: 'Step 1',
            id: 1
        },
        {
            text: 'Step 2',
            id: 2
        }]);
    }

    async getTagsForAddPreservationScope(tagNo: string, setRequestCanceller?: RequestCanceler): Promise<TagData[]> {
        // const endpoint = '/Tags/Search';
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        const testData: TagData[] = [
            { tagId: 10, tagNo: 'Tag 1', description: 'desc 1' },
            { tagId: 20, tagNo: 'Tag 2', description: 'desc 2' },
            { tagId: 30, tagNo: 'Tag 3', description: 'desc 3' },
            { tagId: 40, tagNo: 'Tag 4', description: 'desc 4' },
            { tagId: 50, tagNo: 'Tag 5', description: 'desc 5' },
            { tagId: 60, tagNo: 'Tag 6', description: 'desc 6' },
            { tagId: 70, tagNo: 'Tag 7', description: 'desc 7' }
        ];

        // TODO: temp filtering while testing
        const result = testData.filter(
            tagRow => tagRow.tagNo.toLowerCase().startsWith(tagNo.toLowerCase())
        );

        return DelayData(result);
    }
}

export default PreservationApiClient;
