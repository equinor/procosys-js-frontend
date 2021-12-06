import React, { useState, useEffect } from 'react';
import { showSnackbarNotification } from '../../../../../../core/services/NotificationService';
import { usePreservationContext } from '../../../../context/PreservationContext';
import AttachmentList from '@procosys/components/AttachmentList';
import { Canceler } from 'axios';
import Spinner from '@procosys/components/Spinner';
import { Container } from './ActionAttachment.style';
import { Attachment } from '@procosys/modules/InvitationForPunchOut/types';
import { TableOptions } from 'react-table';

interface ActionAttachmentsProps {
    tagId: number;
    isVoided: boolean;
    actionId: number;
    enableActions: boolean;
}

const ActionAttachments = ({
    tagId,
    isVoided,
    actionId,
    enableActions,
}: ActionAttachmentsProps): JSX.Element => {
    const { apiClient } = usePreservationContext();
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getAttachments = (): Canceler | null => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                setIsLoading(true);
                const attachments = await apiClient.getActionAttachments(
                    tagId,
                    actionId,
                    (cancel: Canceler) => (requestCancellor = cancel)
                );
                setAttachments(attachments);
            } catch (error) {
                console.error(
                    'Get attachments failed: ',
                    error.message,
                    error.data,
                    true
                );
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

    const downloadAttachment = async (
        attachment: Attachment
    ): Promise<void> => {
        if (attachment.id) {
            try {
                const url = await apiClient.getDownloadUrlForActionAttachment(
                    tagId,
                    actionId,
                    attachment.id
                );
                window.open(url, '_blank');
                showSnackbarNotification(
                    'Attachment is downloaded.',
                    5000,
                    true
                );
            } catch (error) {
                console.error(
                    'Not able to get download url for action attachment: ',
                    error.message,
                    error.data
                );
                showSnackbarNotification(error.message, 5000, true);
            }
        } else {
            console.error('Cannot download an attachment that does not exist');
            showSnackbarNotification(
                'Cannot download an attachment that does not exist',
                5000,
                true
            );
        }
    };

    const addAttachments = async (files: FileList | null): Promise<void> => {
        if (!files) {
            showSnackbarNotification('No files to upload');
            return;
        }
        setIsLoading(true);
        Array.from(files).forEach(async (file) => {
            try {
                await apiClient.addAttachmentToAction(
                    tagId,
                    actionId,
                    file,
                    false
                );
                getAttachments();
                showSnackbarNotification(
                    `Attachment with filename '${file.name}' is added to action.`,
                    5000,
                    true
                );
            } catch (error) {
                console.error(
                    'Upload file attachment failed: ',
                    error.message,
                    error.data
                );
                showSnackbarNotification(error.message, 5000, true);
            }
        });
        setIsLoading(false);
    };

    const deleteAttachment = async (
        row: TableOptions<Attachment>
    ): Promise<void> => {
        const attachment: Attachment = row.value;
        if (attachment.id && attachment.rowVersion) {
            try {
                setIsLoading(true);
                await apiClient.deleteAttachmentOnAction(
                    tagId,
                    actionId,
                    attachment.id,
                    attachment.rowVersion
                );
                getAttachments();
                showSnackbarNotification(
                    `Attachment with filename '${attachment.fileName}' is deleted.`,
                    5000,
                    true
                );
            } catch (error) {
                console.error(
                    'Not able to delete action attachment: ',
                    error.message,
                    error.data
                );
                showSnackbarNotification(error.message, 5000, true);
            }
            setIsLoading(false);
        } else {
            console.error('Cannot delete an attachment that does not exist');
            showSnackbarNotification(
                'Cannot delete an attachment that does not exist',
                5000,
                true
            );
        }
    };

    if (isLoading) {
        return (
            <div style={{ margin: 'calc(var(--grid-unit) * 5) auto' }}>
                <Spinner large />
            </div>
        );
    }

    return (
        <Container>
            <AttachmentList
                attachments={attachments}
                disabled={isVoided}
                addAttachments={enableActions ? addAttachments : undefined}
                deleteAttachment={enableActions ? deleteAttachment : undefined}
                downloadAttachment={downloadAttachment}
            />
        </Container>
    );
};

export default ActionAttachments;
