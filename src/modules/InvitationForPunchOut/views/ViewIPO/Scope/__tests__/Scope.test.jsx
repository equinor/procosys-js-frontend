import React from 'react';
import Scope from '../index';
import { ThemeProvider } from 'styled-components';
import { render } from '@testing-library/react';
import theme from '../../../../../../assets/theme';

const renderWithTheme = (Component) => {
    return render(<ThemeProvider theme={theme}>{Component}</ThemeProvider>);
};


describe('<Scope />', () => {
    it('Renders correct table for DP', async () => {
        const { queryByText } = renderWithTheme(<Scope commPkgScope={[]} mcPkgScope={[]} type="DP" />);

        expect(queryByText('Included MC Packages')).toBeInTheDocument();
        expect(queryByText('MC pkg description')).toBeInTheDocument();
        expect(queryByText('Nothing to display')).toBeInTheDocument();
    });

    it('Renders correct table for MDP', async () => {
        const { queryByText } = renderWithTheme(<Scope commPkgScope={[]} mcPkgScope={[]} type="MDP" />);

        expect(queryByText('Included Comm Packages')).toBeInTheDocument();
        expect(queryByText('Comm pkg description')).toBeInTheDocument();
        expect(queryByText('Nothing to display')).toBeInTheDocument();
    });
});



