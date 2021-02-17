import '../assets/sass/procosys-styles.scss';

import ProCoSysSettings, { AsyncState } from '@procosys/core/ProCoSysSettings';
import ProcosysContext, { createProcosysContext } from '../core/ProcosysContext';
import React, { useEffect, useRef, useState } from 'react';

import App from './index';
import Error from '@procosys/components/Error';
import { IAuthService } from 'src/auth/AuthService';
import Loading from '@procosys/components/Loading';
import { hot } from 'react-hot-loader';
import { Helmet } from 'react-helmet';

type AppProps = {
    authService: IAuthService;
}

/**
 * Loads initial application configuration before 
 * rendering the main application
 * @param props 
 */
const Root = (props: AppProps): JSX.Element => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const overlayRef = useRef<HTMLDivElement | null>(null);
    
    const [configurationState, setConfigurationState] = useState<AsyncState>(ProCoSysSettings.configState);

    const updateConfigurationState = async (): Promise<void> => {
        await ProCoSysSettings.loadConfiguration(props.authService);
        setConfigurationState(ProCoSysSettings.configState);
    };

    useEffect(() => {
        updateConfigurationState();
    },[]);

    const loadingConfiguration = (): JSX.Element => {
        return (<Loading title="Loading configuration" />);
    };

    const failedToLoadConfig = (): JSX.Element => {
        return (<Error title="Failed to load remote configuration" large />);
    };

    switch(configurationState) {
        case AsyncState.INITIALIZING: 
            return loadingConfiguration();
        case AsyncState.ERROR: 
            return failedToLoadConfig();
    }

    const context = createProcosysContext({
        auth: props.authService,
    });


    return (
        <ProcosysContext.Provider value={context}>
            <Helmet>
                <title>&nbsp;</title>
            </Helmet>
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
