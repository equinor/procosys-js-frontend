import React, { Suspense } from 'react';

import Loading from '../components/Loading';
import { ThemeProvider } from 'styled-components';
import theme, {materialUIThemeOverrides} from './../assets/theme';
import { useProcosysContext } from '../core/ProcosysContext';
import {ThemeProvider as MuiThemeProvider} from '@material-ui/core/styles';

const Login = React.lazy(() => import('../modules/Login'));
const GeneralRouter = React.lazy(() => import('./GeneralRouter'));

const App = (): JSX.Element => {
    const {auth} = useProcosysContext();

    const userIsLoggedIn = auth.getCurrentUser() != null;

    if (!userIsLoggedIn) {
        auth.login();
    }

    return (
        <MuiThemeProvider theme={materialUIThemeOverrides}>
            <ThemeProvider theme={theme}>
                <Suspense fallback={<Loading />}>
                    {userIsLoggedIn ? <GeneralRouter /> : <Login />}
                </Suspense>
            </ThemeProvider>
        </MuiThemeProvider>
    );
};

export default App;
