import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ModuleTabs from '../ModuleTabs';
import '@testing-library/jest-dom';

// Define __DEV__ for the test environment
/* eslint-disable */
global.__DEV__ = true;

test('nawiguje do strony Preservation po kliknięciu na link', () => {
    render(
        <MemoryRouter initialEntries={['/OSEBERG_C']}>
            <Routes>
                <Route path="/OSEBERG_C" element={<ModuleTabs />} />
                <Route
                    path="/OSEBERG_C/preservation"
                    element={<div>Preservation Page</div>}
                />
            </Routes>
        </MemoryRouter>
    );

    // Find and click the Preservation link
    const preservationLink = screen.getByRole('link', {
        name: /Preservation/i,
    });
    fireEvent.click(preservationLink);

    // Check if the Preservation page is rendered by looking for unique text on that page
    expect(screen.getByText(/Preservation Page/i)).toBeInTheDocument();
});
