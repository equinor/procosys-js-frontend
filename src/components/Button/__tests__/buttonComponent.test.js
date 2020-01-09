import Button from '../index';
import React from 'react';
import { render } from '@testing-library/react';

describe('<Button />', () => {
    it('Should display text when using text prop', () => {
        const { getByText } = render(<Button text="click me" />);

        expect(getByText('click me')).toBeInTheDocument();
    });
});
