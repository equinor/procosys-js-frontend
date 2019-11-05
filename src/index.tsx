import './assets/sass/global.scss';

import App from './app/index';
import { AuthProvider } from './contexts/AuthContext';
import React from 'react';
import ReactDOM from 'react-dom';
import { UserAgentApplication } from 'msal';

const settings = require('./../settings.json');



const auth = {
    clientId: settings.auth.clientId,
    redirectUri: window.location.origin,
    authority: settings.auth.authority,
};

/**
 * Prevent the application from loading itself when triggered from an iFrame
 * This is done by the MSAL library, which
 *  */
if (window.parent === window) {
    var element = document.createElement('div');
    element.setAttribute('id', 'root');
    element.setAttribute('class', 'container');
    document.body.appendChild(element);

    ReactDOM.render(
        <AuthProvider>
            <App />
        </AuthProvider>,
        document.getElementById('root'));
} else {
    let context = new UserAgentApplication({ auth });

    context.handleRedirectCallback((error: any) => {
        console.error(`MSAL Frame error: ${error}`);
    });
}

