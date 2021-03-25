import React from 'react';
import ReportsTable from '../index';
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

const commPkgScope = [
    {
        commPkgNo: '7101-C01',
        description: 'M30 LIFEBOAT',
        status: 'OS'
    },
    {
        commPkgNo: '7101-C02',
        description: 'M30 LIFERAFT & DAVIT',
        status: 'OS'
    },
    {
        commPkgNo: '7101-C08',
        description: 'M50 MISC LIFESAVING EQUIPMENT',
        status: 'OS'
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

jest.mock('react-virtualized-auto-sizer', () => {
    return (props) => {
        const renderCallback = props.children;

        return renderCallback({
            width: 1200,
            height: 900
        });
    };
});

const renderWithTheme = (Component) => {
    return render(<ThemeProvider theme={theme}>{Component}</ThemeProvider>);
};


describe('<ReportsTable />', () => {
    it('Renders Report types with MC Scope', async () => {
        const { queryByText } = renderWithTheme(<ReportsTable mcPkgScope={mcPkgScope} commPkgScope={[]} />);

        expect(queryByText('MC32D')).toBeInTheDocument();
        expect(queryByText('MC84')).toBeInTheDocument();
        expect(queryByText('CDP06')).toBeInTheDocument();
    });

    it('Renders Report types with Comm Scope', async () => {
        const { queryByText } = renderWithTheme(<ReportsTable mcPkgScope={[]} commPkgScope={commPkgScope} />);

        expect(queryByText('MC32D')).toBeInTheDocument();
        expect(queryByText('MC84')).toBeInTheDocument();
        expect(queryByText('CDP06')).toBeInTheDocument();
    });
});



