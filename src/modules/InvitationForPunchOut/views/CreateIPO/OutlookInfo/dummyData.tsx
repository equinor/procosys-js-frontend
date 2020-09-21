import { Participant, ResponseType } from './index';

export const participants: Participant[] = [
    {
        name: 'Jan Erik Hagevold',
        email: 'jehag@equinor.com',
        company: 'Bouvet ASA',
        response: ResponseType.ATTENDING
    },
    {
        name: 'Elisabeth Bratli',
        email: 'elibra@equinor.com',
        company: 'Bouvet ASA',
        response: ResponseType.TENTATIVE
    },
    {
        name: 'Jan Inge Dalsbø',
        email: 'jdalsb@equinor.com',
        company: 'Bouvet ASA',
        response: ResponseType.TENTATIVE
    },
    {
        name: 'Pål Eie',
        email: 'paeie@equinor.com',
        company: 'Bouvet ASA',
        response: ResponseType.NOT_RESPONDED
    },
    {
        name: 'Christer Nordbø',
        email: 'cnordb@equinor.com',
        company: 'Bouvet ASA',
        response: ResponseType.DECLINED
    },
    {
        name: 'Nora Lykke Strøm Larsen',
        email: 'norl@equinor.com',
        company: 'Bouvet ASA',
        response: ResponseType.TENTATIVE
    },
];

export const organizer: Participant = {
    name: 'Christine Emberland Smith',
    email: 'csm@equinor.com',
    company: 'Bouvet ASA'
};


