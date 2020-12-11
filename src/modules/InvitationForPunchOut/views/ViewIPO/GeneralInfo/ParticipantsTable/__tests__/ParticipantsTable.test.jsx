import { fireEvent, render } from '@testing-library/react';

import { ComponentName } from '../../../../enums';
import { OutlookResponseType } from '../../../enums';
import ParticipantsTable from '../index';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { configure } from '@testing-library/dom';
import theme from '../../../../../../../assets/theme';

configure({ testIdAttribute: 'id' });

const participants = [
    {
        organization: 'External',
        sortKey: 2,
        person: null,
        functionalRole: null,        
        externalEmail: {
            id: 0,
            externalEmail: 'asdasd@asdasd.com',
            response: OutlookResponseType.NONE,
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
            response: OutlookResponseType.ATTENDING,
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
            response: OutlookResponseType.DECLINED,

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
                id: 234,
                firstName: 'Oakjfcv',
                lastName: 'Alkjljsdf',
                azureOid: 'azure2',
                email: 'lkjlkjsdf@dwwdwd.com',
                rowVersion: '123123',
            },
            required: true,
            response: OutlookResponseType.TENTATIVE,

        },
        externalEmail: null,
        functionalRole: null,
        signedBy: 'signer2',
        signedAtUtc: new Date(2020, 11, 6, 12), 
        attended: true,
        note: ''
    }
];


const completePunchOut = jest.fn();
const approvePunchOut = jest.fn();
const mockSetDirtyStateFor = jest.fn();
const mockUnsetDirtyStateFor = jest.fn();

jest.mock('@procosys/core/DirtyContext', () => ({
    useDirtyContext: () => {
        return {
            setDirtyStateFor: mockSetDirtyStateFor,
            unsetDirtyStateFor: mockUnsetDirtyStateFor
        };
    }
}));

const renderWithTheme = (Component) => {
    return render(
        <ThemeProvider theme={theme}>{Component}</ThemeProvider>
    );
};


describe('<ParticipantsTable />', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

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

    it('Should not render buttons when canceled', async () => {
        const { queryByText } = renderWithTheme(<ParticipantsTable 
            participants={participants} 
            status="Canceled"
            accept={approvePunchOut}
            complete={completePunchOut} />);

        expect(queryByText('Approve punch out')).not.toBeInTheDocument();
        expect(queryByText('Complete punch out')).not.toBeInTheDocument();
        expect(queryByText('Sign punch out')).not.toBeInTheDocument();
    });

    it('Should set attended from outlook response in planned state', async () => {
        const { queryAllByText } = renderWithTheme(<ParticipantsTable 
            participants={participants} 
            status="Planned"
            accept={approvePunchOut}
            complete={completePunchOut} />);

        expect(queryAllByText('Attended').length).toBe(2); // +1 for table header
        expect(queryAllByText('Did not attend').length).toBe(3);
    });

    it('Should set attended from participant status when not in planned state', async () => {
        const { queryAllByText } = renderWithTheme(<ParticipantsTable 
            participants={participants} 
            status="Completed"
            accept={approvePunchOut}
            complete={completePunchOut} />);

        expect(queryAllByText('Attended').length).toBe(3); // +1 for table header
        expect(queryAllByText('Did not attend').length).toBe(2);
    });

    it('Should set dirty state when entering text', async () => {
        const { getByTestId } = renderWithTheme(<ParticipantsTable 
            participants={participants} 
            status="Planned"
            accept={approvePunchOut}
            complete={completePunchOut} />);

        const input = getByTestId('textfield234');
        fireEvent.change(input, { target: { value: 'test' }});
        expect(mockSetDirtyStateFor).toBeCalledTimes(1);
        expect(mockSetDirtyStateFor).toBeCalledWith(ComponentName.ParticipantsTable);
    });

    it('Should set dirty state when setting attendance', async () => {
        const { getByTestId } = renderWithTheme(<ParticipantsTable 
            participants={participants} 
            status="Planned"
            accept={approvePunchOut}
            complete={completePunchOut} />);

        const input = getByTestId('attendance234');
        fireEvent.click(input);
        expect(mockSetDirtyStateFor).toBeCalledTimes(1);
        expect(mockSetDirtyStateFor).toBeCalledWith(ComponentName.ParticipantsTable);
    });

    it('Should reset dirty state when reverting to clean state', async () => {
        const { getByTestId } = renderWithTheme(<ParticipantsTable 
            participants={participants} 
            status="Planned"
            accept={approvePunchOut}
            complete={completePunchOut} />);

        const input = getByTestId('attendance234');
        jest.clearAllMocks();
        fireEvent.click(input);
        fireEvent.click(input);
        expect(mockSetDirtyStateFor).toBeCalledTimes(1);
        expect(mockSetDirtyStateFor).toBeCalledWith(ComponentName.ParticipantsTable);
        expect(mockUnsetDirtyStateFor).toBeCalledTimes(1);
        expect(mockUnsetDirtyStateFor).toBeCalledWith(ComponentName.ParticipantsTable);
    });
});
