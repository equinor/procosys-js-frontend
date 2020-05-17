import React, { useState, useEffect } from 'react';
import { showSnackbarNotification } from '../../../../../../core/services/NotificationService';
import { usePreservationContext } from '../../../../context/PreservationContext';
import { Canceler } from 'axios';
import Table from './../../../../../../components/Table';
import { Container, AttachmentLink, AddFile, FormFieldSpacer } from './AttachmentTab.style';
import Spinner from '@procosys/components/Spinner';
import EdsIcon from '../../../../../../components/EdsIcon';
import { tokens } from '@equinor/eds-tokens';

const addIcon = <EdsIcon color={tokens.colors.interactive.primary__resting.rgba} name='add_circle_filled' size={16} />;
const deletIcon = <EdsIcon color={tokens.colors.interactive.primary__resting.rgba} name='delete_to_trash' size={16} />;

interface Attachment {
    id: number;
    fileName: string;
    rowVersion: string;
}

interface AttachmentTabProps {
    tagId: number | null;
}

const AttachmentTab = ({
    tagId
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
                console.error('Get attachments failed: ', error.messsage, error.data, true);
                showSnackbarNotification(error.message, 5000, true);
            }
            setIsLoading(false);
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    };

    const uploadFileAttachment = async (file: File): Promise<void> => {

        try {
            if (tagId != null) {
                setIsLoading(true);
                await apiClient.addAttachmentToTag(tagId, file, false);
                getAttachments();
                showSnackbarNotification(`Attachment with filename '${file.name}' is added to tag.`, 5000, true);
            }
        } catch (error) {
            console.error('Upload file attachment failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message, 5000, true);
        }
        setIsLoading(false);

        return Promise.resolve();
    };

    const downloadAttachment = (attachmentId: number): void => {
        (
            async (): Promise<void> => {
                try {
                    if (tagId != null) {
                        const url = await apiClient.getDownloadUrlForTagAttachment(tagId, attachmentId);
                        window.open(url, '_blank');
                        showSnackbarNotification('Attachment is downloaded.', 5000, true);
                    }
                } catch (error) {
                    console.error('Not able to get download url for tag attachment: ', error.messsage, error.data);
                    showSnackbarNotification(error.message, 5000, true);
                }
            }
        )();
    };

    useEffect(() => {
        getAttachments();
    }, []);


    const getFilenameColumn = (attachment: Attachment): JSX.Element => {
        return (
            <AttachmentLink>
                <div onClick={(): void => { downloadAttachment(attachment.id); }}>
                    {attachment.fileName}
                </div>
            </AttachmentLink >
        );
    };

    const deleteAttachment = (attachment: Attachment): void => {
        if (confirm(`You want to delete the file '${attachment.fileName}'`)) {
            (
                async (): Promise<void> => {
                    try {
                        if (tagId != null) {
                            setIsLoading(true);
                            await apiClient.deleteAttachmentOnTag(tagId, attachment.id, attachment.rowVersion);
                            getAttachments();
                            showSnackbarNotification(`Attachment with filename '${attachment.fileName}' is deleted.`, 5000, true);
                        }
                    } catch (error) {
                        console.error('Not able to delete tag attachment: ', error.messsage, error.data);
                        showSnackbarNotification(error.message, 5000, true);
                    }
                    setIsLoading(false);
                }
            )();
        }
    };

    const handleSubmitFile = (e: any): void => {
        e.preventDefault();
        const file = e.target.files[0];
        uploadFileAttachment(file);
    };

    if (isLoading) {
        return (
            <div style={{ margin: 'calc(var(--grid-unit) * 5) auto' }}><Spinner large /></div>
        );
    }

    return (
        <Container>
            <Table
                columns={[
                    { render: getFilenameColumn },
                ]}
                data={attachments}
                options={{
                    showTitle: false,
                    draggable: false,
                    selection: false,
                    header: false,
                    padding: 'dense',
                    search: false,
                    paging: false,
                    emptyRowsWhenPaging: false,
                    actionsColumnIndex: -1,
                }}
                actions={[
                    {
                        icon: (): JSX.Element => deletIcon,
                        tooltip: 'Delete attachment',
                        onClick: (event, rowData): void => deleteAttachment(rowData)
                    },
                ]}
                components={{
                    Toolbar: (): any => (
                        <AddFile>
                            <form>
                                <label htmlFor="addFile">
                                    {addIcon} <FormFieldSpacer /> Add file
                                </label>
                                <input id="addFile" style={{ display: 'none' }} type='file' onChange={handleSubmitFile} />
                            </form>
                        </AddFile>
                    )
                }}

                style={{ boxShadow: 'none' }}
            />
        </Container >
    );
};

export default AttachmentTab; 