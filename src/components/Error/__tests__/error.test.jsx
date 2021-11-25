import Error from '../index';
import React from 'react';
import { render } from '@testing-library/react';

describe('<Error />', () => {
    it('Should display text when using title prop', () => {
        const { getByText } = render(<Error title="Hello" />);

        expect(getByText('Hello')).toBeInTheDocument();
    });
    it('Should not render text node when not using title prop', () => {
        const { container } = render(<Error />);

        expect(container.textContent).toBe('Unknown error');
    });
});
