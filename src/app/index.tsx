import React, { Suspense, useEffect } from 'react';

import GeneralRouter from './GeneralRouter';
import Spinner from '../components/Spinner';
import { ThemeProvider } from 'styled-components';
import { hot } from 'react-hot-loader';
import theme from './../assets/theme';
import { useAuth } from '../contexts/AuthContext';

const Login = React.lazy(() => import('../modules/Login'));

const App = (): JSX.Element => {
    const auth = useAuth();

    useEffect(() => {
        console.log('AuthContext: ', auth);
    }, [auth]);

    return (
        <ThemeProvider theme={theme}>
            <Suspense fallback={<Spinner />}>
                {auth.account ? <GeneralRouter /> : <Login />}
            </Suspense>
        </ThemeProvider>
    );
};

export default hot(module)(App);
