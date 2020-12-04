import ParticipantsTable from '../index';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { render } from '@testing-library/react';
import theme from '../../../../../../../assets/theme';

const participants = [
    {
        organization: 'External',
        sortKey: 2,
        person: null,
        functionalRole: null,        
        externalEmail: {
            id: 0,
            externalEmail: 'asdasd@asdasd.com',
            response: 'None',
            rowVersion: '00101' 
        },
        attended: false,
        note: ''
    },
    {
        organization: 'TechnicalIntegrity',
        sortKey: 3,
        person: null,
        functionalRole: {
            id: 1,
            code: 'asdasdasd',
            email: 'funcitonalRole@asd.com',
            persons: [],
            response: 'Attending',
            rowVersion: '123o875'
        },        
        externalEmail: null, 
        attended: false,
        note: ''
    },
    {
        organization: 'Contractor',
        sortKey: 0,
        person: {
            person: {
                id: 123,
                firstName: 'Adwa',
                lastName: 'ASdsklandasnd',
                azureOid: 'azure1',
                email: 'asdadasd@dwwdwd.com',
                rowVersion: '123123',
            },
            required: true,
            response: 'I shall not join',

        },
        externalEmail: null,        
        functionalRole: null,
        signedBy: 'signer1',
        signedAtUtc: new Date(2020, 11, 6, 11), 
        attended: true,
        note: ''
    },
    {
        organization: 'ConstructionCompany',
        sortKey: 1,
        person: {
            person: {
                id: 1,
                firstName: 'Oakjfcv',
                lastName: 'Alkjljsdf',
                azureOid: 'azure2',
                email: 'lkjlkjsdf@dwwdwd.com',
                rowVersion: '123123',
            },
            required: true,
            response: 'Tentative',

        },
        externalEmail: null,
        functionalRole: null,
        signedBy: 'signer2',
        signedAtUtc: new Date(2020, 11, 6, 12), 
        attended: true,
        note: ''
    }
];


const completePunchOut = jest.fn(() => {});
const approvePunchOut = jest.fn(() => {});

const renderWithTheme = (Component) => {
    return render(<ThemeProvider theme={theme}>{Component}</ThemeProvider>);
};


describe('<ParticipantsTable />', () => {
    it('Renders persons to table', async () => {
        const { queryAllByText, queryByText } = renderWithTheme(<ParticipantsTable 
            participants={participants} 
            status="Accepted"
            accept={approvePunchOut}
            complete={completePunchOut} />);

        expect(queryByText(`${participants[2].person.person.firstName} ${participants[2].person.person.lastName}`)).toBeInTheDocument();
        expect(queryByText(`${participants[3].person.person.firstName} ${participants[3].person.person.lastName}`)).toBeInTheDocument();
        expect(queryByText(`${participants[3].signedBy}`)).toBeInTheDocument();
        expect(queryByText(`${participants[2].signedBy}`)).toBeInTheDocument();
        expect(queryAllByText(participants[2].person.response).length).toBeGreaterThan(0);
        expect(queryAllByText(participants[3].person.response).length).toBeGreaterThan(0);
        expect(queryAllByText('Did not attend').length).toBeGreaterThan(0);
    });

    it('Renders external to table', async () => {
        const { queryByText, queryAllByText } = renderWithTheme(<ParticipantsTable 
            participants={participants} 
            status="Planned"
            accept={approvePunchOut}
            complete={completePunchOut} />);

        expect(queryByText('Sign punch out')).toBeInTheDocument();
        expect(queryByText(participants[0].externalEmail.externalEmail)).toBeInTheDocument();
        expect(queryAllByText(participants[0].externalEmail.response).length).toBeGreaterThan(0);
    });

    it('Renders functionalRole to table', async () => {
        const newParticipants = [...participants];
        newParticipants[2] = { ...participants[2], signedAtUtc: null, signedBy: null};
        newParticipants[3] = { ...participants[3], signedAtUtc: null, signedBy: null};
        const { queryByText } = renderWithTheme(<ParticipantsTable 
            participants={newParticipants} 
            status="Planned"
            accept={approvePunchOut}
            complete={completePunchOut} />);

        expect(queryByText('Complete punch out')).toBeInTheDocument();
        expect(queryByText('Sign punch out')).toBeInTheDocument();
        expect(queryByText(participants[1].functionalRole.code)).toBeInTheDocument();
    });

    it('Renders signedBy with full name', async () => {
        const newParticipants = [...participants];
        newParticipants[3] = { ...participants[3], signedAtUtc: null, signedBy: null};
        const { queryByText } = renderWithTheme(<ParticipantsTable 
            participants={newParticipants} 
            status="Completed"
            accept={approvePunchOut}
            complete={completePunchOut} />);

        expect(queryByText('Approve punch out')).toBeInTheDocument();
        expect(queryByText('Sign punch out')).toBeInTheDocument();
        expect(queryByText('06/12/2020 11:00')).toBeInTheDocument();
    });

    it('Renders approvedBy with full name', async () => {
        const { queryByText } = renderWithTheme(<ParticipantsTable 
            participants={participants} 
            status="Accepted"
            accept={approvePunchOut}
            complete={completePunchOut} />);

        expect(queryByText('Sign punch out')).toBeInTheDocument();
        expect(queryByText(`${participants[2].signedBy}`)).toBeInTheDocument();
        expect(queryByText(`${participants[3].signedBy}`)).toBeInTheDocument();
        expect(queryByText('06/12/2020 11:00')).toBeInTheDocument();
        expect(queryByText('06/12/2020 12:00')).toBeInTheDocument();
    });

    it('Renders not buttons when canceled', async () => {
        const { queryByText } = renderWithTheme(<ParticipantsTable 
            participants={participants} 
            status="Canceled"
            accept={approvePunchOut}
            complete={completePunchOut} />);

        expect(queryByText('Approve punch out')).not.toBeInTheDocument();
        expect(queryByText('Complete punch out')).not.toBeInTheDocument();
        expect(queryByText('Sign punch out')).not.toBeInTheDocument();
    });
});

