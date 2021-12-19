export enum OrganizationsEnum {
    Commissioning = 'Commissioning',
    ConstructionCompany = 'ConstructionCompany',
    Contractor = 'Contractor',
    Operation = 'Operation',
    TechnicalIntegrity = 'TechnicalIntegrity',
    Supplier = 'Supplier',
    External = 'External',
}

export enum ComponentName {
    CreateAndEditIPO = 'CreateAndEditIPO',
    ParticipantsTable = 'ParticipantsTable',
    GeneralInfo = 'GeneralInfo',
    Scope = 'Scope',
    Participants = 'Participants',
    Attachments = 'Attachments',
}

export enum IpoStatusEnum {
    PLANNED = 'Planned',
    COMPLETED = 'Completed',
    ACCEPTED = 'Accepted',
    CANCELED = 'Canceled',
}

export enum IpoCustomEvents {
    CREATED = 'IPO_Created',
    EDITED = 'IPO_Edited',
    CANCELED = 'IPO_Canceled',
    COMPLETED = 'IPO_Completed',
    UNCOMPLETED = 'IPO_Uncompleted',
    ACCEPTED = 'IPO_Accepted',
    UNACCEPTED = 'IPO_Unaccepted',
    UPDATED_PARTICIPANTS = 'IPO_UpdatedParticipants',
    SIGNED = 'IPO_Signed',
    UNSIGNED = 'IPO_Unsigned',
    COMMENT_ADDED = 'IPO_CommentAdded',
}
