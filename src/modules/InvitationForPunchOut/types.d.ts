import { SelectItem } from '../../components/Select';

export type ProjectDetails = {
    id: number;
    name: string;
    description: string;
}

export type ProgressBarSteps = {
    title: string;
    isCompleted: boolean;
}

export type GeneralInfoDetails = {
    projectId: number | null;
    projectName: string | null;
    poType: SelectItem | null;
    title: string | null;
    description?: string | null;
    startDate: string | null;
    endDate: string | null;
    startTime: string | null;
    endTime: string | null;
    location?: string | null;
}

export type Person = {
    id: number;
    name: string;
    cc: boolean;
}

export type RoleParticipant = {
    id: number;
    roleName: string;
    persons: Person[] | null;
}

export type Participant = {
    organization: string;
    type: string;
    person: Person | null;
    role: RoleParticipant | null;
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
