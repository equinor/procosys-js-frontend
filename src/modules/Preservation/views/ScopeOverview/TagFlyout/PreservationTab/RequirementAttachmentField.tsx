import React, { useRef, useState } from 'react';

import { TagRequirementField } from '../types';
import { usePreservationContext } from '@procosys/modules/Preservation/context/PreservationContext';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import Spinner from '@procosys/components/Spinner';
import { Button } from '@equinor/eds-core-react';
import EdsIcon from '@procosys/components/EdsIcon';
import { tokens } from '@equinor/eds-tokens';
import {
    SelectFileButton,
    SelectFileLabel,
    AttachmentLink,
} from './Requirements.style';

const deleteIcon = (
    <EdsIcon
        color={tokens.colors.interactive.primary__resting.rgba}
        name="delete_to_trash"
        size={16}
    />
);

interface RequirementAttachmentFieldProps {
    requirementId: number;
    field: TagRequirementField;
    tagId: number;
    onAttachmentUpdated: () => void;
}

const RequirementAttachmentField = ({
    requirementId,
    field,
    tagId,
    onAttachmentUpdated,
}: RequirementAttachmentFieldProps): JSX.Element => {
    const { apiClient } = usePreservationContext();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [filename, setFilename] = useState<string | null>(
        field.currentValue && field.currentValue.fileName
            ? field.currentValue.fileName
            : null
    );

    const downloadAttachment = async (): Promise<void> => {
        try {
            const url =
                await apiClient.getDownloadUrlForAttachmentOnTagRequirement(
                    tagId,
                    requirementId,
                    field.id
                );
            window.open(url, '_blank');
            showSnackbarNotification('Attachment is downloaded.', 5000, true);
        } catch (error) {
            console.error(
                'Not able to get download url for tag requirement attachment: ',
                error.message,
                error.data
            );
            showSnackbarNotification(error.message, 5000, true);
        }
    };

    const recordAttachment = async (file: File): Promise<void> => {
        try {
            console.log('adding file to ' + requirementId);
            setIsLoading(true);
            await apiClient.recordAttachmentOnTagRequirement(
                tagId,
                requirementId,
                field.id,
                file
            );
            if (field.currentValue) {
                setFilename(file.name);
            }
            showSnackbarNotification(
                `Attachment with filename '${file.name}' is added to tag requirement.`,
                5000,
                true
            );
        } catch (error) {
            console.error(
                'Upload file attachment failed: ',
                error.message,
                error.data
            );
            showSnackbarNotification(error.message, 5000, true);
        } finally {
            onAttachmentUpdated();
        }
        setIsLoading(false);
    };

    const deleteAttachment = async (): Promise<void> => {
        try {
            setIsLoading(true);
            await apiClient.removeAttachmentOnTagRequirement(
                tagId,
                requirementId,
                field.id
            );
            setFilename(null);
            showSnackbarNotification('Attachment is deleted.', 5000, true);
        } catch (error) {
            console.error(
                'Not able to delete attachment on tag requirement: ',
                error.message,
                error.data
            );
            showSnackbarNotification(error.message, 5000, true);
        } finally {
            onAttachmentUpdated();
        }
        setIsLoading(false);
    };

    const handleSubmitFile = (e: any): void => {
        console.log('handled submit file on ' + requirementId);
        e.preventDefault();
        const file = e.target.files[0];
        recordAttachment(file);
    };

    const inputFileRef = useRef<HTMLInputElement>(null);

    const handleAddFile = (): void => {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    };

    if (isLoading) {
        return (
            <div style={{ margin: 'calc(var(--grid-unit) * 5) auto' }}>
                <Spinner large />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filename && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <AttachmentLink onClick={downloadAttachment}>
                        {filename}
                    </AttachmentLink>
                    <Button variant="ghost" onClick={deleteAttachment}>
                        {deleteIcon}
                    </Button>
                </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ marginTop: 'var(--grid-unit)' }}>
                    <form>
                        <SelectFileButton onClick={handleAddFile}>
                            Select file
                        </SelectFileButton>
                        <input
                            id="uploadFile"
                            style={{ display: 'none' }}
                            type="file"
                            ref={inputFileRef}
                            onChange={handleSubmitFile}
                        />
                    </form>
                </div>
                <SelectFileLabel>{field.label}</SelectFileLabel>
            </div>
        </div>
    );
};

export default RequirementAttachmentField;
