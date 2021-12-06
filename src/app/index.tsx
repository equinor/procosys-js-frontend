import React, { Suspense } from 'react';
import theme, { materialUIThemeOverrides } from './../assets/theme';

import Loading from '../components/Loading';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from 'styled-components';
import { UserContextProvider } from '@procosys/core/UserContext';
import withAccessControl from '@procosys/core/security/withAccessControl';
import { useHotkeys } from 'react-hotkeys-hook';

const GeneralRouter = React.lazy(() => import('./GeneralRouter'));

const App = (): JSX.Element => {
    useHotkeys(
        'ctrl+q',
        () => {
            const input = document.getElementById(
                'procosys-qs'
            ) as HTMLInputElement;
            input.focus();
            const val = input.value ?? '';
            input.value = '';
            input.value = val;
        },
        { enableOnTags: ['INPUT'] }
    );

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

export default withAccessControl(App, [], ['main']);
