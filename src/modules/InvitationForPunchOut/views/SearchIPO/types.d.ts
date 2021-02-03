
export interface SavedIPOFilter {
    id: number;
    title: string;
    criteria: string;
    defaultFilter: boolean;
    rowVersion: string;
}

type CommPkg = {
    commPkgNo: string;
};

type McPkg = {
    mcPkgNo: string;
};

export interface IPO {
    id: number;
    title: string;
    status: string;
    type: string;
    commPkgs?: CommPkg[];
    mcPkgs?: McPkg[];
    sent: string;
    completed?: string;
    accepted?: string;
    contractor: string;
    construction: string;
}

export interface IPOs {
    maxAvailable: number;
    ipos: IPO[];
}

export type ProjectDetails = {
    id: number;
    name: string;
    description: string;
}

export type Filter = {

};
