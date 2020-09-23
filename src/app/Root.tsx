import '../assets/sass/procosys-styles.scss';

import ProcosysContext, { createProcosysContext } from '../core/ProcosysContext';
import React, { useRef } from 'react';

import App from './index';
import { IAuthService } from 'src/auth/AuthService';
import { hot } from 'react-hot-loader';

type AppProps = {
    authService: IAuthService;
}

const Root = (props: AppProps): JSX.Element => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const context = createProcosysContext({
        auth: props.authService,
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

export default hot(module)(Root);
