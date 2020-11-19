import React from 'react';
import ScopeOverview from '../ScopeOverview';
import { render, act, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';

const mockTags = [{
    maxAvailable: 1,
    tags: [{
        actionStatus: 'active', 
        areaCode: 'areacode',
        calloffNo: 'calloffno',
        commPkgNo: 'commpkno',
        description: 'descripotion',
        disciplineCode: 'T',
        id: 1,
        isNew: false,
        isVoided: false,
        mcPkgNo: 'mcpkgno',
        mode: 'mode',
        nextMode: 'nextMode',
        nextResponsibleCode: 'nextresp',
        purchaseOrderNo: 'purchorderno',
        readyToBePreserved: true,
        readyToBeStarted: false,
        readyToBeTransferred: true,
        readyToBeCompleted: false,
        readyToBeRescheduled: true,
        isInUse: true,
        requirements: [
            {
                id: 1,
                requirementTypeCode: 'Area',
                requirementTypeIcon: 'Area',
                nextDueTimeUtc: '2020-06-24T07:41:29.8405826Z',
                nextDueAsYearAndWeek: '2020w26',
                nextDueWeeks: 10,
                readyToBePreserved: true
            }
        ],
        status: 'Active',
        responsibleCode: '1',
        responsibleDescription: 'respdesc',
        tagFunctionCode: 'tfc',
        tagNo: 'tagno',
        tagType: 'Standard',
        rowVersion: '1',
    }]
}];

const mockProject = {
    id: 1,
    name: 'test',
    description: 'project'
};

jest.mock('../../../context/PreservationContext', () => ({
    usePreservationContext: () => {
        return {
            project: mockProject,
            availableProjects: [mockProject],                
            apiClient: {
                getSavedTagListFilters: () => Promise.resolve(null),
                getPreservedTags: () => Promise.resolve(mockTags)
            }
        };
    }
}));

const resizeWindow = (width, height) => {
    window.innerWidth = width;
    window.innerHeight = height;
    window.dispatchEvent(new Event('resize'));
};

describe('<ScopeOverview />', () => {

    it('Should display all columns on desktop screen', async () => {

        await act(async () => {
            resizeWindow(2000,1000);
            
            const history = createMemoryHistory();
            const { getByText } = render(
                <Router history={history}>
                    <ScopeOverview />
                </Router>
            );
           
            await waitFor(() => expect(getByText('Description')).toBeInTheDocument());
            await waitFor(() => expect(getByText('Show actions')).not.toBeInTheDocument());
        });        
    });

    it('Should display "show actions" button on mobile device and "description" column should not show', async () => {
        await act(async () => {
            resizeWindow(400,1000);
            
            const history = createMemoryHistory();
            const { getByText } = render(
                <Router history={history}>
                    <ScopeOverview />
                </Router>
            );
           
            await waitFor(() => expect(getByText('Description')).not.toBeInTheDocument());
            await waitFor(() => expect(getByText('Show actions')).toBeInTheDocument());
        });        
    });

    
});