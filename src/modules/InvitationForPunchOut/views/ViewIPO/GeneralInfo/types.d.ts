export type ResponseType = 'Attending' | 'Tentative' | 'Not responded' |'Declined';

export type Participant = {
    id: string;
    name: string;
    role: string;
    response: ResponseType;
    attended: boolean;
    notes: string;
    completed?: boolean;
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
    acceptedAt?: Date;
    acceptedBy?: string;
}

export type CompletedType = {
    completedBy: string;
    completedAt: Date;
}
