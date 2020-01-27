export interface Tag {
    tagNo: string;
}

export interface TagRow {
    tagNo: string;
    description: string;
    purchaseOrderNumber: string;
    commPkgNo: string;
    mcPkgNo: string;
    isPreserved: boolean;
}

export interface Journey {
    id: number;
    title: string;
    isVoided: boolean;
    steps: Step[];
}

export interface Step {
    id: number;
    isVoided: boolean;
    mode: Mode;
    responsible: Responsible;
}

export interface Mode {
    id: number;
    title: string;
}

export interface Responsible {
    id: number;
    name: string;
}
