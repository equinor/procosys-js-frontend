import { ProCoSysApiError } from '@procosys/core/ProCoSysApiError';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';

interface ErrorResponse {
    ErrorCount: number;
    Errors: {
        PropertyName: string;
        ErrorMessage: string;
    }[];
}

interface ValidationErrorResponse {
    title: string;
    status: number;
    errors: { [key: string]: string[] };
}

export const handleErrorFromBackend = (
    error: ProCoSysApiError,
    errorMessageConsole: string,
    setValidationErrorMessage: (message: string | null) => void
): void => {
    if (error.data) {
        const statusCode = error.data.status;
        switch (statusCode) {
            case 400: {
                const data = error.data
                    .data as unknown as ValidationErrorResponse;
                const title = data.title || 'Validation error';
                const errors = data.errors || {};

                const errorMessages =
                    Object.values(errors).flat().join(', ') || error.message;
                const validationMessage = `${title}: ${errorMessages}`;

                console.error(
                    errorMessageConsole,
                    validationMessage,
                    error.data
                );
                setValidationErrorMessage(errorMessages);
                throw showSnackbarNotification(validationMessage);
            }
            case 403: {
                console.error(errorMessageConsole, error.message, error.data);
                throw showSnackbarNotification(
                    'You are not authorized to perform this operation.'
                );
            }
            case 404: {
                console.error(errorMessageConsole, error.message, error.data);
                throw showSnackbarNotification(
                    error.message || 'Resource not found.'
                );
            }
            case 409: {
                console.error(errorMessageConsole, error.message, error.data);
                throw showSnackbarNotification(
                    'Data has been updated by another user. Please reload and start over!'
                );
            }
            case 500: {
                console.error(errorMessageConsole, error.message, error.data);
                throw showSnackbarNotification(
                    error.message || 'Server error. Please try again later.'
                );
            }
            default: {
                try {
                    const apiErrorResponse = error.data
                        .data as unknown as ErrorResponse;
                    let errorMessage = `${statusCode} (${error.data.statusText})`;

                    if (apiErrorResponse.Errors) {
                        errorMessage = apiErrorResponse.Errors.map(
                            (err) => err.ErrorMessage
                        ).join(', ');
                    }
                    console.error(
                        errorMessageConsole,
                        errorMessage,
                        error.data
                    );
                    throw showSnackbarNotification(errorMessage);
                } catch (err) {
                    console.error(
                        errorMessageConsole,
                        'Failed to parse errors',
                        error.data
                    );
                    throw showSnackbarNotification('Failed to parse errors');
                }
            }
        }
    } else if (error.isCancel) {
        console.warn('Request was cancelled:', error.message);
    } else {
        console.error(errorMessageConsole, 'An unknown error occurred', error);
        throw showSnackbarNotification('An unknown error occurred');
    }
};
