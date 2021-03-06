export interface TagDetails {
    id: number;
    tagNo: string;
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
    purchaseOrderNo: string;
    areaCode: string;
    readyToBePreserved: boolean;
    remark: string;
    storageArea: string;
    tagType: string;
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
    forSupplier: boolean;
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
    icon: string;
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
    usage: string;
}

export interface RequirementField {
    id: number;
    label: string;
    isVoided: boolean;
    sortKey: number;
    fieldType: string;
    unit: string | null;
    showPrevious: boolean;
}
