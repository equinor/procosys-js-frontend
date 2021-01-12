import { render, waitFor } from '@testing-library/react';

import Comments from '../index';
import React from 'react';

const comments = [
    {
        id: 0,
        comment: 'Attachments alkwd akwkl dknawkndlaknwd wdadd adwa a adwadwad ada adw ad adw ad awaddadawdawdadawd',
        createdAtUtc: 'Wed, 14 Jun 2017 07:00:00 GMT',
        createdBy: {
            firstName: 'Jan Erik',
            lastName: 'Hagevold'
        },
        rowVersion: 'asdadasdads'
    },
    {
        id: 1,
        comment: 'Attachments alkwd akwkl dknawkndlaknwd dsa dwad adwad adw awdawd awda wd a awdawda wdawda dawd awd awd awdawdad',
        createdAtUtc: 'Wed, 14 Jun 2017 08:00:00 GMT',
        createdBy: {
            firstName: 'Elisabeth',
            lastName: 'Bratli'
        },
        rowVersion: 'asdawwwwwads'
    }
];

jest.mock('../../../../context/InvitationForPunchOutContext',() => ({
    useInvitationForPunchOutContext: () => {
        return {
            apiClient: {
                getComments: (id) => Promise.resolve(id === 0 ? comments : [])
            }
        };
    }
}));

describe('Module: <Comments ipoId={} />', () => {


    it('Should render comments in pane', async () => {
        const { getByText } = render(<Comments comments={comments}  loading={false} />);

        await waitFor(() => expect(getByText(comments[1].comment)).toBeInTheDocument());
        await waitFor(() => expect(getByText((new Date(comments[1].createdAtUtc)).toLocaleString([], {year: 'numeric', month: '2-digit', day: 'numeric', hour: '2-digit', minute: '2-digit'}))).toBeInTheDocument());
        await waitFor(() => expect(getByText(`${comments[0].createdBy.firstName} ${comments[0].createdBy.lastName}`)).toBeInTheDocument());
    });
});


