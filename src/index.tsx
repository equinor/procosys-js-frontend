import AuthService from './auth/AuthService';
import Helmet from 'react-helmet';
import Login from './modules/Login';
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

const authService = new AuthService();
authService
    .loadAuthModule()
    .then(() => {
        /**
         * Prevent the application from loading itself when triggered from an iFrame
         * This is done by the MSAL library, when trying to do a silent refresh
         *  */
        if (window.parent != window) {
            console.info('Aborted further app loading iFrame');
        } else {
            if (authService.getCurrentUser() === null) {
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
    })
    .catch((error) => {
        console.error(error);
        render(<div>Fatal error, page failed to load</div>, element);
    });
