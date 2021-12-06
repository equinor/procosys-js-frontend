import React from 'react';
import Scope from '../index';
import { ThemeProvider } from 'styled-components';
import { render } from '@testing-library/react';
import theme from '../../../../../../assets/theme';

const commPkgScope = [
    {
        commPkgNo: '7101-C01',
        description: 'M30 LIFEBOAT',
        status: 'OS',
    },
    {
        commPkgNo: '7101-C02',
        description: 'M30 LIFERAFT & DAVIT',
        status: 'OS',
    },
    {
        commPkgNo: '7101-C08',
        description: 'M50 MISC LIFESAVING EQUIPMENT',
        status: 'OS',
    },
];

const mcPkgScope = [
    {
        mcPkgNo: '7101-F001',
        description: 'M30 LIFEBOAT',
        commPkgNo: '7101-C01',
    },
    {
        mcPkgNo: '7101-E001',
        description: 'LIFEBOAT FOR M30',
        commPkgNo: '7101-C01',
    },
];

jest.mock('@procosys/core/PlantContext', () => ({
    useCurrentPlant: () => {
        return {
            plant: {
                pathId: 'HEIMDAL',
            },
        };
    },
}));

const renderWithTheme = (Component) => {
    return render(<ThemeProvider theme={theme}>{Component}</ThemeProvider>);
};

describe('<Scope />', () => {
    it('Renders reports', async () => {
        const { queryByText } = renderWithTheme(
            <Scope commPkgScope={commPkgScope} mcPkgScope={[]} />
        );

        expect(queryByText('Reports')).toBeInTheDocument();
        expect(queryByText('MC32D')).toBeInTheDocument();
        expect(queryByText('MC84')).toBeInTheDocument();
        expect(queryByText('CDP06')).toBeInTheDocument();
    });

    it('Renders comm pkg scope', async () => {
        const { queryByText } = renderWithTheme(
            <Scope commPkgScope={commPkgScope} mcPkgScope={[]} />
        );

        expect(queryByText('Included Comm Packages')).toBeInTheDocument();
        expect(queryByText('Included MC Packages')).toBeNull();
        expect(queryByText('Comm pkg description')).toBeInTheDocument();
    });

    it('Renders mc pkg scope', async () => {
        const { queryByText } = renderWithTheme(
            <Scope commPkgScope={[]} mcPkgScope={mcPkgScope} />
        );

        expect(queryByText('Included MC Packages')).toBeInTheDocument();
        expect(queryByText('Included Comm Packages')).toBeNull();
        expect(queryByText('MC pkg description')).toBeInTheDocument();
    });

    it('Renders both mc and comm pkg scope', async () => {
        const { queryByText } = renderWithTheme(
            <Scope commPkgScope={commPkgScope} mcPkgScope={mcPkgScope} />
        );

        expect(queryByText('Included MC Packages')).toBeInTheDocument();
        expect(queryByText('MC pkg description')).toBeInTheDocument();
        expect(queryByText('Included MC Packages')).toBeInTheDocument();
        expect(queryByText('MC pkg description')).toBeInTheDocument();
    });
});
