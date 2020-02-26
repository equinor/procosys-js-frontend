import React, { useState, useEffect } from 'react';

import { Button, TextField, Typography } from '@equinor/eds-core-react';
import { TagRequirement, TagRequirementField, TagRequirementRecordValues } from './../types';
import RequirementNumberField from './RequirementNumberField';
import RequirementCheckboxField from './RequirementCheckboxField';
import PreservationIcon from '../../../PreservationIcon';
import { Container, Section, Field, NextInfo } from './Requirements.style';

interface RequirementProps {
    requirements: TagRequirement[];
    readonly: boolean;
    recordTagRequirementValues: (values: TagRequirementRecordValues) => void;
}

const Requirements = ({
    requirements,
    readonly,
    recordTagRequirementValues
}: RequirementProps): JSX.Element => {

    const [requirementValues, setRequirementValues] = useState<TagRequirementRecordValues[]>([]);

    useEffect((): void => {
        // reset values when requirements are updated
        setRequirementValues([]);
    }, [requirements]);

    const setFieldValue = (requirementId: number, fieldId: number, value: string): void => {
        const newRequirementValues = [...requirementValues];
        const requirement = newRequirementValues.find(value => value.requirementId == requirementId);

        if (requirement) {
            const fieldIndex = requirement.fieldValues.findIndex(field => field.fieldId == fieldId);

            if (fieldIndex > -1) {
                requirement.fieldValues[fieldIndex].value = value;
            } else {
                requirement.fieldValues.push({
                    fieldId: fieldId,
                    value: value
                });
            }
        } else {
            newRequirementValues.push({
                requirementId: requirementId,
                comment: null,
                fieldValues: [
                    {
                        fieldId: fieldId,
                        value: value
                    }
                ]
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
                fieldValues: []
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
                        setFieldValue={setFieldValue} 
                    />
                );
            case 'number':
                return (
                    <RequirementNumberField 
                        requirementId={requirementId} 
                        field={field} 
                        readonly={readonly} 
                        setFieldValue={setFieldValue} 
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
                                        onClick={(): void => console.log('TODO: PBI #71519')}
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
