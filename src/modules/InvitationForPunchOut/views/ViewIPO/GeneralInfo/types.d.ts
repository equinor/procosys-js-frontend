export type ResponseType = 'Attending' | 'Tentative' | 'Not responded' |'Declined';

export type Participant = {
    id?: string;
    name: string;
    role: string;
    response: ResponseType;
    attended: boolean;
    notes: string;
    signedBy?: string;
    signedAt?: Date;
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
    meetingPoint: string;
    invitationSent: boolean;
}
