import { render } from '@testing-library/react';

import CommPkgTable from '../CommPkgTable';
import React from 'react';

describe('<CommPkgTable />', () => {
    it('Should render CommPkg table headers without MC column', () => {
        const { getByText, queryByText } = render(<CommPkgTable filter={''} />);
        expect(getByText('Comm pkg')).toBeInTheDocument();
        expect(getByText('Description')).toBeInTheDocument();
        expect(getByText('Comm status')).toBeInTheDocument();
        expect(getByText('MDP accepted')).toBeInTheDocument();
        expect(queryByText('MC')).toBeNull();
    });

    it('Should render CommPkg table headers with MC column', () => {
        const { getByText } = render(<CommPkgTable filter={''} type={'DP'} />);
        expect(getByText('Comm pkg')).toBeInTheDocument();
        expect(getByText('Description')).toBeInTheDocument();
        expect(getByText('Comm status')).toBeInTheDocument();
        expect(getByText('MDP accepted')).toBeInTheDocument();
        expect(getByText('MC')).toBeInTheDocument();
    });

    //TODO: add more tests

});
