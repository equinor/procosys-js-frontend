import { Button, Switch, TextField } from '@equinor/eds-core-react';
import { CompletedType, Participant } from '../types';
import { Container, CustomTable, SpinnerContainer } from './style';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getFormatDate, getFormatTime } from '../utils';

import CustomTooltip from './CustomTooltip';
import Spinner from '@procosys/components/Spinner';
import { Table } from '@equinor/eds-core-react';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';

const { Head, Body, Cell, Row } = Table;
const tooltipText = <div>Punch round has been completed<br />and any punches have been added.<br />Set contractor final punch<br />actual date (M01)</div>;

interface Props {
    participants: Participant[];
    completed: CompletedType;
    completePunchOut: (participants: Participant[], index: number) => Promise<any>;
}

const ParticipantsTable = ({participants, completed, completePunchOut}: Props): JSX.Element => {
    const [data, setData] = useState<Participant[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const btnRef = useRef<HTMLButtonElement>();

    useEffect(() => {
        setData(participants);
    }, [participants]);

    const getSignedProperty = useCallback((participant: Participant, handleCompletePunchOut: (index: number) => void): JSX.Element => {
        if (completed.completedBy && completed.completedBy === participant.name) {
            return <span>{completed.completedBy}</span>;
        // TODO: Determine participant permission for current user
        } else if (participant.id === 0) {
            return (
                <CustomTooltip title={tooltipText} arrow>
                    <Button tooltip={tooltipText} ref={btnRef} onClick={handleCompletePunchOut}>Complete punch out</Button>
                </CustomTooltip>
            );
        } else {
            return <span>-</span>;
        }
    }, [completed]);

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
                        <Cell as="th" scope="col" style={{verticalAlign: 'middle'}}>Signed at</Cell>
                    </Row>
                </Head>
                <Body>
                    {data && data.length > 0 && data.map((participant: Participant, index: number) => (
                        <Row key={index} as="tr">
                            <Cell as="td" style={{verticalAlign: 'middle'}}>{participant.role}</Cell>
                            <Cell as="td" style={{verticalAlign: 'middle'}}>{participant.name}</Cell>
                            <Cell as="td" style={{verticalAlign: 'middle'}}>{participant.response}</Cell>
                            <Cell as="td" style={{verticalAlign: 'middle', minWidth: '160px'}}>
                                <Switch default label={participant.attended ? 'Attended' : 'Did not attend'} checked={participant.attended} onChange={(): void => handleEditAttended(index)}/>
                            </Cell>
                            <Cell as="td" style={{verticalAlign: 'middle', width: '40%', minWidth: '200px'}}>
                                <TextField id={`${participant.id}`} value={participant.notes} onChange={(e: any): void => handleEditNotes(e, index)} />
                            </Cell>
                            <Cell as="td" style={{verticalAlign: 'middle', minWidth: '160px'}}>
                                {getSignedProperty(participant, () => handleCompletePunchOut(index))}
                            </Cell>
                            <Cell as="td" style={{verticalAlign: 'middle', minWidth: '150px'}}>
                                {(completed.completedAt && completed.completedBy === participant.name)  
                                    ? `${getFormatDate(completed.completedAt)} ${getFormatTime(completed.completedAt)}` 
                                    : '-'}
                            </Cell>
                        </Row>
                    ))}
                </Body>
            </CustomTable> 
        </Container>
    );
};

export default ParticipantsTable;
