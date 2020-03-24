import ApiClient from '../../../http/ApiClient';
import { AxiosRequestConfig } from 'axios';
import { IAuthService } from '../../../auth/AuthService';
import { RequestCanceler } from '../../../http/HttpClient';

const Settings = require('../../../../settings.json');


interface ModeResponse {
    id: number;
    title: string;
}


interface ErrorResponse {
    ErrorCount: number;
    Errors: {
        PropertyName: string;
        ErrorMessage: string;
    }[];
}


class PreservationApiError extends Error {

    data: ErrorResponse | null;

    constructor(message: string, apiResponse?: ErrorResponse) {
        super(message);
        this.data = apiResponse || null;
        this.name = 'PreservationApiError';
    }
}

function getPlantConfigApiError(error: any): PreservationApiError {
    if (error.response.status == 500) {
        return new PreservationApiError(error.response.data);
    }

    const response = error.response.data as ErrorResponse;
    let errorMessage = `${error.response.status} (${error.response.statusText})`;

    if (error.response.data) {
        errorMessage = response.Errors.map(err => err.ErrorMessage).join(', ');
    }

    return new PreservationApiError(errorMessage, response);
}


/**
 * API for interacting with data in ProCoSys.
 */
class PlantConfigApiClient extends ApiClient {
    constructor(authService: IAuthService) {
        super(
            authService,
            Settings.externalResources.preservationApi.scope.join(' '),
            Settings.externalResources.preservationApi.url
        );
        this.client.interceptors.request.use(
            config => {
                config.params = {
                    ...config.params,
                };
                return config;
            },
            error => Promise.reject(error)
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
        console.log('Setting current plant for preservation: ', plantId);
        if (this.plantIdInterceptorId) {
            this.client.interceptors.request.eject(this.plantIdInterceptorId);
            this.plantIdInterceptorId = null;
        }
        // const plant = plantId.replace('PCS$', '');
        this.plantIdInterceptorId = this.client.interceptors.request.use(
            config => {
                config.headers = {
                    ...config.headers,
                    'x-plant': plantId,
                };
                return config;
            },
            error => Promise.reject(error)
        );
    }


    /**
 * Get modes
 *
 * @param setRequestCanceller Returns a function that can be called to cancel the request
 */
    async getModes(setRequestCanceller?: RequestCanceler
    ): Promise<ModeResponse[]> {
        const endpoint = '/Tags';

        const settings: AxiosRequestConfig = {
            params: {
            },
        };
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<ModeResponse[]>(
                endpoint,
                settings
            );
            return result.data;
        }
        catch (error) {
            throw getPlantConfigApiError(error);
        }
    }
}

export default PlantConfigApiClient;
