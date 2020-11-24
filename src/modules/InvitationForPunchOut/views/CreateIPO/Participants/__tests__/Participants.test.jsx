import { render, waitFor } from '@testing-library/react';

import Participants from '../Participants';
import React from 'react';

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
                email: 'elisabeth@email.com'
            }
        ]
    }
];

const participants = [
    {
        organization: 'Contractor',
        externalEmail: null,
        person: null,
        role: null
    },
    {
        organization: 'Construction company',
        externalEmail: null,
        person: null,
        role: null
    }
];

jest.mock('../../../../context/InvitationForPunchOutContext',() => ({
    useInvitationForPunchOutContext: () => {
        return {
            apiClient: {
                getFunctionalRolesAsync: () => Promise.resolve(mockRoles)
            }
        };
    }
}));

describe('Module: <Participants />', () => {
    
    it('Should render participants', async () => {
        const { getAllByText } = render(<Participants participants={participants} isValid={false}/>);
        await waitFor(() => expect(getAllByText('Organization').length).toBe(2));
        await waitFor(() => expect(getAllByText('Type').length).toBe(2));
        await waitFor(() => expect(getAllByText('Select').length).toBe(2));
    });
});
