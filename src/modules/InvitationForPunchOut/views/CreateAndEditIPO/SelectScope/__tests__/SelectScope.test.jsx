import React from 'react';
import SelectScope from '../SelectScope';
import { render } from '@testing-library/react';


describe('<SelectScope />', () => {

    it('Renders with correct title and table for MDP', async () => {
        var propFunc = jest.fn();
        const { getByText } = render(<SelectScope selectedMcPkgScope={propFunc}/>);
        expect(getByText('Select commissioning packages')).toBeInTheDocument();
        expect(getByText('Comm pkg')).toBeInTheDocument;
    });

    it('Renders with correct title and table for DP', async () => {
        var propFunc = jest.fn();
        const { getByText } = render(<SelectScope type="DP" selectedMcPkgScope={propFunc}/>);
        expect(getByText('Click on the arrow next to a comm pkg to open MC scope')).toBeInTheDocument();
        expect(getByText('Comm pkg')).toBeInTheDocument;
    });

    it('Renders with correct title for MDP if commPkgNo is given', async () => {
        var propFunc = jest.fn();
        const { getByText } = render(<SelectScope selectedMcPkgScope={propFunc} commPkgNo={50}/>);
        expect(getByText('Scope has been preselected')).toBeInTheDocument();
    });

    it('Renders with correct title for DP if commPkgNo is given', async () => {
        var propFunc = jest.fn();
        const { getByText } = render(<SelectScope type="DP" selectedMcPkgScope={propFunc} commPkgNo={50}/>);
        expect(getByText('Select MC packages in comm pkg 50')).toBeInTheDocument();
    });
});
