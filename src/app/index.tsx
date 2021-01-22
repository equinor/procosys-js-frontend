import React, { Suspense } from 'react';
import theme, {materialUIThemeOverrides} from './../assets/theme';

import Loading from '../components/Loading';
import {ThemeProvider as MuiThemeProvider} from '@material-ui/core/styles';
import { ThemeProvider } from 'styled-components';
import { UserContextProvider } from '@procosys/core/UserContext';

const GeneralRouter = React.lazy(() => import('./GeneralRouter'));

const App = (): JSX.Element => {

    return (
        <UserContextProvider>
            <MuiThemeProvider theme={materialUIThemeOverrides}>
                <ThemeProvider theme={theme}>
                    <Suspense fallback={<Loading />}>
                        <GeneralRouter />
                    </Suspense>
                </ThemeProvider>
            </MuiThemeProvider>
        </UserContextProvider>
    );
};

export default App;
