import React, { useRef } from 'react';
import { Container, AttachmentLink, AddFile, StyledButton, DragAndDropContainer, DragAndDropTitle, TableContainer } from './style';
import EdsIcon from '../EdsIcon';
import { tokens } from '@equinor/eds-tokens';
import { TableOptions, UseTableRowProps } from 'react-table';
import ProcosysTable from '../Table';
import { getFileTypeIconName } from '@procosys/modules/InvitationForPunchOut/views/utils';
import { Attachment } from '@procosys/modules/InvitationForPunchOut/types';

const addIcon = <EdsIcon name='add_circle_filled' size={16} />;

interface AttachmentListProps {
    attachments: Attachment[];
    disabled: boolean;
    addAttachments?: (files: FileList) => void;
    deleteAttachment?: (row: TableOptions<Attachment>) => void;
    downloadAttachment: (attachment: Attachment) => Promise<void>;
    large?: boolean;
    detailed?: boolean;
}

interface Column {
    Header: string;
    accessor: (d: UseTableRowProps<Attachment>) => UseTableRowProps<Attachment>;
    align?: string;
    Cell: (row: TableOptions<Attachment>) => JSX.Element;
    width?: number;
    alignContent?: string;
}

const AttachmentList = ({
    attachments,
    disabled,
    addAttachments,
    deleteAttachment,
    downloadAttachment,
    large = false,
    detailed = false,
}: AttachmentListProps): JSX.Element => {

    const getFilenameColumn = (row: TableOptions<Attachment>): JSX.Element => {
        const attachment = row.value as Attachment;
        return (
            <AttachmentLink>
                <div onClick={(): void => { downloadAttachment(attachment); }}>
                    {attachment.fileName}
                </div>
            </AttachmentLink >
        );
    };

    const handleDelete = (row: TableOptions<Attachment>): void => {
        if (!disabled && deleteAttachment) {
            if (confirm(`You want to delete the file '${row.value.fileName}'`)) {
                deleteAttachment(row);
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
        return (
            deleteAttachment ? (
                <div aria-disabled={disabled} onClick={(): void => handleDelete(row)} >
                    <EdsIcon color={tokens.colors.interactive.primary__resting.rgba} name='delete_to_trash' size={16} />
                </div>
            ) : <></>
        );
    };

    const getAttachmentIcon = (row: TableOptions<Attachment>): JSX.Element => {
        const attachment = row.value as Attachment;
        const iconName = getFileTypeIconName(attachment.fileName);
        return (
            <EdsIcon name={iconName} size={24} color={tokens.colors.text.static_icons__default} />
        );
    };

    const getUploadedBy = (row: TableOptions<Attachment>): JSX.Element => {
        return (
            row.value.uploadedBy? (
                <div>
                    { row.value.uploadedBy }
                </div>
            ) : <></>
        );
    };

    const getUploadedAt = (row: TableOptions<Attachment>): JSX.Element => {
        return (
            row.value.uploadedAt? (
                <div>
                    { row.value.uploadedAt }
                </div>
            ) : <></>
        );
    };

    const getColumns = (): Column[] => {
        const columns: Column[] = [];
        columns.push(
            {
                Header: 'Type',
                accessor: (d: UseTableRowProps<Attachment>): UseTableRowProps<Attachment> => d,
                Cell: getAttachmentIcon,
                width: 16
            },
            {
                Header: 'Title',
                accessor: (d: UseTableRowProps<Attachment>): UseTableRowProps<Attachment> => d,
                Cell: getFilenameColumn,
                width: 300
            }
        );
        if(detailed){
            columns.push(
                {
                    Header: 'Uploaded at',
                    accessor: (d: UseTableRowProps<Attachment>): UseTableRowProps<Attachment> => d,
                    Cell: getUploadedAt
                },
                {
                    Header: 'Uploaded by',
                    accessor: (d: UseTableRowProps<Attachment>): UseTableRowProps<Attachment> => d,
                    Cell: getUploadedBy
                }
            );
        }
        columns.push(
            {
                Header: ' ',
                accessor: (d: UseTableRowProps<Attachment>): UseTableRowProps<Attachment> => d,
                align: 'right',
                Cell: getRemoveAttachmentColumn,
            }
        );
        return columns;
    };

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
                    columns={getColumns()}
                    data={attachments}
                    noHeader={!large}
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
