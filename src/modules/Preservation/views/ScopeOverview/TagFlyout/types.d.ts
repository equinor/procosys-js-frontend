export interface TagDetails {
    id: number;
    tagNo: string;
    isVoided: boolean;
    description: string;
    status: string;
    journey: {
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
    calloffNo: string;
    purchaseOrderNo: string;
    areaCode: string;
    readyToBePreserved: boolean;
    remark: string;
    storageArea: string;
    rowVersion: string;
    tagType: string;
}

export interface TagRequirement {
    id: number;
    intervalWeeks: number;
    nextDueWeeks: number;
    requirementType: {
        id: number;
        code: string;
        icon: string;
        title: string;
    };
    requirementDefinition: {
        id: number;
        title: string;
    };
    nextDueTimeUtc: Date;
    nextDueAsYearAndWeek: string;
    readyToBePreserved: boolean;
    fields: TagRequirementField[];
    comment: string;
}

export interface TagRequirementField {
    id: number;
    label: string;
    fieldType: string;
    unit: string | null;
    showPrevious: boolean;
    currentValue?: {
        isChecked: boolean; // applicable for fieldType = CheckBox
        isNA: boolean; // applicable for fieldType = Number
        value: number | null; // applicable for fieldType = Number
        fileName: string | null; // applicable for fieldType = Attachment
    };
    // previousValue applicable for fieldType = Number
    previousValue?: {
        isChecked: boolean;
        isNA: boolean;
        value: number | null;
    };
}

export interface TagRequirementRecordValues {
    requirementId: number;
    comment: string | null;
    numberValues: RecordNumberValue[];
    checkBoxValues: RecordCheckBoxValue[];
}

interface RecordNumberValue {
    fieldId: number;
    value: number | null;
    isNA: boolean;
}

interface RecordCheckBoxValue {
    fieldId: number;
    isChecked: boolean;
}
