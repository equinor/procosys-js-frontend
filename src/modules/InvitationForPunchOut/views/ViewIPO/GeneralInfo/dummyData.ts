import { GeneralInfoType } from './types';

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
            id: 0,
            name: 'Anne ASPH',
            role: 'Contractor',
            response: 'Attending',
            attended: true,
            notes: '',
        },
        {
            id: 1,
            name: 'Ole OCT',
            role: 'Construction company',
            response: 'Attending',
            attended: true,
            notes: 'Any comment',
        },
        {
            id: 2,
            name: 'Chris Commissioning',
            role: 'Commissioning',
            response: 'Tentative',
            attended: false,
            notes: '',
        },
        {
            id: 3,
            name: 'Ola Operation',
            role: 'Operation',
            response: 'Not responded',
            attended: false,
            notes: '',
        },
        {
            id: 4,
            name: 'Sven Supplier',
            role: 'Supplier',
            response: 'Declined',
            attended: false,
            notes: '',
        },

    ],
    location: 'In front of area ABC',
};
