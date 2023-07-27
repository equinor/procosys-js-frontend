import { fireEvent, render } from '@testing-library/react';

import InvitationsFilter from '../InvitationsFilter';
import React from 'react';

const emptyFilter = {
    ipoStatuses: [],
    functionalRoleCode: '',
    personOid: '',
    ipoIdStartsWith: '',
    commPkgNoStartsWith: '',
    mcPkgNoStartsWith: '',
    titleStartsWith: '',
    punchOutDates: [],
};

const roles = [
    {
        text: 'Role 1',
        value: 'role1',
    },
    {
        text: 'Role 2',
        value: 'role2',
    },
];

const project = { id: 'projectd', title: 'Project' };

const filter = {
    ipoStatuses: ['Completed'],
    functionalRoleCode: '',
    personOid: '',
    ipoIdStartsWith: '',
    commPkgNoStartsWith: '',
    mcPkgNoStartsWith: '',
    titleStartsWith: '',
    punchOutDates: ['ThisWeek'],
};

const savedFilters = [
    {
        id: 1,
        title: 'Not empty',
        criteria: JSON.stringify(filter),
        defaultFilter: false,
        rowVersion: '1',
    },
];

const exportInvitationsToExcel = jest.fn();

describe('<InvitationsFilter />', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should render with no active filters', async () => {
        const { getByText } = render(
            <InvitationsFilter
                project={project}
                onCloseRequest={jest.fn()}
                filter={emptyFilter}
                setFilter={jest.fn()}
                roles={roles}
                numberOfIPOs={0}
                savedFilters={savedFilters}
                refreshSavedFilters={jest.fn}
                selectedSavedFilterTitle={null}
                setSelectedSavedFilterTitle={jest.fn}
                exportInvitationsToExcel={exportInvitationsToExcel}
            />
        );
        expect(getByText('No active filters')).toBeInTheDocument();
    });

    it('Should render with filters sections', async () => {
        const { getByText } = render(
            <InvitationsFilter
                project={project}
                onCloseRequest={jest.fn()}
                filter={emptyFilter}
                setFilter={jest.fn()}
                roles={roles}
                numberOfIPOs={0}
                savedFilters={savedFilters}
                refreshSavedFilters={jest.fn}
                selectedSavedFilterTitle={null}
                setSelectedSavedFilterTitle={jest.fn}
                exportInvitationsToExcel={exportInvitationsToExcel}
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
                project={{ id: 'projectd', title: 'Project' }}
                onCloseRequest={jest.fn()}
                filter={emptyFilter}
                setFilter={jest.fn()}
                roles={roles}
                numberOfIPOs={0}
                savedFilters={savedFilters}
                refreshSavedFilters={jest.fn}
                selectedSavedFilterTitle={null}
                setSelectedSavedFilterTitle={jest.fn}
                exportInvitationsToExcel={exportInvitationsToExcel}
            />
        );
        fireEvent.click(getByTestId('search-fields'));
        expect(getByPlaceholderText('Search IPO number')).toBeInTheDocument();
        expect(getByPlaceholderText('Search IPO title')).toBeInTheDocument();
        expect(getByPlaceholderText('Search comm pkg')).toBeInTheDocument();
        expect(getByPlaceholderText('Search mc pkg')).toBeInTheDocument();
    });

    it('Should only open the saved filters popover after the button for saved filters has been clicked', async () => {
        const { getByTitle, queryByText } = render(
            <InvitationsFilter
                project={project}
                onCloseRequest={jest.fn()}
                filter={emptyFilter}
                setFilter={jest.fn()}
                roles={roles}
                numberOfIPOs={0}
                savedFilters={savedFilters}
                refreshSavedFilters={jest.fn}
                selectedSavedFilterTitle={null}
                setSelectedSavedFilterTitle={jest.fn}
                exportInvitationsToExcel={exportInvitationsToExcel}
            />
        );
        expect(queryByText('Saved filters')).not.toBeInTheDocument();
        const openButton = getByTitle('Open saved filters');
        fireEvent.click(openButton);
        expect(queryByText('Saved filters')).toBeInTheDocument();
    });

    it('Should change filter value if a saved filter is clicked', async () => {
        const { getByTitle, queryByText } = render(
            <InvitationsFilter
                project={project}
                onCloseRequest={jest.fn()}
                filter={emptyFilter}
                setFilter={jest.fn()}
                roles={roles}
                numberOfIPOs={0}
                savedFilters={savedFilters}
                refreshSavedFilters={jest.fn}
                selectedSavedFilterTitle={null}
                setSelectedSavedFilterTitle={jest.fn}
                exportInvitationsToExcel={exportInvitationsToExcel}
            />
        );
        expect(queryByText('No active filters')).toBeInTheDocument();
        const openButton = getByTitle('Open saved filters');
        fireEvent.click(openButton);
        const savedFilter = queryByText('Not empty');
        fireEvent.click(savedFilter);
        expect(queryByText('No active filters')).not.toBeInTheDocument();
    });

    it('Should render with the export to excel button', async () => {
        const { getByTitle } = render(
            <InvitationsFilter
                project={project}
                onCloseRequest={jest.fn()}
                filter={emptyFilter}
                setFilter={jest.fn()}
                roles={roles}
                numberOfIPOs={0}
                savedFilters={savedFilters}
                refreshSavedFilters={jest.fn}
                selectedSavedFilterTitle={null}
                setSelectedSavedFilterTitle={jest.fn}
                exportInvitationsToExcel={exportInvitationsToExcel}
            />
        );
        expect(getByTitle('Export filtered IPOs to Excel')).toBeInTheDocument();
    });

    it('Should call the export to excel function when excel button is clicked', async () => {
        const { getByTitle } = render(
            <InvitationsFilter
                project={project}
                onCloseRequest={jest.fn()}
                filter={emptyFilter}
                setFilter={jest.fn()}
                roles={roles}
                numberOfIPOs={0}
                savedFilters={savedFilters}
                refreshSavedFilters={jest.fn}
                selectedSavedFilterTitle={null}
                setSelectedSavedFilterTitle={jest.fn}
                exportInvitationsToExcel={exportInvitationsToExcel}
            />
        );
        expect(exportInvitationsToExcel).toHaveBeenCalledTimes(0);
        getByTitle('Export filtered IPOs to Excel').click();
        expect(exportInvitationsToExcel).toHaveBeenCalledTimes(1);
    });
});
