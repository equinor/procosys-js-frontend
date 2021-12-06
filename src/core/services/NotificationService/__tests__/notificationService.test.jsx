import { render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import theme from '../../../../assets/theme';
import { showSnackbarNotification } from '../index';

const renderWithTheme = (Component) => {
    return render(<ThemeProvider theme={theme}>{Component}</ThemeProvider>);
};

describe('NotificationService', () => {
    it('Should display a notification for three seconds.', async () => {
        const { getByText, queryByText } = renderWithTheme(
            <div id="procosys-overlay">
                <input
                    type="button"
                    value="Click on me"
                    onClick={() => {
                        showSnackbarNotification(
                            'This is a notification',
                            3000
                        );
                    }}
                />
            </div>
        );

        getByText('Click on me').click();
        expect(queryByText('This is a notification')).toBeInTheDocument();
        await new Promise((r) => setTimeout(r, 3100));
        expect(queryByText('This is a notification')).not.toBeInTheDocument();
    });
});
