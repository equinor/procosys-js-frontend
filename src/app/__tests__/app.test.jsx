import App from './../index';
import ProCoSysClient from '../../http/ProCoSysClient';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';
import { useProcosysContext } from '../../core/ProcosysContext';

jest.mock('../../core/ProcosysContext');

jest.mock('../../http/ProCoSysClient', () => {
    return () => ({
        getAllPlantsForUserAsync: () => Promise.resolve([]),
    });
});

describe('Renders <App /> when authenticated', () => {
    const fakeLoginInterceptor = jest.fn();
    useProcosysContext.mockImplementation(() => ({
        auth: { login: fakeLoginInterceptor, getCurrentUser: () => ({}) },
    }));
    it('Does not try to login user when already logged in', async () => {
        await act(async () => {
            render(<App />);
        });
        expect(fakeLoginInterceptor).toBeCalledTimes(0);
    });

    it('Renders Plant Selector when signed in, without plant access', async () => {
        useProcosysContext.mockImplementation(() => ({
            auth: { getCurrentUser: () => ({}) },
            procosysApiClient: ProCoSysClient(),
        }));
        let renderedContainer = null;
        await act(async () => {
            const { container } = render(<App />);
            renderedContainer = container;
        });
        expect(renderedContainer.textContent).toContain(
            'You dont seem to have an account in ProCoSys - use AccessIT to request access'
        );
    });
});
