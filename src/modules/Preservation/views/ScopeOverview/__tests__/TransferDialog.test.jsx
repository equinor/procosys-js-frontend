import React from 'react';
import TransferDialog from '../Dialogs/TransferDialog';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const transferableTags = [
    {
        tagNo: 'tagNo1',
        readyToBeTransferred: true,
        isVoided: false,
        description: 'Tag description 1',
        status: 'Active',
        requirements: [{ id: 1, requirementTypeCode: 'Grease' }],
    },
];

const nonTransferableTags = [
    {
        tagNo: 'tagNo2',
        readyToBeTransferred: false,
        isVoided: false,
        description: 'Tag description 2',
        status: 'Active',
        requirements: [{ id: 1, requirementTypeCode: 'Grease' }],
    },
];

describe('<TransferDialog />', () => {
    it('Should only display nontransferable tags when no transferable tags are selected', async () => {
        const { queryByText } = render(
            <MemoryRouter>
                <TransferDialog
                    transferableTags={[]}
                    nonTransferableTags={nonTransferableTags}
                />
            </MemoryRouter>
        );
        expect(queryByText('tagNo2')).toBeInTheDocument();
        expect(
            queryByText('1 tag(s) cannot be transferred')
        ).toBeInTheDocument();
        expect(
            queryByText('1 tag(s) will be transferred')
        ).not.toBeInTheDocument();
    });

    it('Should display all tags when transferable and nontransferable tags are selected', async () => {
        const { queryByText } = render(
            <MemoryRouter>
                <TransferDialog
                    transferableTags={transferableTags}
                    nonTransferableTags={nonTransferableTags}
                />
            </MemoryRouter>
        );
        expect(queryByText('tagNo1')).toBeInTheDocument();
        expect(queryByText('tagNo2')).toBeInTheDocument();
        expect(
            queryByText('1 tag(s) cannot be transferred')
        ).toBeInTheDocument();
        expect(queryByText('1 tag(s) will be transferred')).toBeInTheDocument();
    });

    it('Should render with only render information about transferable tag when no transferable tags are selected', async () => {
        const { queryByText } = render(
            <MemoryRouter>
                <TransferDialog
                    transferableTags={transferableTags}
                    nonTransferableTags={[]}
                />
            </MemoryRouter>
        );
        expect(queryByText('tagNo1')).toBeInTheDocument();
        expect(queryByText('1 tag(s) will be transferred')).toBeInTheDocument();
        expect(
            queryByText('1 tag(s) cannot be transferred')
        ).not.toBeInTheDocument();
    });
});
