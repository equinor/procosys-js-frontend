export type ResponseType = 'Attending' | 'Tentative' | 'Not responded' |'Declined';

export type Participant = {
    id: number;
    name: string;
    role: string;
    response: ResponseType;
    attended: boolean;
    notes: string;
};
        
export type GeneralInfoType = {
    project: string;
    type: string;
    title: string;
    description: string;
    punchRoundTime: {
        from: Date;
        to: Date;
    },
    participants: Participant[];
    location: string;
    completedAt?: Date;
    completedBy?: string;
    approvedAt?: Date;
    approvedBy?: string;
}

export type CompletedType = {
    completedBy?: string;
    completedAt?: Date;
}

export type ApprovedType = {
    approvedBy?: string;
    approvedAt?: Date;
}
