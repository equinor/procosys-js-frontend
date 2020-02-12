import ApiClient from '../../../http/ApiClient';
import { AxiosRequestConfig } from 'axios';
import { IAuthService } from '../../../auth/AuthService';
import { RequestCanceler } from '../../../http/HttpClient';

const Settings = require('../../../../settings.json');

export interface PreservedTagResponse {
    id: number;
    tagNo: string;
    description: string;
    mode: string;
    areaCode: string;
    calloffNo: string;
    commPkgNo: string;
    disciplineCode: string;
    isAreaTag: boolean;
    isVoided: boolean;
    mcPkgNo: string;
    purchaseOrderNo: string;
    status: string;
    tagFunctionCode: string;
    responsibleCode: string;
    remark: string;
    readyToBePreserved: boolean;
    firstUpcomingRequirement: {
        nextDueAsYearAndWeek: string;
        nextDueWeeks: number;
    };
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
}

export interface PreservedTagDetailsResponse {
    id: number;
    tagNo: string;
    description: string;
    status: string;
    journeyTitle: string;
    mode: string;
    responsibleName: string;
    commPkgNo: string;
    mcPkgNo: string;
    purchaseOrderNo: string;
    areaCode: string;
}

export interface JourneyResponse {
    id: number;
    title: string;
    isVoided: boolean;
    steps: [
        {
            id: number;
            isVoided: boolean;
            mode: {
                id: number;
                title: string;
            };
            responsible: {
                id: number;
                name: string;
            };
        }
    ];
}

export interface RequirementTypeResponse {
    resultType: string;
    errors: string[];
    data: [{
        id: number;
        code: string;
        title: string;
        isVoided: boolean;
        sortKey: number;
        requirementDefinitions: [{
            id: number;
            title: string;
            isVoided: boolean;
            defaultIntervalWeeks: number;
            sortKey: number;
            fields: [{
                id: number;
                label: string;
                isVoided: boolean;
                sortKey: string;
                fieldType: string;
                unit: string | null;
                showPrevious: boolean;
            }];
            needsUserInput: boolean;
        }];
    }];
}

interface PreserveTagRequirement {
    requirementDefinitionId: number;
    intervalWeeks: number;
}

interface ErrorResponse {
    ErrorCount: number;
    Errors: {
        PropertyName: string;
        ErrorMessage: string;
    }[];
}

class PreservationApiError extends Error {

    data: ErrorResponse | null;

    constructor(message: string, apiResponse?: ErrorResponse) {
        super(message);
        this.data = apiResponse || null;
        this.name = 'PreservationApiError';
    }
}


/**
 * Wraps the data return in a promise and delays the response.
 *
 * @param data Any data that is to be returned by the promise
 * @param fail Should the promise be rejected? Default: false
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function DelayData(data: any, fail = false): Promise<any> {
    return new Promise((resolve, reject) => {
        if (fail) {
            setTimeout(() => reject(data), 3000);
        } else {
            setTimeout(() => resolve(data), 3000);
        }
    });
}

function getPreservationApiError(error: any): PreservationApiError {
    if (error.response.status == 500) {
        return new PreservationApiError(error.response.data);
    }

    const response = error.response.data as ErrorResponse;
    let errorMessage = `${error.response.status} (${error.response.statusText})`;

    if (error.response.data) {
        errorMessage = response.Errors.map(err => err.ErrorMessage).join(', ');
    }

    return new PreservationApiError(errorMessage, response);
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
     *
     * @param listOfTagNo List of Tag Numbers
     * @param stepId Step ID
     * @param requirements List of Requirements
     * @param projectName Name of affected project
     * @param remark Optional: Remark for all tags
     * @param setRequestCanceller Optional: Returns a function that can be called to cancel the request
     *
     * @returns Promise<void>
     * @throws PreservationApiError
     */
    async preserveTags(
        listOfTagNo: string[],
        stepId: number,
        requirements: PreserveTagRequirement[],
        projectName: string,
        remark?: string | null,
        setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = '/Tags/Preserved';

        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            await this.client.post(endpoint, {
                tagNos: listOfTagNo,
                projectName: projectName,
                stepId: stepId,
                requirements,
                remark
            });
        } catch (error) {
            if (error.response.status == 500) {
                throw new PreservationApiError(error.response.data);
            }
            const response = error.response.data as ErrorResponse;
            const errorMessage = response.Errors.map(err => err.ErrorMessage).join(', ');
            throw new PreservationApiError(errorMessage, response);
        }

    }

    /**
     * Get preserved tags for currently logged in user in current plant context
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getPreservedTags(projectName: string,
        setRequestCanceller?: RequestCanceler
    ): Promise<PreservedTagResponse[]> {
        const endpoint = '/Tags/Preserved';

        const settings: AxiosRequestConfig = {
            params: {
                projectName: projectName
            },
        };
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
    async startPreservation(tags: number[]): Promise<void> {
        const endpoint = '/Tags/Preserved/StartPreservation';
        const settings: AxiosRequestConfig = {};
        await this.client.put(endpoint, tags, settings);
    }

    /**
     * Set given tags to 'preserved'
     * @param tags  List with tag IDs
     */
    async preserve(tags: number[]): Promise<void> {
        const endpoint = '/Tags/Preserved/Preserve';
        const settings: AxiosRequestConfig = {};
        await this.client.put(endpoint, tags, settings);
    }

    /**
     * Get all journeys
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getJourneys(setRequestCanceller?: RequestCanceler): Promise<JourneyResponse[]> {
        const endpoint = '/Journeys';
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        const result = await this.client.get<JourneyResponse[]>(endpoint, settings);
        return result.data;
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

    async getPreservedTagDetails(tagId: number, setRequestCanceller?: RequestCanceler): Promise<PreservedTagDetailsResponse> {
        const endpoint = `/Tags/Preserved/${tagId}`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<PreservedTagDetailsResponse>(endpoint, settings);
            return result.data;
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
     * Get all requirement types
     *
     * @param includeVoided Include voided Requirements in result
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getRequirementTypes(includeVoided = false, setRequestCanceller?: RequestCanceler): Promise<RequirementTypeResponse> {
        const endpoint = '/RequirementTypes';
        const settings: AxiosRequestConfig = {
            params: {
                includeVoided: includeVoided
            }
        };
        this.setupRequestCanceler(settings, setRequestCanceller);
        const result = await this.client.get<RequirementTypeResponse>(endpoint, settings);
        return result.data;
    }
}


export default PreservationApiClient;
