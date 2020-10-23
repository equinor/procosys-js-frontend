import { CustomSwitch, CustomTextField } from './CustomFields';

import React from 'react';
import { Typography } from '@material-ui/core';

interface AttendedProps {
    status: boolean;
    onChange: (e: any) => void;
}

export const AttendedEditCell = ({status, onChange}: AttendedProps): JSX.Element => {
    return (
        <div style={{display: 'flex', alignItems: 'center'}}>
            <CustomSwitch checked={status} onChange={(): void => onChange(!status)}/>
            <Typography variant='body2'>
                {status ? 'Attended' : 'Did not attend'}
            </Typography>
        </div>
    );
};
export const AttendedReadCell = ({status}: Pick<AttendedProps, 'status'>): JSX.Element => {
    return (
        <div style={{display: 'flex', alignItems: 'center'}}>
            <CustomSwitch checked={status} />
            <Typography variant='body2'>
                {status ? 'Attended' : 'Did not attend'}
            </Typography>
        </div>
    );
};


interface NotesCellProps {
    value: string;
    onChange: (e: any, index: number) => void;
    index: number;
}

export const NotesEditCell = ({value, onChange, index}: NotesCellProps): JSX.Element => {
    return (
        <CustomTextField value={value} onChange={(e: any): void => onChange(e, index)} />
    );
};

export const NotesReadCell = ({value}: Pick<NotesCellProps, 'value'>): JSX.Element => {
    return (
        <CustomTextField disabled value={value} />
    );
};
