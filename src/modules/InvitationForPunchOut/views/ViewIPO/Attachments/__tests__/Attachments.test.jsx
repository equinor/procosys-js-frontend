import { render, waitFor } from '@testing-library/react';

import Attachments from '../index';
import React from 'react';

const attachment = {
    downloadUri: '',
    id: 9,
    fileName: 'file1.txt',
    rowVersion: '',
    uploadedAt: new Date(2020, 11, 11, 11),
    uploadedBy: {
        id: 1,
        firstName: 'firstName',
        lastName: 'lastName',
        azureOid: '',
        email: null,
        rowVersion: ''
    }
};

jest.mock('../../../../context/InvitationForPunchOutContext',() => ({
    useInvitationForPunchOutContext: () => {
        return {
            apiClient: {
                getAttachments: (id) => Promise.resolve(id === 0 ? [{
                    downloadUri: '',
                    id: 9,
                    fileName: 'file1.txt',
                    rowVersion: '',
                    uploadedAt: new Date(2020, 11, 11, 11),
                    uploadedBy: {
                        id: 1,
                        firstName: 'firstName',
                        lastName: 'lastName',
                        azureOid: '',
                        email: null,
                        rowVersion: ''
                    }
                }] : [])
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
        await waitFor(() => expect(getByText('11/12/2020 11:00')).toBeInTheDocument());
        await waitFor(() => expect(getByText(`${attachment.uploadedBy.firstName} ${attachment.uploadedBy.lastName}`)).toBeInTheDocument());
    });
});

