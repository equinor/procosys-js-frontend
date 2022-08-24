import { configure, getByText, render, waitFor } from '@testing-library/react';

import EditIPO from '../EditIPO';
import { Invitation } from '../../ViewIPO/types';
import React from 'react';
import { act } from 'react-dom/test-utils';
import ViewIPOHeader from '../../ViewIPO/ViewIPOHeader';
import { Step } from '@procosys/modules/InvitationForPunchOut/types';

configure({ testIdAttribute: 'id' }); // makes id attibute data-testid for subsequent tests

const initialSteps: Step[] = [
    { title: 'Invitation for punch-out sent', isCompleted: true },
    { title: 'Punch-out complete', isCompleted: false },
    { title: 'Punch-out accepted by company', isCompleted: false },
];

const mockRoles = [
    {
        code: 'Code a',
        description: 'Desc',
        email: 'codea@test.com',
        informationalEmail: null,
        usePersonalEmail: false,
        persons: [
            {
                azureOid: '00-11-22',
                firstName: 'Elisabeth',
                lastName: 'Bratli',
                email: 'elisabeth@email.com',
            },
        ],
    },
];

const mockInvitation: Invitation = {
    canEdit: false,
    canCancel: true,
    canDelete: true,
    projectName: 'projectName',
    title: 'titleA',
    description: 'descriptionA',
    location: 'locationA',
    type: 'DP',
    rowVersion: 'version1',
    status: '',
    createdBy: {
        firstName: 'arild',
        lastName: 'bjerke',
        azureOid: 'dwaljawdawlkjawldjaw',
    },
    startTimeUtc: '2020-12-16 00:57:59',
    endTimeUtc: '2020-12-17 00:59:59',
    participants: [],
    mcPkgScope: [],
    commPkgScope: [],
};

jest.mock('react-router-dom', () => ({
    useParams: (): { ipoId: any; projectId: any; commPkgNo: any } => ({
        ipoId: 1,
        projectId: '1001',
        commPkgNo: '1',
    }),
    Link: jest.fn().mockImplementation(({ children }) => {
        return children;
    }),
}));

jest.mock('@procosys/hooks/useRouter', () =>
    jest.fn(() => ({
        history: (): any => ({
            push: jest.fn((): void => {
                return;
            }),
        }),
    }))
);

jest.mock('../../../context/InvitationForPunchOutContext', () => ({
    useInvitationForPunchOutContext: (): any => {
        return {
            apiClient: {
                getAllProjectsForUserAsync: (_: any): any => {
                    return Promise.resolve([
                        {
                            id: 123,
                            name: 'project.name',
                            description: 'project.description',
                        },
                    ]);
                },
                getIPO: (): any => Promise.resolve(mockInvitation),
                getAttachments: (): any => {
                    return Promise.resolve([]);
                },
                getFunctionalRolesAsync: (): any => Promise.resolve(mockRoles),
            },
        };
    },
}));

const mockSetDirtyStateFor = jest.fn();
const mockUnsetDirtyStateFor = jest.fn();

jest.mock('@procosys/core/DirtyContext', () => ({
    useDirtyContext: (): any => {
        return {
            setDirtyStateFor: mockSetDirtyStateFor,
            unsetDirtyStateFor: mockUnsetDirtyStateFor,
        };
    },
}));

describe('<EditIPO />', () => {
    it('Should display "Edit" as headline when in edit mode', async () => {
        const { getByText, getByTestId, getByLabelText } = render(<EditIPO />);
        await waitFor(() =>
            expect(getByText('Edit titleA')).toBeInTheDocument()
        );
        await waitFor(() =>
            expect(getByTestId('title')).toHaveProperty('value', 'titleA')
        );
        await waitFor(() =>
            expect(getByText('descriptionA')).toBeInTheDocument()
        );
        await waitFor(() =>
            expect(getByTestId('location')).toHaveProperty('value', 'locationA')
        );
        await waitFor(() =>
            expect(getByText('DP (Discipline Punch)')).toBeInTheDocument()
        );
    });

    it('Should not display "Cancel IPO"-button when canCancel is false', async () => {
        const { queryByText } = render(
            <ViewIPOHeader
                ipoId={1}
                steps={initialSteps}
                isCancelled={false}
                currentStep={1}
                title={'test'}
                organizer="test"
                participants={[]}
                isEditable={true}
                showEditButton={true}
                canDelete={false}
                deletePunchOut={(): void => {
                    /*mock*/
                }}
                canCancel={false}
                cancelPunchOut={(): void => {
                    /*mock*/
                }}
                isAdmin={false}
                isUsingAdminRights={false}
                setIsUsingAdminRights={(): void => {
                    /*mock*/
                }}
            />
        );

        expect(queryByText('Cancel IPO')).not.toBeInTheDocument();
    });

    it('Should display "Cancel IPO"-button when canCancel is true', async () => {
        const { queryByText } = render(
            <ViewIPOHeader
                ipoId={1}
                steps={initialSteps}
                isCancelled={false}
                currentStep={1}
                title={'test'}
                organizer="test"
                participants={[]}
                isEditable={true}
                showEditButton={true}
                canDelete={false}
                deletePunchOut={(): void => {
                    /*mock*/
                }}
                canCancel={true}
                cancelPunchOut={(): void => {
                    /*mock*/
                }}
                isAdmin={false}
                isUsingAdminRights={false}
                setIsUsingAdminRights={(): void => {
                    /*mock*/
                }}
            />
        );

        expect(queryByText('Cancel IPO')).toBeInTheDocument();
    });

    it('Should display "Delete IPO"-button when canDelete is true', async () => {
        const { queryByText } = render(
            <ViewIPOHeader
                ipoId={1}
                steps={initialSteps}
                isCancelled={false}
                currentStep={1}
                title={'test'}
                organizer="test"
                participants={[]}
                isEditable={true}
                showEditButton={true}
                canDelete={true}
                deletePunchOut={(): void => {
                    /*mock*/
                }}
                canCancel={true}
                cancelPunchOut={(): void => {
                    /*mock*/
                }}
                isAdmin={false}
                isUsingAdminRights={false}
                setIsUsingAdminRights={(): void => {
                    /*mock*/
                }}
            />
        );

        expect(queryByText('Delete IPO')).toBeInTheDocument();
    });

    it('Should not display "Delete IPO"-button when isCancelled is true, isUsingAdminRights is false and canDelete is false', async () => {
        const { queryByText } = render(
            <ViewIPOHeader
                ipoId={1}
                steps={initialSteps}
                isCancelled={true}
                currentStep={1}
                title={'test'}
                organizer="test"
                participants={[]}
                isEditable={true}
                showEditButton={true}
                canDelete={false}
                deletePunchOut={(): void => {
                    /*mock*/
                }}
                canCancel={true}
                cancelPunchOut={(): void => {
                    /*mock*/
                }}
                isAdmin={false}
                isUsingAdminRights={false}
                setIsUsingAdminRights={(): void => {
                    /*mock*/
                }}
            />
        );

        expect(queryByText('Delete IPO')).not.toBeInTheDocument();
    });
});
