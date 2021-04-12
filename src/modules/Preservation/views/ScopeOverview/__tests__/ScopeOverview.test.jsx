import React from 'react';
import ScopeOverview from '../ScopeOverview';
import { render, screen } from '@testing-library/react';
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
                getSavedTagListFilters: () => Promise.resolve([]),
                getPreservedTags: () => Promise.resolve(mockTags)
            }
        };
    }
}));

const mockSetDirtyStateFor = jest.fn();
const mockUnsetDirtyStateFor = jest.fn();

jest.mock('@procosys/core/DirtyContext', () => ({
    useDirtyContext: () => {
        return {
            setDirtyStateFor: mockSetDirtyStateFor,
            unsetDirtyStateFor: mockUnsetDirtyStateFor
        };
    }
}));

describe('<ScopeOverview />', () => {

    it('Should display description column', async () => {
        const history = createMemoryHistory();
        render(
            <Router history={history}>
                <ScopeOverview />
            </Router>
        );     
        const description = await screen.findByText('Description');   
        expect(description).toBeInTheDocument();   
    });
    
});