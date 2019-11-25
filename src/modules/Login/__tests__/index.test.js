import Login from '../index';
import React from 'react';
import { render } from '@testing-library/react';

describe('Module: <Login />', () => {

    it('Should render Login without errors', () => {
        const { getByTitle } = render(<Login />);
        expect(getByTitle('Loading')).toBeInTheDocument();
    });

});
