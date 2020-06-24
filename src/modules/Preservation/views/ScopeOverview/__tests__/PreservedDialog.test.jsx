import React from 'react';
import PreservedDialog from '../PreservedDialog';
import { render } from '@testing-library/react';


const preservableTags = [
    {
        tagNo: 'tagNo1',
        readyToBePreserved: true,
        isVoided: false,
        description: 'Tag description 1',
        status: 'Active',
        requirements: [{id: 1, requirementTypeCode: 'Grease'}],
    }
];

const nonPreservableTags = [
    {
        tagNo: 'tagNo2',
        readyToBePreserved: false,
        isVoided:false,
        description: 'Tag description 2',
        status: 'Active',
        requirements: [{id: 1, requirementTypeCode: 'Grease'}],
    }
];

describe('<PreservedDialog />', () => {

    it('Should only display nonpreservable tags when no preservable tags are selected', async () => {
        const { queryByText } = render(<PreservedDialog preservableTags={[]} nonPreservableTags={nonPreservableTags} />);
        expect(queryByText('tagNo2')).toBeInTheDocument();
        expect(queryByText('1 tag(s) will not be preserved for this week')).toBeInTheDocument();
        expect(queryByText('1 tag(s) will be preserved for this week')).not.toBeInTheDocument();
    });

    it('Should display all tags when preservable and nonpreservable tags are selected', async () => {
        const { queryByText } = render(<PreservedDialog preservableTags={preservableTags} nonPreservableTags={nonPreservableTags} />);
        expect(queryByText('tagNo1')).toBeInTheDocument();
        expect(queryByText('tagNo2')).toBeInTheDocument();
        expect(queryByText('1 tag(s) will not be preserved for this week')).toBeInTheDocument();
        expect(queryByText('1 tag(s) will be preserved for this week')).toBeInTheDocument();
    });

    it('Should render with only render information about preservable tag when no preservable tags are selected', async () => {
        const { queryByText } = render(<PreservedDialog preservableTags={preservableTags} nonPreservableTags={[]} />);
        expect(queryByText('tagNo1')).toBeInTheDocument();
        expect(queryByText('1 tag(s) will be preserved for this week')).toBeInTheDocument();
        expect(queryByText('1 tag(s) will not be preserved for this week')).not.toBeInTheDocument();
    });
});

