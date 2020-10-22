import { Switch, TextField, Typography, withStyles } from '@material-ui/core';

import MaterialTable from 'material-table';
import { Participant } from '.';
import React from 'react';

const CustomSwitch = withStyles({
    switchBase: {
        color: '#6f6f6f',
        '&$checked': {
            color: '#007079',
        },
        '&$checked + $track': {
            backgroundColor: '#e6faec',
        },
    },
    checked: {},
    track: {
        backgroundColor: '#dcdcdc',
    },
})(Switch);

const CustomTextField = withStyles({
    root: {
        background: '#f7f7f7',
    }
})(TextField);


interface AttendedProps {
    id: string;
    status: boolean;
    handleSetAttended: (id: string) => void;
}

const AttendedCell = ({id, status, handleSetAttended}: AttendedProps): JSX.Element => {
    return (
        <div style={{display: 'flex', alignItems: 'center'}}>
            <CustomSwitch checked={status} onChange={(): void => handleSetAttended(id)}/>
            <Typography variant='body2'>{status ? 'Attended' : 'Did not attend'}</Typography>
        </div>
    );
};


interface NotesCellProps {
    id: string;
    text: string;
    handleSetNotes: (e: any, id: string) => void;
}

const NotesCell = ({id, text, handleSetNotes}: NotesCellProps): JSX.Element => {
    return (
        <CustomTextField value={text} onChange={(e): void => handleSetNotes(e, id)} />
    );
};

interface Props {
    handleSetAttended: (id: string) => void;
    handleSetNotes: (e: any, id: string) => void;
    participants: Participant[];
}

const ParticipantsTable = ({participants, handleSetAttended, handleSetNotes}: Props): JSX.Element => {
    return (
        <MaterialTable 
            components={{
                Toolbar: (): null => null,                
                Pagination: (): null => null
            }}
            options={{
                headerStyle: {backgroundColor: '#f7f7f7', fontWeight: 700, fontSize: '1em'},
                rowStyle: { fontStyle: 'semibold'},
                padding: 'dense'
            }}
            columns={[
                { title: 'Attendance list', field: 'role'},
                { title: 'Representative', field: 'name'},
                { title: 'Outlook response', field: 'response'},
                { title: 'Attended', field: 'attended', render: (rowData): any => <AttendedCell id={rowData.id} status={rowData.attended} handleSetAttended={handleSetAttended}/>},
                { title: 'Note/Comment', field: 'notes', render: (rowData): any => <NotesCell id={rowData.id} text={rowData.notes} handleSetNotes={handleSetNotes} />},
                { title: 'Signed by', field: 'signedBy', render: (rowData): any => rowData.signedBy ? rowData.signedBy : '-'},
                { title: 'Signed at', field: 'signedAt', render: (rowData): any => rowData.signedAt ? rowData.signedAt : '-'},
            ]} 
            data={participants}
        />
    );
};

export default ParticipantsTable;
