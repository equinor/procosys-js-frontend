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
    useHistory: () => { }
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

const tableData = [
    {
        tagNo: 'tagno-test',
        description: 'description-test',
        purchaseOrderTitle: 'pono-test',
        commPkgNo: 'commpkg-test',
        mcPkgNo: 'mcpkgno-test',
        isPreserved: false
    }
];

describe('Module: <SelectTags />', () => {

    it('Should render Next button disabled when no rows are selected', () => {
        const { getByText } = render(<SelectTags selectedTags={[]} scopeTableData={[]} setSelectedTags={() => void 0} setSelectedTableRows={() => void 0} />);
        expect(getByText('Next').closest('button')).toHaveProperty('disabled', true);
    });

    it('Should render Next button enabled when rows are selected', () => {
        const selectedTags = [
            { 'tagNo': 'test' }
        ];

        const { getByText } = render(<SelectTags selectedTags={selectedTags} scopeTableData={tableData} setSelectedTags={() => void 0} setSelectedTableRows={() => void 0} />);

        expect(getByText('Next').closest('button')).toHaveProperty('disabled', false);
    });

    it('Should render Tag info in table', () => {
        const { getByText } = render(<SelectTags selectedTags={[]} scopeTableData={tableData} setSelectedTags={() => void 0} setSelectedTableRows={() => void 0} />);

        expect(getByText('tagno-test')).toBeInTheDocument();
        expect(getByText('description-test')).toBeInTheDocument();
        expect(getByText('pono-test')).toBeInTheDocument();
        expect(getByText('commpkg-test')).toBeInTheDocument();
        expect(getByText('mcpkgno-test')).toBeInTheDocument();
    });

    it('Should update selected tags when clicking checkbox in table', () => {
        const selectedTags = [];
        let i = 0;

        const setSelectedTags = () => {
            // this gets called when setting up the test - ignore the first time.
            if (i === 0) {
                i++;
                return;
            }
            selectedTags.push({ tagNo: 'test' });
        };

        const { container } = render(
            <SelectTags
                selectedTags={selectedTags}
                scopeTableData={tableData}
                setSelectedTags={setSelectedTags}
                setSelectedTableRows={() => 1}
            />);

        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        fireEvent.click(checkboxes[1]); // fist checkbox after "select all"
        expect(selectedTags.length).toBe(1);
    });

    it('Should render Tag info in table', () => {
        const { getByText } = render(<SelectTags selectedTags={[]} scopeTableData={tableData} setSelectedTags={() => void 0} setSelectedTableRows={() => void 0} />);

        expect(getByText('tagno-test')).toBeInTheDocument();
        expect(getByText('description-test')).toBeInTheDocument();
        expect(getByText('pono-test')).toBeInTheDocument();
        expect(getByText('commpkg-test')).toBeInTheDocument();
        expect(getByText('mcpkgno-test')).toBeInTheDocument();
    });

    it('Should not render search field when add-scope-method is autoscope.', () => {
        const { queryByText } = render(<SelectTags selectedTags={[]} scopeTableData={tableData} addScopeMethod='AddTagsAutoscope' setSelectedTags={() => void 0} setSelectedTableRows={() => void 0} />);
        expect(queryByText('Type the start of a tag number and press enter to load tags. Note: Minimum two characters are required.')).not.toBeInTheDocument();
    });

    it('Should render search field when add-scope-method is manually', () => {
        const { queryByText } = render(<SelectTags selectedTags={[]} scopeTableData={tableData} addScopeMethod='AddTagsManually' setSelectedTags={() => void 0} setSelectedTableRows={() => void 0} />);
        expect(queryByText('Type the start of a tag number and press enter to load tags. Note: Minimum two characters are required.')).toBeInTheDocument();
    });

});
