import React from 'react';

import { TagRequirementField } from './../types';
import { Typography } from '@equinor/eds-core-react';
import Checkbox from './../../../../../../components/Checkbox';

interface RequirementCheckboxFieldProps {
    requirementId: number;
    field: TagRequirementField;
    readonly: boolean;
    isChecked?: boolean;
    onFieldChange: (requirementId: number, fieldId: number, isChecked: boolean) => void;
}

const RequirementCheckBoxField = ({
    requirementId,
    field,
    readonly,
    isChecked,
    onFieldChange
}: RequirementCheckboxFieldProps): JSX.Element => {

    return (
        <Checkbox
            checked={isChecked}
            disabled={readonly}
            onChange={(checked: boolean): void => {
                onFieldChange(requirementId, field.id, checked);
            }}
        >
            <Typography variant='body_long'>{field.label}</Typography>
        </Checkbox>
    );
};

export default RequirementCheckBoxField;
