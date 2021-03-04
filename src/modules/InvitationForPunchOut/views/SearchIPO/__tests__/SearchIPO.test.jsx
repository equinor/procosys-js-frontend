import { render, waitFor } from '@testing-library/react';

import React from 'react';
import SearchIPO from '../../SearchIPO';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';

jest.mock('../../../context/InvitationForPunchOutContext', () => ({
    useInvitationForPunchOutContext: () => {
        return {
            apiClient: {
                getIPOs: () => Promise.resolve({maxAvailable: 0, invitations: []}),
                getAllProjectsForUserAsync: () => Promise.resolve([]),
                getFunctionalRolesAsync: () => Promise.resolve([])
            }
        };
    }
}));

describe('<SearchIPO />', () => {
    it('Should render with header and empty table', async () => {
        const history = createMemoryHistory();
        const { getByText } = render(
            <Router history={history}>
                <SearchIPO />
            </Router>
        );          
        await waitFor(() => expect(getByText('Invitation for punch-out')).toBeInTheDocument());
        await waitFor(() => expect(getByText('Select project')).toBeInTheDocument());
        await waitFor(() => expect(getByText('No records to display')).toBeInTheDocument());
        await waitFor(() => expect(getByText('New IPO')).toBeInTheDocument());
    });
});
