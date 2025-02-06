export interface RequirementDefinition {
    id: number;
    title: string;
    isVoided: boolean;
    defaultIntervalWeeks: number;
    sortKey: number;
    usage: string;
    rowVersion: string;
    isInUse: boolean;
    fields: [
        {
            id: number;
            label: string;
            isVoided: boolean;
            sortKey: number;
            fieldType: string;
            unit: string;
            showPrevious: boolean;
            isInUse: boolean;
            rowVersion: string;
        }
    ];
    needsUserInput: boolean;
}

export interface RequirementType {
    id: number;
    code: string;
    title: string;
    icon: string;
    isVoided: boolean;
    sortKey: number;
    isInUse: boolean;
    rowVersion: string;
    requirementDefinitions: RequirementDefinition[];
}
