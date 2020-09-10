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

    //TODO: add more tests

});
