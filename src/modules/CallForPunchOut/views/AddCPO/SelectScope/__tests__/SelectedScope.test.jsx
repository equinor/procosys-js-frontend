import { render } from '@testing-library/react';

import SelectedScope from '../SelectedScope';
import React from 'react';

const mockMcScope = [
    {
        mcPkgNo: 'Mc pkg 1',
        description: 'Description 1',
        m01: 'date',
        m02: 'date',
        discipline: 'E'
    },
    {
        mcPkgNo: 'Mc pkg 2',
        description: 'Description',
        m01: 'date',
        m02: 'date',
        discipline: 'J'
    },
    {
        mcPkgNo: 'Mc pkg 3',
        description: 'Description 3',
        m01: 'date',
        m02: 'date',
        discipline: 'T'
    }
];

describe('<SelectedScope />', () => {
    it('Renders with warning when MC scope has different disciplines', async () => {
        const { getByText } = render(<SelectedScope selectedMcPkgs={mockMcScope} multipleDisciplines={true}/>);
        expect(getByText('Scope contains multiple disciplines')).toBeInTheDocument();
    });

    it('Renders without warning when no packages selected selected', async () => {
        const { queryByText } = render(<SelectedScope/>);
        expect(queryByText('Scope contains multiple disciplines')).toBeNull();
    });

    it('Renders with Accordion if selected scope is not empty', async () => {
        const { getByText } = render(<SelectedScope selectedMcPkgs={mockMcScope}/>);
        expect(getByText(mockMcScope[0].mcPkgNo)).toBeInTheDocument();
        expect(getByText(mockMcScope[1].mcPkgNo)).toBeInTheDocument();
        expect(getByText(mockMcScope[2].mcPkgNo)).toBeInTheDocument();
        expect(document.getElementsByTagName('svg')).toHaveLength(6); //one to open accordion and one delete icon on each element
    });
});
