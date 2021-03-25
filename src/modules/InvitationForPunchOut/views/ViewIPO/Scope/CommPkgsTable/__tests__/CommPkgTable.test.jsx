import CommPkgsTable from '../index';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { render } from '@testing-library/react';
import theme from '../../../../../../../assets/theme';

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

jest.mock('react-virtualized-auto-sizer', () => {
    return (props) => {
        const renderCallback = props.children;

        return renderCallback({
            width: 1200,
            height: 900
        });
    };
});

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


describe('<CommPkgsTable />', () => {
    it('Renders Comm pkgs to table', async () => {
        const { queryByText, queryAllByText } = renderWithTheme(<CommPkgsTable commPkgScope={commPkgScope} />);

        expect(queryByText(commPkgScope[0].commPkgNo)).toBeInTheDocument();
        expect(queryByText(commPkgScope[1].commPkgNo)).toBeInTheDocument();
        expect(queryByText(commPkgScope[2].commPkgNo)).toBeInTheDocument();
        expect(queryByText(commPkgScope[0].description)).toBeInTheDocument();
        expect(queryByText(commPkgScope[1].description)).toBeInTheDocument();
        expect(queryByText(commPkgScope[2].description)).toBeInTheDocument();
        expect(queryAllByText(commPkgScope[0].status).length).toBe(3);
    });
});


