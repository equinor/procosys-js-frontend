import React, { useRef } from 'react';
import { Container, AttachmentLink, AddFile, StyledButton, DragAndDropContainer, DragAndDropTitle, TableContainer } from './style';
import EdsIcon from '../EdsIcon';
import { tokens } from '@equinor/eds-tokens';
import { Button } from '@equinor/eds-core-react';
import { TableOptions, UseTableRowProps } from 'react-table';
import ProcosysTable from '../Table';
import { getFileTypeIconName } from '@procosys/modules/InvitationForPunchOut/views/utils';
import { Attachment } from '@procosys/modules/InvitationForPunchOut/types';
import { getFormattedDateAndTime } from '@procosys/core/services/DateService';

const addIcon = <EdsIcon name='add_circle_filled' size={16} />;

interface AttachmentListProps {
    attachments: Attachment[];
    disabled: boolean;
    addAttachments?: (files: FileList) => void;
    deleteAttachment?: (row: TableOptions<Attachment>) => void;
    downloadAttachment: (attachment: Attachment) => Promise<void> | void;
    large?: boolean;
    detailed?: boolean;
}

/*
interface Column {
    Header: string;
    accessor: (d: UseTableRowProps<Attachment>) => UseTableRowProps<Attachment>;
    align?: string;
    Cell: (row: TableOptions<Attachment>) => JSX.Element;
    width?: number;
    alignContent?: string;
    margin?: string;
}
*/

const AttachmentList = ({
    attachments,
    disabled,
    addAttachments,
    deleteAttachment,
    downloadAttachment,
    large = false,
    detailed = false,
}: AttachmentListProps): JSX.Element => {

    const iconSize = large? 24 : 16;

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
                <div aria-disabled={disabled} onClick={(): void => handleDelete(row)} style={{margin: 'auto'}} >
                    <EdsIcon color={tokens.colors.interactive.primary__resting.rgba} name='delete_to_trash' size={iconSize} />
                </div>
            ) : <></>
        );
    };

    const getAttachmentIcon = (row: TableOptions<Attachment>): JSX.Element => {
        const attachment = row.value as Attachment;
        const iconName = getFileTypeIconName(attachment.fileName);
        return (
            <EdsIcon name={iconName} size={iconSize} color={tokens.colors.text.static_icons__default} />
        );
    };

    const getUploadedBy = (row: TableOptions<Attachment>): JSX.Element => {
        return (
            row.value.uploadedBy? (
                <div>
                    { row.value.uploadedBy.firstName } { row.value.uploadedBy.lastName }
                </div>
            ) : <></>
        );
    };

    const getUploadedAt = (row: TableOptions<Attachment>): JSX.Element => {
        return (
            row.value.uploadedAt? (
                <div>
                    { getFormattedDateAndTime(row.value.uploadedAt) }
                </div>
            ) : <></>
        );
    };

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const getColumns = () => {
        const columns = [];
        columns.push(
            {
                Header: 'Type',
                accessor: (d: UseTableRowProps<Attachment>): UseTableRowProps<Attachment> => d,
                Cell: getAttachmentIcon,
                width: 8
            },
            {
                Header: 'Title',
                accessor: (d: UseTableRowProps<Attachment>): UseTableRowProps<Attachment> => d,
                Cell: getFilenameColumn
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
                Cell: getRemoveAttachmentColumn,
                width: 8
            }
        );
        return columns;
    };

    return (
        <Container>
            {
                addAttachments && large && (
                    <>
                        <form>
                            <Button
                                onClick={handleAddFile}
                            >
                        Select files
                            </Button>
                            <input id="addFile" style={{ display: 'none' }} multiple type='file' ref={inputFileRef} onChange={handleSubmitFiles} />
                        </form>
                    </>
                )
            }
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
                            {addAttachments && !large && (
                                <form>
                                    <StyledButton
                                        variant='ghost'
                                        disabled={disabled}
                                        data-testid={'addFiles'}
                                        onClick={handleAddFile}>
                                        {addIcon} Add files
                                    </StyledButton>
                                    <input id="addFiles" style={{ display: 'none' }} multiple type='file' ref={inputFileRef} onChange={handleSubmitFiles} />
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
