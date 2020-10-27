export interface PreservedTags {
    maxAvailable: number;
    tags: PreservedTag[];
}
export interface PreservedTag {
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
    isInUse: boolean;
    requirements: Requirement[];
    status: string;
    responsibleCode: string;
    responsibleDescription: string;
    tagFunctionCode: string;
    tagNo: string;
    tagType?: string;
    rowVersion: string;
}

export interface Requirement {
    id: number;
    requirementTypeCode: string;
    requirementTypeIcon: string;
    nextDueTimeUtc: Date;
    nextDueAsYearAndWeek: string;
    nextDueWeeks: number;
    readyToBePreserved: boolean;
}

export interface TagListFilter {
    tagNoStartsWith: string | null;
    purchaseOrderNoStartsWith: string | null;
    callOffStartsWith: string | null;
    storageAreaStartsWith: string | null;
    commPkgNoStartsWith: string | null;
    mcPkgNoStartsWith: string | null;
    journeyIds: string[];
    modeIds: string[];
    dueFilters: string[];
    requirementTypeIds: string[];
    tagFunctionCodes: string[];
    disciplineCodes: string[];
    preservationStatus: string | null;
    actionStatus: string | null;
    voidedFilter: string | null;
    responsibleIds: string[] | null;
    areaCodes: string[] | null;
}

export interface SavedTagListFilter {
    id: number;
    title: string;
    criteria: string;
    defaultFilter: boolean;
    rowVersion: string;
}
