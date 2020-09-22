import Axios, { AxiosError, AxiosResponse } from 'axios';

interface ErrorResponse {
    ErrorCount: number;
    Errors: {
        PropertyName: string;
        ErrorMessage: string;
    }[];
}

export enum ErrorType {
    Preservation = 'PerservationApiError',
    Ipo = 'IpoApiError',
    Unknown = ' Unknown'
};

export class ProCoSysApiError extends Error {
    data: AxiosResponse | null;
    isCancel: boolean;

    constructor(errorType: ErrorType, message: string, apiResponse?: AxiosResponse) {
        super(message);
        this.data = apiResponse || null;
        this.name = errorType;
        this.isCancel = false;
    }
}

export function createProCoSysApiError(errorType: ErrorType, error: AxiosError): ProCoSysApiError {
    if (Axios.isCancel(error)) {
        const cancelledError = new ProCoSysApiError(ErrorType.Unknown, 'The request was cancelled');
        cancelledError.isCancel = true;
        return cancelledError;
    }

    if (!error || !error.response) {
        console.error('An unknown API error occured, error: ', error);
        return new ProCoSysApiError(ErrorType.Unknown, 'Unknown error');
    }
    if (error.response.status == 500) {
        return new ProCoSysApiError(errorType, error.response.data, error.response);
    }
    if (error.response.status == 409) {
        return new ProCoSysApiError(errorType, 'Data has been updated by another user. Please reload and start over!', error.response);
    }
    if (error.response.status == 404) {
        return new ProCoSysApiError(errorType, error.response.data, error.response);
    }
    if (error.response.status == 403) {
        return new ProCoSysApiError(errorType, 'You are not authorized to perform this operation.', error.response);
    }
    if (error.response.status == 400) {
        try {
            // input and business validation errors
            let validationErrorMessage = error.response.data.title;
            const validationErrors = error.response.data.errors;

            for (const validatedField in validationErrors) {
                const fieldErrors = validationErrors[validatedField].join(' | ');
                validationErrorMessage += ` ${fieldErrors} `;
            }

            return new ProCoSysApiError(errorType, validationErrorMessage, error.response);
        } catch (exception) {
            return new ProCoSysApiError(errorType, 'Failed to parse validation errors', error.response);
        }
    }
    try {
        const apiErrorResponse = error.response.data as ErrorResponse;
        let errorMessage = `${error.response.status} (${error.response.statusText})`;

        if (error.response.data) {
            errorMessage = apiErrorResponse.Errors.map(err => err.ErrorMessage).join(', ');
        }
        return new ProCoSysApiError(errorType, errorMessage, error.response);
    } catch (err) {
        return new ProCoSysApiError(errorType, 'Failed to parse errors', error.response);
    }
}