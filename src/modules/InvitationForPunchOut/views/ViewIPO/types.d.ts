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
    mcPkgScope: McPkg;
    commPkgScope: CommPkg;
}

export type Attachment = {
    id: number;
    fileName: string;
    rowVersion: string;
}

export type Participant = {
    organization: string;
    sortKey: number;
    externalEmail: string;
    person: Person;
    functionalRole: FunctionalRole;
}

export type Person = {
    id: number;
    firstName: string;
    lastName: string;
    azureOid: string;
    required: boolean;
    response?: string;
    rowVersion: string;
}

export type FunctionalRole = {
    code: string;
    email: string;
    usePersonalEmail: boolean;
    persons: Person[];
}

export type McPkg = {
    mcPkgNo: string;
    description: string;
    commPkgNo: string;
}

export type CommPkg = {
    commPkgNo: string;
    description: string;
    status: string;
}

export type Organization = 'Commissioning' | 'ConstructionCompany' | 'Contractor' | 'Operation' | 'TechnicalIntegrity' | 'Supplier' | 'External';


export type ResponseType = 'Attending' | 'Tentative' | 'Not responded' |'Declined';

export type CompletedType = {
    completedBy?: string;
    completedAt?: Date;
}

