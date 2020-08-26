import React, { useRef } from 'react';
import Table from './../Table';
import { Container, AttachmentLink, AddFile, StyledButton } from './style';
import EdsIcon from '../EdsIcon';
import { tokens } from '@equinor/eds-tokens';

const addIcon = <EdsIcon name='add_circle_filled' size={16} />;
const deletIcon = <EdsIcon color={tokens.colors.interactive.primary__resting.rgba} name='delete_to_trash' size={16} />;

export interface Attachment {
    id: number;
    fileName: string;
    rowVersion: string;
}

interface AttachmentListProps {
    attachments: Attachment[];
    disabled: boolean;
    addAttachment?: (file: File) => void;
    deleteAttachment?: (attachment: Attachment) => void;
    downloadAttachment: (id: number) => void;
}

const AttachmentList = ({
    attachments,
    disabled,
    addAttachment,
    deleteAttachment,
    downloadAttachment,
}: AttachmentListProps): JSX.Element => {

    const getFilenameColumn = (attachment: Attachment): JSX.Element => {
        return (
            <AttachmentLink>
                <div onClick={(): void => { downloadAttachment(attachment.id); }}>
                    {attachment.fileName}
                </div>
            </AttachmentLink >
        );
    };

    const handleDelete = (attachment: Attachment): void => {
        if (!disabled && deleteAttachment) {
            if (confirm(`You want to delete the file '${attachment.fileName}'`)) {
                deleteAttachment(attachment);
            }
        }
    };

    const handleSubmitFile = (e: any): void => {
        if (addAttachment) {
            e.preventDefault();
            const file = e.target.files[0];
            addAttachment(file);
        }
    };

    const inputFileRef = useRef<HTMLInputElement>(null);

    const handleAddFile = (): void => {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    };

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
                        icon: (): JSX.Element => deleteAttachment ? deletIcon : <></>,
                        tooltip: disabled ? '' : 'Delete attachment',
                        onClick: (event, rowData): void => handleDelete(rowData),
                        disabled: disabled
                    },
                ]}
                components={{
                    Toolbar: (): any => (
                        <AddFile>
                            {addAttachment && (
                                <form>
                                    <StyledButton
                                        variant='ghost'
                                        disabled={disabled}
                                        onClick={handleAddFile}>
                                        {addIcon} Add file
                                    </StyledButton>
                                    <input id="addFile" style={{ display: 'none' }} type='file' ref={inputFileRef} onChange={handleSubmitFile} />
                                </form>
                            )}
                        </AddFile>
                    )
                }}

                style={{ boxShadow: 'none' }}
            />
        </Container >
    );
};

export default AttachmentList; 
