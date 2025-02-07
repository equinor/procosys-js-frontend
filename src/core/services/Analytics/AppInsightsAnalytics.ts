import * as H from 'history';

import { ICustomProperties, IExceptionTelemetry } from './types';

import {
    ApplicationInsights,
    ITelemetryPlugin,
} from '@microsoft/applicationinsights-web';
import IAnalytics from './IAnalytics';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';

class AppInsightsAnalytics implements IAnalytics {
    _service: ApplicationInsights;
    _plant: string;

    constructor(history: H.History) {
        const reactPlugin = new ReactPlugin() as unknown as ITelemetryPlugin;
        this._service = new ApplicationInsights({
            config: {
                instrumentationKey: window.INSTRUMENTATION_KEY,
                extensions: [reactPlugin],
                extensionConfig: {
                    [reactPlugin.identifier]: { history: history },
                },
            },
        });
        this._service.loadAppInsights();
        this._plant = '';
    }

    setCurrentPlant(plant: string): void {
        this._plant = plant;
    }

    trackUserAction(name: string, data?: ICustomProperties): void {
        this._service.trackEvent(
            { name: name },
            { plant: this._plant, ...data }
        );
    }

    trackException(exception: Error, id?: string): void {
        const data: IExceptionTelemetry = {
            exception: exception,
        };
        if (id) {
            data.id = id;
        }
        this._service.trackException(data);
    }
}

export default AppInsightsAnalytics;
