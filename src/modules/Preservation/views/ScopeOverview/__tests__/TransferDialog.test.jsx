import React from 'react';
import TransferDialog from '../TransferDialog';
import { render, act } from '@testing-library/react';


const transferableTags = [
    {
        tagNo: 'tagNo1',
        readyToBeTransferred: true,
        description: 'Tag description 1',
        status: 'Active',
        requirements: [{id: 1, requirementTypeCode: 'Grease'}],
    }
];

const nonTransferableTags = [
    {
        tagNo: 'tagNo2',
        readyToBeTransferred: false,
        description: 'Tag description 2',
        status: 'Active',
        requirements: [{id: 1, requirementTypeCode: 'Grease'}],
    }
];

describe('<TransferDialog />', () => {

    /** Because of API calls using effect hooks, we need to wrap everything in act */
    it('Should only display nontransferable tags when no transferable tags are selected', async () => {
        await act(async () => {
            const { queryByText } = render(<TransferDialog transferableTags={[]} nonTransferableTags={nonTransferableTags} />);
            expect(queryByText('tagNo2')).toBeInTheDocument();
            expect(queryByText('1 tag(s) will not be transferred')).toBeInTheDocument();
            expect(queryByText('1 tag(s) will be transferred')).not.toBeInTheDocument();
        });
    });

    it('Should display all tags when transferable and nontransferable tags are selected', async () => {
        await act(async () => {
            const { queryByText } = render(<TransferDialog transferableTags={transferableTags} nonTransferableTags={nonTransferableTags} />);
            expect(queryByText('tagNo1')).toBeInTheDocument();
            expect(queryByText('tagNo2')).toBeInTheDocument();
            expect(queryByText('1 tag(s) will not be transferred')).toBeInTheDocument();
            expect(queryByText('1 tag(s) will be transferred')).toBeInTheDocument();
        });
    });

    it('Should render with only render information about transferable tag when no transferable tags are selected', async () => {
        await act(async () => {
            const { queryByText } = render(<TransferDialog transferableTags={transferableTags} nonTransferableTags={[]} />);
            expect(queryByText('tagNo1')).toBeInTheDocument();
            expect(queryByText('1 tag(s) will be transferred')).toBeInTheDocument();
            expect(queryByText('1 tag(s) will not be transferred')).not.toBeInTheDocument();
        });
    });
});

