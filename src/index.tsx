import './assets/sass/procosys-styles.scss';
import 'react-hot-loader';
import { hot } from 'react-hot-loader/root';

import ProcosysContext, { createProcosysContext } from './core/ProcosysContext';
import React, { useRef } from 'react';

import App from './app/index';
import AuthService from './auth/AuthService';
import ReactDOM from 'react-dom';

const start = async (): Promise<void> => {
    const authService = new AuthService();
    authService.handleRedirectCallback();

    /**
     * Prevent the application from loading itself when triggered from an iFrame
     * This is done by the MSAL library, when trying to do a silent refresh
     *  */
    if (window.parent != window) {
        console.info('Aborted further app loading iFrame');
        return;
    }

    const Root = (): JSX.Element => {
        const rootRef = useRef<HTMLDivElement | null>(null);
        const overlayRef = useRef<HTMLDivElement | null>(null);
        const context = createProcosysContext({
            auth: authService,
        });

        return (
            <ProcosysContext.Provider value={context}>
                <div id="procosys-root" ref={rootRef}>
                    <App />
                </div>
                <div id="procosys-overlay" ref={overlayRef}>
                    {/* Empty on purpose */}
                </div>
            </ProcosysContext.Provider>
        );
    };

    const element = document.getElementById('app-container') || document.createElement('div');
    element.setAttribute('id', 'app-container');
    document.body.appendChild(element);
    const HotRoot = hot(Root);

    ReactDOM.render(
        <HotRoot />,
        document.getElementById('app-container'));

};

start();
