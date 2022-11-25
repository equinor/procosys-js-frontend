import React, { Suspense } from 'react';
import theme, { materialUIThemeOverrides } from './../assets/theme';

import Loading from '../components/Loading';
import { ThemeProvider as MuiThemeProvider } from '@mui/styles';
import { ThemeProvider } from 'styled-components';
import { UserContextProvider } from '@procosys/core/UserContext';
import withAccessControl from '@procosys/core/security/withAccessControl';
import { useHotkeys } from 'react-hotkeys-hook';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import en from 'date-fns/locale/en-GB';
import us from 'date-fns/locale/en-US';
import nb from 'date-fns/locale/nb';

const langs: Map<string, Locale> = new Map([
    ['en-GB', en],
    ['en-US', us],
    ['no-NB', nb],
]);

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

    const userLanguage: string = window.navigator.language;
    let locale;
    if (langs.has(userLanguage)) {
        locale = langs.get(userLanguage);
    } else {
        locale = langs.get('no-NB');
    }

    return (
        <UserContextProvider>
            <MuiThemeProvider theme={materialUIThemeOverrides}>
                <ThemeProvider theme={theme}>
                    <LocalizationProvider
                        dateAdapter={AdapterDateFns}
                        adapterLocale={locale}
                    >
                        <Suspense fallback={<Loading />}>
                            <GeneralRouter />
                        </Suspense>
                    </LocalizationProvider>
                </ThemeProvider>
            </MuiThemeProvider>
        </UserContextProvider>
    );
};

export default withAccessControl(App, [], ['main']);
