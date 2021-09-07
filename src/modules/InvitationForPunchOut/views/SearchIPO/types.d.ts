export interface IPO {
    id: number;
    title: string;
    status: string;
    type: string;
    createdAtUtc: Date;
    startTimeUtc: Date;
    completedAtUtc?: Date;
    acceptedAtUtc?: Date;
    contractorRep: string;
    constructionCompanyRep: string;
    commissioningReps: string[];
    operationReps: string[];
    mcPkgNos?: string[];
    commPkgNos?: string[];
}

export interface IPOs {
    maxAvailable: number;
    invitations: IPO[];
}

export type ProjectDetails = {
    id: number;
    name: string;
    description: string;
}

export type IPOFilter = {
    ipoStatuses: string[];
    functionalRoleCode: string;
    personOid: string;
    ipoIdStartsWith: string;
    commPkgNoStartsWith: string;
    mcPkgNoStartsWith: string;
    titleStartsWith: string;
    lastChangedAtFromUtc?: Date;
    lastChangedAtToUtc?: Date;
    punchOutDateFromUtc?: Date;
    punchOutDateToUtc?: Date;
    punchOutDates: string[];
};

export interface SavedIPOFilter {
    id: number;
    title: string;
    criteria: string;
    defaultFilter: boolean;
    rowVersion: string;
}
