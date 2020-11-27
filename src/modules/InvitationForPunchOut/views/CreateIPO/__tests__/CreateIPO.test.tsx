import { fireEvent, render, waitFor, within } from '@testing-library/react';

import { ComponentName } from '../utils';
import CreateIPO from '../CreateIPO';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { configure } from '@testing-library/dom';

configure({ testIdAttribute: 'id' });

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

const mockSetDirtyStateFor = jest.fn();
const mockUnsetDirtyStateFor = jest.fn();

jest.mock('@procosys/core/DirtyContext', () => ({
    useDirtyContext: (): any => {
        return {
            setDirtyStateFor: mockSetDirtyStateFor,
            unsetDirtyStateFor: mockUnsetDirtyStateFor
        };
    }
}));

describe('<CreateIPO />', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

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

    it('Should set dirty state when making to general info.', async () => {
        const { getByTestId } = render(<CreateIPO />);
        const input = await waitFor(() => getByTestId('description'));

        fireEvent.change(input, { target: { value: 'test' }});
        expect(mockSetDirtyStateFor).toBeCalledTimes(1);
        expect(mockSetDirtyStateFor).toBeCalledWith(ComponentName.CreateIPO);

    });

    it('Should reset dirty state when reverting to clean state.', async () => {
        const { getByTestId } = render(<CreateIPO />);
        const input = await waitFor(() => getByTestId('description'));

        jest.clearAllMocks();
        fireEvent.change(input, { target: { value: 'test' }});
        fireEvent.change(input, { target: { value: '' }});
        expect(mockSetDirtyStateFor).toBeCalledTimes(1);
        expect(mockSetDirtyStateFor).toBeCalledWith(ComponentName.CreateIPO);
        expect(mockUnsetDirtyStateFor).toBeCalledTimes(1);
        expect(mockUnsetDirtyStateFor).toBeCalledWith(ComponentName.CreateIPO);

    });
});


