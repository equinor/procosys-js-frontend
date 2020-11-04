import { Switch, Typography } from '@equinor/eds-core-react';
import { Tooltip, withStyles } from '@material-ui/core';

import React from 'react';

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
    disabled: boolean;
}

export const AttendedEditCell = ({status, onChange, disabled}: AttendedProps): JSX.Element => {
    return (
        <div style={{display: 'flex', alignItems: 'center'}}>
            <Switch default disabled={disabled} checked={status} onChange={(): void => onChange(!status)}/>
            <Typography variant='body_long'>
                {status ? 'Attended' : 'Did not attend'}
            </Typography>
        </div>
    );
};

