import React, { useState, useEffect } from 'react';

import { showSnackbarNotification } from '../../../../../../core/services/NotificationService';
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';


import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { usePreservationContext } from '../../../../context/PreservationContext';
import { Canceler } from 'axios';
import Table from './../../../../../../components/Table';
import { Container, AttachmentLink, AddFile } from './AttachmentTab.style';
import { Link } from 'react-router-dom';


interface Attachment {
    id: number;
    title: string;
    fileName: string;
}

interface AttachmentTabProps {
    tagId: number | null;
}

const AttachmentTab = ({
    tagId
}: AttachmentTabProps): JSX.Element => {
    const { apiClient } = usePreservationContext();
    const [attachments, setAttachments] = useState<Attachment[]>([]);

    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                if (tagId != null) {
                    const attachments = await apiClient.getTagAttachments(tagId, (cancel: Canceler) => requestCancellor = cancel);

                    setAttachments(attachments);
                }
            } catch (error) {
                console.error('Get attachments failed: ', error.messsage, error.data);
                showSnackbarNotification(error.message, 5000);
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);


    const getFilenameColumn = (attachment: Attachment): JSX.Element => {
        return (
            <AttachmentLink>
                <div>
                    <span><Link to="c:/files/myfile.pdf" target="_blank" download>{attachment.fileName}</Link> </span>
                </div>
            </AttachmentLink>
        );
    };

    const deleteAttachment = (rowData: Attachment): void => {
        if (confirm(`You want to delete the file '${rowData.title}'`)) {
            //todo delete
        }
    };

    const handleSubmitFile = (e: any): void => {
        e.preventDefault();
    };

    const addFileForm = (): JSX.Element => {
        return (
            <form onSubmit={handleSubmitFile}>
                <label htmlFor="addFile">
                    <AddCircleOutlinedIcon /> Add file
                </label>
                <input id="addFile" style={{ display: 'none' }} type='file' onChange={(e): void => {
                    console.log(e);
                }}
                />
            </form>
        );
    };

    return (
        <Container>
            <AddFile>
                {addFileForm()}
            </AddFile>
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
                    actionsColumnIndex: -1
                }}
                actions={[
                    {
                        icon: (): JSX.Element => <DeleteOutlinedIcon />, //todo: Default icons is not working
                        tooltip: 'Delete attachment',
                        onClick: (event, rowData): void => deleteAttachment(rowData)
                    },
                ]}
                style={{ boxShadow: 'none' }}
            />
        </Container >
    );
};

export default AttachmentTab; 