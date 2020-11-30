import '../assets/sass/procosys-styles.scss';

import ProCoSysSettings, { ConfigurationLoaderAsyncState } from '@procosys/core/ProCoSysSettings';
import ProcosysContext, { createProcosysContext } from '../core/ProcosysContext';
import React, { useEffect, useRef, useState } from 'react';

import App from './index';
import Error from '@procosys/components/Error';
import { IAuthService } from 'src/auth/AuthService';
import Loading from '@procosys/components/Loading';
import { hot } from 'react-hot-loader';

type AppProps = {
    authService: IAuthService;
}


const Root = (props: AppProps): JSX.Element => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const overlayRef = useRef<HTMLDivElement | null>(null);
    
    const [configurationState, setConfigurationState] = useState<ConfigurationLoaderAsyncState>(ProCoSysSettings.state);

    const updateConfigurationState = (): void => {
        setConfigurationState(ProCoSysSettings.state);
        if (ProCoSysSettings.state == ConfigurationLoaderAsyncState.INITIALIZING) {
            setTimeout(updateConfigurationState, 10);
        }
    };

    useEffect(() => {
        updateConfigurationState();
    },[]);

    const loadingConfiguration = (): JSX.Element => {
        console.log('Loading settings');
        return (<Loading title="Loading configuration" />);
    };

    const failedToLoadConfig = (): JSX.Element => {
        console.log('Failed to load settings');

        return (<Error title="Failed to load remote configuration" large />);
    };

    switch(configurationState) {
        case ConfigurationLoaderAsyncState.INITIALIZING: 
            return loadingConfiguration();
        case ConfigurationLoaderAsyncState.ERROR: 
            return failedToLoadConfig();
    }
    console.log('Settings: ', ProCoSysSettings);
    
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
