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
    readyToBePreserved: boolean;
    remark: string;
    storageArea: string;
    rowVersion: string;
}

/**
 * Journey
 */

export interface Journey {
    id: number;
    title: string;
    isVoided: boolean;
    steps: Step[];
}

export interface Step {
    id: number;
    title: string;
    isVoided: boolean;
    mode: Mode;
    rowVersion: string;
}

export interface Mode {
    id: number;
    title: string;
    rowVersion: string;
}

/**
 * Requirement type
 */

export interface Requirement {
    requirementDefinitionId: number;
    intervalWeeks: number;
}

export interface RequirementType {
    id: number;
    code: string;
    title: string;
    isVoided: boolean;
    sortKey: number;
    requirementDefinitions: RequirementDefinition[];
}

export interface RequirementDefinition {
    id: number;
    title: string;
    isVoided: boolean;
    defaultIntervalWeeks: number;
    sortKey: number;
    fields: RequirementField[];
    needsUserInput: boolean;
}

export interface RequirementField {
    id: number;
    label: string;
    isVoided: boolean;
    sortKey: string;
    fieldType: string;
    unit: string | null;
    showPrevious: boolean;
}
