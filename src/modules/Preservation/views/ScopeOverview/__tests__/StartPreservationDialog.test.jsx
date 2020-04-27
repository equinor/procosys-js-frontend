import React from 'react';
import StartPreservationDialog from '../StartPreservationDialog';
import { render, act } from '@testing-library/react';


const startableTags = [
    {
        tagNo: 'tagNo1',
        readyToBeStarted: true,
        description: 'Tag description 1',
        status: 'NotStarted',
        requirements: [{id: 1, requirementTypeCode: 'Grease'}],
    }
];

const nonStartableTags = [
    {
        tagNo: 'tagNo2',
        readyToBeStarted: false,
        description: 'Tag description 2',
        status: 'Active',
        requirements: [{id: 1, requirementTypeCode: 'Grease'}],
    }
];

describe('<StartPreservationDialog />', () => {

    /** Because of API calls using effect hooks, we need to wrap everything in act */
    it('Should only display nonstartable tags when no startable tags are selected', async () => {
        await act(async () => {
            const { queryByText } = render(<StartPreservationDialog startableTags={[]} nonStartableTags={nonStartableTags} />);
            expect(queryByText('tagNo2')).toBeInTheDocument();
            expect(queryByText('1 tag(s) will not be started')).toBeInTheDocument();
            expect(queryByText('1 tag(s) will be started')).not.toBeInTheDocument();
        });
    });

    it('Should display all tags when startable and nonstartable tags are selected', async () => {
        await act(async () => {
            const { queryByText } = render(<StartPreservationDialog startableTags={startableTags} nonStartableTags={nonStartableTags} />);
            expect(queryByText('tagNo1')).toBeInTheDocument();
            expect(queryByText('tagNo2')).toBeInTheDocument();
            expect(queryByText('1 tag(s) will not be started')).toBeInTheDocument();
            expect(queryByText('1 tag(s) will be started')).toBeInTheDocument();
        });
    });

    it('Should render with only render information about startable tag when no nonstartable tags are selected', async () => {
        await act(async () => {
            const { queryByText } = render(<StartPreservationDialog startableTags={startableTags} nonStartableTags={[]} />);
            expect(queryByText('1 tag(s) will be started')).toBeInTheDocument();
            expect(queryByText('tagNo1')).toBeInTheDocument();
            expect(queryByText('1 tag(s) will not be started')).toBeNull();
            expect(queryByText('1 tag(s) cannot be started.')).not.toBeInTheDocument();
        });
    });
});

