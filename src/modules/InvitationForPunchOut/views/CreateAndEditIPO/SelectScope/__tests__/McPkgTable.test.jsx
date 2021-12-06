import { render, waitFor, act } from '@testing-library/react';

import McPkgTable from '../McPkgTable';
import React from 'react';

const mockSelectedMcPkgs = {
    commPkgNoParent: 'comm 01',
    multipleDisciplines: false,
    selected: [
        {
            mcPkgNo: 'Mc pkg 1',
            description: 'Description 1',
            status: 'OK',
            tableData: {
                checked: true,
            },
        },
        {
            mcPkgNo: 'Mc pkg 2',
            description:
                'Very long description of a commpkg that is to be selected. Description should be displayed in accordion in selected scope component.Very long description of a commpkg that is to be selected. Description should be displayed in accordion in selected scope component.',
            status: 'OK',
            tableData: {
                checked: true,
            },
        },
    ],
};

const mockMcPkgs = [
    {
        mcPkgNo: 'Mc pkg 1',
        description: 'Description 1',
        discipline: 'E',
    },
    {
        mcPkgNo: 'Mc pkg 2',
        description:
            'Very long description of a commpkg that is to be selected. Description should be displayed in accordion in selected scope component.Very long description of a commpkg that is to be selected. Description should be displayed in accordion in selected scope component.',
        discipline: 'J',
    },
    {
        mcPkgNo: 'Mc pkg 3',
        description: 'Description 3',
        discipline: 'T',
    },
];

jest.mock('../../../../context/InvitationForPunchOutContext', () => ({
    useInvitationForPunchOutContext: () => {
        return {
            apiClient: {
                getMcPkgsAsync: () => Promise.resolve(mockMcPkgs),
            },
        };
    },
}));

describe('<McPkgTable />', () => {
    it('Should render McPkg table headers', async () => {
        var propFunc = jest.fn();
        await act(async () => {
            const { getByText } = render(
                <McPkgTable
                    setSelectedMcPkgScope={propFunc}
                    selectedMcPkgScope={mockSelectedMcPkgs}
                />
            );
            await waitFor(() =>
                expect(getByText('Mc pkg')).toBeInTheDocument()
            );
            expect(getByText('Description')).toBeInTheDocument();
        });
    });

    it('Should render table data', async () => {
        var propFunc = jest.fn();
        await act(async () => {
            const { getByText, container } = render(
                <McPkgTable
                    setSelectedMcPkgScope={propFunc}
                    selectedMcPkgScope={mockSelectedMcPkgs}
                />
            );
            await waitFor(() =>
                expect(getByText('Mc pkg')).toBeInTheDocument()
            );
            expect(getByText('Mc pkg 1')).toBeInTheDocument();
            expect(getByText('Mc pkg 2')).toBeInTheDocument();
            expect(getByText('Mc pkg 3')).toBeInTheDocument();
            const checkboxes = container.querySelectorAll(
                'input[type="checkbox"]'
            );
            expect(checkboxes.length == 3);
        });
    });

    test.todo('Should be able to remove mc packages from selected scope');
    test.todo('Should render with selected mc pkgs');
    test.todo('Should be able to add mc packages to selected scope');
});
