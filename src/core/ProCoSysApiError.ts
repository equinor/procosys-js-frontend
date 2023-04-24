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
        if (Axios.isCancel(error)) {
            super('The request was cancelled');
            cancel = true;
        } else if (!error || !error.response) {
            console.error('An unknown API error occured, error: ', error);
            super('Unknown error');
        } else if (error.response.status == 500) {
            super(error.response.data ? `${error.response.data}` : undefined);
        } else if (error.response.status == 409) {
            super(
                'Data has been updated by another user. Please reload and start over!'
            );
        } else if (error.response.status == 404) {
            super(error.response.data ? `${error.response.data}` : undefined);
        } else if (error.response.status == 403) {
            super('You are not authorized to perform this operation.');
        } else if (error.response.status == 400) {
            if (
                isOfType<PreservationErrorResponse>(
                    error.response.data,
                    'errors'
                )
            ) {
                super(
                    error.response.data
                        ? `${error.response.data.errors[''][0]}`
                        : undefined
                );
            } else if (isOfType<dataError>(error.response.data, 'errors')) {
                super(
                    error.response.data
                        ? `${error.response.data.errors.IpoException}`
                        : undefined
                );
            } else {
                super(
                    error.response.data ? `${error.response.data}` : undefined
                );
            }
        } else {
            try {
                const apiErrorResponse = error.response.data as ErrorResponse;
                let errorMessage = `${error.response.status} (${error.response.statusText})`;

                if (error.response.data) {
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
