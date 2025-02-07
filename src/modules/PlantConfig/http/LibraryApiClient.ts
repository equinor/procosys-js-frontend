import {
    ErrorResponse,
    RegisterResponse,
    TagFunctionResponse,
} from './LibraryApiClient.types';

import ApiClient from '../../../http/ApiClient';
import { AxiosRequestConfig } from 'axios';
import { IAuthService } from '../../../auth/AuthService';
import Qs from 'qs';
import { RequestCanceler } from '../../../http/HttpClient';

export interface AreaResponse {
    code: string;
    description: string;
}

export interface DisciplineResponse {
    code: string;
    description: string;
}

export interface ResponsibleResponse {
    code: string;
    description: string;
}

class LibraryApiError extends Error {
    data: ErrorResponse | null;

    constructor(message: string, apiResponse?: ErrorResponse) {
        super(message);
        this.data = apiResponse || null;
        this.name = 'LibraryApiError';
    }
}

function getLibraryApiError(error: any): LibraryApiError {
    if (error.response.status == 500) {
        return new LibraryApiError(error.response.data);
    }

    const response = error.response.data as ErrorResponse;
    let errorMessage = `${error.response.status} (${error.response.statusText})`;

    if (error.response.data) {
        errorMessage = response.Errors.map((err) => err.ErrorMessage).join(
            ', '
        );
    }

    return new LibraryApiError(errorMessage, response);
}

/**
 * API for interacting with data in ProCoSys.
 */
class LibraryApiClient extends ApiClient {
    constructor(authService: IAuthService) {
        super(authService, window.LIBRARY_API_SCOPE, window.LIBRARY_API_URL);
        this.client.interceptors.request.use(
            (config) => {
                config.params = {
                    ...config.params,
                };
                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    /**
     * Holds a reference to an internal callbackID used to set the plantId on requests.
     */
    private plantIdInterceptorId: number | null = null;

    /**
     * Sets the current context for relevant api requests
     *
     * @param plantId Plant ID
     */
    setCurrentPlant(plantId: string): void {
        if (this.plantIdInterceptorId) {
            this.client.interceptors.request.eject(this.plantIdInterceptorId);
            this.plantIdInterceptorId = null;
        }
        this.plantIdInterceptorId = this.client.interceptors.request.use(
            (config) => {
                config.headers = {
                    ...config.headers,
                    'x-plant': plantId,
                } as any; // https://github.com/axios/axios/issues/5494
                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    /**
     * Get all registers from Library
     *
     * @param setRequestCanceller Request Canceler
     */
    async getRegisters(
        setRequestCanceller?: RequestCanceler
    ): Promise<RegisterResponse[]> {
        const endpoint = '/Registers';

        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<RegisterResponse[]>(
                endpoint,
                settings
            );
            return result.data;
        } catch (error) {
            throw getLibraryApiError(error);
        }
    }

    /**
     * Get all tag functions from Library based on register code
     *
     * @param registerCode  Register to filter by
     * @param setRequestCanceller Request Canceler
     */
    async getTagFunctions(
        registerCode: string,
        setRequestCanceller?: RequestCanceler
    ): Promise<TagFunctionResponse[]> {
        const endpoint = '/TagFunctions';

        const settings: AxiosRequestConfig = {
            params: {
                registerCode: registerCode,
            },
        };
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<TagFunctionResponse[]>(
                endpoint,
                settings
            );
            return result.data;
        } catch (error) {
            throw getLibraryApiError(error);
        }
    }

    /**
     * Get areas
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getAreas(
        setRequestCanceller?: RequestCanceler
    ): Promise<AreaResponse[]> {
        const endpoint = '/Areas';
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<AreaResponse[]>(
                endpoint,
                settings
            );
            return result.data;
        } catch (error) {
            throw getLibraryApiError(error);
        }
    }

    /**
     * Get disciplines
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getDisciplines(
        classifications: string[],
        setRequestCanceller?: RequestCanceler
    ): Promise<DisciplineResponse[]> {
        const endpoint = '/Disciplines';
        const settings: AxiosRequestConfig = {
            params: {
                classifications: classifications,
            },
            paramsSerializer: function (params) {
                return Qs.stringify(params, { arrayFormat: 'repeat' });
            },
        };
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<DisciplineResponse[]>(
                endpoint,
                settings
            );
            return result.data;
        } catch (error) {
            throw getLibraryApiError(error);
        }
    }

    /**
     * Get responsibles
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getResponsibles(
        setRequestCanceller?: RequestCanceler
    ): Promise<ResponsibleResponse[]> {
        const endpoint = '/Responsibles';

        const settings: AxiosRequestConfig = {
            params: {},
        };
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<ResponsibleResponse[]>(
                endpoint,
                settings
            );
            return result.data;
        } catch (error) {
            throw getLibraryApiError(error);
        }
    }
}

export default LibraryApiClient;
