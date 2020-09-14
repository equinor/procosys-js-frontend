import React, { ErrorInfo } from 'react';

import { ErrorBoundaryContainer } from './ErrorBoundary.style';
import { Typography } from '@equinor/eds-core-react';

type ErrorProps = {
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
    }

    render(): React.ReactChild {
        if (this.state.hasError) {
            return (
                <ErrorBoundaryContainer>
                    <Typography variant="h1">{!this.props.message ? 'Sorry, an unexpected error occured' : this.props.message}</Typography>
                </ErrorBoundaryContainer>);
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
