import { render, waitFor } from '@testing-library/react';

import RequirementsSelector from '../RequirementsSelector';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import theme from '@procosys/assets/theme';

const renderWithTheme = (Component) => {
    return render(<ThemeProvider theme={theme}>{Component}</ThemeProvider>);
};

const requirementTypes = [
    {
        id: 1,
        code: 'area',
        isVoided: false,
        rowVersion: '-',
        title: 'Area preservation',
        requirementDefinitions: [{
            defaultIntervalWeeks: 4,
            id: 2,
            isVoided: false,
            needsUserInput: true,
            title: 'By discipline Electrical'
        }]
    },
    {
        id: 2,
        code: 'motor',
        isVoided: false,
        rowVersion: '-',
        title: 'Motor preservation',
        requirementDefinitions: [{
            defaultIntervalWeeks: 2,
            id: 3,
            isVoided: false,
            needsUserInput: false,
            title: 'Spin it 30 deg'
        }]
    },
];

describe('<RequirementsSelector />', () => {
    it('Renders with no default value', async () => {
        const { queryByText } = renderWithTheme(<RequirementsSelector requirementTypes={requirementTypes} requirements={[]} />);
        expect(queryByText('Interval')).toBeNull();
    });

    it('Renders with default value', async () => {
        const selectedItems = [{
            requirementDefinitionId: 1,
            intervalWeeks: 2,
        }];
        const { getByText } = renderWithTheme(<RequirementsSelector requirementTypes={requirementTypes} requirements={selectedItems} />);
        expect(getByText('2 weeks')).toBeInTheDocument();
    });

    it('Triggers onChange when item is selected', async () => {
        const mySpy = jest.fn();
        const { getAllByText, getByText } = renderWithTheme(<RequirementsSelector requirementTypes={requirementTypes} requirements={[]} onChange={mySpy} />);
        getByText('Add Requirement').click();
        getAllByText('Select')[0].click();
        getByText('Area preservation').click();
        getByText('By discipline Electrical').click();

        await waitFor(() => expect(mySpy).toHaveBeenCalledTimes(1));
    });

    it('Triggers onChange when interval is changed', async () => {
        const mySpy = jest.fn();
        const selectedItems = [{
            requirementDefinitionId: 1,
            intervalWeeks: 2,
        }];
        const { getByText } = renderWithTheme(<RequirementsSelector requirementTypes={requirementTypes} requirements={selectedItems} onChange={mySpy} />);
        getByText('2 weeks').click();
        getByText('4 weeks').click();

        await waitFor(() => expect(mySpy).toHaveBeenCalledTimes(1));
    });

});
