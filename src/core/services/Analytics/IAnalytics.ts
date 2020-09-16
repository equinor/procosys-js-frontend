import { ICustomProperties, IExceptionTelemetry } from './types';

interface IAnalytics {
    trackUserAction: (name: string, data?: ICustomProperties) => void;
    trackException: (data: IExceptionTelemetry) => void;
}

export default IAnalytics;
