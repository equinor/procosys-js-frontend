import React, { useState, useEffect } from 'react';
import { showSnackbarNotification } from '../../../../../../core/services/NotificationService';
import { usePreservationContext } from '../../../../context/PreservationContext';
import { Canceler } from 'axios';
import Spinner from '@procosys/components/Spinner';
import AttachmentList, { Attachment } from '@procosys/components/AttachmentList';
import { Container } from './AttachmentTab.style';


interface AttachmentTabProps {
    tagId: number;
    isVoided: boolean;
}

const AttachmentTab = ({
    tagId,
    isVoided
}: AttachmentTabProps): JSX.Element => {

    const { apiClient } = usePreservationContext();
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getAttachments = (): Canceler | null => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                if (tagId != null) {
                    setIsLoading(true);
                    const attachments = await apiClient.getTagAttachments(tagId, (cancel: Canceler) => requestCancellor = cancel);
                    setAttachments(attachments);
                }
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

    const addAttachment = async (file: File): Promise<void> => {

        try {
            if (tagId != null) {
                setIsLoading(true);
                await apiClient.addAttachmentToTag(tagId, file, false);
                getAttachments();
                showSnackbarNotification(`Attachment with filename '${file.name}' is added to tag.`, 5000, true);
            }
        } catch (error) {
            console.error('Upload file attachment failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000, true);
        }
        setIsLoading(false);
    };

    const downloadAttachment = async (attachmentId: number): Promise<void> => {
        try {
            if (tagId != null) {
                const url = await apiClient.getDownloadUrlForTagAttachment(tagId, attachmentId);
                window.open(url, '_blank');
                showSnackbarNotification('Attachment is downloaded.', 5000, true);
            }
        } catch (error) {
            console.error('Not able to get download url for tag attachment: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000, true);
        }
    };

    const deleteAttachment = async (attachment: Attachment): Promise<void> => {
        try {
            if (tagId != null) {
                setIsLoading(true);
                await apiClient.deleteAttachmentOnTag(tagId, attachment.id, attachment.rowVersion);
                getAttachments();
                showSnackbarNotification(`Attachment with filename '${attachment.fileName}' is deleted.`, 5000, true);
            }
        } catch (error) {
            console.error('Not able to delete tag attachment: ', error.message, error.data);
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
                disabled={isVoided}
                addAttachment={addAttachment}
                deleteAttachment={deleteAttachment}
                downloadAttachment={downloadAttachment}
            />
        </Container>
    );
};

export default AttachmentTab;
