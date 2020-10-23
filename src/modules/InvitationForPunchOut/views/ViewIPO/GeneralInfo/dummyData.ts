import { GeneralInfoType } from './types';
import { ResponseType } from '../OutlookInfo';

export const generalInfo: GeneralInfoType = {
    project: 'L/0265C.001, Johan Sverdrup Field Development',
    type: 'MDP',
    title: 'RC160 Tilpasse support og bytte pakningen på Nivåglass R-43LG0131',
    description: 'This is a description that describes what we are going to check in the MDP and who is responsible. Also this describes something about previous punches, so the text goes over three lines, and can become longer if necessary.',
    punchRoundTime: {
        from: new Date(2020, 10, 25, 9, 0, 0),
        to: new Date(2020, 10, 26, 15, 0, 0)
    },
    participants: [
        {
            name: 'Anne ASPH',
            role: 'Contractor',
            response: ResponseType.ATTENDING,
            attended: true,
            notes: '',
            signedBy: undefined,
            signedAt: undefined
        },
        {
            name: 'Ole OCT',
            role: 'Constr. Comp.',
            response: ResponseType.ATTENDING,
            attended: true,
            notes: 'Any comment',
            signedBy: undefined,
            signedAt: undefined
        },
        {
            name: 'Chris Commissioning',
            role: 'Commissioning',
            response: ResponseType.TENTATIVE,
            attended: false,
            notes: '',
            signedBy: undefined,
            signedAt: undefined
        },
        {
            name: 'Ola Operation',
            role: 'Operation',
            response: ResponseType.NOT_RESPONDED,
            attended: false,
            notes: '',
            signedBy: undefined,
            signedAt: undefined
        },
        {
            name: 'Sven Supplier',
            role: 'Supplier',
            response: ResponseType.DECLINED,
            attended: false,
            notes: '',
            signedBy: undefined,
            signedAt: undefined
        },

    ],
    meetingPoint: 'In front of area ABC',
    invitationSent: true
};
