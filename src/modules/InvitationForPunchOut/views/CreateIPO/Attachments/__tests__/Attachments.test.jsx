import Attachments from '../Attachments';
import React from 'react';
import { render } from '@testing-library/react';

const attachmentsMock = [
    {
        name: 'Attachment 1',
    },
    {
        name: 'Attachment 2'
    }
];

describe('Module: <Attachments />', () => {

    it('Should render embty table when no attachments', () => {
        const { getByText } = render(<Attachments attachments={[]}/>);
        expect(getByText('No records to display')).toBeInTheDocument();
    });

    it('Should render attachments in table', () => {
        const { getByText } = render(<Attachments attachments={attachmentsMock}/>);
        expect(getByText('Attachment 1')).toBeInTheDocument();
        expect(getByText('Attachment 2')).toBeInTheDocument();
    });
});
