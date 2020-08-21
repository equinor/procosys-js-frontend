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
    icon: string;
    requirementDefinitions: RequirementDefinition[];
}

export interface RequirementDefinition {
    id: number;
    title: string;
    isVoided: boolean;
    defaultIntervalWeeks: number;
    sortKey: number;
    fields: RequirementField[];
    usage: string;
    needsUserInput: boolean;
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
