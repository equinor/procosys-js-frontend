import React from 'react';
import { render, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import EditTagProperties from '../EditTagProperties';

const mockJourneys = [{
    title: 'Journey 1',
    id: 1,
    isVoided: false,
    steps: [{
        id: 1,
        isVoided: false,
        title: 'stepTitle1',
        mode: {
            id: 1,
            title: 'FABRICATION-1'
        },
        responsible: {
            id: 1,
            name: 'RESP-2'
        }
    }]
},
{
    title: 'Journey 2',
    id: 2,
    isVoided: false,
    steps: [{
        id: 2,
        isVoided: false,
        title: 'stepTitle2',
        mode: {
            id: 2,
            title: 'FABRICATION-1'
        },
        responsible: {
            id: 2,
            name: 'RESP-2'
        }
    }]
}];

const mockRequirementTypes = [
    {
        id: 1,
        code: 'ROTATION',
        title: 'Rotate something',
        isVoided: false,
        sortKey: 10,
        requirementDefinitions: [{
            id: 1,
            title: 'DEF-1',
            isVoided: false,
            needsUserInput: false,
            fields: [{
                id: 1,
                label: 'Messurement',
                isVoided: false,
                fieldType: 'input',
                unit: 'mOHM',
                showPrevious: false
            }]
        }]
    }, 
    {
        id: 1,
        code: 'HEATING',
        title: 'Heating',
        isVoided: false,
        sortKey: 20,
        requirementDefinitions: [{
            id: 2,
            title: 'DEF-2',
            isVoided: false,
            needsUserInput: false,
            fields: [{
                id: 2,
                label: 'Messurement',
                isVoided: false,
                fieldType: 'input',
                unit: 'F',
                showPrevious: false
            }]
        }]
    }];

const mockRequirements = [{
    requirementDefinitionId: -1,
    requirementId: 12,
    intervalWeeks: 2,
    requirementType: {title:'Existing req 1'},
    requirementDefinition: {title:'req 1 title'},
    editingRequirements: true,
    isVoided: false,
    rowVersion: '123vhhj='
}];

const mockTag = {
    id: 111,
    tagNo: 'tag-111',
    description: 'description string',
    status: 'Active',
    journey: {title:'Journey 1'},
    mode: {title:'FABRICATION-1'},
    responsible: {code:'resp'},
    commPkgNo: 'commPkg',
    mcPkgNo: 'mcPkg',
    purchaseOrderNo: 'pono',
    areaCode: '700',
    readyToBePreserved: true,
    remark: 'rem',
    storageArea: 'sa',
    rowVersion: '111vhhhhhj='
};

jest.mock('react-router-dom', () => ({
    useHistory: () => {},
    useParams: () => { return {tagId: 111};}
}));

jest.mock('../../../context/PreservationContext', () => ({
    usePreservationContext: jest.fn(() => {
        return {
            project: {
                id: 1,
                name: 'test',
                description: 'project'
            },
            apiClient: {
                getTagDetails: () => Promise.resolve(mockTag),
                getTagRequirements: () => Promise.resolve(mockRequirements),
                getJourneys: () => Promise.resolve(mockJourneys),
                getRequirementTypes: () => Promise.resolve(mockRequirementTypes),
            },
        };
    })
}));

describe('Module: <EditTagProperties />', () => {

    it('Should render with all editable fields', async () => {
        const { getByTitle, getByText } = render(<EditTagProperties />);
        await waitForElementToBeRemoved(getByTitle('Loading'));

        expect(document.getElementById('Remark')).toBeInTheDocument();
        expect(document.getElementById('StorageArea')).toBeInTheDocument();
        expect(getByText('Preservation journey for selected tag')).toBeInTheDocument();
        expect(getByText('Preservation step')).toBeInTheDocument();
        expect(getByText('Requirements for all selected tags')).toBeInTheDocument();
    });

    it('Should render with tag details', async () => {
        const { getByTitle, getByText } = render(<EditTagProperties />);
        await waitForElementToBeRemoved(getByTitle('Loading'));

        expect(getByText('Editing ' + mockTag.tagNo)).toBeInTheDocument();
        expect(document.getElementById('Remark').nodeValue == mockTag.remark);
        expect(document.getElementById('StorageArea').nodeValue == mockTag.storageArea);
        expect(getByText(mockTag.journey.title)).toBeInTheDocument();
        expect(getByText(mockJourneys[0].steps[0].title)).toBeInTheDocument();
    });

    it('Should render Save button disabled when tag is not edited', async () => {
        const { getByText, getByTitle } = render(<EditTagProperties />);
        await waitForElementToBeRemoved(getByTitle('Loading'));
        expect(getByText('Save').closest('button')).toHaveProperty('disabled', true);
    });

    it('Should render Cancel button enabled', async () => {
        const { getByText, getByTitle } = render(<EditTagProperties />);
        await waitForElementToBeRemoved(getByTitle('Loading'));
        expect(getByText('Cancel').closest('button')).toHaveProperty('disabled', false);
    });

    it('Should render with one unvoided requirement when API returns one requirement for tag', async () => {
        const { getByText, getByTitle, queryAllByText } = render(<EditTagProperties />);
        await waitForElementToBeRemoved(getByTitle('Loading'));

        const req = queryAllByText('Requirement');
        expect(req.length).toBe(1);
        expect(getByText('Void')).toBeInTheDocument();
    });

    it('Should be able to add requirements to requirements-list', async () => {
        const { queryAllByText, getByText, getByTitle } = render(<EditTagProperties />);
        await waitForElementToBeRemoved(getByTitle('Loading'));

        getByText('Add Requirement').click();
        const components = queryAllByText('Requirement');
        expect(expect(components.length).toBe(2));
    });


    it('Should remove requirement input when clicking on delete', async () => {
        const { queryAllByText, getByText, getByTitle } = render(<EditTagProperties />);
        await waitForElementToBeRemoved(getByTitle('Loading'));

        getByText('Add Requirement').click();

        getByTitle('Delete').click();
        const components = queryAllByText('Requirement');
        expect(components.length).toBe(1);
    });

    it('Should void requirement when clicking on void', async () => {
        const { queryAllByText, getByText, getByTitle } = render(<EditTagProperties />);
        await waitForElementToBeRemoved(getByTitle('Loading'));

        getByTitle('Void').click();
        const components = queryAllByText('Requirement');
        expect(components.length).toBe(1);
        expect(getByText('Unvoid')).toBeInTheDocument();
    });

    it('Should enable Save button when changes are made', async () => {
        const { getByText, getByTitle } = render(<EditTagProperties />);
        await waitForElementToBeRemoved(getByTitle('Loading'));

        getByTitle('Void').click();
        await waitFor(() => expect(getByText('Save').closest('button')).toHaveProperty('disabled', false));
    });

});
