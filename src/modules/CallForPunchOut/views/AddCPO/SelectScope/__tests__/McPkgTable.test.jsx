import { render } from '@testing-library/react';

import McPkgTable from '../McPkgTable';
import React from 'react';

describe('<McPkgTable />', () => {
    it('Should render McPkg table headers', () => {
        const { getByText } = render(<McPkgTable filter=''/>);
        expect(getByText('Mc pkg')).toBeInTheDocument();
        expect(getByText('Description')).toBeInTheDocument();
        expect(getByText('M-01 date')).toBeInTheDocument();
        expect(getByText('M-02 date')).toBeInTheDocument();
    });

    test.todo('Should be able to remove mc packages from selected scope');
    test.todo('Should render with selected mc pkgs');
    test.todo('Should be able to add mc packages to selected scope');

});
