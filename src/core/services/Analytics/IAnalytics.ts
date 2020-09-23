import { ICustomProperties, IExceptionTelemetry } from './types';

interface IAnalytics {
    trackUserAction: (name: string, data?: ICustomProperties) => void;
    trackException: (exception: Error, id?: string) => void;
}

export default IAnalytics;
