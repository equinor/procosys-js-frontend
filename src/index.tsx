
import React from 'react';

import Root from './app/Root';
import AuthService from './auth/AuthService';
import { render } from 'react-dom';

const authService = new AuthService();
authService.handleRedirectCallback();

/**
 * Prevent the application from loading itself when triggered from an iFrame
 * This is done by the MSAL library, when trying to do a silent refresh
 *  */
if (window.parent != window) {
    console.info('Aborted further app loading iFrame');
} else {
    const element = document.createElement('div');
    element.setAttribute('id', 'app-container');
    document.body.appendChild(element);

    render(
        <Root authService={authService} />,
        document.getElementById('app-container'));
}
