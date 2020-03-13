export interface PreservedTags {
    maxAvailable: number;
    tags: PreservedTag[];
}
export interface PreservedTag {
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
    requirements: Requirement[];
    status: string;
    responsibleCode: string;
    tagFunctionCode: string;
    tagNo: string;
    tagType: string;
}

export interface Requirement {
    id: number;
    requirementTypeCode: string;
    nextDueTimeUtc: Date;
    nextDueAsYearAndWeek: string;
    nextDueWeeks: number;
    readyToBePreserved: boolean;
}