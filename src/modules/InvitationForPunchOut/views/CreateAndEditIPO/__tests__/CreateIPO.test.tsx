import {
    fireEvent,
    render,
    waitFor,
    within,
    screen,
} from '@testing-library/react';

import CreateIPO from '../CreateIPO';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { configure } from '@testing-library/dom';
import { renderWithLocalizationProvider } from '@procosys/modules/InvitationForPunchOut/helperFunctions/testingFunctions/renderWithLocalizationProvider';

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
    beforeEach(async () => {
        await act(async () => {
            renderWithLocalizationProvider(<CreateIPO />);
        });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should display type types when Type of punch round select is clicked', async () => {
        const selectContainer = screen.getByTestId('po-type-select');
        const utils = within(selectContainer);
        const button = utils.getByRole('listbox');
        fireEvent.click(button);
        await waitFor(() =>
            expect(
                screen.getByText('DP (Discipline Punch)')
            ).toBeInTheDocument()
        );
        await waitFor(() =>
            expect(
                screen.getByText('MDP (Multi Discipline Punch)')
            ).toBeInTheDocument()
        );
    });

    it('Should render Next button enabled', async () => {
        expect(screen.getByText('Next').closest('button')).toHaveProperty(
            'disabled',
            false
        );
    });

    it('Should render Previous button enabled', async () => {
        await waitFor(() =>
            expect(
                screen.getByText('Previous').closest('button')
            ).toHaveProperty('disabled', true)
        );
    });

    // TODO: fix when mui components allow ID
    // it('Should not allow to proceed with endtime preceding starttime', async () => {
    //     const endTime = screen.getByTestId('endTime');
    //     const startTime = screen.getByTestId('startTime');
    //     fireEvent.change(startTime, { target: { value: '' } });
    //     userEvent.type(startTime, '13:30');
    //     fireEvent.change(endTime, { target: { value: '' } });
    //     userEvent.type(endTime, '12:30');
    //     await waitFor(() =>
    //         expect(screen.getByText('Next').closest('button')).toHaveProperty(
    //             'disabled',
    //             true
    //         )
    //     );
    //     expect(
    //         screen.getByText('Start time must precede end time.')
    //     ).toBeInTheDocument();
    // });

    it('Should not allow to proceed with title exceeding 250 characters', async () => {
        const longString = [...Array(251)]
            .map(() => (~~(Math.random() * 36)).toString(36))
            .join('');
        const title = screen.getByTestId('title');
        fireEvent.change(title, { target: { value: longString } });
        await waitFor(() =>
            expect(screen.getByText('Next').closest('button')).toHaveProperty(
                'disabled',
                true
            )
        );
        expect(
            screen.getByText('Title is too long. Maximum 250 characters.')
        ).toBeInTheDocument();
    });

    it('Should indicate required fields when clicking next button', async () => {
        const button = screen.getByText('Next').closest('button');
        expect(button).toBeInTheDocument();
        if (button) {
            fireEvent.click(button);
        }
        await waitFor(() =>
            expect(screen.getAllByText('Required field.').length).toBe(3)
        );
        expect(screen.getByText('Confirmation required.')).toBeInTheDocument();
    });
});
