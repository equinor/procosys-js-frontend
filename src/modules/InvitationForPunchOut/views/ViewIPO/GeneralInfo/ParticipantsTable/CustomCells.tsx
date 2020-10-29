import { Tooltip, withStyles } from '@material-ui/core';

import React from 'react';
import { Switch } from '@equinor/eds-core-react';

export const CustomTooltip = withStyles({
    tooltip: {
        backgroundColor: '#000',
        width: '191px',
        textAlign: 'center'
    }
})(Tooltip);

interface AttendedProps {
    status: boolean;
    onChange: (e: any) => void;
}

export const AttendedEditCell = ({status, onChange}: AttendedProps): JSX.Element => {
    return (
        <div style={{display: 'flex', alignItems: 'center'}}>
            <Switch default label={status ? 'Attended' : 'Did not attend'} checked={status} onChange={(): void => onChange(!status)}/>
        </div>
    );
};

