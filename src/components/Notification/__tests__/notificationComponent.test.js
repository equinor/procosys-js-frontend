import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import theme from '../../../assets/theme';
import showSnackbarNotification from '../index';

const renderWithTheme = Component => {
    return render(<ThemeProvider theme={theme}>{Component}</ThemeProvider>);
};

describe('Button that shows a notification when clicked.', () => {
    it('Renders as a button', async () => {
        const { getByText } = renderWithTheme(
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
        expect(getByText('Click on me')).toBeInTheDocument();

        //getByText('Click on me').click();
        fireEvent.mouseDown(getByText('Click on me'));

        //expect( queryByText('This is a notification')).toBeInTheDocument();
    });

    //   fireEvent.mouseDown(getByText('ClickMe'));

    //    expect(queryByText('Item 1')).toBeNull();
});
