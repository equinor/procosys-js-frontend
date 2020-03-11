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
    purchaseOrderNo: string;
    remark: string;
    readyToBePreserved: boolean;
    readyToBeTransferred: boolean;
    requirements: Requirement[];
    status: string;
    responsibleCode: string;
    tagFunctionCode: string;
    tagNo: string;
    tagType?: string;
}

export interface Requirement {
    id: number;
    requirementTypeCode: string;
    nextDueTimeUtc: Date;
    nextDueAsYearAndWeek: string;
    nextDueWeeks: number;
    readyToBePreserved: boolean;
}