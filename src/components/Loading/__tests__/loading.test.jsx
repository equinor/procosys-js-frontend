import Loading from '../index';
import React from 'react';
import {render} from '@testing-library/react';

describe('<Loading />', () => {
    it('Should display text when using title prop', () => {
        const {getByText} = render(<Loading title="Hello" />);

        expect(getByText('Hello')).toBeInTheDocument();
    });
    it('Should not render text node when not using title prop', () => {
        const {container} = render(<Loading />);

        expect(container.querySelector('h1')).not.toBeInTheDocument();
    });
});
