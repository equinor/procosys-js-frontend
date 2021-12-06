import ProCoSysSettings, { AsyncState } from '@procosys/core/ProCoSysSettings';

import AuthService from './auth/AuthService';
import Error from './components/Error';
import Helmet from 'react-helmet';
import { Loading } from './components';
import Login from './modules/Login';
import React from 'react';
import Root from './app/Root';
import favicon from './assets/icons/ProCoSys_favicon16x16.png';
import { render } from 'react-dom';

const element = document.createElement('div');
element.setAttribute('id', 'app-container');
document.body.appendChild(element);

const getHelmetBaseConfig = (): JSX.Element => {
    return (
        <Helmet titleTemplate="ProCoSys %s">
            <title>- Authenticating</title>
            <link rel="icon" type="image/png" href={favicon} sizes="16x16" />
        </Helmet>
    );
};

render(
    <>
        {getHelmetBaseConfig()}
        <Loading title="Loading configuration" />
    </>,
    element
);

const validateConfigurationState = async (): Promise<void> => {
    await ProCoSysSettings.loadAuthConfiguration();

    if (ProCoSysSettings.authConfigState == AsyncState.ERROR) {
        render(
            <>
                {getHelmetBaseConfig()}
                <Error title="Failed to initialize auth config" large />
            </>,
            element
        );
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
                    <>
                        {getHelmetBaseConfig()}
                        <Login />
                    </>,
                    element
                );
            } else {
                render(
                    <>
                        {getHelmetBaseConfig()}
                        <Root authService={authService} />
                    </>,
                    element
                );
            }
        }
    }
};

validateConfigurationState();
