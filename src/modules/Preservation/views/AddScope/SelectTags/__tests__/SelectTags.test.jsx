import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import SelectTags from '../SelectTags';

jest.mock('../../../../context/PreservationContext', () => ({
    usePreservationContext: jest.fn(() => {
        return {
            project: {
                id: 1,
                name: 'test',
                description: 'project'
            }
        };
    })
}));

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(() => {
        return {};
    })
}));

const tableData = [
    {
        tagNo: 'tagno-test',
        description: 'description-test',
        purchaseOrderNumber: 'pono-test',
        commPkgNo: 'commpkg-test',
        mcPkgNo: 'mcpkgno-test',
        isPreserved: false
    }
];

describe('Module: <SelectTags />', () => {
    
    it('Should render Next button disabled when no rows are selected', () => {
        const { getByText } = render(<SelectTags selectedTags={[]} />);
        expect(getByText('Next')).toHaveProperty('disabled', true);
    });

    it('Should render Next button enabled when rows are selected', () => {
        const selectedTags = [
            { 'tagNo': 'test' }
        ];

        const { getByText } = render(<SelectTags selectedTags={selectedTags} />);

        expect(getByText('Next')).toHaveProperty('disabled', false);
    });

    it('Should render Tag info in table', () => {
        const { getByText } = render(<SelectTags selectedTags={[]} scopeTableData={tableData} />);

        expect(getByText('tagno-test')).toBeInTheDocument();
        expect(getByText('description-test')).toBeInTheDocument();
        expect(getByText('pono-test')).toBeInTheDocument();
        expect(getByText('commpkg-test')).toBeInTheDocument();
        expect(getByText('mcpkgno-test')).toBeInTheDocument();
    });

    it('Should update selected tags when clicking checkbox in table', () => {
        const selectedTags = [];

        const { container, getByText } = render(
            <SelectTags 
                selectedTags={selectedTags} 
                scopeTableData={tableData}
                setSelectedTags={jest.fn(() => {
                    selectedTags.push({ tagNo: 'test'});
                })}
            />);

        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        fireEvent.click(checkboxes[1]); // fist checkbox after "select all"

        expect(getByText('1 tags selected')).toBeInTheDocument();
        expect(selectedTags.length).toBe(1);
    });

    it('Should render Tag info in table', () => {
        const { getByText } = render(<SelectTags selectedTags={[]} scopeTableData={tableData} />);

        expect(getByText('tagno-test')).toBeInTheDocument();
        expect(getByText('description-test')).toBeInTheDocument();
        expect(getByText('pono-test')).toBeInTheDocument();
        expect(getByText('commpkg-test')).toBeInTheDocument();
        expect(getByText('mcpkgno-test')).toBeInTheDocument();
    });

    it('Should not render search field when add-scope-method is autoscope.', () => {
        const { queryByText } = render(<SelectTags selectedTags={[]} scopeTableData={tableData} addScopeMethod='AddTagsAutoscope' />);
        expect(queryByText('Type the start of a tag number and press enter to load tags')).not.toBeInTheDocument();
    });

    it('Should render search field when add-scope-method is manually', () => {
        const { queryByText } = render(<SelectTags selectedTags={[]} scopeTableData={tableData} addScopeMethod='AddTagsManually' />);
        expect(queryByText('Type the start of a tag number and press enter to load tags')).toBeInTheDocument();
    });

});
