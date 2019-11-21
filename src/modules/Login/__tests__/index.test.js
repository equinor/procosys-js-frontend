import Login from '../index';
import React from 'react';
import { render } from '@testing-library/react';
import {useProcosysContext} from '../../../core/ProcosysContext';

jest.mock('../../../core/ProcosysContext');


describe('Login Module', () => {
    useProcosysContext.mockImplementation(() => ({auth: {login: jest.fn()}}));



    it('Should render Login without errors', () => {
        const { getByText } = render(<Login />);
        expect(getByText('Login')).toBeInTheDocument();
    });

    it('Should trigger login function when trying to sign in', () => {

        const spy = jest.fn();
        useProcosysContext.mockImplementation(() => ({auth: {login: spy}}));
        const { getByText } = render(<Login />);
        const element = getByText('Login');
        element.click();
        expect(spy.mock.calls.length).toBe(1);
    });
});
