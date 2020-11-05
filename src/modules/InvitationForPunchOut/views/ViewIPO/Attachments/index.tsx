import { AddAttachmentContainer, AttachmentTable, Container, DragAndDropContainer, FormContainer, SpinnerContainer } from './index.style';
import { Button, Typography } from '@equinor/eds-core-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Canceler } from '@procosys/http/HttpClient';
import CustomTooltip from './CustomTooltip';
import EdsIcon from '@procosys/components/EdsIcon';
import Spinner from '@procosys/components/Spinner';
import { Table } from '@equinor/eds-core-react';
import fileTypeValidator from '@procosys/util/FileTypeValidator';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useInvitationForPunchOutContext } from '@procosys/modules/InvitationForPunchOut/context/InvitationForPunchOutContext';

const { Head, Body, Cell, Row } = Table;

type Attachment = {
    id: number;
    fileName: string;
    rowVersion: string;
}

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

    const handleSubmitFile = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        e.preventDefault();

        if (!e.target.files) {
            showSnackbarNotification('No files to upload');
            return;
        }

        setLoading(true);
        const file = e.target.files[0];
        try {
            fileTypeValidator(file.name);
            await apiClient.uploadAttachment(ipoId, file, true);
        } catch (error) {
            console.error('Upload attchment failed: ', error.message, error.data);
            showSnackbarNotification(error.message);
        }
        await getAttachments();
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
        const files = event.dataTransfer.files;
        await Promise.all(Array.from(files).map(async file => {
            try {
                fileTypeValidator(file.name);
                await apiClient.uploadAttachment(ipoId, file, true);
            } catch (error) {
                console.error('Upload attachment failed: ', error.message, error.data);
                showSnackbarNotification(error.message);
            }
        }));
        await getAttachments();
        setLoading(false);
    };

    const removeAttachment = async (index: number): Promise<void> => {
        setLoading(true);
        try {
            await apiClient.deleteAttachment(ipoId, attachments[index].id, attachments[index].rowVersion);
            setAttachments(currentAttachments =>
                [...currentAttachments.slice(0, index), ...currentAttachments.slice(index + 1)]
            );
        } catch (error) {
            console.error(error.message, error.data);
            showSnackbarNotification(error.message);
        }
        setLoading(false);
    };

    const openAttachment = async (attachmentId: number): Promise<void> => {
        try {
            const response = await apiClient.getAttachment(ipoId, attachmentId);
            window.open(response, '_blank');
        } catch (error) {
            console.error(error.message, error.data);
            showSnackbarNotification(error.message);
        }
    };

    return (<Container>
        {loading && (
            <SpinnerContainer>
                <Spinner large />
            </SpinnerContainer>
        )}
        <FormContainer>
            <Typography variant='h5'>Drag and drop to add files, or click on the button to select files</Typography>
            <AddAttachmentContainer>
                <form>
                    <Button
                        disabled={loading}
                        onClick={handleAddFile}
                    >
                        Select files
                    </Button>
                    <input id="addFile" style={{ display: 'none' }} type='file' ref={inputFileRef} onChange={handleSubmitFile} />
                </form>
            </AddAttachmentContainer>
            <DragAndDropContainer
                onDrop={(event: React.DragEvent<HTMLDivElement>): Promise<void> => handleDrop(event)}
                onDragOver={(event: React.DragEvent<HTMLDivElement>): void => handleDragOver(event)}
            >
                <EdsIcon name='cloud_download' size={48} color='#DADADA'/>
            </DragAndDropContainer>
            <Typography variant='h5'>Attachments</Typography>
            <AttachmentTable>
                <Head>
                    <Row>
                        <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>Title</Cell>
                        <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>{' '}</Cell>
                    </Row>
                </Head>
                <Body>
                    {attachments && attachments.length > 0 ? attachments.map((attachment, index) => (
                        <Row key={attachment.id}>
                            <Cell as="td" style={{verticalAlign: 'middle', lineHeight: '1em'}}>
                                <CustomTooltip title="Click to open in new tab" arrow>
                                    <Typography onClick={(): Promise<void> => openAttachment(attachment.id)} variant="body_short" link>{attachment.fileName}</Typography>
                                </CustomTooltip>
                            </Cell>
                            <Cell as="td" style={{verticalAlign: 'middle', lineHeight: '1em', width: '30px'}}>
                                <div onClick={(): Promise<void> => removeAttachment(index)}>
                                    <EdsIcon name='delete_to_trash' />
                                </div>
                            </Cell>
                        </Row>
                    )) : (
                        <Row>
                            <Cell style={{verticalAlign: 'middle', width: '100%'}}><Typography style={{textAlign: 'center'}} variant="body_short">No records to display</Typography></Cell>
                        </Row>
                    )}
                </Body>

            </AttachmentTable>
        </FormContainer>
    </Container>);
};

export default Attachments;
