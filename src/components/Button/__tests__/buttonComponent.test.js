import Button from '../index';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

describe('<Button />', () => {
    it('Should display text when using text prop', () => {
        const { getByText } = render(<Button text="click me" />);

        expect(getByText('click me')).toBeInTheDocument();
    });

    it('Should trigger the onClick function when clicked', () => {
        const fn = jest.fn();
        const { container } = render(<Button text="click me" onClick={fn} />);
        const button = container.firstChild;

        fireEvent.click(button);

        expect(fn).toBeCalledTimes(1);
    });
});
