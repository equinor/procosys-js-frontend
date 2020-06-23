import axios, { Canceler as AxiosCanceler, AxiosInstance, AxiosRequestConfig } from 'axios';

const axiosSettings: AxiosRequestConfig = {
};

/**
 * Callback for setting up request canceler
 */
export type RequestCanceler = ((callback: Canceler) => void);

export type Canceler = AxiosCanceler;


/**
 * Generic HTTP Client with common configuration
 */
export default class HttpClient {

    protected client: AxiosInstance;

    /**
     * @param baseUrl Base URL for resource to interact with
     * @param customSettings Any custom <AxiosRequestConfig> for the client
     */
    constructor(baseUrl = '', customSettings: AxiosRequestConfig = {}) {
        const instance = axios.create({
            ...axiosSettings,
            baseURL: baseUrl,
            ...customSettings
        });

        this.client = instance;
    }

    /**
     * Generic setup for canceling requests
     * @param settings Settings object to manipulate
     * @param cancelorCallback Callback function which received the cancel token
     */
    protected setupRequestCanceler(settings: AxiosRequestConfig, cancelorCallback?: RequestCanceler): void {
        if (cancelorCallback) {
            const cancelToken = new axios.CancelToken((c) => {
                cancelorCallback(c);
                return c;
            });
            settings.cancelToken = cancelToken;
        }
    }

}
