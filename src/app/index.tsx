
import React, { Suspense, useEffect } from 'react'

import Header from '../modules/Header';
import Spinner from '../components/Spinner';
import { ThemeProvider } from 'styled-components';
import { hot } from 'react-hot-loader';
import theme from './../assets/theme';
import { useAuth } from '../contexts/AuthContext';
import GeneralRouter from './GeneralRouter';

const Login = React.lazy(() => import('../modules/Login'));

const App = () => {
    const auth = useAuth();
    auth.handleRedirectCallback((err) => console.log("Redirect Err", err));

    useEffect(() => {
        console.log("AuthContext: ", auth);
    }, [auth])

    return (
        <ThemeProvider theme={theme}>
            <Suspense fallback={<Spinner />}>
                {auth.account ? <GeneralRouter /> : <Login />}
            </Suspense>
        </ThemeProvider>
    )
}

export default hot(module)(App)
