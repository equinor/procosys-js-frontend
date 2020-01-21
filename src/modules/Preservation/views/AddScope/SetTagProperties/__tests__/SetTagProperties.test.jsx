import React from 'react';
import SelectTags from '../SelectTags';
import { render } from '@testing-library/react';

jest.mock('../../../context/PreservationContext', () => ({
    usePreservationContext: jest.fn(() => {
        return {
            project: {
                description: 'test project'
            }
        };
    })
}));

let selectedTags = [];

describe('Module: <SelectTags />', () => {

    it('Should render Next button disabled when no rows are selected', () => {
        const { getByText } = render(<SelectTags tags={selectedTags} />);
        expect(getByText('Next')).toHaveProperty('disabled', true);
    });

    it('Should render Next button enabled when rows are selected', () => {
        selectedTags = [
            { id: 1 }
        ];

        const { getByText } = render(<SelectTags tags={selectedTags} />);
        expect(getByText('Next')).toHaveProperty('disabled', false);
    });
});
