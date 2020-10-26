import { AttendedEditCell, CustomTooltip, NotesEditCell } from './CustomCells';
import { Container, CustomTable, SpinnerContainer } from './style';
import React, { useEffect, useRef, useState } from 'react';

import { Button } from '@equinor/eds-core-react';
import { Participant } from '../types';
import Spinner from '@procosys/components/Spinner';
import { Table } from '@equinor/eds-core-react';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';

const { Head, Body, Cell, Row } = Table;
const tooltipText = <div>Punch round has been completed<br />and any punches have been added.<br />Set contractor final punch<br />actual date (M01)</div>;

interface Props {
    participants: Participant[];
    completePunchOut: (participants: Participant[], index: number) => Promise<any>;
}

const ParticipantsTable = ({participants, completePunchOut}: Props): JSX.Element => {
    const [data, setData] = useState<Participant[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const btnRef = useRef<HTMLButtonElement>();

    useEffect(() => {
        setData(participants);
    }, [participants]);

    const getSignedProperty = (participant: Participant, handleCompletePunchOut: (index: number) => void): JSX.Element => {
        if (participant.completed) {
            return <span>{participant.name}</span>;
        // TODO: Determine participant permission for current user
        } else if (participant.id === '0') {
            return (
                <CustomTooltip title={tooltipText} arrow>
                    <Button tooltip={tooltipText} ref={btnRef} onClick={handleCompletePunchOut}>Complete punch out</Button>
                </CustomTooltip>
            );
        } else {
            return <span>-</span>;
        }
    };

    const handleCompletePunchOut = async (index: number): Promise<any> => {
        setLoading(true);
        if (btnRef.current) {
            btnRef.current.setAttribute('disabled', 'disabled');
        }
        try {
            const updateData = [...data];
            updateData[index] = { ...updateData[index], completed: true};
            await completePunchOut(updateData, index);
        } catch (error) {
            if (btnRef.current) {
                btnRef.current.removeAttribute('disabled');
            }
            showSnackbarNotification(error.message, 2000, true);
            setLoading(false);
        }     
        showSnackbarNotification('Punch out completed', 2000, true);
        setLoading(false);
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
        <Container>
            {loading && (
                <SpinnerContainer>
                    <Spinner large />
                </SpinnerContainer>
            )}
            <CustomTable>
                <Head>
                    <Row>
                        <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>Attendance list </Cell>
                        <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>Representative </Cell>
                        <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>Outlook response</Cell>
                        <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>Attended</Cell>
                        <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>Notes</Cell>
                        <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>Signed by</Cell>
                    </Row>
                </Head>
                <Body>
                    {data && data.length > 0 && data.map((participant: Participant, index: number) => (
                        <Row key={index} as="tr">
                            <Cell as="td" style={{verticalAlign: 'middle'}}>{participant.role}</Cell>
                            <Cell as="td" style={{verticalAlign: 'middle'}}>{participant.name}</Cell>
                            <Cell as="td" style={{verticalAlign: 'middle'}}>{participant.response}</Cell>
                            <Cell as="td" style={{verticalAlign: 'middle', minWidth: '160px'}}>
                                <AttendedEditCell status={participant.attended} onChange={(): void => handleEditAttended(index)} />
                            </Cell>
                            <Cell as="td" style={{verticalAlign: 'middle', width: '40%', minWidth: '200px'}}>
                                <NotesEditCell value={participant.notes} onChange={handleEditNotes} index={index} />
                            </Cell>
                            <Cell as="td" style={{verticalAlign: 'middle', minWidth: '160px'}}>
                                {getSignedProperty(participant, () => handleCompletePunchOut(index))}
                            </Cell>
                        </Row>
                    ))}
                </Body>
            </CustomTable> 
        </Container>
    );
};

export default ParticipantsTable;
