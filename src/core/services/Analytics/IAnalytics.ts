import { ICustomProperties, IExceptionTelemetry } from './types';

interface IAnalytics {
    setCurrentPlant: (plant: string) => void;
    trackUserAction: (name: string, data?: ICustomProperties) => void;
    trackException: (exception: Error, id?: string) => void;
}

export default IAnalytics;
