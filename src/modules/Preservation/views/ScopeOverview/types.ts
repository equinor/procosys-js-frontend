export interface PreservedTag {
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
    //requirements: Requirements[]; //todo
}

export interface Requirements {
    nextDueTimeUtc: string;
    nextDueAsYearAndWeek: string;
}
