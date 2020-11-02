import { fireEvent, render, within } from '@testing-library/react';

import CreateIPO from '../CreateIPO';
import React from 'react';

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
        const { getByTestId, getByText } = render(<CreateIPO />);
        const selectContainer = getByTestId('po-type-select');
        
        const utils = within(selectContainer);
        const button = utils.getByRole('listbox');
        fireEvent.click(button);

        expect(getByText('DP (Discipline Punch)')).toBeInTheDocument();
        expect(getByText('MDP (Multi Discipline Punch)')).toBeInTheDocument();
    });
});


