import React, { useRef } from 'react';
import { AttachmentLink, AddFile, StyledButton, TableContainer } from './style';
import EdsIcon from '../EdsIcon';
import { tokens } from '@equinor/eds-tokens';
import { TableOptions, UseTableRowProps } from 'react-table';
import ProcosysTable from '../Table';

const addIcon = <EdsIcon name='add_circle_filled' size={16} />;

export interface Attachment {
    id: number;
    fileName: string;
    rowVersion: string;
}

interface AttachmentListProps {
    attachments: Attachment[];
    disabled: boolean;
    addAttachment?: (file: File) => void;
    deleteAttachment?: (attachment: Attachment) => void;
    downloadAttachment: (id: number) => void;
}

const AttachmentList = ({
    attachments,
    disabled,
    addAttachment,
    deleteAttachment,
    downloadAttachment,
}: AttachmentListProps): JSX.Element => {

    const getFilenameColumn = (row: TableOptions<Attachment>): JSX.Element => {
        const attachment = row.value as Attachment;
        return (
            <AttachmentLink>
                <div onClick={(): void => { downloadAttachment(attachment.id); }}>
                    {attachment.fileName}
                </div>
            </AttachmentLink >
        );
    };

    const handleDelete = (attachment: Attachment): void => {
        if (!disabled && deleteAttachment) {
            if (confirm(`You want to delete the file '${attachment.fileName}'`)) {
                deleteAttachment(attachment);
            }
        }
    };

    const handleSubmitFile = (e: any): void => {
        if (addAttachment) {
            e.preventDefault();
            const file = e.target.files[0];
            addAttachment(file);
        }
    };

    const inputFileRef = useRef<HTMLInputElement>(null);

    const handleAddFile = (): void => {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    };

    const getRemoveAttachmentColumn = (row: TableOptions<Attachment>): JSX.Element => {
        const attachment = row.value as Attachment;
        return (
            deleteAttachment ? (
                <div aria-disabled={disabled} onClick={(): void => handleDelete(attachment)} >
                    <EdsIcon color={tokens.colors.interactive.primary__resting.rgba} name='delete_to_trash' size={16} />
                </div>
            ) : <></>
        );
    };

    const columns = [
        {
            Header: ' ',
            accessor: (d: UseTableRowProps<Attachment>): UseTableRowProps<Attachment> => d,
            Cell: getFilenameColumn
        },
        {
            Header: '  ',
            accessor: (d: UseTableRowProps<Attachment>): UseTableRowProps<Attachment> => d,
            align: 'right',
            Cell: getRemoveAttachmentColumn
        }
    ];

    return (
        <TableContainer>
            <ProcosysTable
                columns={columns}
                data={attachments}
                noHeader={true}
                pageIndex={0}
                pageSize={25}
                clientPagination={true}
                clientSorting={true}
                rowSelect={false}
                toolbar={
                    <AddFile>
                        {addAttachment && (
                            <form>
                                <StyledButton
                                    variant='ghost'
                                    disabled={disabled}
                                    onClick={handleAddFile}>
                                    {addIcon} Add file
                                </StyledButton>
                                <input id="addFile" style={{ display: 'none' }} type='file' ref={inputFileRef} onChange={handleSubmitFile} />
                            </form>
                        )}
                    </AddFile>
                }
            />
        </TableContainer>
    );
};

export default AttachmentList;
