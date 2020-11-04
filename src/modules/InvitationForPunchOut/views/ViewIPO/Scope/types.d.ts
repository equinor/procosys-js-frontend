export type CommPkg = {
    id: number;
    commPkgNo: string;
    description: string;
    status: string;
    punchStatus: string;
}

export type Project = {
    id: number;
    name: string;
    description: string;
}

export type McPkg = {
    id: number;
    mcPkgNo: string;
    description: string;
    disciplineCode: string;
    punchStatus: string;
}
