import { AddAttachmentContainer, ButtonContainer, Container, DragAndDropContainer, FormContainer, SpinnerContainer } from './index.style';
import { Button, Typography } from '@equinor/eds-core-react';
import React, { useEffect, useRef, useState } from 'react';

import EdsIcon from '@procosys/components/EdsIcon';
// import fileTypeValidator from '@procosys/util/FileTypeValidator';
import Spinner from '@procosys/components/Spinner';
import Table from '@procosys/components/Table';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { tokens } from '@equinor/eds-tokens';
import { useInvitationForPunchOutContext } from '@procosys/modules/InvitationForPunchOut/context/InvitationForPunchOutContext';

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

    const getAttachments = async (): Promise<any> => {
        setLoading(true);
        let response: any[] = [];
        try {
            response = await apiClient.getAttachments(ipoId);
            setAttachments(response);
        } catch (error) {
            console.error(error.message, error.data);
            showSnackbarNotification(error.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        getAttachments();
    }, []);

    const handleSubmitFile = async (e: any): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        const file = e.target.files[0];
        // try {
        //     fileTypeValidator(file.name);
        //     const id = await apiClient.uploadAttachment(ipoId, file, true);
        //     await getAttachments();
        // } catch (error) {
        //     console.error('Upload attchment failed: ', error.message, error.data);
        //     showSnackbarNotification(error.message);
        // }
        setLoading(false);
    };

    const handleAddFile = (): void => {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    };

    const getAttachmentName = (attachment: Attachment): JSX.Element => {
        return (
            <div>{attachment.fileName}</div>
        );
    };
    
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
    };
    
    const handleDrop = async (event: React.DragEvent<HTMLDivElement>): Promise<void> => {
        event.preventDefault();
        setLoading(true);
        const files = event.dataTransfer.files;
        Array.from(files).forEach(async file => {
            // try {
            //     fileTypeValidator(file.name);
            //     const id = await apiClient.uploadAttachment(ipoId, file, true);
            //     await getAttachments();
            // } catch (error) {
            //     console.error('Upload attchment failed: ', error.message, error.data);
            //     showSnackbarNotification(error.message);
            // }
        });
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
            <Table
                columns={[{ title: 'Title', render: getAttachmentName }]}
                data={attachments}
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
                    boxShadow: 'none',
                    width: '95%'
                }}
                localization={{
                    header : {
                        actions: ''
                    }
                }}
                actions={[
                    {
                        icon: (): JSX.Element => <EdsIcon name='delete_to_trash' />,
                        tooltip: 'Remove attachment',
                        onClick: (_, rowData): Promise<void> => removeAttachment(rowData.tableData.id)
                    }
                ]}
            />
        </FormContainer>
    </Container>);
};

export default Attachments;
