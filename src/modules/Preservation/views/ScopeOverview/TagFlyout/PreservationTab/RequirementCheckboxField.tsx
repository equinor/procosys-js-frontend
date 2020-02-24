import React from 'react';

import { TagRequirementField } from './../types';
import { Typography } from '@equinor/eds-core-react';
import Checkbox from './../../../../../../components/Checkbox';

interface RequirementCheckboxFieldProps {
    requirementId: number;
    field: TagRequirementField;
    readonly: boolean;
    setFieldValue: (requirementId: number, fieldId: number, value: string) => void;
}

const RequirementCheckBoxField = ({
    requirementId,
    field,
    readonly,
    setFieldValue
}: RequirementCheckboxFieldProps): JSX.Element => {

    const isChecked = field.currentValue && field.currentValue.isChecked;

    return (
        <Checkbox 
            checked={isChecked} 
            disabled={readonly}
            onChange={(checked: boolean): void => {
                setFieldValue(requirementId, field.id, checked.toString());
            }}
        >
            <Typography variant='body_long'>{field.label}</Typography>
        </Checkbox>
    );
};

export default RequirementCheckBoxField;