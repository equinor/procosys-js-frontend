import React from 'react';

import { TagRequirementField } from './../types';
import { TextField } from '@equinor/eds-core-react';

interface RequirementNumberFieldProps {
    requirementId: number;
    field: TagRequirementField;
    readonly: boolean;
    setFieldValue: (requirementId: number, fieldId: number, value: string) => void;
}

const RequirementNumberField = ({
    requirementId,
    field,
    readonly,
    setFieldValue
}: RequirementNumberFieldProps): JSX.Element => {

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
                    onChange={(event: React.FormEvent<HTMLInputElement>): void => {
                        setFieldValue(requirementId, field.id, event.currentTarget.value);
                    }}
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

export default RequirementNumberField;