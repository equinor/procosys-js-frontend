import React, { useState, useEffect } from 'react';
import { showSnackbarNotification } from '../../../../../../core/services/NotificationService';
import { usePreservationContext } from '../../../../context/PreservationContext';
import { Canceler } from 'axios';
import Spinner from '@procosys/components/Spinner';
import AttachmentList from '@procosys/components/AttachmentList';
import { Container } from './AttachmentTab.style';
import { Attachment } from '@procosys/modules/InvitationForPunchOut/types';
import { TableOptions } from 'react-table';

interface AttachmentTabProps {
    tagId: number;
    isVoided: boolean;
}

const AttachmentTab = ({
    tagId,
    isVoided,
}: AttachmentTabProps): JSX.Element => {
    const { apiClient } = usePreservationContext();
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const addDownloadUriToAttachment = async (
        attachment: Attachment
    ): Promise<Attachment> => {
        if (!attachment.id) return attachment;

        try {
            const uri = await apiClient.getDownloadUrlForTagAttachment(
                tagId,
                attachment.id
            );
            return { ...attachment, downloadUri: uri };
        } catch (error) {
            console.error(
                'Unable to get download URL for attachment:',
                error.message,
                error.data
            );
            return attachment;
        }
    };

    const getAttachments = (): Canceler | null => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                if (tagId != null) {
                    setIsLoading(true);
                    const attachments = await apiClient.getTagAttachments(
                        tagId,
                        (cancel: Canceler) => (requestCancellor = cancel)
                    );

                    const attachmentsWithUrls: Attachment[] = [];

                    for (const attachment of attachments) {
                        const attachmentWithUri =
                            await addDownloadUriToAttachment(attachment);
                        attachmentsWithUrls.push(attachmentWithUri);
                    }

                    setAttachments(attachmentsWithUrls);
                }
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

    const addAttachments = async (files: FileList): Promise<void> => {
        if (!files) {
            showSnackbarNotification('No files to upload');
            return;
        }
        setIsLoading(true);
        Array.from(files).forEach(async (file) => {
            try {
                if (tagId != null) {
                    await apiClient.addAttachmentToTag(tagId, file, false);
                    getAttachments();
                    showSnackbarNotification(
                        `Attachment with filename '${file.name}' is added to tag.`,
                        5000,
                        true
                    );
                }
            } catch (error: any) {
                const errorMessage =
                    error.data.data.errors[''][0] || error.message;
                console.error(
                    'Upload file attachment failed: ',
                    error.message,
                    error.data
                );
                showSnackbarNotification(errorMessage, 5000, true);
            }
        });
        setIsLoading(false);
    };

    const deleteAttachment = async (
        row: TableOptions<Attachment>
    ): Promise<void> => {
        const attachment: Attachment = row.value;
        try {
            if (tagId != null && attachment.id && attachment.rowVersion) {
                setIsLoading(true);
                await apiClient.deleteAttachmentOnTag(
                    tagId,
                    attachment.id,
                    attachment.rowVersion
                );
                getAttachments();
                showSnackbarNotification(
                    `Attachment with filename '${attachment.fileName}' is deleted.`,
                    5000,
                    true
                );
            }
        } catch (error) {
            console.error(
                'Not able to delete tag attachment: ',
                error.message,
                error.data
            );
            showSnackbarNotification(error.message, 5000, true);
        }
        setIsLoading(false);
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
                addAttachments={addAttachments}
                deleteAttachment={deleteAttachment}
            />
        </Container>
    );
};

export default AttachmentTab;
