import { AddAttachmentContainer, AttachmentTable, Container, DragAndDropContainer, FormContainer, SpinnerContainer } from './index.style';
import { Button, Typography } from '@equinor/eds-core-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getFileName, getFileTypeIconName } from '../../utils';

import { Attachment } from '@procosys/modules/InvitationForPunchOut/types';
import { Canceler } from '@procosys/http/HttpClient';
import CustomTooltip from './CustomTooltip';
import EdsIcon from '@procosys/components/EdsIcon';
import Spinner from '@procosys/components/Spinner';
import { Table } from '@equinor/eds-core-react';
import fileTypeValidator from '@procosys/util/FileTypeValidator';
import { getFormattedDateAndTime } from '@procosys/core/services/DateService';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useInvitationForPunchOutContext } from '@procosys/modules/InvitationForPunchOut/context/InvitationForPunchOutContext';
import AttachmentList from '@procosys/components/AttachmentList';
import { TableOptions } from 'react-table';

const { Head, Body, Cell, Row } = Table;


interface AttachmentsProps {
    ipoId: number;
}

const Attachments = ({ ipoId }: AttachmentsProps): JSX.Element => {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const { apiClient } = useInvitationForPunchOutContext();
    const [loading, setLoading] = useState<boolean>(false);

    const getAttachments = useCallback(async (requestCanceller?: (cancelCallback: Canceler) => void): Promise<void> => {
        try {
            const response = await apiClient.getAttachments(ipoId, requestCanceller);
            setAttachments(response);
        } catch (error) {
            console.error(error.message, error.data);
            showSnackbarNotification(error.message);
        }
    }, [ipoId]);


    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            setLoading(true);
            await getAttachments((cancel: Canceler) => { requestCancellor = cancel; });
            setLoading(false);
        })();
        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    const uploadFiles = async (files: FileList | null): Promise<void> => {
        if (!files) {
            showSnackbarNotification('No files to upload');
            return;
        }

        await Promise.all(Array.from(files).map(async file => {
            try {
                fileTypeValidator(file.name);
                await apiClient.uploadAttachment(ipoId, file, true);
            } catch (error) {
                console.error('Upload attachment failed: ', error.message, error.data);
                showSnackbarNotification(error.message);
            }
        }));
    };

    const handleSubmitFiles = async (files: FileList | null): Promise<void> => {
        setLoading(true);
        if(files){
            await uploadFiles(files);
            await getAttachments();
        }
        setLoading(false);
    };

    const handleAddFile = (): void => {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
    };

    const handleDrop = async (event: React.DragEvent<HTMLDivElement>): Promise<void> => {
        event.preventDefault();
        setLoading(true);
        await uploadFiles(event.dataTransfer.files);
        await getAttachments();
        setLoading(false);
    };

    const removeAttachment = async (row: TableOptions<Attachment>): Promise<void> => {
        const index = row.row.index;
        const attachment = attachments[index];
        if (attachment.id && attachment.rowVersion) {
            setLoading(true);
            try {
                await apiClient.deleteAttachment(ipoId, attachment.id, attachment.rowVersion);
                setAttachments(currentAttachments =>
                    [...currentAttachments.slice(0, index), ...currentAttachments.slice(index + 1)]
                );
            } catch (error) {
                console.error(error.message, error.data);
                showSnackbarNotification(error.message);
            }
            setLoading(false);
        }
    };

    const openAttachment = (attachment: Attachment): void => {
        if(attachment.downloadUri){
            window.open(attachment.downloadUri, '_blank');
        }
    };

    return (<Container>
        {loading && (
            <SpinnerContainer>
                <Spinner large />
            </SpinnerContainer>
        )}
            <AttachmentList 
                attachments={attachments}
                disabled={false}
                addAttachments={handleSubmitFiles}
                deleteAttachment={removeAttachment}
                downloadAttachment={openAttachment}
                large={true}
                detailed={true}
            />
    </Container>);
};

export default Attachments;
