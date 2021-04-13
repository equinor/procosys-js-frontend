import React, { useRef } from 'react';
import Table from './../Table';
import { Container, AttachmentLink, AddFile, StyledButton, DragAndDropContainer, DragAndDropTitle, TableContainer } from './style';
import EdsIcon from '../EdsIcon';
import { tokens } from '@equinor/eds-tokens';
import { TableOptions, UseTableRowProps } from 'react-table';
import ProcosysTable from '../Table';

const addIcon = <EdsIcon name='add_circle_filled' size={16} />;
const deleteIcon = <EdsIcon color={tokens.colors.interactive.primary__resting.rgba} name='delete_to_trash' size={16} />;

export interface Attachment {
    id: number;
    fileName: string;
    rowVersion: string;
}

interface AttachmentListProps {
    attachments: Attachment[];
    disabled: boolean;
    addAttachments?: (files: FileList) => void;
    deleteAttachment?: (attachment: Attachment) => void;
    downloadAttachment: (id: number) => void;
    large?: boolean;
}

const AttachmentList = ({
    attachments,
    disabled,
    addAttachments,
    deleteAttachment,
    downloadAttachment,
    large = false,
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

    const handleSubmitFiles = (e: any): void => {
        if (addAttachments) {
            e.preventDefault();
            addAttachments(e.target.files);
        }
    };

    const inputFileRef = useRef<HTMLInputElement>(null);

    const handleAddFile = (): void => {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        if(addAttachments){
            addAttachments(event.dataTransfer.files);
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

    /* TODO: once table component is ready and I've been able to ask someone about design and
    ** it makes sense to use this component for all the different attachment components:
    ** Change columns based on which type
    ** Change options (header especially)
    ** Add type icons
    */
    return (
        <Container>
            { addAttachments &&
                <div>
                    <DragAndDropTitle>
                        Drag and drop to add files, or click on the button { large? 'above' : 'below'}
                    </DragAndDropTitle>
                    <DragAndDropContainer
                        onDrop={(event: React.DragEvent<HTMLDivElement>): void => handleDrop(event)}
                        onDragOver={(event: React.DragEvent<HTMLDivElement>): void => handleDragOver(event)}
                        data-testid="DnDField"
                    >
                        <EdsIcon name='cloud_download' size={48} color='#DADADA' />
                    </DragAndDropContainer>
                </div>
            }
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
                            {addAttachments && (
                                <form>
                                    <StyledButton
                                        variant='ghost'
                                        disabled={disabled}
                                        data-testid={'addFiles'}
                                        onClick={handleAddFile}>
                                        {addIcon} Add files
                                    </StyledButton>
                                    <input id="addFile" style={{ display: 'none' }} type='file' ref={inputFileRef} onChange={handleSubmitFiles} />
                                </form>
                            )}
                        </AddFile>
                    }
                />
            </TableContainer>
        </ Container>
    );
};

export default AttachmentList;
