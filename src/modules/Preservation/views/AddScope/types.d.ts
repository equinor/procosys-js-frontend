export interface Tag {
    tagNo: string;
}

export interface TagRow {
    tagNo: string;
    description: string;
    purchaseOrderNumber: string;
    commPkgNo: string;
    mcPkgNo: string;
    isPreserved: boolean;
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
    isVoided: boolean;
    mode: Mode;
    responsible: Responsible;
}

export interface Mode {
    id: number;
    title: string;
}

export interface Responsible {
    id: number;
    name: string;
}


/**
 * Requirement type
 */

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
