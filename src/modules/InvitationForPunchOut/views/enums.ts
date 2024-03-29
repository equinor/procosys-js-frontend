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
    SCOPEHANDEDOVER = 'ScopeHandedOver',
    CANCELED = 'Canceled',
}

export enum IpoCustomEvents {
    CREATED = 'IPO_Created',
    EDITED = 'IPO_Edited',
    CANCELED = 'IPO_Canceled',
    DELETED = 'IPO_Deleted',
    COMPLETED = 'IPO_Completed',
    UNCOMPLETED = 'IPO_Uncompleted',
    ACCEPTED = 'IPO_Accepted',
    UNACCEPTED = 'IPO_Unaccepted',
    UPDATED_ATTENDED_STATUS = 'IPO_UpdatedAttendedStatus',
    UPDATED_ATTENDED_NOTES = 'IPO_UpdatedAttendedNotes',
    SIGNED = 'IPO_Signed',
    UNSIGNED = 'IPO_Unsigned',
    COMMENT_ADDED = 'IPO_CommentAdded',
}

export enum OperationHandoverStatusEnum {
    ACCEPTED = 'ACCEPTED',
    SENT = 'SENT',
    UNDEFINED = 'UNDEFINED',
    REJECTED = 'REJECTED',
}
