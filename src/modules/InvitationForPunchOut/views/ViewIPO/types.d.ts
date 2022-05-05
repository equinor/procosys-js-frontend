export type McPkgScope = {
    mcPkgNo: string;
    description: string;
    system: string;
    commPkgNo: string;
};

export type CommPkgScope = {
    commPkgNo: string;
    description: string;
    system: string;
    status: string;
};

type Participant = {
    id: number;
    organization: string;
    sortKey: number;
    isSigner: boolean;
    rowVersion: string;
    externalEmail: ExternalEmail;
    person: Person;
    functionalRole: FunctionalRole;
    signedAtUtc?: Date;
    signedBy?: {
        userName: string;
        firstName: string;
        lastName: string;
    };
    note: string;
    attended: boolean;
};

type FunctionalRole = {
    code: string;
    email: string;
    persons: PersonInRole[];
    response?: string;
};

type Person = {
    response?: string;
    firstName: string;
    lastName: string;
    azureOid: string;
    email: string;
};

type PersonInRole = {
    response?: string;
    id: number;
    firstName: string;
    lastName: string;
    azureOid: string;
    email: string;
    required: boolean;
    rowVersion?: string;
};

type ExternalEmail = {
    externalEmail: string;
    response?: string;
};

export type Invitation = {
    canEdit: boolean;
    canCancel: boolean;
    canDelete: boolean;
    projectName: string;
    title: string;
    description: string;
    location: string;
    type: string;
    rowVersion: string;
    status: string;
    createdBy: {
        azureOid?: string;
        firstName: string;
        lastName: string;
    };
    startTimeUtc: string;
    endTimeUtc: string;
    participants: Participant[];
    mcPkgScope: McPkgScope[];
    commPkgScope: CommPkgScope[];
};

export type IpoComment = {
    id: number;
    comment: string;
    createdAtUtc: string;
    createdBy: {
        firstName: string;
        lastName: string;
    };
};

export type HistoryItem = {
    id: number;
    description: string;
    createdAtUtc: string;
    createdBy: {
        userName: string;
    };
};
