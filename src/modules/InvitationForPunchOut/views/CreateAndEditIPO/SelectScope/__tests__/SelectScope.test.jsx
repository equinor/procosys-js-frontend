import React from 'react';
import SelectScope from '../SelectScope';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

describe('<SelectScope />', () => {
    it('Renders with correct title and table for MDP', async () => {
        var propFunc = jest.fn();
        const { getByText } = render(
            <MemoryRouter>
                <SelectScope
                    selectedMcPkgScope={propFunc}
                    setSelectedCommPkgScope={propFunc}
                />
            </MemoryRouter>
        );
        expect(getByText('Select commissioning packages')).toBeInTheDocument();
        expect(getByText('Comm pkg')).toBeInTheDocument;
    });

    it('Renders with correct title and table for DP', async () => {
        var propFunc = jest.fn();
        const { getByText } = render(
            <MemoryRouter>
                <SelectScope
                    type="DP"
                    selectedMcPkgScope={propFunc}
                    setSelectedCommPkgScope={propFunc}
                />
            </MemoryRouter>
        );
        expect(
            getByText('Click on the arrow next to a comm pkg to open MC scope')
        ).toBeInTheDocument();
        expect(getByText('Comm pkg')).toBeInTheDocument;
    });

    it('Renders with correct title for MDP if commPkgNo is given', async () => {
        var propFunc = jest.fn();
        const { getByText } = render(
            <MemoryRouter>
                <SelectScope
                    selectedMcPkgScope={propFunc}
                    commPkgNo={50}
                    setSelectedCommPkgScope={propFunc}
                />
            </MemoryRouter>
        );
        expect(getByText('Scope has been preselected')).toBeInTheDocument();
    });

    it('Renders with correct title for DP if commPkgNo is given', async () => {
        var propFunc = jest.fn();
        const { getByText } = render(
            <MemoryRouter>
                <SelectScope
                    type="DP"
                    selectedMcPkgScope={propFunc}
                    commPkgNo={50}
                    setSelectedCommPkgScope={propFunc}
                />
            </MemoryRouter>
        );
        expect(
            getByText('Select MC packages in comm pkg 50')
        ).toBeInTheDocument();
    });
});
