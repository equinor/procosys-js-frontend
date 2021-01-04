import { render, waitFor } from '@testing-library/react';

import Log from '../index';
import React from 'react';

const dummyLogs = [
    {
        id: 0,
        description: 'asdasdsadd',
        createdAtUtc: '2020-12-28T09:24:19.592Z',
        createdBy: {
            id: 0,
            firstName: 'jan',
            lastName: 'hagevold',
        },
        eventType: 'created IPO'
    },
    {
        id: 1,
        description: 'jcecopwej dwada daddawd',
        createdAtUtc: '2020-12-28T10:24:19.592Z',
        createdBy: {
            id: 1,
            firstName: 'elisabeth',
            lastName: 'bartli',
        },
        eventType: 'completed IPO'
    }
];

jest.mock('../../../../context/InvitationForPunchOutContext',() => ({
    useInvitationForPunchOutContext: () => {
        return {
            apiClient: {
                getLogs: (id) => Promise.resolve(id === 0 ? dummyLogs : [])
            }
        };
    }
}));

describe('Module: <Log ipoId={} />', () => {

    it('Should render empty table when no logs', async () => {
        const { getByText } = render(<Log ipoId={2} />);

        await waitFor(() => expect(getByText('No records to display')).toBeInTheDocument());
    });

    it('Should render logs in table', async () => {
        const { getByText } = render(<Log ipoId={0} />);

        await waitFor(() => expect(getByText(dummyLogs[1].eventType)).toBeInTheDocument());
        await waitFor(() => expect(getByText(dummyLogs[1].description)).toBeInTheDocument());
        await waitFor(() => expect(getByText('28/12/2020 10:24')).toBeInTheDocument());
        await waitFor(() => expect(getByText(`${dummyLogs[0].createdBy.firstName} ${dummyLogs[0].createdBy.lastName}`)).toBeInTheDocument());
    });
});


