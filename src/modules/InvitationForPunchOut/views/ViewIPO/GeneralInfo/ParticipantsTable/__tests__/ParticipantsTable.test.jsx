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
        }
    },
    {
        organization: 'TechnicalIntegrity',
        sortKey: 3,
        person: null,
        functionalRole: {
            id: 123,
            code: 'asdasdasd',
            email: 'funcitonalRole@asd.com',
            persons: [],
            response: 'Attending',
            rowVersion: '123o875'
        },        
        externalEmail: null    
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
        functionalRole: null    
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
        functionalRole: null
    }
];


const completed = {
    completedBy: 123,
    completedAt: new Date(2020, 11, 6, 11, 0) // 06/11/2020 11:00
};


const completePunchOut = jest.fn(() => {});

const renderWithTheme = (Component) => {
    return render(<ThemeProvider theme={theme}>{Component}</ThemeProvider>);
};


describe('<ParticipantsTable />', () => {
    it('Renders persons to table', async () => {
        const { queryByText, queryAllByText } = renderWithTheme(<ParticipantsTable completed={{completedBy: undefined, completedAt: undefined}} participants={participants} completePunchOut={completePunchOut} />);

        expect(queryByText(`${participants[2].person.person.firstName} ${participants[2].person.person.lastName}`)).toBeInTheDocument();
        expect(queryByText(`${participants[3].person.person.firstName} ${participants[3].person.person.lastName}`)).toBeInTheDocument();
        expect(queryAllByText(participants[2].person.response).length).toBeGreaterThan(0);
        expect(queryAllByText(participants[3].person.response).length).toBeGreaterThan(0);
        expect(queryAllByText('Did not attend').length).toBeGreaterThan(0);
    });

    it('Renders external to table', async () => {
        const { queryByText, queryAllByText } = renderWithTheme(<ParticipantsTable completed={{completedBy: undefined, completedAt: undefined}} participants={participants} completePunchOut={completePunchOut} />);

        expect(queryByText(participants[0].externalEmail.externalEmail)).toBeInTheDocument();
        expect(queryAllByText(participants[0].externalEmail.response).length).toBeGreaterThan(0);
    });

    it('Renders functionalRole to table', async () => {
        const { queryByText, queryAllByText } = renderWithTheme(<ParticipantsTable completed={{completedBy: undefined, completedAt: undefined}} participants={participants} completePunchOut={completePunchOut} />);

        expect(queryByText(participants[1].functionalRole.code)).toBeInTheDocument();
        expect(queryAllByText(participants[1].functionalRole.response).length).toBeGreaterThan(0);
    });

    it('Renders completedBy with full name', async () => {
        const { queryByText, queryAllByText } = renderWithTheme(<ParticipantsTable completed={completed} participants={participants} completePunchOut={completePunchOut} />);

        expect(queryAllByText(`${participants[2].person.person.firstName} ${participants[2].person.person.lastName}`)).toHaveLength(2);
        expect(queryByText('06/12/2020 11:00')).toBeInTheDocument();
    });
});

