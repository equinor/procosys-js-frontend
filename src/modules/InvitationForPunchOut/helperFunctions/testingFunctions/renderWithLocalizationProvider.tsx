import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { render } from '@testing-library/react';

export const renderWithLocalizationProvider = (
    componentToRender: JSX.Element
): void => {
    render(
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            {componentToRender}
        </LocalizationProvider>
    );
};
