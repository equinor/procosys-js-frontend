import ErrorBoundary from '..';
import React from 'react';
import { render } from '@testing-library/react';

const FaultyComponent = () => {
    throw 'This is an expected error from ErrorBoundary';
};

const SuccessfullComponent = () => {
    return <p>Hello</p>;
};


describe('<ErrorBoundary />', () => {
    // just prevent it from cluttering the log statements from test
    console.error = jest.fn();
    it('Renders error with default message', () => {
        const { getByText } = render(<ErrorBoundary><FaultyComponent /></ErrorBoundary>);
        expect(getByText('An unexpected error occured')).toBeInTheDocument();
    });

    it('Renders error with custom error message', () => {
        const { getByText } = render(<ErrorBoundary message="My custom error"><FaultyComponent /></ErrorBoundary>);
        expect(getByText('My custom error')).toBeInTheDocument();
    });

    it('Renders component without error', () => {
        const { getByText } = render(<ErrorBoundary><SuccessfullComponent /></ErrorBoundary>);
        expect(getByText('Hello')).toBeInTheDocument();
    });
});
