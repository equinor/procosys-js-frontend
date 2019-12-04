import App from './../index';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';
import {useProcosysContext} from '../../core/ProcosysContext';

jest.mock('../../core/ProcosysContext');

jest.mock('../../http/ProCoSysClient', () => {
    return () => ({
        getAllPlantsForUserAsync: () => Promise.resolve([]),
    });
});

describe('Renders <App /> when not authenticated', () => {
    useProcosysContext.mockImplementation(() => ({auth: {login: jest.fn(), getCurrentUser: () => null}}));

    it('Renders login when not signed in', () => {
        const { getByTitle } = render(<App />);
        expect(getByTitle('Loading')).toBeInTheDocument();
    });

    it('Automatically tries to login the user on load', () => {
        const fakeLoginInterceptor = jest.fn();
        useProcosysContext.mockImplementation(() => ({auth: {login: fakeLoginInterceptor, getCurrentUser: () => null}}));
        render(<App />);
        expect(fakeLoginInterceptor).toBeCalledTimes(1);
    });
    useProcosysContext.mockRestore();
});

describe('Renders <App /> when authenticated', () => {
    const fakeLoginInterceptor = jest.fn();
    useProcosysContext.mockImplementation(() => ({auth: {login: fakeLoginInterceptor, getCurrentUser: () => ({ })}}));
    it('Does not try to login user when already logged in', async () => {

        await act(async () => {
            render(<App />);
        });
        expect(fakeLoginInterceptor).toBeCalledTimes(0);
    });

    it('Renders Plant Selector when signed in, without plant access', async () => {
        useProcosysContext.mockImplementation(() => ({auth: {getCurrentUser: () => ({ })}}));
        let renderedContainer = null;
        await act(async () => {
            const {container} = render(<App />);
            renderedContainer = container;
        });
        expect(renderedContainer.textContent).toContain('You dont seem to have an account in ProCoSys - use AccessIT to request access');
    });

});
