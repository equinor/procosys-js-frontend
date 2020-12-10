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
    projectId: number | null;
    projectName: string | null;
    poType: SelectItem | null;
    title: string | null;
    description?: string | null;
    startTime: Date;
    endTime: Date;
    location?: string | null;
}

export type Person = {
    azureOid: string;
    firstName: string;
    lastName: string;
    email: string;
    radioOption: string | null;
}

export type RoleParticipant = {
    code: string;
    description: string;
    usePersonalEmail: boolean;
    notify: boolean;
    persons: Person[];
}

export type Participant = {
    organization: SelectItem;
    type: string;
    externalEmail: string | null;
    person: Person | null;
    role: RoleParticipant | null;
}

export type Attachment = {
    downloadUri: string;
    id: number;
    fileName: string;
    rowVersion: string;
    uploadedAt: Date;
    uploadedBy: {
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
