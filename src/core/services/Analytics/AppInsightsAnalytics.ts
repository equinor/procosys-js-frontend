import * as H from 'history';

import { ICustomProperties, IExceptionTelemetry } from './types';

import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';

const instrumentationKey = require('../../../../settings.json').instrumentationKey;

class AppInsightsAnalytics {

    _service: ApplicationInsights;

    constructor(history: H.History) {
        const reactPlugin = new ReactPlugin();
        this._service = new ApplicationInsights({
            config: {
                instrumentationKey: instrumentationKey,
                extensions: [reactPlugin],
                extensionConfig: {
                    [reactPlugin.identifier]: { history: history }
                }
            }
        });
        this._service.loadAppInsights();
    };

    trackUserAction(name: string, data?: ICustomProperties): void {
        this._service.trackEvent({ name: name }, data);
    }

    trackException(data: IExceptionTelemetry): void {
        this._service.trackException(data);
    }
}

export default AppInsightsAnalytics;
