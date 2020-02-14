export interface TagDetails {
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
}

export interface TagRequirement {
    id: number;
    requirementTypeCode: string;
    requirementTypeTitle: string;
    requirementDefinitionTitle: string;
    nextDueTimeUtc: Date;
    nextDueAsYearAndWeek: string;
    readyToBePreserved: boolean;
    fields: TagRequirementField[];
}

export interface TagRequirementField {
    id: number;
    label: string;
    fieldType: string;
    unit: string;
    showPrevious: boolean;
    currentValue: string;
    previousValue: string;
}