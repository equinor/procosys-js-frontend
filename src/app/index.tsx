import React, { Suspense } from 'react';

import Loading from '../components/Loading';
import { ThemeProvider } from 'styled-components';
import { hot } from 'react-hot-loader';
import theme from './../assets/theme';
import { useProcosysContext } from '../core/ProcosysContext';

const Login = React.lazy(() => import('../modules/Login'));
const GeneralRouter = React.lazy(() => import('./GeneralRouter'));

const App = (): JSX.Element => {
    const {auth} = useProcosysContext();

    const userIsLoggedIn = auth.getCurrentUser() != null;

    if (!userIsLoggedIn) {
        auth.login();
    }

    return (
        <ThemeProvider theme={theme}>
            <Suspense fallback={<Loading />}>
                {userIsLoggedIn ? <GeneralRouter /> : <Login />}
            </Suspense>
        </ThemeProvider>
    );
};

export default hot(module)(App);
