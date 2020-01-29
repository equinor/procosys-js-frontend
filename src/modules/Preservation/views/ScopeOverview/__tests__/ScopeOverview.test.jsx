// import { render } from '@testing-library/react';
// import React from 'react';

// import ScopeOverview from '../ScopeOverview';

jest.mock('../../../context/PreservationContext', () => ({
    usePreservationContext: jest.fn(() => {
        return {
            project: {
                description: 'test project'
            }
        };
    })
}));


describe('Module: <ScopeOverview />', () => {

    it('Should show list of preserved tags', () => {
        //todo
    });

    it('Start preservation button should be disabled when Active tags are selected', () => {
        //todo
    });

    it('Start preservation button should be enabled when NotStarted tags are selected', () => {
        //todo
    });
});