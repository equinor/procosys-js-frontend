import { configure, render, waitFor } from '@testing-library/react';

import CreateAndEditIPO from '../CreateAndEditIPO';
import React from 'react';
import { Invitation } from '../../ViewIPO/types';

configure({ testIdAttribute: 'id' }); // makes id attibute data-testid for subsequent tests

const mockInvitation: Invitation = {
    projectName: 'projectName',
    title: 'titleA',
    description: 'descriptionA',
    location: 'locationA',
    type: 'DP',
    rowVersion: 'version1',
    status: '',
    createdBy: 'arild',
    startTimeUtc: '2020-12-16 00:57:59',
    endTimeUtc: '2020-12-17 00:57:59',
    participants: [],
    mcPkgScope: [],
    commPkgScope: []
};

jest.mock('react-router-dom', () => ({
    useParams: (): { ipoId: any, projectId: any, commPkgNo: any } => ({
        ipoId: 1,
        projectId: '1001',
        commPkgNo: '1',
    }),
}));

jest.mock('@procosys/hooks/useRouter', () => jest.fn(() => ({
    history: (): any => ({
        push: jest.fn((): void => { return; })
    })
})));

jest.mock('../../../context/InvitationForPunchOutContext', () => ({
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
                },
                getIPO: (): any => Promise.resolve(mockInvitation),
                getAttachments: (): any => {
                    return Promise.resolve([]);
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
    it('Should display "Edit" as headline when in edit mode', async () => {
        const { getByText, getByTestId, getByLabelText } = render(<CreateAndEditIPO />);
        await waitFor(() => expect(getByText('Edit titleA')).toBeInTheDocument());
        await waitFor(() => expect(getByTestId('title')).toHaveProperty('value', 'titleA'));
        await waitFor(() => expect(getByText('descriptionA')).toBeInTheDocument());
        await waitFor(() => expect(getByTestId('location')).toHaveProperty('value', 'locationA'));
        await waitFor(() => expect(getByText('DP (Discipline Punch)')).toBeInTheDocument());
        await waitFor(() => expect(getByLabelText('Date')).toHaveValue('2020-12-16'));
        await waitFor(() => expect(getByLabelText('From')).toHaveValue('00:57'));
        await waitFor(() => expect(getByLabelText('To')).toHaveValue('00:57'));
    });
});

