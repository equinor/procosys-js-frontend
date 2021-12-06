export interface Tag {
    tagId?: number;
    tagNo: string;
    description: string;
    mcPkgNo?: string;
    areaCode?: string;
    remark?: string;
    storageArea?: string;
    tagType?: string;
    disciplineCode?: string;
}

export interface TagRow {
    noCheckbox?: boolean;
    tagNo: string;
    description: string;
    purchaseOrderTitle: string;
    commPkgNo: string;
    mcPkgNo: string;
    mccrResponsibleCodes: string;
    tagFunctionCode: string;
    isPreserved: boolean;
    isSelected?: boolean;
    tableData?: {
        checked: boolean;
    };
}

export interface TagMigrationRow {
    noCheckbox?: boolean;
    id: number;
    tagNo: string;
    description: string;
    nextUpcommingDueTime: Date;
    startDate: Date;
    registerCode: string;
    tagFunctionCode: string;
    commPkgNo: string;
    mcPkgNo: string;
    callOfNo: string;
    purchaseOrderTitle: string;
    mccrResponsibleCodes: string;
    preservationRemark: string;
    storageArea: string;
    modeCode: string;
    heating: boolean;
    special: boolean;
    isPreserved: boolean;
    isSelected?: boolean;
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
    title: string;
    isVoided: boolean;
    mode: Mode;
    responsible: Responsible;
    rowVersion: string;
}

export interface Mode {
    id: number;
    title: string;
    forSupplier: boolean;
    rowVersion: string;
}

export interface Responsible {
    code: string;
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

export interface PurchaseOrder {
    title: string;
    description: string;
}
