import PersonSelector from '../PersonSelector';
import React from 'react';
import { render } from '@testing-library/react';

describe('<PersonSelector />', () => {
    it('Should render with title and dropdown', async () => {
        const { getByText } = render(
            <PersonSelector onChange={jest.fn()} personOid={''} />
        );
        expect(getByText('Person')).toBeInTheDocument();
        expect(getByText('Search to select')).toBeInTheDocument();
    });
});
