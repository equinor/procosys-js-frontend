import ApiClient from '../../../http/ApiClient';
import { AxiosRequestConfig } from 'axios';
import { IAuthService } from '../../../auth/AuthService';
import { RequestCanceler } from '../../../http/HttpClient';

const Settings = require('../../../../settings.json');

interface PreservedTagResponse {
    maxAvailable: number;
    tags: [{
        areaCode: string;
        calloffNo: string;
        commPkgNo: string;
        description: string;
        disciplineCode: string;
        id: number;
        isNew: boolean;
        isVoided: boolean;
        mcPkgNo: string;
        mode: string;
        nextMode: string;
        nextResponsibleCode: string;
        purchaseOrderNo: string;
        readyToBePreserved: boolean;
        readyToBeStarted: boolean;
        readyToBeTransferred: boolean;
        requirements: [
            {
                id: number;
                requirementTypeCode: string;
                nextDueTimeUtc: Date;
                nextDueAsYearAndWeek: string;
                nextDueWeeks: number;
                readyToBePreserved: boolean;
            }
        ];
        status: string;
        responsibleCode: string;
        tagFunctionCode: string;
        tagNo: string;
        tagType: string;
    }];
}

type TagSearchResponse = {
    tagNo: string;
    description: string;
    purchaseOrderNumber: string;
    commPkgNo: string;
    mcPkgNo: string;
    isPreserved: boolean;
}

interface TagDetailsResponse {
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
    readyToBePreserved: boolean;
}

interface JourneyResponse {
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

interface RequirementTypeResponse {
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

export interface DisciplineResponse {
    code: string;
    description: string;
}

export interface AreaResponse {
    code: string;
    description: string;
}

interface TagRequirementsResponse {
    id: number;
    intervalWeeks: number;
    nextDueWeeks: number;
    requirementTypeCode: string;
    requirementTypeTitle: string;
    requirementDefinitionTitle: string;
    nextDueTimeUtc: Date;
    nextDueAsYearAndWeek: string;
    readyToBePreserved: boolean;
    fields: [
        {
            id: number;
            label: string;
            fieldType: string;
            unit: string | null;
            showPrevious: boolean;
            currentValue:
            {
                isChecked: boolean;
                isNA: boolean;
                value: number | null;
            };
            previousValue:
            {
                isChecked: boolean;
                isNA: boolean;
                value: number | null;
            };
        }
    ];
    comment: string;
}

interface ActionResponse {
    id: number;
    title: string;
    dueTimeUtc: Date | null;
    isClosed: boolean;
}

interface ActionDetailsResponse {
    id: number;
    title: string;
    description: string;
    dueTimeUtc: Date | null;
    isClosed: boolean;
    createdAtUtc: Date;
    closedAtUtc: Date | null;
    createdBy: {
        id: number;
        firstName: string;
        lastName: string;
    };
    closedBy: {
        id: number;
        firstName: string;
        lastName: string;
    };
}

interface PreserveTagRequirement {
    requirementDefinitionId: number;
    intervalWeeks: number;
}

interface TagRequirementRecordValues {
    requirementId: number;
    comment: string | null;
    fieldValues: RecordFieldValue[];
}

interface RecordFieldValue {
    fieldId: number;
    value: string;
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
     * Add a set of tags to preservation scope.
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
        const endpoint = '/Tags/Standard';

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
            throw getPreservationApiError(error);
        }
    }

    /**
     * Create a new area tag and add it to preservation scope. 
     * 
    * @param tagNo List of Tag Numbers
    * @param diciplineCode Dicipline code
    * @param areaCode Area code
    * @param tagNoSuffix  TagNo suffix
    * @param stepId Step ID
    * @param requirements List of Requirements
    * @param projectName Name of affected project
    * @param description Description of new tag
    * @param remark Optional: Remark for all tags
    * @param setRequestCanceller Optional: Returns a function that can be called to cancel the request
    *
    * @returns Promise<void>
    * @throws PreservationApiError
    */
    async preserveNewAreaTag(
        areaTagType: string,
        stepId: number,
        requirements: PreserveTagRequirement[],
        projectName: string,
        disciplineCode?: string,
        areaCode?: string,
        suffix?: string,
        description?: string,
        remark?: string,
        setRequestCanceller?: RequestCanceler): Promise<void> {

        const endpoint = '/Tags/Area';
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            await this.client.post(endpoint, {
                projectName: projectName,
                areaTagType: areaTagType,
                disciplineCode: disciplineCode,
                areaCode: areaCode,
                tagNoSuffix: suffix,
                stepId: stepId,
                requirements,
                description,
                remark
            });
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
     * Get preserved tags for currently logged in user in current plant context
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getPreservedTags(projectName: string,
        setRequestCanceller?: RequestCanceler
    ): Promise<PreservedTagResponse> {
        const endpoint = '/Tags';

        const settings: AxiosRequestConfig = {
            params: {
                projectName: projectName,
                page: 0, //temporary
                size: 10000,   //temporary
                property: 'Due',  //temporary
                direction: 'Asc'
            },
        };
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<PreservedTagResponse>(
                endpoint,
                settings
            );
            return result.data;
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
     * Start preservation for the given tags.
     * @param tags  List with tag IDs
     */
    async startPreservation(tags: number[]): Promise<void> {
        const endpoint = '/Tags/StartPreservation';
        const settings: AxiosRequestConfig = {};
        try {
            await this.client.put(endpoint, tags, settings);
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }

    async startPreservationForTag(tagId: number): Promise<void> {
        const endpoint = `/Tags/${tagId}/StartPreservation`;
        const settings: AxiosRequestConfig = {};
        try {
            await this.client.put(endpoint, null, settings);
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
     * Set given tags to 'preserved' (bulk preserve)
     * @param tags  List with tag IDs
     */
    async preserve(tags: number[]): Promise<void> {
        const endpoint = '/Tags/BulkPreserve';
        const settings: AxiosRequestConfig = {};
        try {
            await this.client.put(endpoint, tags, settings);
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }

    async preserveSingleTag(tagId: number): Promise<void> {
        const endpoint = `/Tags/${tagId}/Preserve`;
        const settings: AxiosRequestConfig = {};
        try {
            await this.client.put(endpoint, null, settings);
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }

    async preserveSingleRequirement(tagId: number, requirementId: number): Promise<void> {
        const endpoint = `/Tags/${tagId}/Requirement/${requirementId}/Preserve`;
        const settings: AxiosRequestConfig = {};
        try {
            await this.client.post(endpoint, null, settings);
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
     * Transfer  given tags
     * @param tags  List with tag IDs
     */
    async transfer(tags: number[]): Promise<void> {
        const endpoint = '/Tags/Transfer';
        const settings: AxiosRequestConfig = {};
        try {
            await this.client.put(endpoint, tags, settings);
        } catch (error) {
            throw getPreservationApiError(error);
        }
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
        try {
            const result = await this.client.get<JourneyResponse[]>(endpoint, settings);
            return result.data;
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
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

        try {
            const result = await this.client.get<TagSearchResponse[]>(
                endpoint,
                settings
            );
            return result.data;
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }

    async getTagDetails(tagId: number, setRequestCanceller?: RequestCanceler): Promise<TagDetailsResponse> {
        const endpoint = `/Tags/${tagId}`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<TagDetailsResponse>(endpoint, settings);
            return result.data;
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }

    async getTagRequirements(tagId: number, setRequestCanceller?: RequestCanceler): Promise<TagRequirementsResponse[]> {
        const endpoint = `/Tags/${tagId}/Requirements`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<TagRequirementsResponse[]>(endpoint, settings);
            return result.data;
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }

    async recordTagRequirementValues(tagId: number, recordValues: TagRequirementRecordValues, setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/Tags/${tagId}/Requirement/${recordValues.requirementId}/RecordValues`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            await this.client.post(
                endpoint,
                {
                    fieldValues: recordValues.fieldValues,
                    comment: recordValues.comment
                },
                settings
            );
        } catch (error) {
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

        try {
            const result = await this.client.get<RequirementTypeResponse>(endpoint, settings);
            return result.data;
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
     * Get disciplines
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getDisciplines(setRequestCanceller?: RequestCanceler): Promise<DisciplineResponse[]> {
        const endpoint = '/Disciplines';
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<DisciplineResponse[]>(endpoint, settings);
            return result.data;
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
     * Get areas
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getAreas(setRequestCanceller?: RequestCanceler): Promise<AreaResponse[]> {
        const endpoint = '/Areas';
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<AreaResponse[]>(endpoint, settings);
            return result.data;
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
     * Get actions
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getActions(tagId: number, setRequestCanceller?: RequestCanceler): Promise<ActionResponse[]> {
        const endpoint = `/Tags/${tagId}/Actions`;
        const settings: AxiosRequestConfig = {
            params: {
                tagId: tagId,
            }
        };

        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<ActionResponse[]>(endpoint, settings);
            return result.data;
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
    * Get action details 
    *
    * @param setRequestCanceller Returns a function that can be called to cancel the request
    */
    async getActionDetails(tagId: number, actionId: number, setRequestCanceller?: RequestCanceler): Promise<ActionDetailsResponse> {
        const endpoint = `/Tags/${tagId}/Actions/${actionId}`;
        const settings: AxiosRequestConfig = {
            params: {
                tagId: tagId,
                actionId: actionId,
            }
        };
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<ActionDetailsResponse>(endpoint, settings);
            return result.data;
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }
}

export default PreservationApiClient;
