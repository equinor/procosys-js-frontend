import React from 'react';

import { Button, TextField, Typography } from '@equinor/eds-core-react';
import { TagRequirement, TagRequirementField } from './../types';
import Checkbox from './../../../../../../components/Checkbox';
import PreservationIcon from '../../../PreservationIcon';
import Spinner from '../../../../../../components/Spinner';
import { Container, Section, Field, NextInfo } from './Requirements.style';

interface RequirementProps {
    requirements: TagRequirement[] | undefined;
    readonly: boolean;
}

const Requirements = ({
    requirements,
    readonly
}: RequirementProps): JSX.Element => {

    const getNumberField = (field: TagRequirementField): JSX.Element => {
        let currentValue: string | number | null = '';
        if (field.currentValue) {
            currentValue = field.currentValue.isNA ? 'N/A' : field.currentValue.value;
        }

        let previousValue: string | number | null = '';
        if (field.previousValue) {
            previousValue = field.previousValue.isNA ? 'N/A' : field.previousValue.value;
        }

        return (
            <div style={{display: 'flex', alignItems: 'flex-end'}}>
                <div style={{maxWidth: '25%'}}>
                    <TextField
                        id={`field${field.id}`}
                        label={field.label}
                        meta={`(${field.unit})`}
                        defaultValue={currentValue}
                        disabled={readonly}
                    />
                </div>
                {
                    field.showPrevious &&
                    <div style={{maxWidth: '25%', marginLeft: 'calc(var(--grid-unit) * 3)'}}>
                        <TextField
                            id={`fieldPrevious${field.id}`}
                            label='Previous value'
                            meta={`(${field.unit})`}
                            defaultValue={previousValue}
                            disabled
                        />
                    </div>                            
                }
            </div>
        );
    };

    const getCheckboxField = (field: TagRequirementField): JSX.Element => {
        const isChecked = field.currentValue && field.currentValue.isChecked;

        return (
            <Checkbox checked={isChecked} disabled={readonly}>
                <Typography variant='body_long'>{field.label}</Typography>
            </Checkbox>
        );
    };

    const getRequirementField = (field: TagRequirementField): JSX.Element => {
        switch (field.fieldType.toLowerCase()) {
            case 'info':
                return <Typography variant='body_long'>{field.label}</Typography>;
            case 'checkbox':
                return getCheckboxField(field);
            case 'number':
                return getNumberField(field);
            default:
                return <div>Unknown field type</div>;
        }
    };

    if (requirements === undefined) {
        return <div style={{margin: 'calc(var(--grid-unit) * 5) auto'}}><Spinner medium /></div>;
    }

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
                                                    getRequirementField(field)
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
                                />
                            </Section>
                            <Section>
                                <div style={{display: 'flex', marginTop: 'var(--grid-unit)', justifyContent: 'flex-end'}}>
                                    <Button disabled>Save</Button>
                                    <Button disabled style={{marginLeft: 'calc(var(--grid-unit) * 2)'}}>Preserved this week</Button>
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
