import { render, waitForElement } from '@testing-library/react';

import App from './../index';
import React from 'react';
import useCurrentUser from '../../hooks/useCurrentUser';
import {useProcosysContext} from '../../core/ProcosysContext';

jest.mock('../../core/ProcosysContext');

jest.mock('../../hooks/useCurrentUser');

describe('Renders <App />', () => {
    useProcosysContext.mockImplementation(() => ({auth: {login: jest.fn()}}));

    it('Renders login when not signed in', async () => {
        useCurrentUser.mockImplementation(() => null);
        const { getByTitle } = render(<App />);
        const lazyElement = await waitForElement(() => getByTitle('Loading'));
        expect(lazyElement).toBeInTheDocument();
    });

    it('Automatically tries to login the user on load', async () => {
        const fakeLoginInterceptor = jest.fn();
        useProcosysContext.mockImplementation(() => ({auth: {login: fakeLoginInterceptor}}));
        useCurrentUser.mockImplementation(() => null);
        render(<App />);
        expect(fakeLoginInterceptor).toBeCalledTimes(1);
    });

    it('Does not try to login user when already logged in', async () => {
        const fakeLoginInterceptor = jest.fn();
        useProcosysContext.mockImplementation(() => ({auth: {login: fakeLoginInterceptor}}));
        useCurrentUser.mockImplementation(() => ({}));
        render(<App />);
        expect(fakeLoginInterceptor).toBeCalledTimes(0);
    });

    it('Renders application when signed in', async () => {
        useCurrentUser.mockImplementation(() => ({}));
        const { getByText } = render(<App />);
        const lazyElement = await waitForElement(() => getByText('TODO: Select first plant in list of available plants for user'));
        expect(lazyElement).toBeInTheDocument();
    });

});

