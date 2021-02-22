import React from 'react';
import SavedFilters from '../index';
import { fireEvent, render } from '@testing-library/react';
import { ProjectDetails } from '@procosys/modules/Preservation/types';
import { SavedIPOFilter, IPOFilter } from '../../../types';
import { ThemeProvider } from 'styled-components';
import theme from '@procosys/assets/theme';

const project: ProjectDetails = {
    id: 1,
    name: 'Test',
    description: 'This is a test project'
};

const filter: IPOFilter = {
    'ipoStatuses':['Completed'],
    'functionalRoleCode':'',
    'personOid':'',
    'ipoIdStartsWith':'',
    'commPkgNoStartsWith':'',
    'mcPkgNoStartsWith':'',
    'titleStartsWith':'',
    'punchOutDates':['ThisWeek']
};

const savedFilters: SavedIPOFilter[] = [
    {
        id: 1,
        title: 'Test',
        criteria: JSON.stringify(filter),
        defaultFilter: false,
        rowVersion:  '1'
    },
    {
        id: 2,
        title: 'Test 2',
        criteria: JSON.stringify(filter),
        defaultFilter: false,
        rowVersion:  '2'
    }
];

const refreshSavedIPOFilters = jest.fn;
const setIPOFilter = jest.fn;
const setSelectedSavedFilterTitle = jest.fn;
const onCloseRequest = jest.fn;

const renderWithTheme = (Component: JSX.Element): any => {
    return render(
        <ThemeProvider theme={theme}>{Component}</ThemeProvider>
    );
};

describe('<SavedFilters />', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should change view once the \'Save current filter\' button has been pressed', () => {
        const { queryByText } = renderWithTheme(
            <SavedFilters 
                project={project}
                savedIPOFilters={savedFilters}
                refreshSavedIPOFilters={refreshSavedIPOFilters}
                ipoFilter={filter}
                setIPOFilter={setIPOFilter}
                selectedSavedFilterTitle={null}
                setSelectedSavedFilterTitle={setSelectedSavedFilterTitle}
                onCloseRequest={onCloseRequest}
            />
        );
        expect(queryByText('Saved filters')).toBeInTheDocument();
        expect(queryByText('Save as new filter')).not.toBeInTheDocument();
        const button = queryByText('Save current filter');
        fireEvent.click(button);
        expect(queryByText('Saved filters')).not.toBeInTheDocument();
        expect(queryByText('Save as new filter')).toBeInTheDocument();
    });

    it('Should render a list of all saved filters', () => {
        const { queryAllByText } = renderWithTheme(
            <SavedFilters 
                project={project}
                savedIPOFilters={savedFilters}
                refreshSavedIPOFilters={refreshSavedIPOFilters}
                ipoFilter={filter}
                setIPOFilter={setIPOFilter}
                selectedSavedFilterTitle={null}
                setSelectedSavedFilterTitle={setSelectedSavedFilterTitle}
                onCloseRequest={onCloseRequest}
            />
        );
        const filters = queryAllByText('Test', {exact: false});
        expect(filters).toHaveLength(2);
    });
});
