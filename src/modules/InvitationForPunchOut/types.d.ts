import { SelectItem } from '../../components/Select';
import { OperationHandoverStatusEnum } from './views/enums';

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
    date: Date | undefined;
    startTime: Date | undefined;
    endTime: Date | undefined;
    isOnline?: boolean;
    location?: string | null;
};

export type Person = {
    azureOid: string;
    name: string;
    email: string;
    radioOption: string | null;
};

export type PersonInRole = {
    id?: number;
    azureOid: string;
    name: string;
    email: string;
    rowVersion?: string;
    radioOption: string | null;
};

export type RoleParticipant = {
    code: string;
    description: string;
    usePersonalEmail: boolean;
    notify: boolean;
    persons: PersonInRole[];
};

type ExternalEmail = {
    email: string;
};

export type Participant = {
    id?: number;
    organization: SelectItem;
    sortKey: number | null;
    type: string;
    rowVersion?: string;
    externalEmail: ExternalEmail | null;
    person: Person | null;
    role: RoleParticipant | null;
    signedAt: Date | null | undefined;
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
    operationHandoverStatus?: OperationHandoverStatusEnum;
    rfocAcceptedAt?: Date;
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
    operationHandoverStatus?: OperationHandoverStatusEnum;
    disableCheckbox?: boolean;
    m01?: string;
    m02?: string;
    status?: string;
    rfocAcceptedAt?: Date;
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
