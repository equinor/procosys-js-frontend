import ProCoSysSettings, {AsyncState} from '@procosys/core/ProCoSysSettings';

import AuthService from './auth/AuthService';
import Error from './components/Error';
import { Loading } from './components';
import Login from './modules/Login';
import React from 'react';
import Root from './app/Root';
import { render } from 'react-dom';

const element = document.createElement('div');
element.setAttribute('id', 'app-container');
document.body.appendChild(element);

render(
    <Loading title="Loading configuration" />,
    element);

const validateConfigurationState = async (): Promise<void> => {

    await ProCoSysSettings.loadAuthConfiguration();

    if (ProCoSysSettings.authConfigState == AsyncState.ERROR) {
        render(
            <Error title="Failed to initialize auth config" large />,
            element);
    } else {
        const authService = new AuthService();
        authService.handleRedirectCallback();
        /**
         * Prevent the application from loading itself when triggered from an iFrame
         * This is done by the MSAL library, when trying to do a silent refresh
         *  */
        if (window.parent != window) {
            console.info('Aborted further app loading iFrame');
        } else {
            if (authService.getCurrentUser() === null) {
                authService.login();
                render(
                    <Login />,
                    element);
            } else {
                render(
                    <Root authService={authService} />,
                    element);
            }
        }
    }
};

validateConfigurationState();

