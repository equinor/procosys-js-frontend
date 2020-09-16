import * as H from 'history';

import { ICustomProperties, IExceptionTelemetry } from './types';

import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import IAnalytics from './IAnalytics';
import { ProCoSysSettings } from '@procosys/core/ProCoSysSettings';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';

class AppInsightsAnalytics implements IAnalytics {

    _service: ApplicationInsights;

    constructor(history: H.History) {
        const reactPlugin = new ReactPlugin();
        this._service = new ApplicationInsights({
            config: {
                instrumentationKey: ProCoSysSettings.instrumentationKey,
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
