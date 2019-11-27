import { render, waitForElement } from '@testing-library/react';

import App from './../index';
import ProCoSysClient from '../../http/ProCoSysClient';
import React from 'react';
import { act } from 'react-dom/test-utils';
import useCurrentUser from '../../hooks/useCurrentUser';
import {useProcosysContext} from '../../core/ProcosysContext';

jest.mock('../../core/ProcosysContext');
jest.mock('../../http/ProCoSysClient');

jest.mock('../../hooks/useCurrentUser');

describe('Renders <App />', () => {
    useProcosysContext.mockImplementation(() => ({auth: {login: jest.fn()}}));
    ProCoSysClient.mockImplementation(() => ({
        getAllPlantsForUserAsync: () => []
    }));

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
        act(() => {
            render(<App />);
        });
        expect(fakeLoginInterceptor).toBeCalledTimes(0);
    });

    it('Renders application when signed in', async () => {
        useCurrentUser.mockImplementation(() => ({}));
        const { getByText } = render(<App />);
        let lazyElement = null;
        await act(async () => {
            lazyElement = await waitForElement(() => getByText('You dont have access to any plants'));
        });
        expect(lazyElement).toBeInTheDocument();

    });

});

