import { render } from '@testing-library/react';
import React from 'react';
import CheckboxFilter from '../CheckboxFilter';

const filterValues = [
    {
        id: '1',
        title: 'Donald Duck',
    },
    {
        id: '2',
        title: 'Onkel Skrue',
    },
    {
        id: '3',
        title: 'Bestemor Duck',
    },
];

const testEdsIcon = 'edit';

describe('<CheckboxFilter />', () => {
    it('Should render checkbox section with title and checkboxes with initial value.', () => {
        const title = 'TestFilter';
        const { getByTestId, getByLabelText } = render(
            <CheckboxFilter
                title={title}
                filterValues={filterValues}
                tagListFilterParam="testFilters"
                itemsChecked={['1']}
                icon={testEdsIcon}
            />
        );
        getByTestId('CheckboxHeader').click();
        expect(getByLabelText(filterValues[0].title)).toBeInTheDocument();
        expect(getByLabelText(filterValues[1].title)).toBeInTheDocument();
        expect(getByLabelText(filterValues[2].title)).toBeInTheDocument();
        expect(getByLabelText(filterValues[0].title)).toHaveAttribute(
            'checked'
        );
        expect(getByLabelText(filterValues[1].title)).not.toHaveAttribute(
            'checked'
        );
        expect(getByLabelText(filterValues[2].title)).not.toHaveAttribute(
            'checked'
        );
    });

    it('Should trigger onCheckboxFilterChange when changed', () => {
        const spyFunction = jest.fn();
        const title = 'TestFilter';
        const { getByTestId, getByLabelText } = render(
            <CheckboxFilter
                title={title}
                filterValues={filterValues}
                tagListFilterParam="testFilters"
                onCheckboxFilterChange={spyFunction}
                itemsChecked={['1']}
                icon={testEdsIcon}
            />
        );
        getByTestId('CheckboxHeader').click();
        getByLabelText(filterValues[1].title).click();
        expect(spyFunction).toHaveBeenCalledTimes(1);
        expect(spyFunction).toHaveBeenCalledWith('testFilters', '2', true);
    });

    it('Value should change on prop change', () => {
        const spyFunction = jest.fn();
        const title = 'TestFilter';
        const { getByTestId, getByLabelText, rerender } = render(
            <CheckboxFilter
                title={title}
                filterValues={filterValues}
                tagListFilterParam="testFilters"
                onCheckboxFilterChange={spyFunction}
                itemsChecked={['1']}
                icon={testEdsIcon}
            />
        );
        rerender(
            <CheckboxFilter
                title={title}
                filterValues={filterValues}
                tagListFilterParam="testFilters"
                onCheckboxFilterChange={spyFunction}
                itemsChecked={['1', '2']}
                icon={testEdsIcon}
            />
        );
        getByTestId('CheckboxHeader').click();
        expect(getByLabelText(filterValues[0].title)).toHaveAttribute(
            'checked'
        );
        expect(getByLabelText(filterValues[1].title)).toHaveAttribute(
            'checked'
        );
        expect(getByLabelText(filterValues[2].title)).not.toHaveAttribute(
            'checked'
        );
    });
});
