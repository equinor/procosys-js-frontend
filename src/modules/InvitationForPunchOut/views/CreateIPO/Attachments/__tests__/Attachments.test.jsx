import { render } from '@testing-library/react';
import React from 'react';
import Attachments from '../Attachments';

const attachmentsMock = [
    {
        name: 'Attachment 1',
    },
    {
        name: 'Attachment 2'
    }
];

describe('Module: <Attachments />', () => {
    
    it('Should render Next button enabled', () => {
        const { getByText } = render(<Attachments attachments={[]} />);
        expect(getByText('Next').closest('button')).toHaveProperty('disabled', false);
    });

    it('Should render Previous button enabled', () => {
        const { getByText } = render(<Attachments attachments={[]}/>);
        expect(getByText('Previous').closest('button')).toHaveProperty('disabled', false);
    });

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
