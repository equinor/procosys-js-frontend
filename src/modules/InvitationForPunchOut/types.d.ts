import { SelectItem } from '../../components/Select';

export type ProjectDetails = {
    id: number;
    name: string;
    description: string;
};

export type Step = {
    title: string;
    isCompleted: boolean;
};

export type GeneralInfoDetails = {
    projectName: string | null;
    poType: SelectItem | null;
    title: string | null;
    description?: string | null;
    startTime: Date | undefined;
    endTime: Date | undefined;
    location?: string | null;
};

export type Person = {
    id?: number;
    azureOid: string;
    name: string;
    email: string;
    radioOption: string | null;
};

export type RoleParticipant = {
    id?: number;
    code: string;
    description: string;
    usePersonalEmail: boolean;
    notify: boolean;
    persons: Person[];
};

type ExternalEmail = {
    id: number | null;
    email: string;
};

export type Participant = {
    organization: SelectItem;
    sortKey: number | null;
    type: string;
    rowVersion?: string;
    externalEmail: ExternalEmail | null;
    person: Person | null;
    role: RoleParticipant | null;
};

export type Attachment = {
    fileName: string;
    downloadUri?: string;
    id?: number;
    file?: File;
    rowVersion?: string;
    uploadedAt?: Date;
    toBeDeleted?: boolean;
    uploadedBy?: {
        id: number;
        firstName: string;
        lastName: string;
        azureOid: string;
        email: string;
        rowVersion: string;
    };
};

export interface CommPkgRow {
    commPkgNo: string;
    description: string;
    system: string;
    status: string;
    disableCheckbox?: boolean;
    tableData?: {
        isSelected: boolean;
    };
}

export interface McPkgRow {
    mcPkgNo: string;
    description: string;
    system: string;
    commPkgNo: string;
    discipline: string;
    tableData?: {
        isSelected: boolean;
    };
}

export interface McScope {
    system: string | null;
    multipleDisciplines: boolean;
    selected: McPkgRow[];
}

export type Organization =
    | 'Commissioning'
    | 'ConstructionCompany'
    | 'Contractor'
    | 'Operation'
    | 'TechnicalIntegrity'
    | 'Supplier'
    | 'External';
