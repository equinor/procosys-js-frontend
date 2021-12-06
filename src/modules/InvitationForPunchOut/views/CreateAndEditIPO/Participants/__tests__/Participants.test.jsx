import { render, waitFor } from '@testing-library/react';

import Participants from '../Participants';
import React from 'react';

const participants = [
    {
        organization: 'Contractor',
        externalEmail: null,
        person: null,
        role: null,
    },
    {
        organization: 'Construction company',
        externalEmail: null,
        person: null,
        role: null,
    },
];

describe('Module: <Participants />', () => {
    it('Should render participants', async () => {
        const { getAllByText } = render(
            <Participants participants={participants} isValid={false} />
        );
        await waitFor(() =>
            expect(getAllByText('Organization').length).toBe(2)
        );
        await waitFor(() => expect(getAllByText('Type').length).toBe(2));
        await waitFor(() => expect(getAllByText('Select').length).toBe(2));
    });
});
