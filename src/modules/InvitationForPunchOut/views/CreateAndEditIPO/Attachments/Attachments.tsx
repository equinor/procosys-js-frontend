import { AddAttachmentContainer, Container, DragAndDropContainer, FormContainer } from './Attachments.style';
import { Button, Typography } from '@equinor/eds-core-react';
import React, { useRef } from 'react';
import { getFileName, getFileTypeIconName } from '../../utils';

import EdsIcon from '@procosys/components/EdsIcon';
import Table from '@procosys/components/Table';
import fileTypeValidator from '@procosys/util/FileTypeValidator';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { tokens } from '@equinor/eds-tokens';
import { Attachment } from '@procosys/modules/InvitationForPunchOut/types';

interface AttachmentsProps {
    attachments: Attachment[];
    setAttachments: React.Dispatch<React.SetStateAction<Attachment[]>>;
}

const Attachments = ({
    attachments,
    setAttachments
}: AttachmentsProps): JSX.Element => {
    const inputFileRef = useRef<HTMLInputElement>(null);

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
    };

    const getAttachmentName = (attachment: Attachment): JSX.Element => {
        return (
            <div>{getFileName(attachment.fileName)}</div>
        );
    };

    const getAttachmentIcon = (attachment: Attachment): JSX.Element => {
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
            <Table
                columns={[{ title: 'Type', render: getAttachmentIcon, width: '30px' }, { title: 'Title', render: getAttachmentName }]}
                data={attachments.filter((attachment) => !attachment.toBeDeleted)}
                options={{
                    toolbar: false,
                    showTitle: false,
                    search: false,
                    draggable: false,
                    padding: 'dense',
                    headerStyle: {
                        backgroundColor: tokens.colors.interactive.table__header__fill_resting.rgba,
                    },
                    actionsColumnIndex: -1,
                    paging: false
                }}
                style={{
                    boxShadow: 'none'
                }}
                localization={{
                    header: {
                        actions: ''
                    }
                }}
                actions={[
                    {
                        icon: (): JSX.Element => <EdsIcon name='delete_to_trash' />,
                        tooltip: 'Remove attachment',
                        onClick: (_, rowData): void => removeAttachment(rowData.tableData.id)
                    }
                ]}
            />
        </FormContainer>
    </Container>);
};

export default Attachments;
