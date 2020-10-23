import { AttendedEditCell, AttendedReadCell, NotesEditCell, NotesReadCell } from './CustomCells';
import MaterialTable, { Icons } from 'material-table';
import React, { forwardRef, useEffect, useState } from 'react';

import EdsIcon from '@procosys/components/EdsIcon';
import { Participant } from '../types';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';

const tableIcons: Icons = {
    Clear: forwardRef((props, ref) => <EdsIcon  name='close' ref={ref} {...props} />),
    Check: forwardRef((props, ref) => <EdsIcon color='#007079' name='done' ref={ref} {...props} />),
    Edit: forwardRef((props, ref) => <EdsIcon color='#007079' ref={ref} name="edit" {...props}/>)
};


interface Props {
    editable: boolean;
    participants: Participant[];
    setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
}

const ParticipantsTable = ({participants, setParticipants, editable}: Props): JSX.Element => {
    const [data, setData] = useState<Participant[]>([]);
    const [columns] = useState<any>(
        [
            { title: 'Attendance list', field: 'role', width: '12%', editable: 'never'},
            { title: 'Representative', field: 'name', width: '12%', editable: 'never'},
            { title: 'Outlook response', field: 'response', width: '12%', editable: 'never'},
            { 
                title: 'Attended', field: 'attended', width: '12%', editable: 'always', type: 'boolean',
                render: (rowData: any): any => <AttendedReadCell status={rowData.attended}/>, 
                editComponent: (data: any): any => {
                    return (
                        <AttendedEditCell status={data.value} onChange={data.onChange} />
                    );
                }
            },
            { 
                title: 'Note/Comment', field: 'notes', width: '28%', editable: 'always',
                render: (rowData: any): JSX.Element => <NotesReadCell value={rowData.notes} />, 
                editComponent: (rowData: any): any => <NotesEditCell value={rowData.value} onChange={rowData.onChange} />
            },
            { title: 'Signed by', field: 'signedBy', width: '12%', render: (rowData: any): any => rowData.signedBy ? rowData.signedBy : '-', editable: 'never'},
            { title: 'Signed at', field: 'signedAt', width: '12%', render: (rowData: any): any => rowData.signedAt ? rowData.signedAt : '-', editable: 'never'},
        ]
    );

    useEffect(() => {
        setData(participants);
    }, [participants]);

    return (
        <MaterialTable 
            icons={tableIcons}
            options={{
                actionsColumnIndex: -1,
                paging: false,
                sorting: false,
                search: false,
                showTitle: false,
                toolbar: editable,
                headerStyle: {backgroundColor: '#f7f7f7', fontWeight: 700, fontSize: '1em'},
                padding: 'dense',
            }}
            editable={{
                onBulkUpdate: (changes: any): Promise<any> =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            const updateData = [...data];
                            for (const index in changes) {
                                // eslint-disable-next-line no-prototype-builtins
                                if (changes.hasOwnProperty(index)) {
                                    updateData[Number(index)] = changes[index].newData;
                                }
                            }
                            setParticipants([...updateData]);
                            // TODO: sync participants
                            showSnackbarNotification('Saved successfully', 2000, true);
                            resolve();
                        }, 0);
                    })     
            }}
            columns={columns} 
            data={data} />);
};

export default ParticipantsTable;
