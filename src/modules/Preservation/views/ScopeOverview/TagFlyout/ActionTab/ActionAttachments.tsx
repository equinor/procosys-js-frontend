import React, { useState, useEffect } from 'react';
import { showSnackbarNotification } from '../../../../../../core/services/NotificationService';
import { usePreservationContext } from '../../../../context/PreservationContext';
import AttachmentList, { Attachment } from '@procosys/components/AttachmentList';
import { Canceler } from 'axios';
import Spinner from '@procosys/components/Spinner';
import { Container } from './ActionAttachment.style';

interface ActionAttachmentsProps {
    tagId: number;
    actionId: number;
    enableActions: boolean;
}

const ActionAttachments = ({
    tagId,
    actionId,
    enableActions
}: ActionAttachmentsProps): JSX.Element => {

    const { apiClient } = usePreservationContext();
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getAttachments = (): Canceler | null => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                setIsLoading(true);
                const attachments = await apiClient.getActionAttachments(tagId, actionId, (cancel: Canceler) => requestCancellor = cancel);
                setAttachments(attachments);
            } catch (error) {
                console.error('Get attachments failed: ', error.message, error.data, true);
                showSnackbarNotification(error.message, 5000, true);
            }
            setIsLoading(false);
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    };

    // Get initial list of attachments 
    useEffect(() => {
        const requestCancellor = getAttachments();
        return (): void => {
            requestCancellor && requestCancellor;
        };
    }, []);


    const downloadAttachment = async (attachmentId: number): Promise<void> => {
        try {
            const url = await apiClient.getDownloadUrlForActionAttachment(tagId, actionId, attachmentId);
            window.open(url, '_blank');
            showSnackbarNotification('Attachment is downloaded.', 5000, true);
        } catch (error) {
            console.error('Not able to get download url for action attachment: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000, true);
        }
    };

    const addAttachment = async (file: File): Promise<void> => {
        try {
            setIsLoading(true);
            await apiClient.addAttachmentToAction(tagId, actionId, file, false);
            getAttachments();
            showSnackbarNotification(`Attachment with filename '${file.name}' is added to action.`, 5000, true);
        } catch (error) {
            console.error('Upload file attachment failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000, true);
        }
        setIsLoading(false);
    };


    const deleteAttachment = async (attachment: Attachment): Promise<void> => {
        try {
            setIsLoading(true);
            await apiClient.deleteAttachmentOnAction(tagId, actionId, attachment.id, attachment.rowVersion);
            getAttachments();
            showSnackbarNotification(`Attachment with filename '${attachment.fileName}' is deleted.`, 5000, true);
        } catch (error) {
            console.error('Not able to delete action attachment: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000, true);
        }
        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <div style={{ margin: 'calc(var(--grid-unit) * 5) auto' }}><Spinner large /></div>
        );
    }

    return (
        <Container>
            <AttachmentList
                attachments={attachments}
                addAttachment={enableActions ? addAttachment : undefined}
                deleteAttachment={enableActions ? deleteAttachment : undefined}
                downloadAttachment={downloadAttachment}
            />
        </Container>
    );
};

export default ActionAttachments;
