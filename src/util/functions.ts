/**
 * Retrieves a user-friendly error message based on the provided error object.
 *
 * @param error - The error object which may contain a `data` property with `status`and code`.
 * @returns A string representing the user-friendly error message.
 */

export const getErrorMessage = (error: any): string => {
    if (error.data) {
        switch (error.data.status) {
            case 401:
                return 'You are not authorized';
            case 403:
                return 'You do not have permission to access this resource.';
            case 404:
                return 'The requested resource was not found.';
            case 500:
                return 'An unexpected error occurred. Please try again later.';
        }
    }
    return 'An unexpected error occurred.';
};
