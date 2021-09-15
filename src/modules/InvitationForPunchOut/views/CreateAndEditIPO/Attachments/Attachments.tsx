import { Container, FormContainer } from './Attachments.style';
import React from 'react';
import { TableOptions } from 'react-table';
import { Attachment } from '@procosys/modules/InvitationForPunchOut/types';
import { ComponentName } from '../../enums';
import fileTypeValidator from '@procosys/util/FileTypeValidator';
import { getAttachmentDownloadLink } from '../utils';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useDirtyContext } from '@procosys/core/DirtyContext';
import AttachmentList from '@procosys/components/AttachmentList';

interface AttachmentsProps {
    attachments: Attachment[];
    setAttachments: React.Dispatch<React.SetStateAction<Attachment[]>>;
}

const Attachments = ({
    attachments,
    setAttachments
}: AttachmentsProps): JSX.Element => {
    const { setDirtyStateFor } = useDirtyContext();

    const removeAttachment = (row: TableOptions<Attachment>): void => {
        const index = row.row.index;
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

    const downloadAttachment = (attachment: Attachment): void => {
        const link = getAttachmentDownloadLink(attachment);
        window.open(link, '_blank');
    };

    return (
        <Container>
            <FormContainer>
                <AttachmentList 
                    attachments={attachments.filter((attachment) => !attachment.toBeDeleted)}
                    disabled={false}
                    addAttachments={addAttachments}
                    deleteAttachment={removeAttachment}
                    downloadAttachment={downloadAttachment}
                    large={true}
                />
            </FormContainer>
        </Container>
    );
};

export default Attachments;
