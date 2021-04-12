import AttachmentList from '../index';
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const attachmentsMock = [
    {
        fileName: 'Attachment 1',
        id: 1,
        rowVersion: '1'
    },
    {
        fileName: 'Attachment 2',
        id: 2,
        rowVersion: '2'
    },
    {
        fileName: 'Attachment 3',
        id: 3,
        rowVersion: '3'
    }
];

const downloadAttachment = jest.fn();
const addAttachments = jest.fn();

describe('<AttachmentList />', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should render an empty table if there are no attachments', () => {
        const { queryByText } = render(
            <AttachmentList 
                attachments={[]}
                disabled={false}
                downloadAttachment={downloadAttachment}
            />
        );
        expect(queryByText('No records to display')).toBeInTheDocument();
    });

    it('Should render attachments in table', () => {
        const { queryByText } = render(
            <AttachmentList 
                attachments={attachmentsMock}
                disabled={false}
                downloadAttachment={downloadAttachment}
            />
        );
        expect(queryByText('No records to display')).not.toBeInTheDocument();
        expect(queryByText('Attachment 1')).toBeInTheDocument();
        expect(queryByText('Attachment 2')).toBeInTheDocument();
        expect(queryByText('Attachment 3')).toBeInTheDocument();
    });

    it('Should render "add files" button and DragAndDropField if an addAttachments prop is passed', () => {
        const { queryByText } = render(
            <AttachmentList 
                attachments={attachmentsMock}
                disabled={false}
                addAttachments={addAttachments}
                downloadAttachment={downloadAttachment}
            />
        );
        expect(queryByText('Add files')).toBeInTheDocument();
        expect(queryByText('Drag and drop to add files, or click on the button below')).toBeInTheDocument();
    });

    it('Should not render the "add files" button and DragAndDropField if an addAttachments prop is not passed', () => {
        const { queryByText } = render(
            <AttachmentList 
                attachments={attachmentsMock}
                disabled={false}
                downloadAttachment={downloadAttachment}
            />
        );
        expect(queryByText('Add files')).not.toBeInTheDocument();
        expect(queryByText('Drag and drop to add files, or click on the button above')).not.toBeInTheDocument();
    });

    it('Should call the addAttachments function if a file is uploaded using "add files" button', () => {
        const file = new File([''], 'test.png', { type: 'image/png' });
        const { getByTestId } = render(
            <AttachmentList 
                attachments={attachmentsMock}
                disabled={false}
                addAttachments={addAttachments}
                downloadAttachment={downloadAttachment}
            />
        );
        const addFilesInput = getByTestId('addFile');
        expect(addFilesInput).toBeInTheDocument();
        userEvent.upload(addFilesInput, file);
        expect(addAttachments).toHaveBeenCalledTimes(1);
    });

    // TODO: after the table component has been finished, is possible to add a test id to the delete buttons then
    it.todo('Should call the deleteAttachment function if a delete button is clicked');

    it('Should call the downloadAttachment function if a filename is clicked', () => {
        const { getByText } = render(
            <AttachmentList 
                attachments={attachmentsMock}
                disabled={false}
                addAttachments={addAttachments}
                downloadAttachment={downloadAttachment}
            />
        );
        const fileName = getByText('Attachment 1');
        expect(fileName).toBeInTheDocument();
        fireEvent.click(fileName);
        expect(downloadAttachment).toHaveBeenCalledTimes(1);
    });

    it.todo('Should render with more details if it\'s the large version');
});
