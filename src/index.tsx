import ProCoSysSettings, { AsyncState } from '@procosys/core/ProCoSysSettings';

import AuthService from './auth/AuthService';
import Error from './components/Error';
import Helmet from 'react-helmet';
import { Loading } from './components';
import Login from './modules/Login';
import Root from './app/Root';
import favicon from './assets/icons/ProCoSys_favicon16x16.png';
import { createRoot } from 'react-dom/client';

const element = document.createElement('div');
element.setAttribute('id', 'app-container');
document.body.appendChild(element);
const root = createRoot(element);

const getHelmetBaseConfig = (): JSX.Element => {
    return (
        <Helmet titleTemplate="ProCoSys %s">
            <title>- Authenticating</title>
            <link rel="icon" type="image/png" href={favicon} sizes="16x16" />
        </Helmet>
    );
};

root.render(
    <>
        {getHelmetBaseConfig()}
        <Loading title="Loading configuration" />
    </>
);

const validateConfigurationState = async (): Promise<void> => {
    await ProCoSysSettings.loadAuthConfiguration();

    if (ProCoSysSettings.authConfigState == AsyncState.ERROR) {
        root.render(
            <>
                {getHelmetBaseConfig()}
                <Error title="Failed to initialize auth config" large />
            </>
        );
    } else {
        const authService = new AuthService();
        await authService.loadAuthModule();
        /**
         * Prevent the application from loading itself when triggered from an iFrame
         * This is done by the MSAL library, when trying to do a silent refresh
         *  */
        if (window.parent != window) {
            console.info('Aborted further app loading iFrame');
        } else {
            if (authService.getCurrentUser() === null) {
                root.render(
                    <>
                        {getHelmetBaseConfig()}
                        <Login />
                    </>
                );
            } else {
                root.render(
                    <>
                        {getHelmetBaseConfig()}
                        <Root authService={authService} />
                    </>
                );
            }
        }
    }
};

validateConfigurationState();
