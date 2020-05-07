import React, { useState, useEffect } from 'react';

import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Table from './../Table';
import { Container, AttachmentLink, AddFile, FormFieldSpacer } from './style';
import { Link } from 'react-router-dom';


interface Attachment {
    id: number;
    title: string;
    fileName: string;
}

interface AttachmentListProps {
    getAttachments: () => Attachment[];
    addFile: (file: Attachment) => void;
    deleteFile: (id: number) => void;
}

const AttachmentList = ({
    getAttachments,
    addFile,
    deleteFile,
}: AttachmentListProps): JSX.Element => {
    const [attachments, setAttachments] = useState<Attachment[]>([]);

    useEffect(() => {
        setAttachments(getAttachments());
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
            deleteFile(rowData.id);
        }
    };

    const handleSubmitFile = (e: any): void => {
        e.preventDefault();
        addFile(e.target);
    };

    const addFileForm = (): JSX.Element => {
        return (
            <form>
                <label htmlFor="addFile">
                    <AddCircleOutlinedIcon /> <FormFieldSpacer /> Add file
                </label>
                <input id="addFile" style={{ display: 'none' }} type='file' onChange={(e): void => {
                    handleSubmitFile(e);
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

export default AttachmentList; 