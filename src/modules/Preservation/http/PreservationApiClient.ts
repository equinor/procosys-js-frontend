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
        readyToBeCompleted: boolean;
        requirements: [
            {
                id: number;
                requirementTypeCode: string;
                nextDueTimeUtc: Date;
                nextDueAsYearAndWeek: string;
                nextDueWeeks: number;
                readyToBePreserved: boolean;
                rowVersion: string;
            }
        ];
        status: string;
        responsibleCode: string;
        tagFunctionCode: string;
        tagNo: string;
        tagType: string;
        rowVersion: string;
    }];
}

type TagSearchResponse = {
    tagNo: string;
    description: string;
    purchaseOrderNumber: string;
    commPkgNo: string;
    mcPkgNo: string;
    registerCode: string;
    tagFunctionCode: string;
    mccrResponsibleCodes: string;
    isPreserved: boolean;
}

interface CheckAreaTagNoResponse {
    tagNo: string;
    exists: boolean;
}

interface ModeResponse {
    id: number;
    title: string;
}

interface PresJourneyResponse {
    id: number;
    title: string;
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
    remark: string;
    storageArea: string;
    rowVersion: string;
}

interface TagListFilter {
    tagNoStartsWith: string | null;
    purchaseOrderNoStartsWith: string | null;
    storageAreaStartsWith: string | null;
    commPkgNoStartsWith: string | null;
    mcPkgNoStartsWith: string | null;
    journeyIds: string[];
    modeIds: string[];
    dueFilters: string[];
    preservationStatus: string | null;
    actionStatus: string | null;
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
                rowVersion: string;
            };
            responsible: {
                id: number;
                name: string;
                rowVersion: string;
            };
        }
    ];
    rowVersion: string;
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
        rowVersion: string;
    }];
}

interface ResponsibleEntity {
    id: string;
    code: string;
    title: string;
}

interface AreaFilterEntity {
    code: string;
    description: string;
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
    rowVersion: string;
}

interface ActionResponse {
    id: number;
    title: string;
    dueTimeUtc: Date | null;
    isClosed: boolean;
    rowVersion: string;
}

interface ActionDetailsResponse {
    id: number;
    title: string;
    description: string;
    dueTimeUtc: Date;
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
    rowVersion: string;
}

interface PreserveTagRequirement {
    requirementDefinitionId: number;
    intervalWeeks: number;
}

interface TagRequirementRecordValues {
    requirementId: number;
    comment: string | null;
    numberValues: RecordNumberValue[];
    checkBoxValues: RecordCheckBoxValue[];
}

interface RecordNumberValue {
    fieldId: number;
    value: number | null;
    isNA: boolean;
}

interface RecordCheckBoxValue {
    fieldId: number;
    isChecked: boolean;
}

interface JourneyFilterResponse {
    id: string;
    title: string;
}

interface ModeFilterResponse {
    id: string;
    title: string;
}

interface RequirementTypeFilterResponse {
    id: string;
    title: string;
}

interface TagFunctionFilterResponse {
    code: string;
}

interface DisciplineFilterResponse {
    code: string;
    description: string;
}

interface AttachmentResponse {
    id: number;
    fileName: string;
    rowVersion: string;
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
    if (error.response.status == 409) {
        return new PreservationApiError('Data has been updated by another user. Please reload and start over!');
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

    async setRemarkAndStorageArea(tagId: number, remark: string, storageArea: string, rowVersion: string, setRequestCanceller?: RequestCanceler): Promise<string> {
        const endpoint = `/Tags/${tagId}`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.put(endpoint, {
                remark,
                storageArea,
                rowVersion
            });
            return result.data;
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
     * Add a set of tags to preservation scope.
     *
     * @param listOfTagNo List of Tag Numbers
     * @param stepId Step ID
     * @param requirements List of Requirements
     * @param projectName Name of affected project
     * @param remark Optional: Remark for all tags
     * @param storageArea Optional: Storage area for all tags
     * @param setRequestCanceller Optional: Returns a function that can be called to cancel the request
     *
     * @returns Promise<void>
     * @throws PreservationApiError
     */
    async addTagsToScope(
        listOfTagNo: string[],
        stepId: number,
        requirements: PreserveTagRequirement[],
        projectName: string,
        remark?: string | null,
        storageArea?: string | null,
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
                remark,
                storageArea
            });
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
     * Add a set of tags to preservation scope based on autoscoping.
     *
     * @param listOfTagNo List of Tag Numbers
     * @param stepId Step ID
     * @param projectName Name of affected project
     * @param remark Optional: Remark for all tags
     * @param storageArea Optional: Storage area for all tags
     * @param setRequestCanceller Optional: Returns a function that can be called to cancel the request
     *
     * @returns Promise<void>
     * @throws PreservationApiError
     */
    async addTagsToScopeByAutoscoping(
        listOfTagNo: string[],
        stepId: number,
        projectName: string,
        remark?: string | null,
        storageArea?: string | null,
        setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = '/Tags/AutoScope';

        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            await this.client.post(endpoint, {
                tagNos: listOfTagNo,
                projectName: projectName,
                stepId: stepId,
                remark,
                storageArea
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
    * @param storageArea Optional: Storage area for all tags
    * @param setRequestCanceller Optional: Returns a function that can be called to cancel the request
    *
    * @returns Promise<void>
    * @throws PreservationApiError
    */
    async createNewAreaTagAndAddToScope(
        areaTagType: string,
        stepId: number,
        requirements: PreserveTagRequirement[],
        projectName: string,
        disciplineCode?: string,
        areaCode?: string | null,
        suffix?: string,
        description?: string,
        remark?: string | null,
        storageArea?: string,
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
                remark,
                storageArea
            });
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    async checkAreaTagNo(
        projectName: string,
        areaTagType: string,
        disciplineCode: string,
        areaCode?: string | null,
        tagNoSuffix?: string | null,
        setRequestCanceller?: RequestCanceler
    ): Promise<CheckAreaTagNoResponse> {
        const endpoint = '/Tags/CheckAreaTagNo';
        const settings: AxiosRequestConfig = {
            params: {
                ProjectName: projectName,
                AreaTagType: areaTagType,
                DisciplineCode: disciplineCode,
                AreaCode: areaCode,
                TagNoSuffix: tagNoSuffix,
            }
        };
        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            const result = await this.client.get<CheckAreaTagNoResponse>(endpoint, settings);
            return result.data;
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
     * Get preserved tags for currently logged in user in current plant context
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getPreservedTags(
        projectName: string,
        page: number,
        size: number,
        sortProperty: string | null,
        sortDirection: string | null,
        tagFilter: TagListFilter,
        setRequestCanceller?: RequestCanceler
    ): Promise<PreservedTagResponse> {
        const endpoint = '/Tags';

        const settings: AxiosRequestConfig = {
            params: {
                projectName: projectName,
                page: page,
                size: size,
                property: sortProperty,
                direction: sortDirection,
                ...tagFilter,
            },
        };

        const qs = require('qs');
        settings.paramsSerializer = (p): string => {
            return qs.stringify(p);
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
     * Complete  given tags
     * @param tags  List with tag IDs
     */
    async complete(tags: number[]): Promise<void> {
        const endpoint = '/Tags/CompletePreservation';
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

    /**
     * Get all responsibles, filtered by project
     *
     * @param project Project Name
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getResponsiblesFilterForProject(project: string, setRequestCanceller?: RequestCanceler): Promise<ResponsibleEntity[]> {
        const endpoint = '/FilterValues/Responsibles';
        const settings: AxiosRequestConfig = {
            params: {
                projectName: project
            }
        };
        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            const result = await this.client.get<ResponsibleEntity[]>(endpoint, settings);
            return result.data;
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
     * Get all areas, filtered by project
     *
     * @param project Project Name
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getAreaFilterForProject(project: string, setRequestCanceller?: RequestCanceler): Promise<AreaFilterEntity[]> {
        const endpoint = '/FilterValues/Areas';
        const settings: AxiosRequestConfig = {
            params: {
                projectName: project
            }
        };
        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            const result = await this.client.get<AreaFilterEntity[]>(endpoint, settings);
            return result.data;
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
     * Get list of tags that can be added to preservation scope
     */
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

    /**
     * Get list of tags by tag function, that can be added to preservation scope.
     */
    async getTagsByTagFunctionForAddPreservationScope(
        projectName: string,
        tagFunctionCode?: string,
        registerCode?: string,
        setRequestCanceller?: RequestCanceler
    ): Promise<TagSearchResponse[]> {
        const endpoint = '/Tags/Search/ByTagFunctions';

        const settings: AxiosRequestConfig = {
            params: {
                projectName: projectName,
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
                    numberValues: recordValues.numberValues,
                    checkBoxValues: recordValues.checkBoxValues,
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

    /**
     * Create new action
     */
    async createNewAction(
        tagId: number,
        title: string,
        description: string,
        dueTimeUtc: Date | null,
        setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/Tags/${tagId}/Actions`;

        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            await this.client.post(endpoint, {
                title: title,
                description: description,
                dueTimeUtc: dueTimeUtc,
            });
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
    * Update action
    */
    async updateAction(
        tagId: number,
        actionId: number,
        title: string,
        description: string,
        dueTimeUtc: Date | null,
        rowVersion: string,
        setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/Tags/${tagId}/Actions/${actionId}`;

        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            await this.client.put(endpoint, {
                title: title,
                description: description,
                dueTimeUtc: dueTimeUtc,
                rowVersion: rowVersion
            });
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
    * Close action
    */
    async closeAction(
        tagId: number,
        actionId: number,
        rowVersion: string,
        setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/Tags/${tagId}/Actions/${actionId}/Close`;

        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            await this.client.put(endpoint, {
                rowVersion: rowVersion
            });
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
    * Get action attachments   
    */
    async getActionAttachments(tagId: number, actionId: number, setRequestCanceller?: RequestCanceler): Promise<AttachmentResponse[]> {
        const endpoint = `/Tags/${tagId}/Actions/${actionId}/Attachments`;

        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<AttachmentResponse[]>(endpoint, settings);
            return result.data;
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
     * Add attachment to action 
     */
    async addAttachmentToAction(
        tagId: number,
        actionId: number,
        file: File,
        overwriteIfExists: boolean,
        setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/Tags/${tagId}/Actions/${actionId}/Attachments`;

        const formData = new FormData();
        formData.append('OverwriteIfExists', overwriteIfExists.toString());
        formData.append('File', file);

        const settings: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            await this.client.post(endpoint, formData, settings);
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
    *  Delete attachment on an action 
    */
    async deleteAttachmentOnAction(
        tagId: number,
        actionId: number,
        attachmentId: number,
        rowVersion: string,
        setRequestCanceller?: RequestCanceler): Promise<void> {

        const endpoint = `/Tags/${tagId}/Actions/${actionId}/Attachments/${attachmentId}`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            await this.client.delete(
                endpoint,
                {
                    data: { rowVersion: rowVersion }
                }
            );
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
    * Get download url for actopm attachment
    */
    async getDownloadUrlForActionAttachment(
        tagId: number,
        actionId: number,
        attachmentId: number,
        setRequestCanceller?: RequestCanceler): Promise<string> {

        const endpoint = `/Tags/${tagId}/Actions/${actionId}/Attachments/${attachmentId}`;
        const settings: AxiosRequestConfig = {
            params: {
                redirect: false
            }
        };
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<string>(endpoint, settings);
            return result.data;
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
        * Get journey filter values
        *
        * @param setRequestCanceller Returns a function that can be called to cancel the request
        */
    async getJourneyFilters(projectName: string, setRequestCanceller?: RequestCanceler): Promise<JourneyFilterResponse[]> {
        const endpoint = '/FilterValues/Journeys';
        const settings: AxiosRequestConfig = {
            params: {
                projectName: projectName,
            }
        };
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<JourneyFilterResponse[]>(endpoint, settings);
            return result.data;
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
    * Get modes filter values
    *
    * @param setRequestCanceller Returns a function that can be called to cancel the request
    */
    async getModeFilters(projectName: string, setRequestCanceller?: RequestCanceler): Promise<ModeFilterResponse[]> {
        const endpoint = '/FilterValues/Modes';
        const settings: AxiosRequestConfig = {
            params: {
                projectName: projectName,
            }
        };
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<ModeFilterResponse[]>(endpoint, settings);
            return result.data;
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
    * Get requirement type filter values
    *
    * @param setRequestCanceller Returns a function that can be called to cancel the request
    */
    async getRequirementTypeFilters(projectName: string, setRequestCanceller?: RequestCanceler): Promise<RequirementTypeFilterResponse[]> {
        const endpoint = '/FilterValues/RequirementTypes';
        const settings: AxiosRequestConfig = {
            params: {
                projectName: projectName,
            }
        };
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<RequirementTypeFilterResponse[]>(endpoint, settings);
            return result.data;
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
    * Get tag function filter values
    *
    * @param setRequestCanceller Returns a function that can be called to cancel the request
    */
    async getTagFunctionFilters(projectName: string, setRequestCanceller?: RequestCanceler): Promise<TagFunctionFilterResponse[]> {
        const endpoint = '/FilterValues/TagFunctions';
        const settings: AxiosRequestConfig = {
            params: {
                projectName: projectName,
            }
        };
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<TagFunctionFilterResponse[]>(endpoint, settings);
            return result.data;
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
    * Get discipline filter values
    *
    * @param setRequestCanceller Returns a function that can be called to cancel the request
    */
    async getDisciplineFilters(projectName: string, setRequestCanceller?: RequestCanceler): Promise<DisciplineFilterResponse[]> {
        const endpoint = '/FilterValues/Disciplines';
        const settings: AxiosRequestConfig = {
            params: {
                projectName: projectName,
            }
        };
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<DisciplineFilterResponse[]>(endpoint, settings);
            return result.data;
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
    * Get tag attachments
    */
    async getTagAttachments(tagId: number, setRequestCanceller?: RequestCanceler): Promise<AttachmentResponse[]> {
        const endpoint = `/Tags/${tagId}/Attachments`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<AttachmentResponse[]>(endpoint, settings);
            return result.data;
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
     * Add attachment to tag 
     */
    async addAttachmentToTag(
        tagId: number,
        file: File,
        overwriteIfExists: boolean,
        setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/Tags/${tagId}/Attachments`;

        const formData = new FormData();
        formData.append('OverwriteIfExists', overwriteIfExists.toString());
        formData.append('File', file);

        const settings: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            await this.client.post(endpoint, formData, settings);
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
    *  Delete attachment on a tag 
    */
    async deleteAttachmentOnTag(
        tagId: number,
        attachmentId: number,
        rowVersion: string,
        setRequestCanceller?: RequestCanceler): Promise<void> {

        const endpoint = `/Tags/${tagId}/Attachments/${attachmentId}`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            await this.client.delete(
                endpoint,
                {
                    data: { rowVersion: rowVersion }
                }
            );
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }


    /**
    * Get download url for  tag attachment
    */
    async getDownloadUrlForTagAttachment(tagId: number, attachmentId: number, setRequestCanceller?: RequestCanceler): Promise<string> {
        const endpoint = `/Tags/${tagId}/Attachments/${attachmentId}`;
        const settings: AxiosRequestConfig = {
            params: {
                redirect: false
            }
        };
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<string>(endpoint, settings);
            return result.data;
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
    * Get modes
    *
    * @param setRequestCanceller Returns a function that can be called to cancel the request
    */
    async getModes(setRequestCanceller?: RequestCanceler): Promise<ModeResponse[]> {
        const endpoint = '/Modes';

        const settings: AxiosRequestConfig = {
            params: {}
        };
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<ModeResponse[]>(
                endpoint,
                settings
            );
            return result.data;
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }

}

export default PreservationApiClient;
