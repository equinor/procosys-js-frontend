import AttachmentList from '../index';
import React from 'react';
import { fireEvent, render } from '@testing-library/react';

export const attachmentsMock = [
    {
        fileName: 'Attachment 1',
        id: 1,
        rowVersion: '1',
        uploadedBy: {
            id: 1,
            firstName: 'Jane',
            lastName: 'Doe',
            azureOid: 'string',
            email: 'string',
            rowVersion: 'string',
        },
        uploadedAt: new Date(),
    },
    {
        fileName: 'Attachment 2',
        id: 2,
        rowVersion: '2',
        uploadedBy: {
            id: 2,
            firstName: 'Dane',
            lastName: 'Doe',
            azureOid: 'string',
            email: 'string',
            rowVersion: 'string',
        },
        uploadedAt: new Date(),
    },
    {
        fileName: 'Attachment 3',
        id: 3,
        rowVersion: '3',
        uploadedBy: {
            id: 3,
            firstName: 'John',
            lastName: 'Doe',
            azureOid: 'string',
            email: 'string',
            rowVersion: 'string',
        },
        uploadedAt: new Date(),
    },
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
        expect(
            queryByText(
                'Drag and drop to add files, or click on the button below'
            )
        ).toBeInTheDocument();
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
        expect(
            queryByText(
                'Drag and drop to add files, or click on the button above'
            )
        ).not.toBeInTheDocument();
    });

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

    it("Should render with more details if it's the detailed version", () => {
        const { getByText } = render(
            <AttachmentList
                attachments={attachmentsMock}
                disabled={false}
                addAttachments={addAttachments}
                downloadAttachment={downloadAttachment}
                large={true}
                detailed={true}
            />
        );
        const details = getByText('Uploaded at');
        expect(details).toBeInTheDocument();
    });

    it("Should render without column headers if it's the small version", () => {
        const { queryByText } = render(
            <AttachmentList
                attachments={attachmentsMock}
                disabled={false}
                addAttachments={addAttachments}
                downloadAttachment={downloadAttachment}
            />
        );
        const header = queryByText('Title');
        expect(header).not.toBeInTheDocument();
    });

    it("Should render with column headers if it's the large version", () => {
        const { getByText } = render(
            <AttachmentList
                attachments={attachmentsMock}
                disabled={false}
                addAttachments={addAttachments}
                downloadAttachment={downloadAttachment}
                large={true}
            />
        );
        const header = getByText('Title');
        expect(header).toBeInTheDocument();
    });
});
