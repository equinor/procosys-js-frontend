import { AddAttachmentContainer, ButtonContainer, Container, DragAndDropContainer, FormContainer } from './Attachments.style';
import { Button, Typography } from '@equinor/eds-core-react';
import React, { useRef } from 'react';

import EdsIcon from '@procosys/components/EdsIcon';
import Table from '@procosys/components/Table';
import fileTypeValidator from '@procosys/util/FileTypeValidator';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { tokens } from '@equinor/eds-tokens';

interface AttachmentsProps {
    next: () => void;
    previous: () => void;
    attachments: File[];
    removeAttachment: (index: number) => void;
    addAttachments: (attachments: File[]) => void;
}

const Attachments = ({
    next,
    previous,
    attachments,
    removeAttachment,
    addAttachments
}: AttachmentsProps): JSX.Element => {
    const inputFileRef = useRef<HTMLInputElement>(null);

    const handleSubmitFile = (e: any): void => {
        e.preventDefault();
        try {
            fileTypeValidator(e.target.files[0].name);
            addAttachments([e.target.files[0]]);
        } catch (error) {
            showSnackbarNotification(error.message);
        }
    };

    const handleAddFile = (): void => {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    };

    const getAttachmentName = (attachment: File): JSX.Element => {
        return (
            <div>{attachment.name}</div>
        );
    };
    
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
    };
    
    const handleDrop = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        Array.from(files).forEach(file => {
            try {
                fileTypeValidator(file.name);
                addAttachments([file]);
            } catch (error) {
                showSnackbarNotification(error.message);
            }
        });
    };

    return (<Container>
        <FormContainer>
            <Typography variant='h5'>Drag and drop to add files, or click on the button to select files</Typography>
            <AddAttachmentContainer>
                <form>
                    <Button
                        onClick={handleAddFile}
                    >
                        Select files
                    </Button>
                    <input id="addFile" style={{ display: 'none' }} type='file' ref={inputFileRef} onChange={handleSubmitFile} />
                </form>
            </AddAttachmentContainer>
            <DragAndDropContainer
                onDrop={(event: React.DragEvent<HTMLDivElement>): void => handleDrop(event)}
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
                    boxShadow: 'none'
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
                        onClick: (_, rowData): void => removeAttachment(rowData.tableData.id)
                    }
                ]}
            />
        </FormContainer>
        <ButtonContainer>
            <Button 
                variant='outlined'
                onClick={previous}
            >
                Previous
            </Button>
            <Button
                onClick={next}
            >
                Next
            </Button>
        </ButtonContainer>
    </Container>);
};

export default Attachments;
