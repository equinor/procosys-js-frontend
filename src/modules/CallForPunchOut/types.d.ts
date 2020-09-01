import { SelectItem } from '../../components/Select';

export type ProjectDetails = {
    id: number;
    name: string;
    description: string;
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
