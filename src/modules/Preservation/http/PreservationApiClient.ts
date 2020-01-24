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
}

export default PreservationApiClient;
