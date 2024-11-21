import CommPkgTable from '../CommPkgTable';
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

describe('<CommPkgTable />', () => {
    it('Should render table', () => {
        const propFunc = jest.fn();
        const { queryByText } = render(
            <MemoryRouter>
                <CommPkgTable setSelectedCommPkgScope={propFunc} />
            </MemoryRouter>
        );
        expect(queryByText('Description')).toBeInTheDocument();
        expect(queryByText('Comm status')).toBeInTheDocument();
        expect(queryByText('Comm pkg')).toBeInTheDocument();
    });

    // TODO
    // it('Should render CommPkg table headers without MC column on search', () => {
    //     const { getByText, queryByText } = render(<CommPkgTable />);
    //     expect(getByText('Comm pkg')).toBeInTheDocument();
    //     expect(getByText('Description')).toBeInTheDocument();
    //     expect(getByText('Comm status')).toBeInTheDocument();
    //     expect(queryByText('MC')).toBeNull();
    // });

    // it('Should CommPkg table headers with MC column on search', () => {
    //     const { getByText } = render(<CommPkgTable type={'DP'} />);
    //     expect(getByText('Comm pkg')).toBeInTheDocument();
    //     expect(getByText('Description')).toBeInTheDocument();
    //     expect(getByText('Comm status')).toBeInTheDocument();
    //     expect(getByText('MC')).toBeInTheDocument();
    // });

    test.todo('Should be able to remove comm packages from selected scope');
    test.todo('Should render with selected comm pkgs');
    test.todo('Should be able to add comm packages to selected scope');

    it('Should render the search field as disabled if the type is MDP and the commPkgNo is in the URL', () => {
        const propFunc = jest.fn();
        const { queryByPlaceholderText } = render(
            <MemoryRouter>
                <CommPkgTable
                    type="MDP"
                    commPkgNo={50}
                    setSelectedCommPkgScope={propFunc}
                />
            </MemoryRouter>
        );
        expect(queryByPlaceholderText('Search')).toBeDisabled();
    });
});
