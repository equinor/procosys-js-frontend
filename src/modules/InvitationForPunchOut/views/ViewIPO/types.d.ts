export type McPkgScope = {
    mcPkgNo: string;
    description: string;
    commPkgNo: string;
}

export type CommPkgScope = {
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
    signedAtUtc?: Date;
    signedBy?: string;
    note: string;
    attended: boolean;
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
    person: {
        id: number;
        firstName: string;
        lastName: string;
        azureOid: string;
        email: string;
        rowVersion: string;
    },
    response?: string;
    required: boolean;
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
    status: string;
    createdBy: string;
    startTimeUtc: string;
    endTimeUtc: string;
    participants: Participant[];
    mcPkgScope: McPkgScope[];
    commPkgScope: CommPkgScope[];
}

export type HistoryItem = {
    id: number;
    description: string;
    createdAtUtc: string;
    createdBy: {
        id: number;
        firstName: string;
        lastName: string;
        userName: string;
        azureOid: string;
        email: string;
        rowVersion: string;
    },
    eventType: string;
}
