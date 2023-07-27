import { render, waitFor } from '@testing-library/react';

import React from 'react';
import SearchIPO from '../SearchIpo';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';

const mockProject = [
    {
        id: 1,
        name: '886',
        description: 'Test',
    },
];

jest.mock('../../../context/InvitationForPunchOutContext', () => ({
    useInvitationForPunchOutContext: () => {
        return {
            apiClient: {
                getIPOs: () =>
                    Promise.resolve({ maxAvailable: 0, invitations: [] }),
                getAllProjectsForUserAsync: () => Promise.resolve(mockProject),
                getFunctionalRolesAsync: () => Promise.resolve([]),
                getSavedIPOFilters: () => Promise.resolve([]),
            },
            availableProjects: mockProject,
        };
    },
}));

describe('<SearchIPO />', () => {
    it('Should render with header and empty table', async () => {
        const history = createMemoryHistory();
        const { getByText } = render(
            <Router history={history}>
                <SearchIPO />
            </Router>
        );
        await waitFor(() =>
            expect(getByText('Invitation for punch-out')).toBeInTheDocument()
        );
        await waitFor(() =>
            expect(getByText('Select project')).toBeInTheDocument()
        );
        await waitFor(() =>
            expect(getByText('No records to display')).toBeInTheDocument()
        );
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
        await waitFor(() =>
            expect(getByText('New IPO').closest('a')).toHaveAttribute(
                'href',
                '/CreateIPO'
            )
        );
    });
});
