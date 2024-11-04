import Axios, { AxiosError, AxiosResponse } from 'axios';
import { isOfType } from './services/TypeGuard';

interface ErrorResponse {
    ErrorCount: number;
    Errors: {
        PropertyName: string;
        ErrorMessage: string;
    }[];
}

interface PreservationErrorResponse {
    errors: {
        [key: string]: Array<string>;
    };
    status: number;
    title: string;
}

export type Errors = {
    IpoException: string[];
    status: number;
    title: string;
};

export type dataError = {
    errors: Errors;
};

export class ProCoSysApiError extends Error {
    data: AxiosResponse | null;
    isCancel: boolean;

    constructor(error: AxiosError) {
        let cancel = false;
        const _error = JSON.parse(JSON.stringify(error)) as AxiosError;
        if (Axios.isCancel(error)) {
            super('The request was cancelled');
            cancel = true;
        } else if (!_error || !_error.response) {
            console.error('An unknown API error occured, error: ', error);
            super((error as Error).message || 'Unknown error');
        } else if (_error.response.status == 500) {
            super(_error.response.data ? `${_error.response.data}` : undefined);
        } else if (_error.response.status == 409) {
            super(
                'Data has been updated by another user. Please reload and start over!'
            );
        } else if (_error.response.status == 404) {
            super(_error.response.data ? `${_error.response.data}` : undefined);
        } else if (_error.response.status == 403) {
            super('You are not authorized to perform this operation.');
        } else if (_error.response.status == 400) {
            if (
                isOfType<PreservationErrorResponse>(
                    _error.response.data,
                    'errors'
                )
            ) {
                super(
                    _error.response.data
                        ? `${_error.response.data.errors[''][0]}`
                        : undefined
                );
            } else if (isOfType<dataError>(_error.response.data, 'errors')) {
                super(
                    _error.response.data
                        ? `${_error.response.data.errors.IpoException}`
                        : undefined
                );
            } else {
                super(
                    _error.response.data ? `${_error.response.data}` : undefined
                );
            }
        } else {
            try {
                const apiErrorResponse = _error.response.data as ErrorResponse;
                let errorMessage = `${_error.response.status} (${_error.response.statusText})`;

                if (_error.response.data) {
                    errorMessage = apiErrorResponse.Errors.map(
                        (err) => err.ErrorMessage
                    ).join(', ');
                }
                super(errorMessage);
            } catch (err) {
                super('Failed to parse errors');
            }
        }

        this.isCancel = cancel;
        this.data = error.response || null;
    }
}
