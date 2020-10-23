import { AttendedEditCell, AttendedReadCell, NotesEditCell, NotesReadCell } from './CustomCells';
import React, { useEffect, useState } from 'react';
import { getFormatDate, getFormatTime } from '../utils';

import { Button } from '@equinor/eds-core-react';
import { Container } from '../style';
import { CustomTable } from './style';
import { Participant } from '../types';
import { Table } from '@equinor/eds-core-react';

const { Head, Body, Cell, Row } = Table;

interface Props {
    editable: boolean;
    participants: Participant[];
    setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
}

const ParticipantsTable = ({participants, setParticipants, editable}: Props): JSX.Element => {
    const [data, setData] = useState<Participant[]>([]);

    useEffect(() => {
        setData(participants);
    }, [participants]);

    const getSignedProperty = (name: string, signedBy: string | undefined, handleCompletePunchOut: (index: number) => void): JSX.Element => {
        // TODO: check participant permission
        if (signedBy) {
            return <span>{signedBy}</span>;
        } else if (name === 'Anne ASPH') {
            return <Button onClick={handleCompletePunchOut}>Complete punch out</Button>;
        } else {
            return <span>-</span>;
        }
    };

    const handleCompletePunchOut = (index: number): void => {
        const updateData = [...data];
        updateData[index] = { ...updateData[index], signedBy: updateData[index].name, signedAt: new Date()};
        setParticipants([...updateData]);
    };

    const handleEditAttended = (index: number): void => {
        const updateData = [...data];
        updateData[index].attended = !updateData[index].attended;
        setData([...updateData]);
    };

    const handleEditNotes = (event: any, index: number): void => {
        const updateData = [...data];
        updateData[index].notes = event.target.value;
        setData([...updateData]);
    };

    return (
        <CustomTable>
            <Head>
                <Row>
                    <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>
                    Attendance list 
                    </Cell>
                    <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>
                    Representative 
                    </Cell>
                    <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>
                        Outlook response
                    </Cell>
                    <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>
                    Attended 
                    </Cell>
                    <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>
                    Note/Comment 
                    </Cell>
                    <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>
                    Signed by 
                    </Cell>
                    <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>
                    Signed at 
                    </Cell>
                </Row>
            </Head>
            <Body>
                {data && data.length > 0 && participants.map((participant: Participant, index: number) => (
                    <Row key={index} as="tr">
                        <Cell as="td" style={{verticalAlign: 'middle'}}>
                            {participant.role}
                        </Cell>
                        <Cell as="td" style={{verticalAlign: 'middle'}}>
                            {participant.name}
                        </Cell>
                        <Cell as="td" style={{verticalAlign: 'middle'}}>
                            {participant.response}
                        </Cell>
                        <Cell as="td" style={{verticalAlign: 'middle'}}>
                            <AttendedEditCell status={participant.attended} onChange={(): void => handleEditAttended(index)} />
                        </Cell>
                        <Cell as="td" style={{verticalAlign: 'middle', width: '40%'}}>
                            <NotesEditCell value={participant.notes} onChange={handleEditNotes} index={index} />
                        </Cell>
                        <Cell as="td" style={{verticalAlign: 'middle', minWidth: '160px'}}>
                            {getSignedProperty(participant.name, participant.signedBy, () => handleCompletePunchOut(index))}
                        </Cell>
                        <Cell as="td" style={{verticalAlign: 'middle', minWidth: '150px'}}>
                            {participant.signedAt ? `${getFormatDate(participant.signedAt)} ${getFormatTime(participant.signedAt)}` : '-'}
                        </Cell>
                    </Row>
                ))}
            </Body>
        </CustomTable> 
    );
};

export default ParticipantsTable;
