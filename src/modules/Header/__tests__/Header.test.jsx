import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Header from '../index';
import '@testing-library/jest-dom';

/* eslint-disable */
global.__DEV__ = true;

jest.mock('@procosys/core/ProCoSysSettings', () => ({
    featureIsEnabled: (feature) => feature === 'IPO',
}));

jest.mock('../../../core/UserContext', () => ({
    useCurrentUser: () => ({
        name: 'Test User',
        plants: [{ id: 'PCS$OSEBERG_C', title: 'Oseberg C' }],
    }),
}));

jest.mock('../../../core/PlantContext', () => ({
    useCurrentPlant: () => ({
        plant: { id: 'OSEBERG_C', title: 'Oseberg C', pathId: 'OSEBERG_C' },
        setCurrentPlant: jest.fn(),
    }),
}));

jest.mock('../../../core/ProcosysContext', () => ({
    useProcosysContext: () => ({
        auth: { logout: jest.fn() },
    }),
}));

jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        ...originalModule,
        useParams: () => ({ plant: 'OSEBERG_C' }),
    };
});

test('nawiguje do "Invitation for punch-out" po kliknięciu w link', () => {
    const handleClick = jest.fn();

    render(
        <MemoryRouter initialEntries={['/OSEBERG_C']}>
            <Routes>
                <Route path="/OSEBERG_C" element={<Header />} />
                <Route
                    path="/OSEBERG_C/InvitationForPunchOut"
                    element={<div>Invitation for punch-out</div>}
                />
            </Routes>
        </MemoryRouter>
    );

    const searchDropdown = screen.getByText('Search');
    fireEvent.click(searchDropdown);

    const invitationLink = screen.getByText(/Invitation for punch-out/i);

    invitationLink.onclick = handleClick;
    fireEvent.click(invitationLink);

    expect(handleClick).toHaveBeenCalled();
});
