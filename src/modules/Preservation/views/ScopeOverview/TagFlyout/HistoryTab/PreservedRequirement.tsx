import React, { useState, useEffect } from 'react';
import Spinner from '@procosys/components/Spinner';
import PreservationIcon from '@procosys/components/PreservationIcon';
import EdsIcon from '@procosys/components/EdsIcon';
import RequirementNumberField from '../PreservationTab/RequirementNumberField';
import RequirementCheckboxField from '../PreservationTab/RequirementCheckboxField';
import { showSnackbarNotification } from '../../../../../../core/services/NotificationService';
import { Canceler } from 'axios';
import { usePreservationContext } from '../../../../context/PreservationContext';
import { TagRequirement, TagRequirementField } from '../types';
import { Section, Field, AttachmentLink } from './PreservedRequirement.style';
import { Typography, Button } from '@equinor/eds-core-react';

interface PreservedRequirementProps {
    tagId: number;
    tagRequirementId: number;
    preservationRecordGuid: string;
    close: () => void;
}

const PreservedRequirement = ({
    tagId,
    tagRequirementId,
    preservationRecordGuid,
    close
}: PreservedRequirementProps): JSX.Element => {
    const { apiClient } = usePreservationContext();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [preservationRecord, setPreservationRecord] = useState<TagRequirement | null>(null);

    const getPreservationRecord = (): Canceler | null => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                setIsLoading(true);

                const preservationRecord = await apiClient.getPreservationRecord(
                    tagId,
                    tagRequirementId,
                    preservationRecordGuid,
                    (cancel: Canceler) => requestCancellor = cancel);

                setPreservationRecord(preservationRecord);
            } catch (error) {
                console.error('Get preservation record failed: ', error.message, error.data);
                showSnackbarNotification(error.message, 5000, true);
            }

            setIsLoading(false);
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    };

    /*Get the preservation record initially */
    useEffect(() => {
        getPreservationRecord();
    }, []);

    const downloadAttachment = async (): Promise<void> => {
        try {
            const url = await apiClient.getDownloadUrlForAttachmentOnPreservationRecord(tagId, tagRequirementId, preservationRecordGuid);
            window.open(url, '_blank');
            showSnackbarNotification('Attachment is downloaded.', 5000, true);
        }
        catch (error) {
            console.error('Not able to get download url for preservation record attachment: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000, true);
        }
    };

    const getRequirementField = (field: TagRequirementField): JSX.Element => {
        switch (field.fieldType.toLowerCase()) {
            case 'info':
                return <Typography variant='body_long'>{field.label}</Typography>;
            case 'checkbox':
                return (
                    <RequirementCheckboxField
                        requirementId={0}
                        field={field}
                        readonly={true}
                        isChecked={field.currentValue && field.currentValue.isChecked}
                        onFieldChange={(): void => { return; }}
                    />
                );
            case 'number':
                return (
                    <RequirementNumberField
                        requirementId={0}
                        field={field}
                        readonly={true}
                        onFieldChange={(): void => { return; }}
                    />
                );
            case 'attachment':
                return (
                    <div>
                        <AttachmentLink onClick={downloadAttachment}>
                            {field.currentValue && field.currentValue.fileName}
                        </AttachmentLink>
                        {field.label}
                    </div>
                );
            default:
                return <div>Unknown field type</div>;
        }
    };

    if (isLoading || preservationRecord === null) {
        return (
            <div style={{ margin: 'calc(var(--grid-unit) * 5) auto', width: '10%' }}><Spinner medium /></div>
        );
    }

    return (
        <div>
            <Section>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant='h4'>
                        {preservationRecord.requirementTypeTitle}
                    </Typography>
                    <div style={{ marginLeft: 'calc(var(--grid-unit) * 2)' }}>
                        <PreservationIcon variant={preservationRecord.requirementTypeIcon} />
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <Button variant='ghost' title='Close' onClick={(): void => close()}>
                            <EdsIcon name='close' size={24} />
                        </Button>
                    </div>
                </div>
                <Typography variant='h6'>
                    {preservationRecord.requirementDefinitionTitle}
                </Typography>
                <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 'var(--grid-unit)' }}>
                    <Typography variant='caption'>Interval</Typography>
                    <Typography variant='body_short' bold style={{ marginLeft: 'var(--grid-unit)' }}>{`${preservationRecord.intervalWeeks} weeks`}</Typography>
                </div>
            </Section>
            <Section>
                {
                    preservationRecord.fields.map(field => {
                        return (
                            <Field key={field.id}>
                                {
                                    getRequirementField(field)
                                }
                            </Field>
                        );
                    })
                }
            </Section>
            <Section>
                <Typography variant='caption' style={{ marginBottom: 'var(--grid-unit)' }}>
                    Comment for this preservation period (optional)
                </Typography>
                {preservationRecord.comment ? preservationRecord.comment : '-'}
            </Section>
        </div>
    );
};

export default PreservedRequirement;
