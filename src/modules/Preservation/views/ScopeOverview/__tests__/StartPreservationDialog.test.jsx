import React from 'react';
import StartPreservationDialog from '../Dialogs/StartPreservationDialog';
import { render } from '@testing-library/react';

const startableTags = [
    {
        tagNo: 'tagNo1',
        readyToBeStarted: true,
        isVoided: false,
        description: 'Tag description 1',
        status: 'NotStarted',
        requirements: [{ id: 1, requirementTypeCode: 'Grease' }],
    },
];

const nonStartableTags = [
    {
        tagNo: 'tagNo2',
        readyToBeStarted: false,
        isVoided: false,
        description: 'Tag description 2',
        status: 'Active',
        requirements: [{ id: 1, requirementTypeCode: 'Grease' }],
    },
];

describe('<StartPreservationDialog />', () => {
    it('Should only display nonstartable tags when no startable tags are selected', async () => {
        const { queryByText } = render(
            <StartPreservationDialog
                startableTags={[]}
                nonStartableTags={nonStartableTags}
            />
        );
        expect(queryByText('tagNo2')).toBeInTheDocument();
        expect(queryByText('1 tag(s) will not be started')).toBeInTheDocument();
        expect(queryByText('1 tag(s) will be started')).not.toBeInTheDocument();
    });

    it('Should display all tags when startable and nonstartable tags are selected', async () => {
        const { queryByText } = render(
            <StartPreservationDialog
                startableTags={startableTags}
                nonStartableTags={nonStartableTags}
            />
        );
        expect(queryByText('tagNo1')).toBeInTheDocument();
        expect(queryByText('tagNo2')).toBeInTheDocument();
        expect(queryByText('1 tag(s) will not be started')).toBeInTheDocument();
        expect(queryByText('1 tag(s) will be started')).toBeInTheDocument();
    });

    it('Should render with only render information about startable tag when no nonstartable tags are selected', async () => {
        const { queryByText } = render(
            <StartPreservationDialog
                startableTags={startableTags}
                nonStartableTags={[]}
            />
        );
        expect(queryByText('1 tag(s) will be started')).toBeInTheDocument();
        expect(queryByText('tagNo1')).toBeInTheDocument();
        expect(queryByText('1 tag(s) will not be started')).toBeNull();
        expect(
            queryByText(
                '1 tag(s) cannot be started. Tags are already started, or are voided.'
            )
        ).not.toBeInTheDocument();
    });
});
