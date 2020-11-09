type McPkgScope = {
    mcPkgNo: string;
    description: string;
    commPkgNo: string;
}

type CommPkgScope = {
    commPkgNo: string;
    description: string;
    status: string;
}

type Participant = {
    organization: string;
    sortKey: number;
    externalEmail: ExternalEmail;
    person: Person;
    functionalRole: FunctionalRole;
}

type FunctionalRole = {
    id: number;
    code: string;
    email: string;
    persons: Person[]
    response?: string;
    rowVersion: string;
}

type Person = {
    id: number;
    firstName: string;
    lastName: string;
    azureOid: string;
    email: string;
    required: boolean;
    response?: string;
    rowVersion: string;
}

type ExternalEmail = {
    id: number;
    externalEmail: string;
    response?: string;
    rowVersion: string;
}

export type Invitation = {
    projectName: string;
    title: string;
    description: string;
    location: string;
    type: string;
    rowVersion: string;
    startTime: string;
    endTime: string;
    participants: Participant[];
    mcPkgScope: McPkgScope;
    commPkgScope: CommPkgScope;
}

export type Attachment = {
    id: number;
    fileName: string;
    rowVersion: string;
}

export type CompletedType = {
    completedBy?: number;
    completedAt?: Date;
}

export type ApprovedType = {
    approvedBy?: number;
    approvedAt?: Date;
}
