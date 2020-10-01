import { render } from '@testing-library/react';
import React from 'react';
import Participants from '../Participants';


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
    
    it('Should render Next button disabled', () => {
        const { getByText } = render(<Participants participants={participants} isValid={false}/>);
        expect(getByText('Next').closest('button')).toHaveProperty('disabled', true);
    });

    it('Should render Previous button enabled', () => {
        const { getByText } = render(<Participants participants={participants} />);
        expect(getByText('Previous').closest('button')).toHaveProperty('disabled', false);
    });
});
