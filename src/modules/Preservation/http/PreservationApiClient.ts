import ApiClient from '../../../http/ApiClient';
import { AxiosRequestConfig } from 'axios';
import { IAuthService } from '../../../auth/AuthService';
import { RequestCanceler } from '../../../http/HttpClient';

const Settings = require('../../../../settings.json');

export interface PreservedTagResponse {
    id: string;
    tagNo: string;
    description: string;
    areaCode: string;
    next: string;
    calloffNo: string;
    commPkgNo: string;
    disciplineCode: string;
    isAreaTag: string;
    isVoided: string;
    mcPkgNo: string;
    projectName: string;
    purchaseOrderNo: string;
    status: string;
    stepId: string;
    tagFunctionCode: string;
    needUserInput: string;
}

export type Journey = {
    id: number;
    text: string;
};

export type Step = {
    id: number;
    text: string;
};

export type TagSearchResponse = {
    tagNo: string;
    description: string;
    purchaseOrderNumber: string;
    commPkgNo: string;
    mcPkgNo: string;
    isPreserved: boolean;
};

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
        super(
            authService,
            Settings.externalResources.preservationApi.scope.join(' '),
            Settings.externalResources.preservationApi.url
        );
        this.client.interceptors.request.use(
            config => {
                config.params = {
                    ...config.params,
                };
                return config;
            },
            error => Promise.reject(error)
        );
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
        this.plantIdInterceptorId = this.client.interceptors.request.use(
            config => {
                config.headers = {
                    ...config.headers,
                    'x-plant': plantId,
                };
                return config;
            },
            error => Promise.reject(error)
        );
    }

    /**
     * Get all available tags for currently logged in user in current plant context
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getTags(
        setRequestCanceller?: RequestCanceler
    ): Promise<PreservedTagResponse[]> {
        const endpoint = '/Tags';
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        const result = await this.client.get<PreservedTagResponse[]>(
            endpoint,
            settings
        );
        return result.data;
    }

    /**
     * Get preserved tags for currently logged in user in current plant context
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getPreservedTags(
        setRequestCanceller?: RequestCanceler
    ): Promise<PreservedTagResponse[]> {
        const endpoint = '/Tags/Preserved';
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        const result = await this.client.get<PreservedTagResponse[]>(
            endpoint,
            settings
        );
        return result.data;
    }

    /**
     * Start preservation for the given tags.
     * @param tags  List with tag IDs
     */
    async startPreservation(tags: string[]): Promise<void> {
        console.log('Start preservation for a set of tags: ' + tags);
        const endpoint = '/Tags/Preserved/StartPreservation';
        const settings: AxiosRequestConfig = {};
        await this.client.put(endpoint, tags, settings);
    }

    async getPreservationJourneys(
        setRequestCanceller?: RequestCanceler
    ): Promise<Journey[]> {
        // const endpoint = '/Journeys';
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        return DelayData([
            {
                text: 'Journey 1',
                id: 1,
            },
            {
                text: 'Journey 2',
                id: 2,
            },
        ]);
    }

    async getPreservationSteps(
        setRequestCanceller?: RequestCanceler
    ): Promise<Step[]> {
        // const endpoint = '/Steps';
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        return DelayData([
            {
                text: 'Step 1',
                id: 1,
            },
            {
                text: 'Step 2',
                id: 2,
            },
        ]);
    }

    async getTagsForAddPreservationScope(
        projectName: string,
        tagNo: string,
        setRequestCanceller?: RequestCanceler
    ): Promise<TagSearchResponse[]> {
        const endpoint = '/Tags/Search';
        const settings: AxiosRequestConfig = {
            params: {
                projectName: projectName,
                startsWithTagNo: tagNo,
            },
        };
        this.setupRequestCanceler(settings, setRequestCanceller);
        const result = await this.client.get<TagSearchResponse[]>(
            endpoint,
            settings
        );
        return result.data;
    }
}

export default PreservationApiClient;
