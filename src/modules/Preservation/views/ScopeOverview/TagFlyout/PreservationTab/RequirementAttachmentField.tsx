import React, { useState } from 'react';

import { TagRequirementField } from '../types';
import { usePreservationContext } from '@procosys/modules/Preservation/context/PreservationContext';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import Spinner from '@procosys/components/Spinner';
import { Button } from '@equinor/eds-core-react';
import EdsIcon from '@procosys/components/EdsIcon';
import { tokens } from '@equinor/eds-tokens';
import { SelectFileLabel, AttachmentLink } from './Requirements.style';

const deleteIcon = <EdsIcon color={tokens.colors.interactive.primary__resting.rgba} name='delete_to_trash' size={16} />;

interface RequirementAttachmentFieldProps {
    requirementId: number;
    field: TagRequirementField;
    tagId: number;
}

const RequirementAttachmentField = ({
    requirementId,
    field,
    tagId
}: RequirementAttachmentFieldProps): JSX.Element => {

    const { apiClient } = usePreservationContext();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [filename, setFilename] = useState<string | null>(field.currentValue && field.currentValue.fileName ? field.currentValue.fileName : null);

    const downloadAttachment = async (): Promise<void> => {
        try {
            const url = await apiClient.getDownloadUrlForAttachmentOnTagRequirement(tagId, requirementId, field.id);
            window.open(url, '_blank');
            showSnackbarNotification('Attachment is downloaded.', 5000, true);
        } catch (error) {
            console.error('Not able to get download url for tag requirement attachment: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000, true);
        }
    };

    const recordAttachment = async (file: File): Promise<void> => {
        try {
            setIsLoading(true);
            await apiClient.recordAttachmentOnTagRequirement(tagId, requirementId, field.id, file);
            if (field.currentValue) {
                setFilename(file.name);
            }
            showSnackbarNotification(`Attachment with filename '${file.name}' is added to tag requirement.`, 5000, true);
        } catch (error) {
            console.error('Upload file attachment failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000, true);
        }
        setIsLoading(false);
    };

    const deleteAttachment = async (): Promise<void> => {
        try {
            setIsLoading(true);
            await apiClient.removeAttachmentOnTagRequirement(tagId, requirementId, field.id);
            setFilename(null);
            showSnackbarNotification('Attachment is deleted.', 5000, true);
        } catch (error) {
            console.error('Not able to delete attachment on tag requirement: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000, true);
        }
        setIsLoading(false);
    };

    const handleSubmitFile = (e: any): void => {
        e.preventDefault();
        const file = e.target.files[0];
        recordAttachment(file);
    };

    if (isLoading) {
        return (
            <div style={{ margin: 'calc(var(--grid-unit) * 5) auto' }}><Spinner large /></div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {
                filename &&
                < div style={{ display: 'flex', alignItems: 'center' }}>
                    <AttachmentLink onClick={downloadAttachment}>
                        {filename}
                    </AttachmentLink>
                    <Button variant='ghost' onClick={deleteAttachment}>
                        {deleteIcon}
                    </Button>
                </div>
            }
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <div style={{marginTop: 'calc(var(--grid-unit) * 2 + 3px)', marginRight: 'var(--grid-unit)'}}>
                    {field.label}
                </div>
                <div style={{ display: 'flex', marginTop: 'var(--grid-unit)' }}>
                    <form>
                        <label htmlFor="uploadFile">
                            <SelectFileLabel>Select file</SelectFileLabel>
                        </label>
                        <input id="uploadFile" style={{ display: 'none' }} type='file' onChange={handleSubmitFile} />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RequirementAttachmentField;