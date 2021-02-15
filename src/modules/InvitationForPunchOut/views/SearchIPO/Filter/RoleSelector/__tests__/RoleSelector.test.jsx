import React from 'react';
import RoleSelector from '../index';
import { render } from '@testing-library/react';

const roles = [
    {
        text: 'Role 1',
        value: 'role1'
    },
    {
        text: 'Role 2',
        value: 'role2'
    }
];

describe('<RoleSelector />', () => {
    it('Should render with title and dropdown', async () => {
        const { getByText } = render(
            <RoleSelector onChange={jest.fn()} roles={roles} functionalRoleCode={''} />
        );          
        expect(getByText('Role')).toBeInTheDocument();
        expect(getByText('Select')).toBeInTheDocument();
    });
});





