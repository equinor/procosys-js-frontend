import { ComponentName, IpoStatusEnum, OrganizationsEnum } from '../../../../enums';
import { fireEvent, render } from '@testing-library/react';

import { OutlookResponseType } from '../../../enums';
import ParticipantsTable from '../index';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { configure } from '@testing-library/dom';
import { getFormattedDateAndTime } from '../../../../../../../core/services/DateService';
import theme from '../../../../../../../assets/theme';

configure({ testIdAttribute: 'id' });

const ParticipantIndex = Object.freeze({
    COMPLETER: 2,
    ACCEPTER: 3,
    EXTERNAL: 0,
    FUNCROLE: 1
});

const participants = [
    {
        organization: OrganizationsEnum.External,
        canSign: false,
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
        organization: OrganizationsEnum.TechnicalIntegrity,
        sortKey: 3,
        canSign: false,
        person: null,
        functionalRole: {
            id: 1,
            code: 'asdasdasd',
            email: 'funcitonalRole@asd.com',
            persons: [],
            response: OutlookResponseType.TENTATIVE,
            rowVersion: '123o875'
        },        
        externalEmail: null, 
        attended: false,
        signedBy: 'signer3',
        signedAtUtc: new Date(2020, 11, 6, 11), 
        note: ''
    },
    {
        organization: OrganizationsEnum.Contractor,
        sortKey: 0,
        canSign: false,
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
            response: OutlookResponseType.ATTENDING,

        },
        externalEmail: null,        
        functionalRole: null,
        signedBy: {
            id: 123,
            firstName: 'Adwa',
            lastName: 'ASdsklandasnd',
            userName: 'signer1',
            azureOid: 'azure1',
            email: 'asdadasd@dwwdwd.com',
            rowVersion: '123123'},          
        signedAtUtc: new Date(2020, 11, 6, 11), 
        attended: true,
        note: ''
    },
    {
        organization: OrganizationsEnum.ConstructionCompany,
        sortKey: 1,
        canSign: false,
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
            response: OutlookResponseType.ATTENDING,

        },
        externalEmail: null,
        functionalRole: null,
        signedBy:  {
            id: 123,
            userName: 'signer2',
            firstName: 'Oakjfcv',
            lastName: 'Alkjljsdf',
            azureOid: 'azure2',
            email: 'lkjlkjsdf@dwwdwd.com',
            rowVersion: '123123',
        },
        signedAtUtc: new Date(2020, 11, 6, 12), 
        attended: true,
        note: ''
    },
    {
        organization: OrganizationsEnum.Contractor,
        sortKey: 4,
        canSign: false,
        externalEmail: null,
        person: null,
        functionalRole: {
            id: 12,
            code: 'one',
            email: 'funcitonalRole@asd.com',
            persons: [
                {
                    person: {
                        id: 1,
                        firstName: 'First',
                        lastName: 'ASdsklandasnd',
                        azureOid: 'azure1',
                        email: 'asdadasd@dwwdwd.com',
                        rowVersion: '123123',
                    },
                    required: true,
                    response: OutlookResponseType.NONE,
        
                },
                {
                    person: {
                        id: 2,
                        firstName: 'Second',
                        lastName: 'ASdsklandasnd',
                        azureOid: 'azure2',
                        email: 'asdadasd2@dwwdwd.com',
                        rowVersion: '1231234',
                    },
                    required: true,
                    response: OutlookResponseType.NONE,
        
                },
            ],
            response: OutlookResponseType.NONE,
            rowVersion: '123o875'
        },
        note: '',
        attended: false,
    }
];

const participants_canSign = [
    {
        organization: OrganizationsEnum.Contractor,
        sortKey: 0,
        canSign: true,
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
            response: OutlookResponseType.ATTENDING,

        },
        externalEmail: null,        
        functionalRole: null,
        signedBy: {
            id: 123,
            firstName: 'Adwa',
            lastName: 'ASdsklandasnd',
            userName: 'signer1',
            azureOid: 'azure1',
            email: 'asdadasd@dwwdwd.com',
            rowVersion: '123123'},          
        signedAtUtc: new Date(2020, 11, 6, 11), 
        attended: true,
        note: ''
    },
    {
        organization: OrganizationsEnum.ConstructionCompany,
        sortKey: 1,
        canSign: true,
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
            response: OutlookResponseType.ATTENDING,

        },
        externalEmail: null,
        functionalRole: null,
        signedBy:  {
            id: 123,
            userName: 'signer2',
            firstName: 'Oakjfcv',
            lastName: 'Alkjljsdf',
            azureOid: 'azure2',
            email: 'lkjlkjsdf@dwwdwd.com',
            rowVersion: '123123',
        },
        signedAtUtc: new Date(2020, 11, 6, 12), 
        attended: true,
        note: ''
    }
];

const completePunchOut = jest.fn();
const acceptPunchOut = jest.fn();
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
            status={IpoStatusEnum.ACCEPTED}
            accept={acceptPunchOut}
            complete={completePunchOut} />);

        expect(queryByText(`${participants[ParticipantIndex.COMPLETER].person.person.firstName} ${participants[ParticipantIndex.COMPLETER].person.person.lastName}`)).toBeInTheDocument();
        expect(queryByText(`${participants[ParticipantIndex.ACCEPTER].person.person.firstName} ${participants[ParticipantIndex.ACCEPTER].person.person.lastName}`)).toBeInTheDocument();
        expect(queryByText(`${participants[ParticipantIndex.COMPLETER].signedBy.userName}`)).toBeInTheDocument();
        expect(queryAllByText(participants[ParticipantIndex.COMPLETER].person.response).length).toBeGreaterThan(0);
        expect(queryAllByText(participants[ParticipantIndex.ACCEPTER].person.response).length).toBeGreaterThan(0);
        expect(queryAllByText('Did not attend').length).toBeGreaterThan(0);
    });

    it('Renders external to table', async () => {
        const { queryByText, queryAllByText } = renderWithTheme(<ParticipantsTable 
            participants={participants} 
            status={IpoStatusEnum.PLANNED}
            accept={acceptPunchOut}
            complete={completePunchOut} />);

        expect(queryByText(participants[ParticipantIndex.EXTERNAL].externalEmail.externalEmail)).toBeInTheDocument();
        expect(queryAllByText(participants[ParticipantIndex.EXTERNAL].externalEmail.response).length).toBeGreaterThan(0);
    });

    it('Renders functionalRole to table', async () => {
        const newParticipants = [...participants];
        newParticipants[ParticipantIndex.FUNCROLE] = { ...participants[ParticipantIndex.FUNCROLE], signedAtUtc: null, signedBy: null, canSign: true };
        newParticipants[ParticipantIndex.COMPLETER] = { ...participants[ParticipantIndex.COMPLETER], signedAtUtc: null, signedBy: null};
        newParticipants[ParticipantIndex.ACCEPTER] = { ...participants[ParticipantIndex.ACCEPTER], signedAtUtc: null, signedBy: null};
        const { queryByText } = renderWithTheme(<ParticipantsTable 
            participants={newParticipants} 
            status={IpoStatusEnum.PLANNED}
            accept={acceptPunchOut}
            complete={completePunchOut} />);

        expect(queryByText('Sign punch-out')).toBeInTheDocument();
        expect(queryByText(participants[ParticipantIndex.FUNCROLE].functionalRole.code)).toBeInTheDocument();
    });

    it('Renders planned status for completer', async () => {
        const newParticipants = [...participants];
        newParticipants[ParticipantIndex.COMPLETER] = { ...participants[ParticipantIndex.COMPLETER], signedAtUtc: null, signedBy: null, canSign: true};
        newParticipants[ParticipantIndex.ACCEPTER] = { ...participants[ParticipantIndex.ACCEPTER], signedAtUtc: null, signedBy: null};
        newParticipants[ParticipantIndex.FUNCROLE] = { ...participants[ParticipantIndex.FUNCROLE], signedAtUtc: null, signedBy: null};
        const { queryByText } = renderWithTheme(<ParticipantsTable 
            participants={newParticipants} 
            status={IpoStatusEnum.PLANNED}
            accept={acceptPunchOut}
            complete={completePunchOut} />);

        expect(queryByText('Complete punch-out')).toBeInTheDocument();
        expect(queryByText('Sign punch-out')).not.toBeInTheDocument();
        expect(queryByText('Accept punch-out')).not.toBeInTheDocument();
    });

    it('Renders completed status for completer', async () => {
        const newParticipants = [...participants];
        newParticipants[ParticipantIndex.COMPLETER] = { ...participants[ParticipantIndex.COMPLETER], canSign: true};
        newParticipants[ParticipantIndex.ACCEPTER] = { ...participants[ParticipantIndex.ACCEPTER], signedAtUtc: null, signedBy: null};
        newParticipants[ParticipantIndex.FUNCROLE] = { ...participants[ParticipantIndex.FUNCROLE], signedAtUtc: null, signedBy: null};
        const { queryByText } = renderWithTheme(<ParticipantsTable 
            participants={newParticipants} 
            status={IpoStatusEnum.COMPLETED}
            accept={acceptPunchOut}
            complete={completePunchOut} />);

        expect(queryByText('Update')).toBeInTheDocument();
        expect(queryByText('Uncomplete')).toBeInTheDocument();
        expect(queryByText('Sign punch-out')).not.toBeInTheDocument();
        expect(queryByText('Accept punch-out')).not.toBeInTheDocument();
        expect(queryByText(getFormattedDateAndTime(newParticipants[ParticipantIndex.COMPLETER].signedAtUtc))).toBeInTheDocument();
    });

    it('Renders completed status for accepter', async () => {
        const newParticipants = [...participants];
        newParticipants[ParticipantIndex.ACCEPTER] = { ...participants[ParticipantIndex.ACCEPTER], signedAtUtc: null, signedBy: null, canSign: true};
        newParticipants[ParticipantIndex.FUNCROLE] = { ...participants[ParticipantIndex.FUNCROLE], signedAtUtc: null, signedBy: null};
        const { queryByText } = renderWithTheme(<ParticipantsTable 
            participants={newParticipants} 
            status={IpoStatusEnum.COMPLETED}
            accept={acceptPunchOut}
            complete={completePunchOut} />);
        expect(queryByText('Update')).not.toBeInTheDocument();
        expect(queryByText('Uncomplete')).not.toBeInTheDocument();
        expect(queryByText('Sign punch-out')).not.toBeInTheDocument();
        expect(queryByText('Accept punch-out')).toBeInTheDocument();
        expect(queryByText(newParticipants[ParticipantIndex.COMPLETER].signedBy.userName)).toBeInTheDocument();
        expect(queryByText(getFormattedDateAndTime(newParticipants[ParticipantIndex.COMPLETER].signedAtUtc))).toBeInTheDocument();
    });

    it('Renders completed status for signer', async () => {
        const newParticipants = [...participants];
        newParticipants[ParticipantIndex.ACCEPTER] = { ...participants[ParticipantIndex.ACCEPTER], signedAtUtc: null, signedBy: null};
        newParticipants[ParticipantIndex.FUNCROLE] = { ...participants[ParticipantIndex.FUNCROLE], signedAtUtc: null, signedBy: null, canSign: true};
        const { queryByText, getByText } = renderWithTheme(<ParticipantsTable 
            participants={newParticipants} 
            status={IpoStatusEnum.COMPLETED}
            accept={acceptPunchOut}
            complete={completePunchOut} />);
        expect(queryByText('Update')).not.toBeInTheDocument();
        expect(queryByText('Uncomplete')).not.toBeInTheDocument();
        expect(queryByText('Sign punch-out')).toBeInTheDocument();
        expect(queryByText('Accept punch-out')).not.toBeInTheDocument();
        expect(getByText(newParticipants[ParticipantIndex.COMPLETER].signedBy.userName)).toBeInTheDocument();
        expect(queryByText(getFormattedDateAndTime(newParticipants[ParticipantIndex.COMPLETER].signedAtUtc))).toBeInTheDocument();
    });

    it('Renders accepted status for completer', async () => {
        const newParticipants = [...participants];
        newParticipants[ParticipantIndex.COMPLETER] = { ...participants[ParticipantIndex.COMPLETER], canSign: true};
        newParticipants[ParticipantIndex.ACCEPTER] = { ...participants[ParticipantIndex.ACCEPTER]};
        newParticipants[ParticipantIndex.FUNCROLE] = { ...participants[ParticipantIndex.FUNCROLE], signedAtUtc: null, signedBy: null};
        const { queryByText } = renderWithTheme(<ParticipantsTable 
            participants={newParticipants} 
            status={IpoStatusEnum.ACCEPTED}
            accept={acceptPunchOut}
            complete={completePunchOut} />);

        expect(queryByText('Update')).not.toBeInTheDocument();
        expect(queryByText('Uncomplete')).not.toBeInTheDocument();
        expect(queryByText('Sign punch-out')).not.toBeInTheDocument();
        expect(queryByText('Accept punch-out')).not.toBeInTheDocument();
        expect(queryByText(`${participants[ParticipantIndex.COMPLETER].signedBy.userName}`)).toBeInTheDocument();
        expect(queryByText('Unaccept punch-out')).not.toBeInTheDocument();
        expect(queryByText(getFormattedDateAndTime(newParticipants[ParticipantIndex.COMPLETER].signedAtUtc))).toBeInTheDocument();
        expect(queryByText(getFormattedDateAndTime(newParticipants[ParticipantIndex.ACCEPTER].signedAtUtc))).toBeInTheDocument();
    });

    it('Renders accepted status for accepter', async () => {
        const newParticipants = [...participants];
        newParticipants[ParticipantIndex.ACCEPTER] = { ...participants[ParticipantIndex.ACCEPTER], canSign: true};
        newParticipants[ParticipantIndex.FUNCROLE] = { ...participants[ParticipantIndex.FUNCROLE], signedAtUtc: null, signedBy: null};
        const { queryByText } = renderWithTheme(<ParticipantsTable 
            participants={newParticipants} 
            status={IpoStatusEnum.ACCEPTED}
            accept={acceptPunchOut}
            complete={completePunchOut} />);

        expect(queryByText('Update')).not.toBeInTheDocument();
        expect(queryByText('Uncomplete')).not.toBeInTheDocument();
        expect(queryByText('Sign punch-out')).not.toBeInTheDocument();
        expect(queryByText('Accept punch-out')).not.toBeInTheDocument();
        expect(queryByText(`${participants[ParticipantIndex.COMPLETER].signedBy.userName}`)).toBeInTheDocument();
        expect(queryByText('Unaccept punch-out')).toBeInTheDocument();
        expect(queryByText(getFormattedDateAndTime(newParticipants[ParticipantIndex.COMPLETER].signedAtUtc))).toBeInTheDocument();
        expect(queryByText(getFormattedDateAndTime(newParticipants[ParticipantIndex.ACCEPTER].signedAtUtc))).toBeInTheDocument();
    });

    it('Renders accepted status for signer', async () => {
        const newParticipants = [...participants];
        newParticipants[ParticipantIndex.FUNCROLE] = { ...participants[ParticipantIndex.FUNCROLE], signedAtUtc: null, signedBy: null, canSign: true};
        const { queryByText, getByText } = renderWithTheme(<ParticipantsTable 
            participants={newParticipants} 
            status={IpoStatusEnum.ACCEPTED}
            accept={acceptPunchOut}
            complete={completePunchOut} />);
        expect(queryByText('Update')).not.toBeInTheDocument();
        expect(queryByText('Uncomplete')).not.toBeInTheDocument();
        expect(queryByText('Sign punch-out')).toBeInTheDocument();
        expect(queryByText('Accept punch-out')).not.toBeInTheDocument();
        expect(getByText(newParticipants[ParticipantIndex.COMPLETER].signedBy.userName)).toBeInTheDocument();
        expect(queryByText('Unaccept punch-out')).not.toBeInTheDocument();
        expect(queryByText(getFormattedDateAndTime(newParticipants[ParticipantIndex.COMPLETER].signedAtUtc))).toBeInTheDocument();
        expect(queryByText(getFormattedDateAndTime(newParticipants[ParticipantIndex.ACCEPTER].signedAtUtc))).toBeInTheDocument();
    });


    it('Should not render buttons when canceled', async () => {
        const newParticipants = [...participants];
        newParticipants[ParticipantIndex.COMPLETER] = { ...participants[ParticipantIndex.COMPLETER], canSign: true};
        const { queryByText } = renderWithTheme(<ParticipantsTable 
            participants={newParticipants} 
            status="Canceled"
            accept={acceptPunchOut}
            complete={completePunchOut} />);

        expect(queryByText('Accept punch-out')).not.toBeInTheDocument();
        expect(queryByText('Complete punch-out')).not.toBeInTheDocument();
        expect(queryByText('Update')).not.toBeInTheDocument();
        expect(queryByText('Uncomplete')).not.toBeInTheDocument();
        expect(queryByText('Sign punch-out')).not.toBeInTheDocument();
    });

    it('Should not render buttons when noone can sign', async () => {
        const { queryByText } = renderWithTheme(<ParticipantsTable 
            participants={participants} 
            status="Canceled"
            accept={acceptPunchOut}
            complete={completePunchOut} />);

        expect(queryByText('Accept punch-out')).not.toBeInTheDocument();
        expect(queryByText('Complete punch-out')).not.toBeInTheDocument();
        expect(queryByText('Update')).not.toBeInTheDocument();
        expect(queryByText('Uncomplete')).not.toBeInTheDocument();
        expect(queryByText('Sign punch-out')).not.toBeInTheDocument();
    });

    it('Should set attended from outlook response in planned state', async () => {
        const { queryAllByText } = renderWithTheme(<ParticipantsTable 
            participants={participants} 
            status="Planned"
            accept={acceptPunchOut}
            complete={completePunchOut} />);

        expect(queryAllByText('Attended').length).toBe(3); // +1 for table header
        expect(queryAllByText('Did not attend').length).toBe(3);
    });

    it('Should set attended from participant status when not in planned state', async () => {
        const { queryAllByText } = renderWithTheme(<ParticipantsTable 
            participants={participants} 
            status="Completed"
            accept={acceptPunchOut}
            complete={completePunchOut} />);

        expect(queryAllByText('Attended').length).toBe(3); // +1 for table header
        expect(queryAllByText('Did not attend').length).toBe(3);
    });

    it('Should set dirty state when entering text', async () => {
        const { getByTestId } = renderWithTheme(<ParticipantsTable 
            participants={participants} 
            status="Planned"
            accept={acceptPunchOut}
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
            accept={acceptPunchOut}
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
            accept={acceptPunchOut}
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

    it('User can accept', async () => {
        const { queryByText } = renderWithTheme(<ParticipantsTable 
            participants={participants_canSign} 
            status={IpoStatusEnum.COMPLETED}
            accept={acceptPunchOut}
            complete={completePunchOut} />);
        expect(queryByText('Accept punch-out')).toBeInTheDocument();
    });

    it('User can unaccept', async () => {
        const { queryByText } = renderWithTheme(<ParticipantsTable 
            participants={participants_canSign} 
            status={IpoStatusEnum.ACCEPTED}
            accept={acceptPunchOut}
            complete={completePunchOut} />);
        expect(queryByText('Unaccept punch-out')).toBeInTheDocument();
    });

    describe('Custom popover rendering', () => {
        it('Should not render a popover anchor if the participant is not a functional role', () => {
            const { queryByTestId } = renderWithTheme(<ParticipantsTable 
                participants={participants} 
                status={IpoStatusEnum.ACCEPTED}
                accept={acceptPunchOut}
                complete={completePunchOut} />);
            participants.forEach((participant) => {
                const anchor = queryByTestId(participant.sortKey.toString() + 'test');
                if(participant.functionalRole === null){
                    expect(anchor).not.toBeInTheDocument();
                }
            });
        });

        it('Should not render a popover anchor if the functional role has no persons', () => {
            const { queryByTestId} = renderWithTheme(<ParticipantsTable 
                participants={participants} 
                status={IpoStatusEnum.ACCEPTED}
                accept={acceptPunchOut}
                complete={completePunchOut} />);
            participants.forEach((participant) => {
                if(participant.functionalRole !== null && participant.functionalRole.persons.length <= 0 ){
                    expect(queryByTestId(participant.sortKey.toString() + 'test', { exact: false })).not.toBeInTheDocument();
                }
            });
        });
        it('Should render one popover anchor for each functional role with at least one person', () => {
            const { queryByTestId } = renderWithTheme(<ParticipantsTable 
                participants={participants} 
                status={IpoStatusEnum.ACCEPTED}
                accept={acceptPunchOut}
                complete={completePunchOut} />);
            participants.forEach((participant) => {
                const anchor = queryByTestId(participant.sortKey.toString() + 'test', { exact: false });
                if(participant.functionalRole !== null && participant.functionalRole.persons.length > 0 ){
                    expect(anchor).toBeInTheDocument();
                }
            });
        });
    });
});
