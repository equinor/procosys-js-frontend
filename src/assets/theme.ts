import { tokens } from '@equinor/eds-tokens';
import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-date-pickers/themeAugmentation';

export const materialUIThemeOverrides = createTheme({
    typography: {
        fontFamily: 'Equinor',
    },
    components: {
        MuiDatePicker: {
            styleOverrides: {
                root: {
                    backgroundColor: tokens.colors.ui.background__light.hex,
                    height: '40px',
                    border: 'none',
                    boxShadow:
                        'inset 0 -1px 0 0 var(--eds_text__static_ic, #6f6f6f)',
                },
            },
        },
    },
});

export default {};
