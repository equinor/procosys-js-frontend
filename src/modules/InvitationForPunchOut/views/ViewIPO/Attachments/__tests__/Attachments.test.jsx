import { act, cleanup, render, waitFor } from '@testing-library/react';

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
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
        cleanup();
    });

    it('Should render embty table when no attachments', async () => {
        let result;
        await act(async () => Promise.resolve(result = render(<Attachments ipoId={2} />, container)));

        expect(result.getByText('No records to display')).toBeInTheDocument();
    });

    it('Should render attachments in table', async () => {
        let result;
        await act(async () => Promise.resolve(result = render(<Attachments ipoId={0} />, container)));

        await waitFor(() => expect(result.getByText('file1.txt')).toBeInTheDocument());
    });
});

