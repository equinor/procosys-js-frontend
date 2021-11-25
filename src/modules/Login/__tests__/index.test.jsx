import Login from '../index';
import React from 'react';
import { render } from '@testing-library/react';

describe('Module: <Login />', () => {
    it('Should render Login without errors', () => {
        const { getByText } = render(<Login />);
        expect(getByText('Authenticating')).toBeInTheDocument();
    });
});
