export interface PreservedTag {
    id: string;
    tagNo: string;
    description: string;
    mode: string;
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
    responsibleCode: string;
    firstUpcomingRequirement: {
        id: string;
        requirementDefintionId: string;
        nextDueTimeUtc: string;
        nextDueAsYearAndWeek: string;
        nextDueWeeks: string;
    };
    requirements: {
        id: string;
        requirementDefintionId: string;
        nextDueTimeUtc: string;
        nextDueAsYearAndWeek: string;
        nextDueWeeks: string;
    }[];
    tableData: {
        checked: boolean;
    };
}

