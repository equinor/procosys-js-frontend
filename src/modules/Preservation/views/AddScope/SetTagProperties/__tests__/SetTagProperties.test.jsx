import React from 'react';
import SetTagProperties from '../SetTagProperties';
import { render } from '@testing-library/react';

const journeys = [{
    text: 'Journey 1',
    id: 1
},
{
    text: 'Journey 2',
    id: 2
}];

const steps = [{
    text: 'Step 1',
    id: 1
},
{
    text: 'Step 2',
    id: 2
}];

jest.mock('../../../../context/PreservationContext', () => ({
    usePreservationContext: jest.fn(() => {
        return {
            project: {
                id: 1,
                name: 'test',
                description: 'project'
            }
        };
    })
}));

describe('Module: <SetTagProperties />', () => {

    it('Should render Add To Scope button disabled when form is invalid', () => {
        const { getByText } = render(<SetTagProperties journeys={journeys} steps={steps} />);
        expect(getByText('Add to scope')).toHaveProperty('disabled', true);
    });

    it('Should render Add button enabled when form is valid', () => {

        const { getByText, queryByText } = render(<SetTagProperties journeys={journeys} steps={steps} />);
        getByText('Select journey').click();
        queryByText(journeys[0].text).click();
        getByText('Select step').click();
        queryByText(steps[0].text).click();

        expect(getByText('Add to scope')).toHaveProperty('disabled', false);
    });
});
