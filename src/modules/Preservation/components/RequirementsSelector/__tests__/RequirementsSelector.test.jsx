import { render } from '@testing-library/react';

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

    it('Triggers onChange', async () => {
        const mySpy = jest.fn();
        const { getAllByText, getByText, debug } = renderWithTheme(<RequirementsSelector requirementTypes={requirementTypes} requirements={[]} onChange={mySpy} />);
        getByText('Add Requirement').click();
        getAllByText('Select')[0].click();
        getByText('Area preservation').click();
        getByText('By discipline Electrical').click();
        debug();
        expect(mySpy).toHaveBeenCalledTimes(1);
    });

});
