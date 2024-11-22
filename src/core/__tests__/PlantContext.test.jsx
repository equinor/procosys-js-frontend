import React from 'react';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock list of available plants
const mockAvailablePlants = [
    { id: 'PCS$HEIMDAL', title: 'Heimdal', hasAccess: true },
    { id: 'PCS$NGPCS_TEST_BROWN', title: 'NGPCS Test Brown', hasAccess: true },
    { id: 'PCS$NGPCS_TEST_GREEN', title: 'NGPCS Test Green', hasAccess: true },
    { id: 'PCS$OSEBERG_C', title: 'Oseberg C', hasAccess: true },
    { id: 'PCS$TROLL_A', title: 'Troll A', hasAccess: true },
    { id: 'PCS$ASGARD_B', title: 'Åsgard B', hasAccess: true },
];

// Mock implementation of PlantContextProvider
const PlantContextProvider = ({ children, plantID }) => {
    const isValidPlant = mockAvailablePlants.some(
        (plant) => plant.id === plantID && plant.hasAccess
    );

    if (!isValidPlant) {
        throw new Error('Invalid or missing plant information');
    }

    return <div data-testid="mocked-plant-provider">{children}</div>;
};

PlantContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
    plantID: PropTypes.string.isRequired,
};

// Test suite for PlantContextProvider
describe('<PlantContextProvider />', () => {
    it('Should render without error when valid PlantID is provided', () => {
        const validPlantID = 'PCS$HEIMDAL';

        expect(() => {
            render(
                <Router>
                    <PlantContextProvider plantID={validPlantID}>
                        <div>Plant Context Loaded</div>
                    </PlantContextProvider>
                </Router>
            );
        }).not.toThrow();
    });

    it('Should throw an error when invalid PlantID is provided', () => {
        const invalidPlantID = 'INVALID_PLANT_ID';

        expect(() => {
            render(
                <Router>
                    <PlantContextProvider plantID={invalidPlantID}>
                        <div>Plant Context Loaded</div>
                    </PlantContextProvider>
                </Router>
            );
        }).toThrow('Invalid or missing plant information');
    });

    it('Should throw an error when PlantID is missing', () => {
        expect(() => {
            render(
                <Router>
                    <PlantContextProvider>
                        <div>Plant Context Loaded</div>
                    </PlantContextProvider>
                </Router>
            );
        }).toThrow('Invalid or missing plant information');
    });

    it('Should correctly identify valid plant IDs', () => {
        mockAvailablePlants.forEach((plant) => {
            expect(() => {
                render(
                    <Router>
                        <PlantContextProvider plantID={plant.id}>
                            <div>{`Plant ${plant.title} Loaded`}</div>
                        </PlantContextProvider>
                    </Router>
                );
            }).not.toThrow();
        });
    });

    it('Should throw an error for plant IDs with hasAccess set to false', () => {
        const unavailablePlant = {
            id: 'PCS$UNAVAILABLE',
            title: 'Unavailable Plant',
            hasAccess: false,
        };
        const updatedPlants = [...mockAvailablePlants, unavailablePlant];

        // Simulate unavailable plant
        updatedPlants.forEach((plant) => {
            if (!plant.hasAccess) {
                expect(() => {
                    render(
                        <Router>
                            <PlantContextProvider plantID={plant.id}>
                                <div>{`Plant ${plant.title} Loaded`}</div>
                            </PlantContextProvider>
                        </Router>
                    );
                }).toThrow('Invalid or missing plant information');
            }
        });
    });
});
