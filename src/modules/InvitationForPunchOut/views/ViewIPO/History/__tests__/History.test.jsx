import { render, waitFor } from '@testing-library/react';

import History from '../index';
import React from 'react';

const dummyHistory = [
    {
        id: 0,
        description: 'asdasdsadd',
        createdAtUtc: '2020-12-28T09:24:19.592Z',
        createdBy: {
            id: 0,
            firstName: 'jan',
            lastName: 'hagevold',
            userName: 'JEHAG'
        },
        eventType: 'IpoCreated'
    },
    {
        id: 1,
        description: 'jcecopwej dwada daddawd',
        createdAtUtc: '2020-12-28T10:24:19.592Z',
        createdBy: {
            id: 1,
            firstName: 'elisabeth',
            lastName: 'bartli',
            userName: 'ELIBRA'
        },
        eventType: 'IpoCompleted'
    }
];

jest.mock('../../../../context/InvitationForPunchOutContext',() => ({
    useInvitationForPunchOutContext: () => {
        return {
            apiClient: {
                getHistory: (id) => Promise.resolve(id === 0 ? dummyHistory : [])
            }
        };
    }
}));

describe('Module: <History ipoId={} />', () => {

    it('Should render empty table when no history', async () => {
        const { getByText } = render(<History ipoId={2} />);

        await waitFor(() => expect(getByText('No records to display')).toBeInTheDocument());
    });

    it('Should render history in table', async () => {
        const { getByText } = render(<History ipoId={0} />);

        await waitFor(() => expect(getByText(dummyHistory[1].eventType)).toBeInTheDocument());
        await waitFor(() => expect(getByText(dummyHistory[1].description)).toBeInTheDocument());
        await waitFor(() => expect(getByText('28/12/2020 10:24')).toBeInTheDocument());
        await waitFor(() => expect(getByText(`${dummyHistory[0].createdBy.userName}`)).toBeInTheDocument());
        await waitFor(() => expect(getByText(`${dummyHistory[1].createdBy.userName}`)).toBeInTheDocument());
    });
});


