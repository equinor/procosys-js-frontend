import { AddAttachmentContainer, Container, DragAndDropContainer, FormContainer } from './Attachments.style';
import { Button, Typography } from '@equinor/eds-core-react';
import React, { useRef } from 'react';
import { getFileName, getFileTypeIconName } from '../../utils';

import { Attachment } from '@procosys/modules/InvitationForPunchOut/types';
import { ComponentName } from '../../enums';
import EdsIcon from '@procosys/components/EdsIcon';
import fileTypeValidator from '@procosys/util/FileTypeValidator';
import { getAttachmentDownloadLink } from '../utils';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useDirtyContext } from '@procosys/core/DirtyContext';
import ProcosysTable from '@procosys/components/Table/ProcosysTable';
import { TableOptions, UseTableRowProps } from 'react-table';

interface AttachmentsProps {
    attachments: Attachment[];
    setAttachments: React.Dispatch<React.SetStateAction<Attachment[]>>;
}

const Attachments = ({
    attachments,
    setAttachments
}: AttachmentsProps): JSX.Element => {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const { setDirtyStateFor } = useDirtyContext();

    const handleSubmitFile = (e: any): void => {
        e.preventDefault();
        try {
            addAttachments(e.target.files);
        } catch (error) {
            console.error('Upload attachment failed: ', error.message, error.data);
            showSnackbarNotification(error.message);
        }
    };

    const handleAddFile = (): void => {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    };

    const removeAttachment = (index: number): void => {
        if (attachments[index].id) {
            //Attachments already uploaded will be deleted when ipo i saved
            attachments[index].toBeDeleted = true;
            setAttachments([...attachments]);
        } else {
            //Attachments not yet uploaded can be removed from the attachments array
            setAttachments(currentAttachments =>
                [...currentAttachments.slice(0, index), ...currentAttachments.slice(index + 1)]
            );
        }
        setDirtyStateFor(ComponentName.Attachments);
    };

    const addAttachments = (files: FileList | null): void => {
        if (!files) {
            showSnackbarNotification('No files to upload');
            return;
        }

        Array.from(files).forEach(file => {
            try {
                fileTypeValidator(file.name);
                setAttachments(currentAttachments => currentAttachments.concat({ fileName: file.name, file: file }));
            } catch (error) {
                showSnackbarNotification(error.message);
            }

        });
        setDirtyStateFor(ComponentName.Attachments);
    };

    const getAttachmentName = (row: TableOptions<Attachment>): JSX.Element => {
        const attachment = row.value as Attachment;
        const link = getAttachmentDownloadLink(attachment);

        return (
            <Typography link={!!link} target='_blank' href={link}>{getFileName(attachment.fileName)}</Typography>
        );
    };

    const getAttachmentIcon = (row: TableOptions<Attachment>): JSX.Element => {
        const attachment = row.value as Attachment;
        const iconName = getFileTypeIconName(attachment.fileName);
        return (
            <EdsIcon name={iconName} size={24} />
        );
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        addAttachments(event.dataTransfer.files);

    };

    const getRemoveAttachmentColumn = (row: TableOptions<Attachment>): JSX.Element => {
        return (
            <div onClick={(): void => removeAttachment(row.row.index)} >
                <EdsIcon name='delete_to_trash' />
            </div>
        );
    };

    const columns = [
        {
            Header: 'Type',
            accessor: (d: UseTableRowProps<Attachment>): UseTableRowProps<Attachment> => d,
            Cell: getAttachmentIcon,
            width: 30
        },
        {
            Header: 'Title',
            accessor: (d: UseTableRowProps<Attachment>): UseTableRowProps<Attachment> => d,
            Cell: getAttachmentName
        },
        {
            Header: ' ',
            accessor: (d: UseTableRowProps<Attachment>): UseTableRowProps<Attachment> => d,
            Cell: getRemoveAttachmentColumn
        },
    ];

    return (<Container>
        <FormContainer>
            <Typography variant='h5'>Drag and drop to add files, or click on the button to select files</Typography>
            <AddAttachmentContainer>
                <form>
                    <Button
                        onClick={handleAddFile}
                    >
                        Select files
                    </Button>
                    <input id="addFile" style={{ display: 'none' }} multiple type='file' ref={inputFileRef} onChange={handleSubmitFile} />
                </form>
            </AddAttachmentContainer>
            <DragAndDropContainer
                onDrop={(event: React.DragEvent<HTMLDivElement>): void => handleDrop(event)}
                onDragOver={(event: React.DragEvent<HTMLDivElement>): void => handleDragOver(event)}
            >
                <EdsIcon name='cloud_download' size={48} color='#DADADA' />
            </DragAndDropContainer>
            <Typography variant='h5'>Attachments</Typography>

            <ProcosysTable
                columns={columns}
                data={attachments.filter((attachment) => !attachment.toBeDeleted)}
                clientPagination={true}
                clientSorting={true}
                maxRowCount={attachments.filter((attachment) => !attachment.toBeDeleted).length || 0}
                pageIndex={0}
                pageSize={10}
                rowSelect={false}
            />
        </FormContainer>
    </Container>);
};

export default Attachments;
