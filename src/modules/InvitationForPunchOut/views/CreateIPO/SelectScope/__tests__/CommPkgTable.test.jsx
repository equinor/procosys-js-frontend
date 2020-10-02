import { render } from '@testing-library/react';

import CommPkgTable from '../CommPkgTable';
import React from 'react';

describe('<CommPkgTable />', () => {
    it('should not render table when no filter is applied', () => {
        const { queryByText } = render(<CommPkgTable />);
        expect(queryByText('Description')).toBeNull();
        expect(queryByText('Comm status')).toBeNull();
        expect(queryByText('MC')).toBeNull();
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

});
