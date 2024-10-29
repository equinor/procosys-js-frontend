import InvitationsTable from '../InvitationsTable';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';

const mockIPOs = [];

const mockGetIPOs = jest.fn(async () => {
    return new Promise((resolve) => {
        resolve(mockIPOs);
    });
});

describe('<InvitationsTable />', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should render with columns', async () => {
        const { getByText } = render(
            <MemoryRouter>
                <InvitationsTable
                    getIPOs={mockGetIPOs}
                    data-testId="invitations-table"
                    pageSize={10}
                    setPageSize={jest.fn()}
                    shouldSelectFirstPage={false}
                    setFirstPageSelected={jest.fn()}
                    projectName={'projectName'}
                    height={200}
                    update={jest.fn()}
                    filterUpdate={jest.fn()}
                    setOrderByField={jest.fn()}
                    setOrderDirection={jest.fn()}
                />
            </MemoryRouter>
        );
        await waitFor(() => expect(getByText('ID')).toBeInTheDocument());
        expect(getByText('Title')).toBeInTheDocument();
        expect(getByText('Type')).toBeInTheDocument();
        expect(getByText('Status')).toBeInTheDocument();
        expect(getByText('Comm pkg')).toBeInTheDocument();
        expect(getByText('MC pkg')).toBeInTheDocument();
        expect(getByText('Sent')).toBeInTheDocument();
        expect(getByText('Punch-out')).toBeInTheDocument();
        expect(getByText('Completed')).toBeInTheDocument();
        expect(getByText('Accepted')).toBeInTheDocument();
        expect(getByText('Contractor rep')).toBeInTheDocument();
        expect(getByText('Construction company rep')).toBeInTheDocument();
        expect(getByText('Commissioning rep')).toBeInTheDocument();
        expect(getByText('Operation rep')).toBeInTheDocument();
        expect(getByText('Technical integrity rep')).toBeInTheDocument();
        expect(getByText('Supplier rep')).toBeInTheDocument();
        expect(getByText('External rep')).toBeInTheDocument();
    });
});
