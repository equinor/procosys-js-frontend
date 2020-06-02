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
