import React, { Suspense } from 'react';

import GeneralRouter from './GeneralRouter';
import Spinner from '../components/Spinner';
import { ThemeProvider } from 'styled-components';
import { hot } from 'react-hot-loader';
import theme from './../assets/theme';
import useCurrentUser from '../hooks/useCurrentUser';

const Login = React.lazy(() => import('../modules/Login'));

const App = (): JSX.Element => {
    const user = useCurrentUser();

    return (
        <ThemeProvider theme={theme}>
            <Suspense fallback={<Spinner />}>
                {user ? <GeneralRouter /> : <Login />}
            </Suspense>
        </ThemeProvider>
    );
};

export default hot(module)(App);
