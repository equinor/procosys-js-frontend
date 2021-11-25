export interface ErrorResponse {
    ErrorCount: number;
    Errors: {
        PropertyName: string;
        ErrorMessage: string;
    }[];
}

export interface RegisterResponse {
    code: string;
    description: string;
}

export interface TagFunctionResponse {
    code: string;
    description: string;
}
