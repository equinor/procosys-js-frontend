import { render, waitForElement } from '@testing-library/react';

import App from './../index';
import React from 'react';
import useCurrentUser from '../../hooks/useCurrentUser';

jest.mock('../../hooks/useCurrentUser');

describe('Initial module loading on application render', () => {

    it('Renders login when not signed in', async () => {
        useCurrentUser.mockImplementation(() => null);
        const { getByText } = render(<App />);
        const lazyElement = await waitForElement(() => getByText('Login'));
        expect(lazyElement).toBeInTheDocument();
    });

    it('Renders application when signed in', async () => {
        const resp = {};
        useCurrentUser.mockImplementation(() => resp);
        const { getByText } = render(<App />);
        const lazyElement = await waitForElement(() => getByText('TODO: Select first plant in list of available plants for user'));
        expect(lazyElement).toBeInTheDocument();
    });

});

