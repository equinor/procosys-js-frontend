import { fireEvent, render, waitFor } from '@testing-library/react';

import React from 'react';
import SearchIPO from '../../SearchIPO';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';

const mockProject = [
    {
        id: 1,
        name: '886',
        description: 'Test'
    }
];

jest.mock('../../../context/InvitationForPunchOutContext', () => ({
    useInvitationForPunchOutContext: () => {
        return {
            apiClient: {
                getIPOs: () => Promise.resolve({maxAvailable: 0, invitations: []}),
                getAllProjectsForUserAsync: () => Promise.resolve(mockProject),
                getFunctionalRolesAsync: () => Promise.resolve([]),
                getSavedIPOFilters: () => Promise.resolve([])
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

    it('Should render "New IPO" button with correct link', async () => {
        const history = createMemoryHistory();
        const { getByText } = render(
            <Router history={history}>
                <SearchIPO />
            </Router>
        );          
        await waitFor(() => expect(getByText('New IPO')).toBeInTheDocument());
        await waitFor(() => expect(getByText('New IPO').closest('a')).toHaveAttribute('href', '/CreateIPO'));
    });

    it('Should change the link in the "New IPO" button when project is changed', async () => {
        const history = createMemoryHistory();
        const { getByText } = render(
            <Router history={history}>
                <SearchIPO />
            </Router>
        );          
        await waitFor(() => expect(getByText('Select project')).toBeInTheDocument());
        fireEvent.click(getByText('Select project'));
        await waitFor(() => expect(getByText('886')).toBeInTheDocument());
        fireEvent.click(getByText('886'));
        await waitFor(() => expect(getByText('New IPO').closest('a')).toHaveAttribute('href', '/CreateIPO/886'));
    });
});
