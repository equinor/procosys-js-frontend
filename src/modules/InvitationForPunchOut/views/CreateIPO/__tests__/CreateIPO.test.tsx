import { fireEvent, render, waitFor, within } from '@testing-library/react';

import CreateIPO from '../CreateIPO';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { configure } from '@testing-library/dom';

jest.mock('react-router-dom', () => ({
    useParams: (): {projectId: any, commPkgNo: any} => ({
        projectId: '1001',
        commPkgNo: '1',
    }),
}));

jest.mock('@procosys/hooks/useRouter', () => jest.fn(() => ({
    history: (): any => ({
        push: jest.fn((): void => { return; })
    })
})));

jest.mock('../../../context/InvitationForPunchOutContext',() => ({
    useInvitationForPunchOutContext: (): any => {
        return {
            apiClient: {
                getAllProjectsForUserAsync: (_: any): any => { 
                    return Promise.resolve([
                        {
                            id: 123,
                            name: 'project.name',
                            description: 'project.description'
                        }
                    ]); 
                }
            }
        };
    }
}));

describe('<CreateIPO />', () => {
    it('Should display type types when Type of punch round select is clicked', async () => {
        const result = render(<CreateIPO />);
        await act(async () => {
            const selectContainer = result.getByTestId('po-type-select');
        
            const utils = within(selectContainer);
            const button = utils.getByRole('listbox');
            fireEvent.click(button);
        });

        expect(result.getByText('DP (Discipline Punch)')).toBeInTheDocument();
        expect(result.getByText('MDP (Multi Discipline Punch)')).toBeInTheDocument();
    });

    it('Should render Next button enabled', async () => {
        const { getByText } = render(<CreateIPO />);
        await waitFor(() => expect(getByText('Next').closest('button')).toHaveProperty('disabled', true));
    });

    it('Should render Previous button enabled', async () => {
        const { getByText } = render(<CreateIPO />);
        await waitFor(() => expect(getByText('Previous').closest('button')).toHaveProperty('disabled', true));
    });

    it('Should update end time when entering start time > end time', async () => {
        configure({ testIdAttribute: 'id' }); // makes id attibute data-testid for subsequent tests
        const { getByTestId } = render(<CreateIPO />);
        const startTime = getByTestId('startTime');
        const endTime = getByTestId('endDate');
        fireEvent.change(startTime, { target: { value: '22:23'}});
        await waitFor(() => expect(endTime).toHaveValue('23:23'));
    });

    it('Should not update end time when entering start time < end time', async () => {
        const { getByTestId } = render(<CreateIPO />);
        const startTime = getByTestId('startTime');
        const endTime = getByTestId('endDate');
        fireEvent.change(endTime, { target: { value: '23:23'}});
        fireEvent.change(startTime, { target: { value: '08:23'}});
        await waitFor(() => expect(endTime).toHaveValue('23:23'));
    });

    it('Should not update time when invalid (empty)', async () => {
        const { getByTestId } = render(<CreateIPO />);
        const startTime = getByTestId('startTime');
        fireEvent.change(startTime, { target: { value: '13:30'}});
        fireEvent.change(startTime, { target: { value: ''}});
        await waitFor(() => expect(startTime).toHaveValue('13:30'));
    });
});


