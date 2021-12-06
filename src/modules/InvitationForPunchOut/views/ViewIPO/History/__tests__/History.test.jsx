import { render, waitFor } from '@testing-library/react';

import History from '../index';
import React from 'react';
import { getFormattedDateAndTime } from '@procosys/core/services/DateService';

const dummyHistory = [
    {
        id: 0,
        description: 'asdasdsadd',
        createdAtUtc: '2020-12-28T09:24:19.592Z',
        createdBy: {
            userName: 'JEHAG',
        },
    },
    {
        id: 1,
        description: 'jcecopwej dwada daddawd',
        createdAtUtc: '2020-12-28T10:24:19.592Z',
        createdBy: {
            userName: 'ELIBRA',
        },
    },
];

jest.mock('../../../../context/InvitationForPunchOutContext', () => ({
    useInvitationForPunchOutContext: () => {
        return {
            apiClient: {
                getHistory: (id) =>
                    Promise.resolve(id === 0 ? dummyHistory : []),
            },
        };
    },
}));

describe('Module: <History ipoId={} />', () => {
    it('Should render empty table when no history', async () => {
        const { getByText } = render(<History ipoId={2} />);

        await waitFor(() =>
            expect(getByText('No records to display')).toBeInTheDocument()
        );
    });

    it('Should render history in table', async () => {
        const { getByText } = render(<History ipoId={0} />);

        await waitFor(() =>
            expect(getByText(dummyHistory[1].description)).toBeInTheDocument()
        );
        await waitFor(() =>
            expect(
                getByText(getFormattedDateAndTime(dummyHistory[0].createdAtUtc))
            ).toBeInTheDocument()
        );
        await waitFor(() =>
            expect(
                getByText(getFormattedDateAndTime(dummyHistory[1].createdAtUtc))
            ).toBeInTheDocument()
        );
        await waitFor(() =>
            expect(
                getByText(`${dummyHistory[0].createdBy.userName}`)
            ).toBeInTheDocument()
        );
        await waitFor(() =>
            expect(
                getByText(`${dummyHistory[1].createdBy.userName}`)
            ).toBeInTheDocument()
        );
    });
});
