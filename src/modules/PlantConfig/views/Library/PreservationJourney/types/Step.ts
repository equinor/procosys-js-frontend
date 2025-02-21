import { Mode } from './Mode';

export interface Step {
    id: number;
    title: string;
    autoTransferMethod: string;
    isVoided: boolean;
    isInUse: boolean;
    mode: Mode;
    responsible: {
        code: string;
        title: string;
        rowVersion: string;
        description?: string;
    };
    rowVersion: string;
}
