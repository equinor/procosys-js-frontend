import { render } from '@testing-library/react';

import SelectScope from '../SelectScope';
import React from 'react';

const mockScope = [
    {
        commPkgNo: 'Comm pkg 1',
        description: 'Description 1',
        status: 'PB',
        mdpAccepted: 'testDate'
    },
    {
        commPkgNo: 'Comm pkg 2',
        description: 'Description 2.',
        status: 'OK',
        mdpAccepted: 'testDate'
    },
    {
        commPkgNo: 'test',
        description: 'Description 3',
        status: 'PA',
        mdpAccepted: 'testDate'
    }
];

describe('<SelectScope />', () => {
    it('Renders with enabled previous button', async () => {
        var propFunc = jest.fn();
        const { getByText } = render(<SelectScope selectedMcPkgScope={propFunc} />);
        expect(getByText('Previous').closest('button')).toHaveProperty('disabled', false);
    });

    it('Renders with disabled next button when empty scope', async () => {
        var propFunc = jest.fn();
        const { getByText } = render(<SelectScope selectedMcPkgScope={propFunc} />);
        expect(getByText('Next').closest('button')).toHaveProperty('disabled', true);
    });

    it('Renders with disabled next button when not empty scope', async () => {
        var propFunc = jest.fn();
        const { getByText } = render(<SelectScope selectedMcPkgScope={propFunc} selectedCommPkgScope={mockScope} isValid={true}/>);
        expect(getByText('Next').closest('button')).toHaveProperty('disabled', false);
    });

    it('Renders with title', async () => {
        var propFunc = jest.fn();
        const { getByText } = render(<SelectScope selectedMcPkgScope={propFunc}/>);
        expect(getByText('Select commissioning packages')).toBeInTheDocument();
    });

});
