import React, { useState, useEffect } from 'react';

import { Button, TextField, Typography } from '@equinor/eds-core-react';
import { TagRequirement, TagRequirementField, TagRequirementRecordValues } from './../types';
import RequirementNumberField from './RequirementNumberField';
import RequirementCheckboxField from './RequirementCheckboxField';
import PreservationIcon from '../../../../../../components/PreservationIcon';
import { Container, Section, Field, NextInfo } from './Requirements.style';
import { showSnackbarNotification } from './../../../../../../core/services/NotificationService';

interface RequirementProps {
    requirements: TagRequirement[];
    readonly: boolean;
    recordTagRequirementValues: (values: TagRequirementRecordValues) => void;
    preserveRequirement: (requirementId: number) => void;
}

const Requirements = ({
    requirements,
    readonly,
    recordTagRequirementValues,
    preserveRequirement
}: RequirementProps): JSX.Element => {

    const [requirementValues, setRequirementValues] = useState<TagRequirementRecordValues[]>([]);

    useEffect((): void => {
        // reset values when requirements are updated
        setRequirementValues([]);
    }, [requirements]);

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

    const isSaveButtonEnabled = (requirementId: number): boolean => {
        if (readonly) {
            return false;
        }

        return requirementValues.findIndex(requirement => requirement.requirementId == requirementId) > -1;
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
        if (requirement && field.currentValue) {
            const fieldIndex = requirement.checkBoxValues.findIndex(f => f.fieldId == field.id);
            if (fieldIndex > -1){
                return requirement.checkBoxValues[fieldIndex].isChecked;
            }
        }
        return field.currentValue && field.currentValue.isChecked;
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
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <Typography variant='h4'>
                                        {requirement.requirementTypeTitle}
                                    </Typography>
                                    <div style={{marginLeft: 'calc(var(--grid-unit) * 2)'}}>
                                        <PreservationIcon variant={requirement.requirementTypeCode} />
                                    </div>
                                </div>
                                <Typography variant='h6'>
                                    {requirement.requirementDefinitionTitle}
                                </Typography>
                                <div style={{display: 'flex', alignItems: 'baseline', marginTop: 'var(--grid-unit)'}}>
                                    <Typography variant='caption'>Interval</Typography>
                                    <Typography variant='body_short' bold style={{marginLeft: 'var(--grid-unit)'}}>{`${requirement.intervalWeeks} weeks`}</Typography>
                                    <Typography variant='caption' style={{marginLeft: 'calc(var(--grid-unit) * 4)'}}>Next</Typography>
                                    <Typography variant='body_short' bold style={{marginLeft: 'var(--grid-unit)'}}>
                                        <NextInfo isOverdue={isOverdue}>
                                            {requirement.nextDueAsYearAndWeek}
                                        </NextInfo>
                                    </Typography>
                                    <Typography variant='caption' style={{marginLeft: 'calc(var(--grid-unit) * 4)'}}>Due</Typography>
                                    <Typography variant='body_short' bold style={{marginLeft: 'var(--grid-unit)'}}>
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
                                    label='Comment for this preservation period (optional)'
                                    placeholder='Write here'
                                    disabled={readonly}
                                    defaultValue={requirement.comment}
                                    onChange={(event: React.FormEvent<HTMLInputElement>): void => {
                                        setComment(requirement.id, event.currentTarget.value);
                                    }}
                                />
                            </Section>
                            <Section>
                                <div style={{display: 'flex', marginTop: 'var(--grid-unit)', justifyContent: 'flex-end'}}>
                                    <Button
                                        disabled={!isSaveButtonEnabled(requirement.id)}
                                        onClick={(): void => saveRequirement(requirement.id)}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        disabled={!isPreserveButtonEnabled(requirement.id, requirement.readyToBePreserved)}
                                        onClick={(): void => preserveRequirement(requirement.id)}
                                        style={{marginLeft: 'calc(var(--grid-unit) * 2)'}}
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
