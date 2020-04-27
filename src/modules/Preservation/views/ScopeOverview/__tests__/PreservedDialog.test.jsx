import React from 'react';
import PreservedDialog from '../PreservedDialog';
import { render, act } from '@testing-library/react';


const preservableTags = [
    {
        tagNo: 'tagNo1',
        readyToBePreserved: true,
        description: 'Tag description 1',
        status: 'Active',
        requirements: [{id: 1, requirementTypeCode: 'Grease'}],
    }
];

const nonPreservableTags = [
    {
        tagNo: 'tagNo2',
        readyToBePreserved: false,
        description: 'Tag description 2',
        status: 'Active',
        requirements: [{id: 1, requirementTypeCode: 'Grease'}],
    }
];

describe('<PreservedDialog />', () => {

    /** Because of API calls using effect hooks, we need to wrap everything in act */
    it('Should only display nonpreservable tags when no preservable tags are selected', async () => {
        await act(async () => {
            const { queryByText } = render(<PreservedDialog preservableTags={[]} nonPreservableTags={nonPreservableTags} />);
            expect(queryByText('tagNo2')).toBeInTheDocument();
            expect(queryByText('1 tag(s) will not be preserved for this week')).toBeInTheDocument();
            expect(queryByText('1 tag(s) will be preserved for this week')).not.toBeInTheDocument();
        });
    });

    it('Should display all tags when preservable and nonpreservable tags are selected', async () => {
        await act(async () => {
            const { queryByText } = render(<PreservedDialog preservableTags={preservableTags} nonPreservableTags={nonPreservableTags} />);
            expect(queryByText('tagNo1')).toBeInTheDocument();
            expect(queryByText('tagNo2')).toBeInTheDocument();
            expect(queryByText('1 tag(s) will not be preserved for this week')).toBeInTheDocument();
            expect(queryByText('1 tag(s) will be preserved for this week')).toBeInTheDocument();
        });
    });

    it('Should render with only render information about preservable tag when no preservable tags are selected', async () => {
        await act(async () => {
            const { queryByText } = render(<PreservedDialog preservableTags={preservableTags} nonPreservableTags={[]} />);
            expect(queryByText('tagNo1')).toBeInTheDocument();
            expect(queryByText('1 tag(s) will be preserved for this week')).toBeInTheDocument();
            expect(queryByText('1 tag(s) will not be preserved for this week')).not.toBeInTheDocument();
        });
    });
});

