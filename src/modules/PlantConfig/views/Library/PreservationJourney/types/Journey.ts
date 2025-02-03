import { ProjectDetails } from '@procosys/modules/Preservation/types';
import { Step } from './Step';

export interface Journey {
    id: number;
    title: string;
    isVoided: boolean;
    isInUse: boolean;
    steps: Step[];
    rowVersion: string;
    project?: ProjectDetails;
}
