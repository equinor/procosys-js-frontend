import { render, waitFor } from '@testing-library/react';

import Attachments from '../index';
import React from 'react';

jest.mock('../../../../context/InvitationForPunchOutContext',() => ({
    useInvitationForPunchOutContext: () => {
        return {
            apiClient: {
                getAttachments: (id) => Promise.resolve(id === 0 ? [{ id: 0, fileName: 'file1.txt', rowVersion: '123'}] : [])
            }
        };
    }
}));

describe('Module: <Attachments ipoId={} />', () => {

    it('Should render empty table when no attachments', async () => {
        const { getByText } = render(<Attachments ipoId={2} />);

        await waitFor(() => expect(getByText('No records to display')).toBeInTheDocument());
    });

    it('Should render attachments in table', async () => {
        const { getByText } = render(<Attachments ipoId={0} />);

        await waitFor(() => expect(getByText('file1')).toBeInTheDocument());
    });
});

