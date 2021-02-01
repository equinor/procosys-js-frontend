import { AnalyticsContext } from '@procosys/core/services/Analytics/AnalyticsContext';
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
        const { getByText } = render(<AnalyticsContext.Provider value={{trackException: jest.fn()}}><ErrorBoundary><FaultyComponent /></ErrorBoundary></AnalyticsContext.Provider>);
        expect(getByText('An unexpected error occured')).toBeInTheDocument();
    });

    it('Renders error with custom error message', () => {
        const { getByText } = render(<AnalyticsContext.Provider value={{trackException: jest.fn()}}><ErrorBoundary message="My custom error"><FaultyComponent /></ErrorBoundary></AnalyticsContext.Provider>);
        expect(getByText('My custom error')).toBeInTheDocument();
    });

    it('Reports exception to analytics context', () => {
        const myFakeExceptionTracker = jest.fn();
        render(<AnalyticsContext.Provider value={{trackException: myFakeExceptionTracker}}><ErrorBoundary><FaultyComponent /></ErrorBoundary></AnalyticsContext.Provider>);
        expect(myFakeExceptionTracker).toHaveBeenCalledTimes(1);
    });

    it('Renders component without error', () => {
        const { getByText } = render(<ErrorBoundary><SuccessfullComponent /></ErrorBoundary>);
        expect(getByText('Hello')).toBeInTheDocument();
    });
});
