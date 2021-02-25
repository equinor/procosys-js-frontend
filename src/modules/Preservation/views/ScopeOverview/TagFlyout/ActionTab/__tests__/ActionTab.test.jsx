import { fireEvent, render } from '@testing-library/react';

import ActionTab from '../ActionTab';
import React from 'react';
import { getFormattedDate } from '../../../../../../../core/services/DateService';

const mockActionList = [
    {
        id: '1',
        title: 'Action 1',
        dueTimeUtc: '2020-05-01',
        isClosed: false      
    },
    {
        id: '2',
        title: 'Action 2',
        dueTimeUtc: null,
        isClosed: true      
    },
];

const mockActionDetails = {
    id: 1,
    title: 'Action 1',
    description: 'Description 1',
    dueTimeUtc: '2020-05-01',
    isClosed: false,
    createdAtUtc: '2020-03-01',
    createdBy: {
        id: '1',
        firstName: 'Donald',
        lastName: 'Duck',
    },
    rowVersion: '1'
};

const mockActionAttachments = [
    {
        id: '1',
        fileName: 'aFileAttachment.png',
        rowVersion: '1'
    }    
];



jest.mock('../../../../../context/PreservationContext', () => ({
    
    usePreservationContext: jest.fn(() => {
        return {
            apiClient: {
                project: {
                    id: 1,
                    name: 'test',
                    description: 'project'
                },
                getActions: () => Promise.resolve(mockActionList),
                getActionDetails: () => Promise.resolve(mockActionDetails),
                getActionAttachments: () => Promise.resolve(mockActionAttachments),
            }
        };
    })
}));

describe('<ActionTab />', () => {

    it('Should render action list', async () => {
        const {findByText, queryByText } = render(<ActionTab tagId={100}/>);
        await findByText('Action 1');
        expect(queryByText('Action 1')).toBeInTheDocument();
        expect(queryByText('Action 2')).toBeInTheDocument();
        expect(queryByText('Add action')).toBeInTheDocument();
    });
    
    it('Should open and show action details when clicking the toggle-button.', async () => {
        const {queryByText, findByTestId, findByText } = render(<ActionTab tagId={100}/>);
        const clickableElement = await findByTestId('toggle-icon-1');

        fireEvent.click(clickableElement);
        await findByText(getFormattedDate('2020-05-01'));

        expect(queryByText(getFormattedDate('2020-05-01'))).toBeInTheDocument();
        expect(queryByText(getFormattedDate('2020-03-01'))).toBeInTheDocument();
        expect(queryByText('Donald Duck')).toBeInTheDocument();
        expect(queryByText('Description 1')).toBeInTheDocument();
        expect(queryByText('aFileAttachment.png')).toBeInTheDocument();
        expect(queryByText('Close action')).toBeInTheDocument();

        fireEvent.click(clickableElement);
        expect(queryByText('Description 1')).not.toBeInTheDocument();
    });
});
