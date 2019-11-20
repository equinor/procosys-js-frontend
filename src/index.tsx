import './assets/sass/global.scss';

import { AuthProvider, authInstance } from './contexts/AuthContext';
import React, {useRef} from 'react';

import App from './app/index';
import ReactDOM from 'react-dom';

const start = async (): Promise<void> => {
    authInstance.handleRedirectCallback((err) => console.error('Auth Redirect Err', err));


    /**
     * Prevent the application from loading itself when triggered from an iFrame
     * This is done by the MSAL library, when trying to do a silent refresh
     *  */
    if (window.parent != window) {
        return;
    }



    const Root = (): JSX.Element => {
        const rootRef = useRef<HTMLDivElement | null>(null);
        const overlayRef = useRef<HTMLDivElement | null>(null);
        const ProcosysContext = React.createContext({});

        return (
            <ProcosysContext.Provider value={{}}>
                <div id="procosys-root" ref={rootRef}>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </div>
                <div id="procosys-overlay" ref={overlayRef}>
                    {/* Empty on purpose */}
                </div>
            </ProcosysContext.Provider>
        );
    };

    const element = document.createElement('div');
    element.setAttribute('id', 'app-container');
    document.body.appendChild(element);

    ReactDOM.render(
        <Root />,
        document.getElementById('app-container'));

};

start();
