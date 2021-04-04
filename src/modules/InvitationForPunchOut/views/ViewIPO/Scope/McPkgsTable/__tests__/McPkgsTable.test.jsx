import McPkgsTable from '../index';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { render } from '@testing-library/react';
import theme from '../../../../../../../assets/theme';

const mcPkgScope = [
    {
        mcPkgNo: '7101-F001',
        description: 'M30 LIFEBOAT',
        commPkgNo: '7101-C01'
    },
    { 
        mcPkgNo: '7101-E001',
        description: 'LIFEBOAT FOR M30',
        commPkgNo: '7101-C01'
    }
];

jest.mock('@procosys/core/PlantContext',() => ({
    useCurrentPlant: () => {
        return {
            plant: {
                pathId: 'HEIMDAL'
            }
        };
    }
}));


const renderWithTheme = (Component) => {
    return render(<ThemeProvider theme={theme}>{Component}</ThemeProvider>);
};


describe('<McPkgsTable />', () => {
    it('Renders MC pkgs to table', async () => {
        const { queryByText, queryAllByText } = renderWithTheme(<McPkgsTable mcPkgScope={mcPkgScope} />);

        expect(queryByText(mcPkgScope[0].mcPkgNo)).toBeInTheDocument();
        expect(queryByText(mcPkgScope[1].mcPkgNo)).toBeInTheDocument();
        expect(queryByText(mcPkgScope[0].description)).toBeInTheDocument();
        expect(queryByText(mcPkgScope[1].description)).toBeInTheDocument();
        expect(queryAllByText(mcPkgScope[0].commPkgNo).length).toBe(2);
    });
});



