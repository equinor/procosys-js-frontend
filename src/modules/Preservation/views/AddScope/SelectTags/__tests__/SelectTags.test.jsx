import { render } from '@testing-library/react';
import React from 'react';

import SelectTags from '../SelectTags';

jest.mock('../../../../context/PreservationContext', () => ({
    usePreservationContext: jest.fn(() => {
        return {
            project: {
                id: 1,
                name: 'test',
                description: 'project'
            }
        };
    })
}));

let selectedTags = [];

describe('Module: <SelectTags />', () => {

    it('Should render Next button disabled when no rows are selected', () => {
        const { getByText } = render(<SelectTags selectedTags={selectedTags} />);
        expect(getByText('Next')).toHaveProperty('disabled', true);
    });

    it('Should render Next button enabled when rows are selected', () => {
        selectedTags = [
            { id: 1 }
        ];

        const { getByText } = render(<SelectTags selectedTags={selectedTags} />);
        expect(getByText('Next')).toHaveProperty('disabled', false);
    });
});