import { fireEvent, render } from '@testing-library/react';

import InvitationsFilter from '../index';
import React from 'react';

const emptyFilter = {
    ipoStatuses: [],
    functionalRoleCode: '',
    personOid: '',
    ipoIdStartsWith: '',
    commPkgNoStartsWith: '',
    mcPkgNoStartsWith: '',
    titleStartsWith: '',
    punchOutDates: []
};

const roles = [
    {
        text: 'Role 1',
        value: 'role1'
    },
    {
        text: 'Role 2',
        value: 'role2'
    }
];

describe('<InvitationsFilter />', () => {
    it('Should render with no active filters', async () => {
        async () => {
            const { getByText } = render(
                <InvitationsFilter 
                    project={{id: 'projectd', title: 'Project'}}
                    onCloseRequest={jest.fn()}
                    filter={emptyFilter} setFilter={jest.fn()}
                    roles={roles}
                    numberOfIPOs={0}
                />
            );          
            expect(getByText('No active filters')).toBeInTheDocument();
        };        
    });

    it('Should render with filters sections', async () => {
        const { getByText } = render(
            <InvitationsFilter 
                project={{id: 'projectd', title: 'Project'}}
                onCloseRequest={jest.fn()}
                filter={emptyFilter} setFilter={jest.fn()}
                roles={roles}
                numberOfIPOs={0}
            />
        );          
        expect(getByText('Search')).toBeInTheDocument();
        expect(getByText('Punch-out date')).toBeInTheDocument();
        expect(getByText('Current IPO status')).toBeInTheDocument();
        expect(getByText('Roles and persons')).toBeInTheDocument();
    });

    it('Should render with filters sections', async () => {
        const { getByPlaceholderText, getByTestId } = render(
            <InvitationsFilter 
                project={{id: 'projectd', title: 'Project'}}
                onCloseRequest={jest.fn()}
                filter={emptyFilter} setFilter={jest.fn()}
                roles={roles}
                numberOfIPOs={0}
            />
        );          
        fireEvent.click(getByTestId('search-fields'));
        expect(getByPlaceholderText('Search IPO number')).toBeInTheDocument();
        expect(getByPlaceholderText('Search IPO title')).toBeInTheDocument();
        expect(getByPlaceholderText('Search comm pkg')).toBeInTheDocument();
        expect(getByPlaceholderText('Search mc pkg')).toBeInTheDocument();
    });
});


