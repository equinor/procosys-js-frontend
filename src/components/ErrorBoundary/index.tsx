import React, { ErrorInfo } from 'react';

import { AnalyticsContext } from '@procosys/core/services/Analytics/AnalyticsContext';
import { ErrorBoundaryContainer } from './ErrorBoundary.style';
import { Typography } from '@equinor/eds-core-react';

export type ErrorProps = {
    message?: string;
    children: React.ReactChild;
}

type ErrorState = {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorProps, ErrorState> {
    constructor(props: ErrorProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): ErrorState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('CRITICAL ERROR OCCURED');
        console.error('Error: ', error);
        console.error('ErrorInfo: ', errorInfo);
        this.context.trackException(error);
    }

    render(): React.ReactChild {
        if (this.state.hasError) {
            return (
                <ErrorBoundaryContainer>
                    <Typography variant="h1">{!this.props.message ? 'An unexpected error occured' : this.props.message}</Typography>
                    {!this.props.message && (
                        <>
                            <Typography variant="h4">Please try to <a href="#" onClick={(): void => window.location.reload()}>refresh</a> the page, and see if the error persists.</Typography>
                            <Typography variant="h6">The incident has been logged, contact support if the error is not resolved.</Typography>
                        </>
                    )}
                </ErrorBoundaryContainer>);
        }

        return this.props.children;
    }
}

ErrorBoundary.contextType = AnalyticsContext;

export default ErrorBoundary;
