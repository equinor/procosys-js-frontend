import { fireEvent, render } from '@testing-library/react';

import EdsIcon from '@procosys/components/EdsIcon';
import React from 'react';
import SelectFilter from '../SelectFilter';

const roles = [
    {
        text: 'Role 1',
        value: 'role1',
    },
    {
        text: 'Role 2',
        value: 'role2',
    },
];

describe('<SelectFilter />', () => {
    it('Should render with title', async () => {
        const { getByText } = render(
            <SelectFilter
                headerLabel="Header label"
                onChange={jest.fn()}
                selectedItems={['', '']}
                roles={roles}
                icon={<EdsIcon name="person" />}
            />
        );
        expect(getByText('Header label')).toBeInTheDocument();
    });

    it('Should render subfilters when expanded', async () => {
        const { getByText, getByTestId } = render(
            <SelectFilter
                headerLabel="Header label"
                onChange={jest.fn()}
                selectedItems={['', '']}
                roles={roles}
                icon={<EdsIcon name="person" />}
            />
        );
        fireEvent.click(getByTestId('selectfilter-collapse'));
        expect(getByText('Role')).toBeInTheDocument();
        expect(getByText('Select')).toBeInTheDocument();
        expect(getByText('Person')).toBeInTheDocument();
        expect(getByText('Search to select')).toBeInTheDocument();
    });
});
