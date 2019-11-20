import { render, waitForElement } from '@testing-library/react';

import App from './../index';
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

jest.mock('../../contexts/AuthContext');

describe('Initial module loading on application render', () => {

    it('Renders login when not signed in', async () => {
        const resp = {
            account: null,
            login: () => null,
            handleRedirectCallback: () => null
        };
        useAuth.mockImplementation(() => resp);
        const { getByText } = render(<App />);
        const lazyElement = await waitForElement(() => getByText('Login'));
        expect(lazyElement).toBeInTheDocument();
    });

    it('Renders application when signed in', async () => {
        const resp = {
            account: { name: 'Darth Vader' },
            handleRedirectCallback: () => null
        };
        useAuth.mockImplementation(() => resp);
        const { getByText } = render(<App />);
        const lazyElement = await waitForElement(() => getByText('No plant selected'));
        expect(lazyElement).toBeInTheDocument();
    });

});

