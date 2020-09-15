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
    person: Person | null;
    role: RoleParticipant | null;
}
