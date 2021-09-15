import { Button, TextField, Typography } from '@equinor/eds-core-react';
import { Container, Field, NextInfo, Section } from './Requirements.style';
import React, { useEffect, useState } from 'react';
import { TagRequirement, TagRequirementField, TagRequirementRecordValues } from './../types';

import PreservationIcon from '../../../../../../components/PreservationIcon';
import RequirementAttachmentField from './RequirementAttachmentField';
import RequirementCheckboxField from './RequirementCheckboxField';
import RequirementNumberField from './RequirementNumberField';
import { showSnackbarNotification } from './../../../../../../core/services/NotificationService';
import { useDirtyContext } from '@procosys/core/DirtyContext';

interface RequirementProps {
    tagId: number;
    requirements: TagRequirement[];
    readonly: boolean;
    recordTagRequirementValues: (values: TagRequirementRecordValues) => void;
    preserveRequirement: (requirementId: number) => void;
    refreshRequirements: () => void;
}

const moduleName = 'PreservationTagFlyoutPreservationRequirements';

const Requirements = ({
    tagId,
    requirements,
    readonly,
    recordTagRequirementValues,
    preserveRequirement,
    refreshRequirements
}: RequirementProps): JSX.Element => {

    const [requirementValues, setRequirementValues] = useState<TagRequirementRecordValues[]>([]);
    const { setDirtyStateFor, unsetDirtyStateFor } = useDirtyContext();

    const hasUnsavedChangesForRequirement = (requirementId: number): boolean => {
        if (readonly) {
            return false;
        }

        return requirementValues.findIndex(requirement => requirement.requirementId == requirementId) > -1;
    };

    const hasUnsavedChanges = (): boolean => {
        return !readonly && requirements.some(requirement => {
            if (hasUnsavedChangesForRequirement(requirement.id)) {
                return true;
            }
        });
    };

    useEffect((): void => {
        // reset values when requirements are updated
        setRequirementValues([]);
    }, [requirements]);

    /** Update global dirty state */
    useEffect(() => {
        if (hasUnsavedChanges()) {
            setDirtyStateFor(moduleName);
        } else {
            unsetDirtyStateFor(moduleName);
        }

        return (): void => {
            unsetDirtyStateFor(moduleName);
        };
    }, [requirementValues]);

    const setNumberFieldValue = (requirementId: number, fieldId: number, value: string): void => {
        const newRequirementValues = [...requirementValues];
        const requirement = newRequirementValues.find(value => value.requirementId == requirementId);

        // determine whether field value is "N/A" or an actual numeric
        value = value.trim().toLowerCase();
        const numberFieldIsNA = value === 'na' || value === 'n/a';
        const numberFieldValue = numberFieldIsNA || value === '' ? null : Number(value); // invalid numbers become "NaN" (validated at save)

        if (requirement) {
            const fieldIndex = requirement.numberValues.findIndex(field => field.fieldId == fieldId);

            if (fieldIndex > -1) {
                requirement.numberValues[fieldIndex].value = numberFieldValue;
                requirement.numberValues[fieldIndex].isNA = numberFieldIsNA;
            } else {
                requirement.numberValues.push({
                    fieldId: fieldId,
                    value: numberFieldValue,
                    isNA: numberFieldIsNA
                });
            }
        } else {
            newRequirementValues.push({
                requirementId: requirementId,
                comment: null,
                numberValues: [
                    {
                        fieldId: fieldId,
                        value: numberFieldValue,
                        isNA: numberFieldIsNA
                    }
                ],
                checkBoxValues: []
            });
        }

        setRequirementValues(newRequirementValues);
    };

    const setCheckBoxFieldValue = (requirementId: number, fieldId: number, isChecked: boolean): void => {
        const newRequirementValues = [...requirementValues];
        const requirement = newRequirementValues.find(value => value.requirementId == requirementId);

        if (requirement) {
            const fieldIndex = requirement.checkBoxValues.findIndex(field => field.fieldId == fieldId);
            if (fieldIndex > -1) {
                requirement.checkBoxValues[fieldIndex].isChecked = isChecked;
            } else {
                requirement.checkBoxValues.push({
                    fieldId: fieldId,
                    isChecked: isChecked
                });
            }
        } else {
            newRequirementValues.push({
                requirementId: requirementId,
                comment: null,
                checkBoxValues: [
                    {
                        fieldId: fieldId,
                        isChecked: isChecked
                    }
                ],
                numberValues: []
            });
        }

        setRequirementValues(newRequirementValues);
    };

    const setComment = (requirementId: number, comment: string): void => {
        const newRequirementValues = [...requirementValues];
        const requirement = newRequirementValues.find(value => value.requirementId == requirementId);

        if (requirement) {
            requirement.comment = comment;
        } else {
            newRequirementValues.push({
                requirementId: requirementId,
                comment: comment,
                numberValues: [],
                checkBoxValues: []
            });
        }

        setRequirementValues(newRequirementValues);
    };

    const saveRequirement = (requirementId: number): void => {
        const requirement = requirementValues.find(req => req.requirementId == requirementId);

        if (!requirement) {
            console.error(`No values to record found for requirementId ${requirementId}`);
            return;
        }

        // validate number fields
        let numbersAreValid = true;
        if (requirement.numberValues) {
            requirement.numberValues.forEach(number => {
                if (!number.isNA && number.value !== null && isNaN(number.value)) {
                    numbersAreValid = false;
                }
            });
        }

        if (!numbersAreValid) {
            showSnackbarNotification('Invalid number value.', 5000, true);
            return;
        }

        recordTagRequirementValues(requirement);
    };

    const isPreserveButtonEnabled = (requirementId: number, isReadyToBePreserved: boolean): boolean => {
        if (readonly) {
            return false;
        }

        // has unsaved changes
        if (requirementValues.findIndex(requirement => requirement.requirementId == requirementId) > -1) {
            return false;
        }

        return isReadyToBePreserved;
    };

    const getCheckboxValue = (requirementId: number, field: TagRequirementField): boolean | undefined => {
        const requirement = requirementValues.find(value => value.requirementId == requirementId);
        if (requirement) {
            const fieldIndex = requirement.checkBoxValues.findIndex(f => f.fieldId == field.id);
            if (fieldIndex > -1) {
                return requirement.checkBoxValues[fieldIndex].isChecked;
            }
        }
        return field.currentValue ? field.currentValue.isChecked : false;
    };

    const getRequirementField = (requirementId: number, field: TagRequirementField): JSX.Element => {

        switch (field.fieldType.toLowerCase()) {
            case 'info':
                return <Typography variant='body_long'>{field.label}</Typography>;
            case 'checkbox':
                return (
                    <RequirementCheckboxField
                        requirementId={requirementId}
                        field={field}
                        readonly={readonly}
                        isChecked={getCheckboxValue(requirementId, field)}
                        onFieldChange={setCheckBoxFieldValue}
                    />
                );
            case 'number':
                return (
                    <RequirementNumberField
                        requirementId={requirementId}
                        field={field}
                        readonly={readonly}
                        onFieldChange={setNumberFieldValue}
                    />
                );
            case 'attachment':
                return (
                    <RequirementAttachmentField
                        requirementId={requirementId}
                        field={field}
                        tagId={tagId}
                        onAttachmentUpdated={refreshRequirements}
                    />
                );

            default:
                return <div>Unknown field type</div>;
        }
    };

    return (
        <div>
            {
                requirements.map(requirement => {
                    const isOverdue = requirement.nextDueWeeks < 0;

                    return (
                        <Container key={requirement.id}>
                            <Section>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant='h4'>
                                        {requirement.requirementType.title}
                                    </Typography>
                                    <div style={{ marginLeft: 'calc(var(--grid-unit) * 2)' }}>
                                        <PreservationIcon variant={requirement.requirementType.icon} />
                                    </div>
                                </div>
                                <Typography variant='h6'>
                                    {requirement.requirementDefinition.title}
                                </Typography>
                                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', marginTop: 'var(--grid-unit)' }}>
                                    <Typography variant='caption'>Interval</Typography>
                                    <Typography variant='body_short' bold style={{ marginLeft: 'var(--grid-unit)' }}>{`${requirement.intervalWeeks} weeks`}</Typography>
                                    <Typography variant='caption' style={{ marginLeft: 'calc(var(--grid-unit) * 3)' }}>Next</Typography>
                                    <Typography variant='body_short' bold style={{ marginLeft: 'var(--grid-unit)' }}>
                                        <NextInfo isOverdue={isOverdue}>
                                            {requirement.nextDueAsYearAndWeek}
                                        </NextInfo>
                                    </Typography>
                                    <Typography variant='caption' style={{ marginLeft: 'calc(var(--grid-unit) * 3)' }}>Due</Typography>
                                    <Typography variant='body_short' bold style={{ marginLeft: 'var(--grid-unit)' }}>
                                        <NextInfo isOverdue={isOverdue}>
                                            {requirement.nextDueWeeks}
                                        </NextInfo>
                                    </Typography>
                                </div>
                            </Section>
                            <Section>
                                {
                                    requirement.fields.map(field => {
                                        return (
                                            <Field key={field.id}>
                                                {
                                                    getRequirementField(requirement.id, field)
                                                }
                                            </Field>
                                        );
                                    })
                                }
                            </Section>
                            <Section>
                                <TextField
                                    id={`requirementComment${requirement.id}`}
                                    label='Comment for this preservation period'
                                    placeholder='Write here'
                                    disabled={readonly}
                                    defaultValue={requirement.comment}
                                    meta="Optional"
                                    onChange={(event: React.FormEvent<HTMLInputElement>): void => {
                                        setComment(requirement.id, event.currentTarget.value);
                                    }}
                                />
                            </Section>
                            <Section>
                                <div style={{ display: 'flex', marginTop: 'var(--grid-unit)', justifyContent: 'flex-end' }}>
                                    <Button
                                        disabled={!hasUnsavedChangesForRequirement(requirement.id)}
                                        onClick={(): void => saveRequirement(requirement.id)}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        disabled={!isPreserveButtonEnabled(requirement.id, requirement.readyToBePreserved)}
                                        onClick={(): void => preserveRequirement(requirement.id)}
                                        style={{ marginLeft: 'calc(var(--grid-unit) * 2)' }}
                                    >
                                        Preserved this week
                                    </Button>
                                </div>
                            </Section>
                        </Container>
                    );
                })
            }
        </div>
    );
};

export default Requirements;
