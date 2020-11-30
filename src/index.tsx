import ProCoSysSettings, {ConfigurationLoaderAsyncState} from '@procosys/core/ProCoSysSettings';

import AuthService from './auth/AuthService';
import Error from './components/Error';
import { Loading } from './components';
import React from 'react';
import Root from './app/Root';
import { render } from 'react-dom';

const element = document.createElement('div');
element.setAttribute('id', 'app-container');
document.body.appendChild(element);

render(
    <Loading title="Loading configuration" />,
    element);

const validateConfigurationState = (): void => {
    if (ProCoSysSettings.state == ConfigurationLoaderAsyncState.INITIALIZING) {
        console.log('This needs re-validation');
        setTimeout(validateConfigurationState, 10);
    } else if (ProCoSysSettings.state == ConfigurationLoaderAsyncState.ERROR) {
        render(
            <Error title="Failed to initialize system config" large />,
            element);
    } else {
        console.log('Rendering');
        
        const authService = new AuthService();
        authService.handleRedirectCallback();
        /**
         * Prevent the application from loading itself when triggered from an iFrame
         * This is done by the MSAL library, when trying to do a silent refresh
         *  */
        if (window.parent != window) {
            console.info('Aborted further app loading iFrame');
        } else {
            render(
                <Root authService={authService} />,
                element);
        }
    }
};

validateConfigurationState();

