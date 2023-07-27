import { fireEvent, render } from '@testing-library/react';

import CheckboxFilterWithDates from '../CheckboxFilterWithDates';
import React from 'react';

const checkboxItems = [
    {
        id: 'item1',
        title: 'Item 1',
    },
    {
        id: 'item2',
        title: 'Item 2',
    },
];

const dateFields = [
    {
        id: 'from',
        title: 'From',
    },
    {
        id: 'to',
        title: 'To',
    },
];

describe('<InvitationsFilter />', () => {
    it('Should render with title', async () => {
        const { getByText } = render(
            <CheckboxFilterWithDates
                title="Title"
                filterValues={checkboxItems}
                filterParam="punchOutDates"
                dateFields={dateFields}
                dateValues={[new Date(), new Date()]}
                onDateChange={jest.fn()}
                onCheckboxFilterChange={jest.fn()}
                itemsChecked={[]}
                icon={'alarm_on'}
            />
        );
        expect(getByText('Title')).toBeInTheDocument();
    });

    it('Should render with items and datefields when expanded', async () => {
        const { getByText, getByTestId, container } = render(
            <CheckboxFilterWithDates
                title="Title"
                filterValues={checkboxItems}
                filterParam="punchOutDates"
                dateFields={dateFields}
                dateValues={[new Date(), new Date()]}
                onDateChange={jest.fn()}
                onCheckboxFilterChange={jest.fn()}
                itemsChecked={[]}
                icon={'alarm_on'}
            />
        );
        fireEvent.click(getByTestId('checkbox-collapse'));
        expect(getByText('Item 1')).toBeInTheDocument();
        expect(getByText('Item 2')).toBeInTheDocument();
        expect(getByText('To')).toBeInTheDocument();
        expect(getByText('From')).toBeInTheDocument();
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        expect(checkboxes.length).toBe(2);
        const dateInputs = container.querySelectorAll('input[type="date"]');
        expect(dateInputs.length).toBe(2);
    });
});
