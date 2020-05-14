import { render, fireEvent} from '@testing-library/react';
import React from 'react';
import ActionTab from '../ActionTab';
import { act } from 'react-dom/test-utils';

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
            }
        };
    })
}));

describe('<ActionTab />', () => {

    let getByTestIdTemp = null;
    let queryByTextTemp = null;

    it('Should render action list', async () => {
        await act(async () => {
            const {queryByText } = render(<ActionTab tagId={100}/>);
            queryByTextTemp = queryByText;
        });

        await act(async () => {
            expect(queryByTextTemp('Action 1')).toBeInTheDocument();
            expect(queryByTextTemp('Action 2')).toBeInTheDocument();
            expect(queryByTextTemp('Add action')).toBeInTheDocument();
        });
    });
    
    it('Should open and show action details when clicking the toggle-button.', async () => {
        await act(async () => {
            const {queryByText, getByTestId } = render(<ActionTab tagId={100}/>);
            getByTestIdTemp = getByTestId;
            queryByTextTemp = queryByText;
        });

        await act(async () => {
            fireEvent.click(getByTestIdTemp('toggle-icon-1'));
        });

        await act(async () => {
            expect(queryByTextTemp('01.05.2020')).toBeInTheDocument();
            expect(queryByTextTemp('01.03.2020')).toBeInTheDocument();
            expect(queryByTextTemp('Donald Duck')).toBeInTheDocument();
            expect(queryByTextTemp('Description 1')).toBeInTheDocument();
            expect(queryByTextTemp('Close action')).toBeInTheDocument();
        });

        await act(async () => {
            fireEvent.click(getByTestIdTemp('toggle-icon-1'));
        });

        await act(async () => {
            expect(queryByTextTemp('Description 1')).not.toBeInTheDocument();
        });        
    });

});
