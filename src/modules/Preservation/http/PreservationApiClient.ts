import ApiClient from '../../../http/ApiClient';
import Axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { IAuthService } from '../../../auth/AuthService';
import { RequestCanceler } from '../../../http/HttpClient';
import Qs from 'qs';

const Settings = require('../../../../settings.json');
const scopes = JSON.parse(Settings.externalResources.preservationApi.scope.replace(/'/g, '"'));

interface PreservedTagResponse {
    maxAvailable: number;
    tags: [{
        actionStatus: string;
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
                requirementTypeIcon: string;
                nextDueTimeUtc: Date;
                nextDueAsYearAndWeek: string;
                nextDueWeeks: number;
                readyToBePreserved: boolean;
            }
        ];
        status: string;
        responsibleCode: string;
        responsibleDescription: string;
        tagFunctionCode: string;
        tagNo: string;
        tagType: string;
        rowVersion: string;
    }];
}

type TagSearchResponse = {
    tagNo: string;
    description: string;
    purchaseOrderTitle: string;
    commPkgNo: string;
    mcPkgNo: string;
    registerCode: string;
    tagFunctionCode: string;
    mccrResponsibleCodes: string;
    isPreserved: boolean;
}

type TagMigrationResponse = {
    id: number;
    tagNo: string;
    description: string;
    nextUpcommingDueTime: Date;
    startDate: Date;
    registerCode: string;
    tagFunctionCode: string;
    commPkgNo: string;
    mcPkgNo: string;
    callOfNo: string;
    purchaseOrderTitle: string;
    mccrResponsibleCodes: string;
    preservationRemark: string;
    storageArea: string;
    modeCode: string;
    heating: boolean;
    special: boolean;
    isPreserved: boolean;
}


type PreservedTag = {
    id: number;
    rowVersion: string;
};

interface CheckAreaTagNoResponse {
    tagNo: string;
    exists: boolean;
}

interface ModeResponse {
    id: number;
    title: string;
    forSupplier: boolean;
    inUse: boolean;
    isVoided: boolean;
    rowVersion: string;
}

interface PresJourneyResponse {
    id: number;
    title: string;
}

interface TagDetailsResponse {
    id: number;
    tagNo: string;
    isVoided: boolean;
    description: string;
    status: string;
    journeyTitle: string;
    mode: string;
    responsibleName: string;
    commPkgNo: string;
    mcPkgNo: string;
    calloffNo: string;
    purchaseOrderNo: string;
    areaCode: string;
    readyToBePreserved: boolean;
    remark: string;
    storageArea: string;
    rowVersion: string;
    tagType: string;
}

interface TagListFilter {
    tagNoStartsWith: string | null;
    purchaseOrderNoStartsWith: string | null;
    callOffStartsWith: string | null;
    storageAreaStartsWith: string | null;
    commPkgNoStartsWith: string | null;
    mcPkgNoStartsWith: string | null;
    journeyIds: string[];
    modeIds: string[];
    dueFilters: string[];
    preservationStatus: string | null;
    actionStatus: string | null;
}

interface SavedScopeFilterResponse {
    id: number;
    title: string;
    defaultFilter: boolean;
    criteria: string;
    rowVersion: string;
}

interface JourneyResponse {
    id: number;
    title: string;
    isVoided: boolean;
    isInUse: boolean;
    steps: [
        {
            id: number;
            title: string;
            isVoided: boolean;
            autoTransferMethod: string;
            mode: {
                id: number;
                title: string;
                rowVersion: string;
            };
            responsible: {
                code: string;
                title: string;
                rowVersion: string;
            };
            rowVersion: string;
        }
    ];
    rowVersion: string;
}

interface RequirementTypeResponse {
    id: number;
    code: string;
    title: string;
    isVoided: boolean;
    icon: string;
    sortKey: number;
    rowVersion: string;
    isInUse: boolean;
    requirementDefinitions: [{
        id: number;
        title: string;
        isVoided: boolean;
        defaultIntervalWeeks: number;
        sortKey: number;
        usage: string;
        isInUse: boolean;
        rowVersion: string;
        fields: [{
            id: number;
            label: string;
            isVoided: boolean;
            sortKey: number;
            fieldType: string;
            unit: string;
            showPrevious: boolean;
            isInUse: boolean;
            rowVersion: string;
        }];
        needsUserInput: boolean;
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

interface RequirementFormInput {
    requirementDefinitionId: number;
    intervalWeeks: number;
}

interface RequirementForUpdate {
    requirementId: number | undefined;
    intervalWeeks: number;
    isVoided: boolean | undefined;
    rowVersion: string | undefined;
}

interface FieldsFormInput {
    id: number | null;
    rowVersion: string | null;
    isVoided: boolean | null;
    sortKey: number;
    fieldType: string;
    label: string;
    unit: string;
    showPrevious: boolean;
}

interface UpdateTagFunctionRequestData {
    registerCode: string;
    tagFunctionCode: string;
    requirements: RequirementFormInput[];
    rowVersion?: string;
}

interface TagRequirementsResponse {
    id: number;
    intervalWeeks: number;
    nextDueWeeks: number;
    requirementTypeCode: string;
    requirementTypeIcon: string;
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
                id: string | null;
                fileName: string | null;
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
    isVoided: boolean;
    rowVersion: string;
}

interface ActionResponse {
    id: number;
    title: string;
    dueTimeUtc: Date | null;
    isClosed: boolean;
    attachmentCount: number;
    rowVersion: string;
}

interface ActionDetailsResponse {
    id: number;
    title: string;
    description: string;
    dueTimeUtc: Date;
    isClosed: boolean;
    createdAtUtc: Date;
    modifiedAtUtc: Date | null;
    closedAtUtc: Date | null;
    createdBy: {
        id: number;
        firstName: string;
        lastName: string;
    };
    modifiedBy: {
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

interface TagFunctionResponse {
    id: number;
    code: string;
    description: string;
    registerCode: string;
    isVoided: boolean;
    requirements: {
        id: number;
        requirementDefinitionId: number;
        intervalWeeks: number;
    }[];
    rowVersion: string;
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

interface HistoryResponse {
    id: number;
    description: string;
    createdAtUtc: Date;
    createdBy: {
        id: number;
        firstName: string;
        lastName: string;
    };
    eventType: string;
    dueWeeks: number;
    tagRequirementId: number;
    preservationRecordGuid: string;
}

class PreservationApiError extends Error {

    data: AxiosResponse | null;
    isCancel: boolean;

    constructor(message: string, apiResponse?: AxiosResponse) {
        super(message);
        this.data = apiResponse || null;
        this.name = 'PreservationApiError';
        this.isCancel = false;
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

function getPreservationApiError(error: AxiosError): PreservationApiError {
    if (Axios.isCancel(error)) {
        const cancelledError = new PreservationApiError('The request was cancelled');
        cancelledError.isCancel = true;
        return cancelledError;
    }

    if (!error || !error.response) {
        console.error('An unknown API error occured, error: ', error);
        return new PreservationApiError('Unknown error');
    }
    if (error.response.status == 500) {
        return new PreservationApiError(error.response.data, error.response);
    }
    if (error.response.status == 409) {
        return new PreservationApiError('Data has been updated by another user. Please reload and start over!', error.response);
    }
    if (error.response.status == 404) {
        return new PreservationApiError(error.response.data, error.response);
    }
    if (error.response.status == 400) {
        try {
            // input and business validation errors
            let validationErrorMessage = error.response.data.title;
            const validationErrors = error.response.data.errors;

            for (const validatedField in validationErrors) {
                const fieldErrors = validationErrors[validatedField].join(' | ');
                validationErrorMessage += ` ${fieldErrors} `;
            }

            return new PreservationApiError(validationErrorMessage, error.response);
        } catch (exception) {
            return new PreservationApiError('Failed to parse validation errors', error.response);
        }
    }
    try {
        const apiErrorResponse = error.response.data as ErrorResponse;
        let errorMessage = `${error.response.status} (${error.response.statusText})`;

        if (error.response.data) {
            errorMessage = apiErrorResponse.Errors.map(err => err.ErrorMessage).join(', ');
        }
        return new PreservationApiError(errorMessage, error.response);
    } catch (err) {
        return new PreservationApiError('Failed to parse errors', error.response);
    }
}

/**
 * API for interacting with data in ProCoSys.
 */
class PreservationApiClient extends ApiClient {

    constructor(authService: IAuthService) {
        super(
            authService,
            scopes.join(' '),
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

    async updateStepAndRequirements(tagId: number, stepId: number, rowVersion: string, updatedRequirements: RequirementForUpdate[], newRequirements: RequirementFormInput[], setRequestCanceller?: RequestCanceler): Promise<string> {
        const endpoint = `/Tags/${tagId}/UpdateTagStepAndRequirements`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            const result = await this.client.put(endpoint, {
                stepId,
                newRequirements,
                updatedRequirements,
                rowVersion
            }, settings);
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
     * migrate a set of tags to preservation scope.
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
    async migrateTagsToScope(
        listOfTagNo: string[],
        stepId: number,
        requirements: PreserveTagRequirement[],
        projectName: string,
        remark?: string | null,
        storageArea?: string | null,
        setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = '/Tags/MigrateStandard';

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
        purchaseOrderCalloffCode?: string | null,
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
                purchaseOrderCalloffCode: purchaseOrderCalloffCode,
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
        purchaseOrderCalloffCode?: string | null,
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
                PurchaseOrderCalloffCode: purchaseOrderCalloffCode,
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

        settings.paramsSerializer = (p): string => {
            return Qs.stringify(p);
        };

        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<PreservedTagResponse>(
                endpoint,
                settings,

            );

            return result.data;
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }


    /**
     * Export tags to excel
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async exportTagsToExcel(
        projectName: string,
        sortProperty: string | null,
        sortDirection: string | null,
        tagFilter: TagListFilter,
        setRequestCanceller?: RequestCanceler
    ): Promise<BlobPart> {
        const endpoint = '/Tags/ExportTagsToExcel';

        const settings: AxiosRequestConfig = {
            params: {
                projectName: projectName,
                property: sortProperty,
                direction: sortDirection,
                ...tagFilter,
            },
            responseType: 'blob'
        };

        settings.paramsSerializer = (p): string => {
            return Qs.stringify(p);
        };

        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<BlobPart>(
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
     * Get saved tag list filters
     */
    async getSavedTagListFilters(projectName: string, setRequestCanceller?: RequestCanceler): Promise<SavedScopeFilterResponse[]> {
        const endpoint = '/SavedFilters';
        const settings: AxiosRequestConfig = {
            params: {
                projectName: projectName
            }
        };
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<SavedScopeFilterResponse[]>(endpoint, settings);
            return result.data;
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }
    /**
     * Add saved tag list filter
     */
    async addSavedTagListFilter(projectName: string, title: string, defaultFilter: boolean, criteria: string, setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = '/SavedFilter';
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            await this.client.post(
                endpoint,
                {
                    projectName: projectName,
                    title: title,
                    defaultFilter: defaultFilter,
                    criteria: criteria
                },
                settings
            );
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
    * Update saved tag list filter
    */
    async updateSavedTagListFilter(savedFilterid: number, title: string, defaultFilter: boolean, criteria: string, rowVersion: string, setRequestCanceller?: RequestCanceler): Promise<void> {

        const endpoint = `/SavedFilters/${savedFilterid}`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            await this.client.put(
                endpoint,
                {
                    title: title,
                    defaultFilter: defaultFilter,
                    critieria: criteria,
                    rowVersion: rowVersion
                },
                settings
            );
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
    * Delete saved tag list filter 
    */
    async deleteSavedTagListFilter(savedFilterId: number, rowVersion: string, setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/SavedFilters/${savedFilterId}`;
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
        const endpoint = `/Tags/${tagId}/Requirements/${requirementId}/Preserve`;
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
    async transfer(tags: PreservedTag[]): Promise<void> {
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
    async complete(tags: PreservedTag[]): Promise<void> {
        const endpoint = '/Tags/CompletePreservation';
        const settings: AxiosRequestConfig = {};
        try {
            await this.client.put(endpoint, tags, settings);
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
     * Void tag
     * @param tagId tag id of tag to void
     * @param rowVersion row version
     */
    async voidTag(tagId: number, rowVersion: string): Promise<void> {
        const endpoint = `Tags/${tagId}/Void`;
        const settings: AxiosRequestConfig = {};
        try {
            await this.client.put(endpoint, { rowVersion: rowVersion }, settings);
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
     * Unoid tag
     * @param tagId tag id of tag to unvoid
     * @param rowVersion row version
     */
    async unvoidTag(tagId: number, rowVersion: string): Promise<void> {
        const endpoint = `Tags/${tagId}/Unvoid`;
        const settings: AxiosRequestConfig = {};
        try {
            await this.client.put(endpoint, { rowVersion: rowVersion }, settings);
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
     * Get all journeys
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getJourneys(includeVoided: boolean, setRequestCanceller?: RequestCanceler): Promise<JourneyResponse[]> {
        const endpoint = '/Journeys';
        const settings: AxiosRequestConfig = {
            params: {
                includeVoided: includeVoided
            }
        };
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
     * Get journey
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getJourney(journeyId: number, includeVoided: boolean, setRequestCanceller?: RequestCanceler): Promise<JourneyResponse> {
        const endpoint = `/Journeys/${journeyId}`;
        const settings: AxiosRequestConfig = {
            params: {
                includeVoided: includeVoided
            }
        };
        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            const result = await this.client.get<JourneyResponse>(endpoint, settings);
            return result.data;
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
     * Add journey (not including steps)
     */
    async addJourney(title: string, setRequestCanceller?: RequestCanceler): Promise<number> {
        const endpoint = '/Journeys';
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.post(
                endpoint,
                {
                    title: title,
                },
                settings
            );
            return result.data;
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
     * Update journey
     */
    async updateJourney(journeyId: number, title: string, rowVersion: string, setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/Journeys/${journeyId}`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            await this.client.put(
                endpoint,
                {
                    title: title,
                    rowVersion: rowVersion
                },
                settings
            );
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
    * Add new step to journey
    */
    async addStepToJourney(journeyId: number, title: string, modeId: number, responsibleCode: string, autoTransferMethod: string, setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/Journeys/${journeyId}/AddStep`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            await this.client.post(
                endpoint,
                {
                    title: title,
                    modeId: modeId,
                    responsibleCode: responsibleCode,
                    autoTransferMethod: autoTransferMethod,
                },
                settings
            );
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
      * Update journey step
      */
    async updateJourneyStep(journeyId: number, stepId: number, title: string, modeId: number, responsibleCode: string, autoTransferMethod: string, rowVersion: string, setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/Journeys/${journeyId}/Steps/${stepId}`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            await this.client.put(
                endpoint,
                {
                    modeId: modeId,
                    responsibleCode: responsibleCode,
                    title: title,
                    autoTransferMethod: autoTransferMethod,
                    rowVersion: rowVersion,
                },
                settings
            );
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
      * Void journey
      */
    async voidJourney(journeyId: number, rowVersion: string, setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/Journeys/${journeyId}/Void`;

        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            await this.client.put(
                endpoint,
                {
                    rowVersion: rowVersion,
                },
                settings
            );
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
      * Unvoid journey
      */
    async unvoidJourney(journeyId: number, rowVersion: string, setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/Journeys/${journeyId}/Unvoid`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            await this.client.put(
                endpoint,
                {
                    rowVersion: rowVersion,
                },
                settings
            );
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
    * Delete journey 
    */
    async deleteJourney(journeyId: number, rowVersion: string, setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/Journeys/${journeyId}`;
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
    * Duplicate journey 
    */
    async duplicateJourney(journeyId: number, setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/Journeys/${journeyId}/Duplicate`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            await this.client.put(endpoint);
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
      * Void journey step
      */
    async voidJourneyStep(journeyId: number, stepId: number, rowVersion: string, setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/Journeys/${journeyId}/Steps/${stepId}/Void`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            await this.client.put(
                endpoint,
                {
                    rowVersion: rowVersion,
                },
                settings
            );
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
     * Unvoid journey step
     */
    async unvoidJourneyStep(journeyId: number, stepId: number, rowVersion: string, setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/Journeys/${journeyId}/Steps/${stepId}/Unvoid`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            await this.client.put(
                endpoint,
                {
                    rowVersion: rowVersion,
                },
                settings
            );
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
     * Delete journey step
     */
    async deleteJourneyStep(journeyId: number, stepId: number, rowVersion: string, setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/Journeys/${journeyId}/Steps/${stepId}`;
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
    * Swap steps on journey
    */
    async swapStepsOnJourney(journeyId: number, stepAId: number, stepARowVersion: string, stepBId: number, stepBRowVersion: string, setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/Journeys/${journeyId}/Steps/SwapSteps`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            await this.client.put(
                endpoint,
                {
                    stepA: {
                        id: stepAId,
                        rowVersion: stepARowVersion
                    },
                    stepB: {
                        id: stepBId,
                        rowVersion: stepBRowVersion
                    },
                },
                settings
            );
        } catch (error) {
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
         * Get tags for migration to new preservation module. Temporary. 
         */
    async getTagsForMigration(
        projectName: string,
        setRequestCanceller?: RequestCanceler
    ): Promise<TagMigrationResponse[]> {
        const endpoint = '/Tags/Search/Preserved';
        const settings: AxiosRequestConfig = {
            params: {
                projectName: projectName,
            },
        };
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<TagMigrationResponse[]>(
                endpoint,
                settings
            );
            return result.data;
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }
    /**
     * Get tag function details
     *
     * @param tagFunctionCode Tag Function Code
     * @param registerCode Register Code
     * @param setRequestCanceller Request Canceller
     */
    async getTagFunction(tagFunctionCode: string, registerCode: string, setRequestCanceller?: RequestCanceler): Promise<TagFunctionResponse> {
        const endpoint = `/TagFunctions/${tagFunctionCode}`;
        const settings: AxiosRequestConfig = {
            params: {
                registerCode: registerCode
            }
        };

        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            const result = await this.client.get<TagFunctionResponse>(endpoint, settings);
            return result.data;
        } catch (error) {
            throw getPreservationApiError(error);
        }

    }


    async updateTagFunction(tagFunctionCode: string, registerCode: string, requirements: RequirementFormInput[], rowVersion?: string): Promise<boolean> {
        const endpoint = '/TagFunctions';
        const data: UpdateTagFunctionRequestData = {
            registerCode: registerCode,
            tagFunctionCode: tagFunctionCode,
            requirements: requirements,
            rowVersion: rowVersion || ''
        };
        try {
            await this.client.put(endpoint, data);
            return true;
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    async voidUnvoidTagFunction(tagFunctionCode: string, registerCode: string, action: 'VOID' | 'UNVOID', rowVersion: string): Promise<void> {
        const endpoint = `/TagFunctions/${tagFunctionCode}/${action === 'VOID' ? 'Void' : 'Unvoid'}`;
        const data = {
            registerCode: registerCode,
            rowVersion: rowVersion
        };
        try {
            await this.client.put(endpoint, data);
        } catch (error) {
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

    async getTagRequirements(tagId: number, includeVoided = false, includeAllUsages = false, setRequestCanceller?: RequestCanceler): Promise<TagRequirementsResponse[]> {
        const endpoint = `/Tags/${tagId}/Requirements`;
        const settings: AxiosRequestConfig = {
            params: {
                IncludeVoided: includeVoided,
                IncludeAllUsages: includeAllUsages
            },
        };
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
        const endpoint = `/Tags/${tagId}/Requirements/${recordValues.requirementId}/RecordValues`;
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

    async recordAttachmentOnTagRequirement(
        tagId: number,
        requirementId: number,
        fieldId: number,
        file: File,
        setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/Tags/${tagId}/Requirements/${requirementId}/Attachment/${fieldId}`;

        const formData = new FormData();
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

    async removeAttachmentOnTagRequirement(
        tagId: number,
        requirementId: number,
        fieldId: number,
        setRequestCanceller?: RequestCanceler): Promise<void> {

        const endpoint = `/Tags/${tagId}/Requirements/${requirementId}/Attachment/${fieldId}`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            await this.client.delete(
                endpoint
            );
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    async getDownloadUrlForAttachmentOnTagRequirement(
        tagId: number,
        requirementId: number,
        fieldId: number,
        setRequestCanceller?: RequestCanceler): Promise<string> {

        const endpoint = `/Tags/${tagId}/Requirements/${requirementId}/Attachment/${fieldId}`;
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

    async getDownloadUrlForAttachmentOnPreservationRecord(
        tagId: number,
        tagRequirementId: number,
        preservationRecordGuid: string,
        setRequestCanceller?: RequestCanceler): Promise<string> {

        const endpoint = `/Tags/${tagId}/Requirements/${tagRequirementId}/PreservationRecord/${preservationRecordGuid}/Attachment`;
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
     * Get all requirement types
     *
     * @param includeVoided Include voided Requirements in result
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getRequirementTypes(includeVoided = false, setRequestCanceller?: RequestCanceler): Promise<RequirementTypeResponse[]> {
        const endpoint = '/RequirementTypes';
        const settings: AxiosRequestConfig = {
            params: {
                includeVoided: includeVoided
            }
        };
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<RequirementTypeResponse[]>(endpoint, settings);
            return result.data;
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
     * Get requirement type
     */
    async getRequirementType(requirementId: number, setRequestCanceller?: RequestCanceler): Promise<RequirementTypeResponse> {
        const endpoint = `/RequirementTypes/${requirementId}`;
        const settings: AxiosRequestConfig = {
            params: {}
        };
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<RequirementTypeResponse>(
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
     * Add requirement type 
     */
    async addRequirementType(code: string, title: string, icon: string, sortKey: number, setRequestCanceller?: RequestCanceler): Promise<number> {
        const endpoint = '/RequirementTypes';
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.post(
                endpoint,
                {
                    code: code,
                    title: title,
                    icon: icon,
                    sortKey: sortKey,
                },
                settings
            );
            return result.data;
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
     * Update requirement type 
     */
    async updateRequirementType(requirementTypeId: number, code: string, title: string, icon: string, sortKey: number, rowVersion: string, setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/RequirementTypes/${requirementTypeId}`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            await this.client.put(
                endpoint,
                {
                    code: code,
                    title: title,
                    icon: icon,
                    sortKey: sortKey,
                    rowVersion: rowVersion
                },
                settings
            );
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
    * Void requirement type 
    */
    async voidRequirementType(requirementTypeId: number, rowVersion: string, setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/RequirementTypes/${requirementTypeId}/Void`;

        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            await this.client.put(
                endpoint,
                {
                    rowVersion: rowVersion,
                },
                settings
            );
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
      * Unvoid requirement type 
      */
    async unvoidRequirementType(requirementTypeId: number, rowVersion: string, setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/RequirementTypes/${requirementTypeId}/Unvoid`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            await this.client.put(
                endpoint,
                {
                    rowVersion: rowVersion,
                },
                settings
            );
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
     * Delete requirement type 
     */
    async deleteRequirementType(requirementTypeId: number, rowVersion: string, setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/RequirementTypes/${requirementTypeId}`;
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
     * Add requirement definition 
     */
    async addRequirementDefinition(requirementTypeId: number, sortKey: number, usage: string, title: string, defaultIntervalWeeks: number, fields: FieldsFormInput[], setRequestCanceller?: RequestCanceler): Promise<number> {
        const endpoint = `/RequirementTypes/${requirementTypeId}/RequirementDefinitions`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.post(
                endpoint,
                {
                    sortKey,
                    usage,
                    title,
                    defaultIntervalWeeks,
                    fields
                },
                settings
            );
            return result.data;
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
     * Update requirement definition 
     */
    async updateRequirementDefinition(requirementTypeId: number, requirementDefinitionId: number, title: string, defaultIntervalWeeks: number, usage: string, sortKey: number,
        rowVersion: string, updatedFields: FieldsFormInput[], newFields: FieldsFormInput[], setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/RequirementTypes/${requirementTypeId}/RequirementDefinitions/${requirementDefinitionId}/`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            await this.client.put(
                endpoint,
                {
                    usage: usage,
                    title: title,
                    defaultIntervalWeeks: defaultIntervalWeeks,
                    sortKey: sortKey,
                    rowVersion: rowVersion,
                    updatedFields: updatedFields,
                    newFields: newFields
                },
                settings
            );
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
    * Void requirement definition 
    */
    async voidRequirementDefinition(requirementTypeId: number, requirementDefinitionId: number, rowVersion: string, setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/RequirementTypes/${requirementTypeId}/RequirementDefinitions/${requirementDefinitionId}/Void`;

        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            await this.client.put(
                endpoint,
                {
                    rowVersion: rowVersion,
                },
                settings
            );
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
    * Unvoid requirement definition 
    */
    async unvoidRequirementDefinition(requirementTypeId: number, requirementDefinitionId: number, rowVersion: string, setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/RequirementTypes/${requirementTypeId}/RequirementDefinitions/${requirementDefinitionId}/Unvoid`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            await this.client.put(
                endpoint,
                {
                    rowVersion: rowVersion,
                },
                settings
            );
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
    * Delete requirement definition 
    */
    async deleteRequirementDefinition(requirementTypeId: number, requirementDefinitionId: number, rowVersion: string, setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/RequirementTypes/${requirementTypeId}/RequirementDefinitions/${requirementDefinitionId}`;
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
    async getModes(includeVoided: boolean, setRequestCanceller?: RequestCanceler): Promise<ModeResponse[]> {
        const endpoint = '/Modes';

        const settings: AxiosRequestConfig = {
            params: {
                includeVoided: includeVoided
            }
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

    /**
    * Get mode
    */
    async getMode(modeId: number, setRequestCanceller?: RequestCanceler): Promise<ModeResponse> {
        const endpoint = `/Modes/${modeId}`;

        const settings: AxiosRequestConfig = {
            params: {}
        };
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<ModeResponse>(
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
     * Add mode 
     */
    async addMode(title: string, forSupplier: boolean, setRequestCanceller?: RequestCanceler): Promise<number> {
        const endpoint = '/Modes';
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.post(
                endpoint,
                {
                    title: title,
                    forSupplier: forSupplier
                },
                settings
            );
            return result.data;
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
     * Update mode
     */
    async updateMode(modeId: number, title: string, forSupplier: boolean, rowVersion: string, setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/Modes/${modeId}`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            await this.client.put(
                endpoint,
                {
                    title: title,
                    forSupplier: forSupplier,
                    rowVersion: rowVersion
                },
                settings
            );
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
    * Delete mode
    */
    async deleteMode(modeId: number, rowVersion: string, setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/Modes/${modeId}`;

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
    * Void mode
    */
    async voidMode(modeId: number, rowVersion: string, setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/Modes/${modeId}/Void`;

        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            await this.client.put(
                endpoint,
                {
                    rowVersion: rowVersion,
                },
                settings
            );
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
      * Unvoid mode
      */
    async unvoidMode(modeId: number, rowVersion: string, setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/Modes/${modeId}/Unvoid`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            await this.client.put(
                endpoint,
                {
                    rowVersion: rowVersion,
                },
                settings
            );
        } catch (error) {
            throw getPreservationApiError(error);
        }
    }

    /**
     * Get history log 
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getHistory(tagId: number, setRequestCanceller?: RequestCanceler): Promise<HistoryResponse[]> {
        const endpoint = `/Tags/${tagId}/History`;

        const settings: AxiosRequestConfig = {
            params: {}
        };
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<HistoryResponse[]>(
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
     * Get preservation record 
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getPreservationRecord(tagId: number, tagRequirementId: number, preservationRecordGuid: string, setRequestCanceller?: RequestCanceler): Promise<TagRequirementsResponse> {
        const endpoint = `/Tags/${tagId}/Requirements/${tagRequirementId}/PreservationRecord/${preservationRecordGuid}`;

        const settings: AxiosRequestConfig = {
            params: {}
        };
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<TagRequirementsResponse>(endpoint, settings);
            return result.data;
        }
        catch (error) {
            throw getPreservationApiError(error);
        }
    }
}

export default PreservationApiClient;
