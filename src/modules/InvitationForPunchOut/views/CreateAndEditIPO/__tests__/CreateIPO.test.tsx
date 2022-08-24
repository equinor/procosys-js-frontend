import { fireEvent, render, waitFor, within } from '@testing-library/react';

import CreateIPO from '../CreateIPO';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { configure } from '@testing-library/dom';

configure({ testIdAttribute: 'id' }); // makes id attibute data-testid for subsequent tests

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

jest.mock('react-router-dom', () => ({
    useParams: (): { projectId: any; commPkgNo: any } => ({
        projectId: '1001',
        commPkgNo: '1',
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

const mockProject = [
    {
        id: 123,
        name: 'project.name',
        description: 'project.description',
    },
];

jest.mock('../../../context/InvitationForPunchOutContext', () => ({
    useInvitationForPunchOutContext: (): any => {
        return {
            apiClient: {
                getFunctionalRolesAsync: (): any => Promise.resolve(mockRoles),
                getAllProjectsForUserAsync: (_: any): any => {
                    return Promise.resolve(mockProject);
                },
            },
            availableProjects: mockProject,
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

describe('<CreateIPO />', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should display type types when Type of punch round select is clicked', async () => {
        let result: any;
        await act(async () => {
            result = render(<CreateIPO />);
        });
        const selectContainer = result.getByTestId('po-type-select');
        const utils = within(selectContainer);
        const button = utils.getByRole('listbox');
        fireEvent.click(button);
        await waitFor(() =>
            expect(
                result.getByText('DP (Discipline Punch)')
            ).toBeInTheDocument()
        );
        await waitFor(() =>
            expect(
                result.getByText('MDP (Multi Discipline Punch)')
            ).toBeInTheDocument()
        );
    });

    it('Should render Next button enabled', async () => {
        let result: any;
        await act(async () => {
            result = render(<CreateIPO />);
        });
        expect(result.getByText('Next').closest('button')).toHaveProperty(
            'disabled',
            false
        );
    });

    it('Should render Previous button enabled', async () => {
        let result: any;
        await act(async () => {
            result = render(<CreateIPO />);
        });
        await waitFor(() =>
            expect(
                result.getByText('Previous').closest('button')
            ).toHaveProperty('disabled', true)
        );
    });

    it('Should update end time when entering start time > end time', async () => {
        let result: any;
        await act(async () => {
            result = render(<CreateIPO />);
        });
        const startTime = result.getByTestId('startTime');
        const endTime = result.getByTestId('endTime');
        fireEvent.change(startTime, { target: { value: '08:00' } });
        fireEvent.change(endTime, { target: { value: '09:00' } });
        fireEvent.change(startTime, { target: { value: '22:23' } });
        await waitFor(() => expect(endTime).toHaveValue('23:23'));
    });

    it('Should not update end time when entering start time < end time', async () => {
        let result: any;
        await act(async () => {
            result = render(<CreateIPO />);
        });
        const startTime = result.getByTestId('startTime');
        const endTime = result.getByTestId('endTime');
        fireEvent.change(startTime, { target: { value: '08:00' } });
        fireEvent.change(endTime, { target: { value: '23:23' } });
        fireEvent.change(startTime, { target: { value: '10:23' } });
        await waitFor(() => expect(endTime).toHaveValue('23:23'));
    });

    it('Should not update time when invalid (empty)', async () => {
        let result: any;
        await act(async () => {
            result = render(<CreateIPO />);
        });
        const startTime = result.getByTestId('startTime');
        fireEvent.change(startTime, { target: { value: '13:30' } });
        fireEvent.change(startTime, { target: { value: '' } });
        await waitFor(() => expect(startTime).toHaveValue('13:30'));
    });

    it('Should not allow to proceed with endtime preceding starttime', async () => {
        let result: any;
        await act(async () => {
            result = render(<CreateIPO />);
        });
        const endTime = result.getByTestId('endTime');
        const startTime = result.getByTestId('startTime');
        fireEvent.change(startTime, { target: { value: '13:30' } });
        fireEvent.change(endTime, { target: { value: '12:30' } });
        await waitFor(() =>
            expect(result.getByText('Next').closest('button')).toHaveProperty(
                'disabled',
                true
            )
        );
        expect(
            result.getByText('Start time must precede end time.')
        ).toBeInTheDocument();
    });

    it('Should not allow to proceed with title exceeding 250 characters', async () => {
        let result: any;
        await act(async () => {
            result = render(<CreateIPO />);
        });
        const longString = [...Array(251)]
            .map(() => (~~(Math.random() * 36)).toString(36))
            .join('');
        const title = result.getByTestId('title');
        fireEvent.change(title, { target: { value: longString } });
        await waitFor(() =>
            expect(result.getByText('Next').closest('button')).toHaveProperty(
                'disabled',
                true
            )
        );
        expect(
            result.getByText('Title is too long. Maximum 250 characters.')
        ).toBeInTheDocument();
    });

    it('Should indicate required fields when clicking next button', async () => {
        let result: any;
        await act(async () => {
            result = render(<CreateIPO />);
        });
        const button = result.getByText('Next').closest('button');
        fireEvent.click(button);
        await waitFor(() =>
            expect(result.getAllByText('Required field.').length).toBe(3)
        );
        expect(result.getByText('Confirmation required.')).toBeInTheDocument();
    });
});
