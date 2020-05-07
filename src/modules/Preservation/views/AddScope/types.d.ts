export interface Tag {
    tagNo: string;
    description: string;
    mcPkgNo?: string;
}

export interface TagRow {
    tagNo: string;
    description: string;
    purchaseOrderNumber: string;
    commPkgNo: string;
    mcPkgNo: string;
    mccrResponsibleCodes: string;
    tagFunctionCode: string;
    isPreserved: boolean;
    tableData?: {
        checked: boolean;
    };
}

export interface CheckAreaTagNo {
    tagNo: string;
    exists: boolean;
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

/**
 * Interfaces for area tag
 */
export interface Discipline {
    code: string;
    description: string;
}

export interface Area {
    code: string;
    description: string;
}
