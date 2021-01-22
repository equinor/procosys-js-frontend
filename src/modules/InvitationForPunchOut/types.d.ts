import { SelectItem } from '../../components/Select';

export type ProjectDetails = {
    id: number;
    name: string;
    description: string;
}

export type Step = {
    title: string;
    isCompleted: boolean;
}

export type GeneralInfoDetails = {
    projectName: string | null;
    poType: SelectItem | null;
    title: string | null;
    description?: string | null;
    startTime: Date;
    endTime: Date;
    location?: string | null;
}

export type Person = {
    id?: number;
    azureOid: string;
    firstName: string;
    lastName: string;
    email: string;
    rowVersion?: string;
    radioOption: string | null;
}

export type RoleParticipant = {
    id?: number;
    rowVersion?: string;
    code: string;
    description: string;
    usePersonalEmail: boolean;
    notify: boolean;
    persons: Person[];
}

type ExternalEmail = {
    id: number | null;
    email: string;
    rowVersion: string | null;
}

export type Participant = {
    organization: SelectItem;
    sortKey: number | null;
    type: string;
    externalEmail: ExternalEmail | null;
    person: Person | null;
    role: RoleParticipant | null;
}

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
    }
}

export interface CommPkgRow {
    commPkgNo: string;
    description: string;
    status: string;
    tableData?: {
        checked: boolean;
    };
}

export interface McPkgRow {
    mcPkgNo: string;
    description: string;
    discipline: string;
    tableData?: {
        checked: boolean;
    };
}

export interface McScope {
    commPkgNoParent: string | null;
    multipleDisciplines: boolean;
    selected: McPkgRow[];
}

export type Organization = 'Commissioning' | 'ConstructionCompany' | 'Contractor' | 'Operation' | 'TechnicalIntegrity' | 'Supplier' | 'External';

