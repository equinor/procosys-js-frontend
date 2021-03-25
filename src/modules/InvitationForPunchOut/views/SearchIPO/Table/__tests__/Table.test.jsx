import InvitationsTable from '../index';
import React from 'react';
import { render, waitFor } from '@testing-library/react';

const mockIPOs = [];

const mockGetIPOs = jest.fn(async () => {
    return new Promise(resolve => {
        resolve(mockIPOs);
    });
});

jest.mock('react-virtualized-auto-sizer', () => {
    return (props) => {
        const renderCallback = props.children;

        return renderCallback({
            width: 1200,
            height: 900
        });
    };
});

describe('<InvitationsTable />', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should render with columns', async () => {
        const { getByText } = render(
            <InvitationsTable
                getIPOs={mockGetIPOs}
                data-testId='invitations-table'
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
        );
        await waitFor(() => expect(getByText('ID')).toBeInTheDocument());
        await waitFor(() => expect(getByText('Title')).toBeInTheDocument());
        await waitFor(() => expect(getByText('Type')).toBeInTheDocument());
        await waitFor(() => expect(getByText('Status')).toBeInTheDocument());
        await waitFor(() => expect(getByText('Comm pkg')).toBeInTheDocument());
        await waitFor(() => expect(getByText('MC pkg')).toBeInTheDocument());
        await waitFor(() => expect(getByText('Sent')).toBeInTheDocument());
        await waitFor(() => expect(getByText('Punch-out')).toBeInTheDocument());
        await waitFor(() => expect(getByText('Completed')).toBeInTheDocument());
        await waitFor(() => expect(getByText('Accepted')).toBeInTheDocument());
        await waitFor(() => expect(getByText('Contractor rep')).toBeInTheDocument());
        await waitFor(() => expect(getByText('Construction rep')).toBeInTheDocument());
    });
});



