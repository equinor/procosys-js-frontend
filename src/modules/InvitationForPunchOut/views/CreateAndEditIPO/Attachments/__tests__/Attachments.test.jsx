import Attachments from '../Attachments';
import React from 'react';
import { render } from '@testing-library/react';

const attachmentsMock = [
    {
        fileName: 'Attachment 1'
    },
    {
        fileName: 'Attachment 2'
    },
    {
        fileName: 'Attachment 3', toBeDeleted: true
    }
];

describe('Module: <Attachments />', () => {
    it('Should render embty table when no attachments', () => {
        const { getByText } = render(<Attachments attachments={[]}/>);
        expect(getByText('No records to display')).toBeInTheDocument();
    });

    it('Should render attachments in table, but should hide those that are to be deleted', () => {
        const { queryByText } = render(<Attachments attachments={attachmentsMock}/>);
        expect(queryByText('Attachment 1')).toBeInTheDocument();
        expect(queryByText('Attachment 2')).toBeInTheDocument();
        expect(queryByText('Attachment 3')).not.toBeInTheDocument();        
    });
});
