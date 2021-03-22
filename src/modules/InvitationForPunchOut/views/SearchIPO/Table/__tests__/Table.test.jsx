import InvitationsTable from '../index';
import React from 'react';
import { render } from '@testing-library/react';

const mockIPOs = [];

const mockGetIPOs = jest.fn(async () => {
    return new Promise(resolve => {
        resolve(mockIPOs);
    });
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
        expect(getByText('ID')).toBeInTheDocument();
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
        expect(getByText('Construction rep')).toBeInTheDocument(); 
    });

    it('Should call setOrderByField and setOrderDirection if a column header is clicked', async () => {
        const setOrderByField = jest.fn();
        const setOrderDirection = jest.fn();
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
                setOrderByField={setOrderByField}
                setOrderDirection={setOrderDirection}
            />
        );
        expect(setOrderByField).toHaveBeenCalledTimes(1);
        expect(setOrderDirection).toHaveBeenCalledTimes(1);
        getByText('ID').click();
        expect(setOrderByField).toHaveBeenCalledTimes(2);
        expect(setOrderDirection).toHaveBeenCalledTimes(2);
    });
});



