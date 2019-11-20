import { getByText, render } from '@testing-library/react';

import Login from '../index';
import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';

jest.mock('../../../contexts/AuthContext');

const response = {
    login: jest.fn()
};

describe('Login Module', () => {
    it('Should render Login without errors', () => {

        useAuth.mockImplementation(() => response);
        const { getByText } = render(<Login />);
        expect(getByText('Login')).toBeInTheDocument();
    });

    it('Should trigger login function when trying to sign in', () => {
        useAuth.mockImplementation(() => response);
        const { getByText } = render(<Login />);
        const element = getByText('Login');
        element.click();
        expect(response.login.mock.calls.length).toBe(1);
    });
});
