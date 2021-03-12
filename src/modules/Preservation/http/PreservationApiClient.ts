import { AxiosError, AxiosRequestConfig } from 'axios';

import ApiClient from '../../../http/ApiClient';
import { IAuthService } from '../../../auth/AuthService';
import { ProCoSysApiError } from '../../../core/ProCoSysApiError';
import ProCoSysSettings from '../../../core/ProCoSysSettings';
import Qs from 'qs';
import { RequestCanceler } from '../../../http/HttpClient';

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
        readyToBeRescheduled: boolean;
        readyToBeDuplicated: boolean;
        isInUse: boolean;
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
    isInUse: boolean;
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
    journey: {
        id: number;
        title: string;
    };
    step: {
        id: number;
        title: string;
    };
    mode: {
        id: number;
        title: string;
    };
    responsible: {
        id: number;
        code: string;
        description: string;
    };
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
    disciplineCode: string;
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
            isInUse: boolean;
            mode: {
                id: number;
                title: string;
                isVoided: boolean,
                forSupplier: boolean,
                isInUse: boolean,
                rowVersion: string;
            };
            responsible: {
                id: number;
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

interface RequirementForDelete {
    requirementId: number | undefined;
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
    requirementType: {
        id: number;
        code: string;
        icon: string;
        title: string;
    };
    requirementDefinition: {
        id: number;
        title: string;
    };
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
    isInUse: boolean;
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

export class PreservationApiError extends ProCoSysApiError {
    constructor(error: AxiosError) {
        super(error);
        this.name = 'PreservationApiError';
    }
}

/**
 * API for interacting with data in ProCoSys.
 */
class PreservationApiClient extends ApiClient {

    constructor(authService: IAuthService) {
        super(
            authService,
            ProCoSysSettings.preservationApi.scope.join(' '),
            ProCoSysSettings.preservationApi.url
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
            throw new PreservationApiError(error);
        }
    }

    async updateTagStepAndRequirements(tagId: number, description: string, stepId: number, rowVersion: string, updatedRequirements: RequirementForUpdate[], newRequirements: RequirementFormInput[], deletedRequirements: RequirementForDelete[], setRequestCanceller?: RequestCanceler): Promise<string> {
        const endpoint = `/Tags/${tagId}/UpdateTagStepAndRequirements`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            const result = await this.client.put(endpoint, {
                description,
                stepId,
                newRequirements,
                updatedRequirements,
                deletedRequirements,
                rowVersion
            }, settings);
            return result.data;
        }
        catch (error) {
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
        }
    }

    /**
     * Duplicate area tag. 
     *
     * @param diciplineCode Dicipline code
     * @param areaCode Area code
     * @param tagNoSuffix  TagNo suffix
     * @param description Description of new tag
     * @param remark Optional: Remark for all tags
     * @param storageArea Optional: Storage area for all tags
     * @param setRequestCanceller Optional: Returns a function that can be called to cancel the request
     *
     * @returns Promise<void>
     * @throws PreservationApiError
    */
    async duplicateAreaTagAndAddToScope(
        sourceTagId: number,
        areaTagType: string,
        disciplineCode?: string,
        areaCode?: string | null,
        suffix?: string,
        description?: string,
        remark?: string,
        storageArea?: string,
        setRequestCanceller?: RequestCanceler): Promise<void> {

        const endpoint = '/Tags/DuplicateArea';
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            await this.client.post(endpoint, {
                sourceTagId: sourceTagId,
                areaTagType: areaTagType,
                disciplineCode: disciplineCode,
                areaCode: areaCode,
                tagNoSuffix: suffix,
                description,
                remark,
                storageArea
            });
        } catch (error) {
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
                    criteria: criteria,
                    rowVersion: rowVersion
                },
                settings
            );
        } catch (error) {
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
        }
    }

    async startPreservationForTag(tagId: number): Promise<void> {
        const endpoint = `/Tags/${tagId}/StartPreservation`;
        const settings: AxiosRequestConfig = {};
        try {
            await this.client.put(endpoint, null, settings);
        }
        catch (error) {
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
        }
    }

    async preserveSingleTag(tagId: number): Promise<void> {
        const endpoint = `/Tags/${tagId}/Preserve`;
        const settings: AxiosRequestConfig = {};
        try {
            await this.client.put(endpoint, null, settings);
        }
        catch (error) {
            throw new PreservationApiError(error);
        }
    }

    async preserveSingleRequirement(tagId: number, requirementId: number): Promise<void> {
        const endpoint = `/Tags/${tagId}/Requirements/${requirementId}/Preserve`;
        const settings: AxiosRequestConfig = {};
        try {
            await this.client.post(endpoint, null, settings);
        }
        catch (error) {
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
        }
    }

    /**
     * Reschedule given tags
     * @param tags  List with tag IDs
     * @param weeks  Weeks to add or subract
     * @param weeks  Direction of rescheduling (Earlier or Later)
     * @param comment  Comment
     */
    async reschedule(tags: PreservedTag[], weeks: number, direction: string, comment: string): Promise<void> {
        const endpoint = '/Tags/Reschedule';
        const settings: AxiosRequestConfig = {};
        try {
            await this.client.put(endpoint, { tags: tags, weeks: weeks, direction: direction, comment: comment }, settings);
        } catch (error) {
            throw new PreservationApiError(error);
        }
    }

    /**
     * Remove given tags
     * @param tags  List with tag IDs
     */
    async remove(tags: PreservedTag[], setRequestCanceller?: RequestCanceler): Promise<void> {
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            for await (const tag of tags) {
                const endpoint = `/Tags/${tag.id}`;
                await this.client.delete(
                    endpoint,
                    {
                        data: { rowVersion: tag.rowVersion }
                    }
                );
            }
        } catch (error) {
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
        }
    }

    /**
     * Delete journey step
     */
    async deleteJourneyStep(journeyId: number, stepId: number, rowVersion: string, setRequestCanceller?: RequestCanceler): Promise<void> {
        const endpoint = `/Journeys/${journeyId}/Steps/${stepId}`;
        const settings: AxiosRequestConfig = { data: { rowVersion: rowVersion } };
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            await this.client.delete(
                endpoint,
                settings
            );
        } catch (error) {
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
        }

    }


    async updateTagFunction(tagFunctionCode: string, registerCode: string, requirements: RequirementFormInput[]): Promise<boolean> {
        const endpoint = '/TagFunctions';
        const data: UpdateTagFunctionRequestData = {
            registerCode: registerCode,
            tagFunctionCode: tagFunctionCode,
            requirements: requirements
        };
        try {
            await this.client.put(endpoint, data);
            return true;
        } catch (error) {
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
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
            throw new PreservationApiError(error);
        }
    }
}

export default PreservationApiClient;
