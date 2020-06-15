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

export interface TagRequirement {
    id: number;
    intervalWeeks: number;
    nextDueWeeks: number;
    requirementTypeCode: string;
    requirementTypeTitle: string;
    requirementDefinitionTitle: string;
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
    currentValue?:
    {
        isChecked: boolean;         // applicable for fieldType = CheckBox
        isNA: boolean;              // applicable for fieldType = Number
        value: number | null;       // applicable for fieldType = Number
        fileName: string | null;    // applicable for fieldType = Attachment
    };
    // previousValue applicable for fieldType = Number
    previousValue?:
    {
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

