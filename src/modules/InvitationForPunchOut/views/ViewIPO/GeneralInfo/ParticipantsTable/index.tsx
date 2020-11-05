import { ApprovedType, CompletedType, Participant } from '../types';
import { Button, Switch, TextField } from '@equinor/eds-core-react';
import { Container, CustomTable, SpinnerContainer } from './style';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getFormatDate, getFormatTime } from '../utils';

import CustomTooltip from './CustomTooltip';
import Spinner from '@procosys/components/Spinner';
import { Table } from '@equinor/eds-core-react';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';

const { Head, Body, Cell, Row } = Table;
const tooltipComplete = <div>Punch round has been completed<br />and any punches have been added.<br />Set contractor final punch<br />actual date (M01)</div>;
const tooltipApprove = <div>Punch round has been completed<br />and and checked by company</div>;

enum OrganizationsEnum {
    Commissioning = 'Commissioning',
    ConstructionCompany = 'Construction company',
    Contractor = 'Contractor',
    Operation = 'Operation',
    TechnicalIntegrity = 'Technical integrity',
    Supplier = 'Supplier',
    External = 'Guest user (external)',
};


interface Props {
    participants: Participant[];
    completed: CompletedType;
    approved: ApprovedType;
    completePunchOut: (index: number) => Promise<any>;
    approvePunchOut: (index: number) => Promise<any>;
}

const ParticipantsTable = ({participants, completed, approved, completePunchOut, approvePunchOut}: Props): JSX.Element => {
    const [data, setData] = useState<Participant[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const btnCompleteRef = useRef<HTMLButtonElement>();
    const btnApproveRef = useRef<HTMLButtonElement>();

    useEffect(() => {
        setData(participants);
    }, [participants]);

    const getSignedProperty = useCallback((participant: Participant, handleCompletePunchOut: (index: number) => void, handleApprovePunchOut: (index: number) => void): JSX.Element => {
        if (completed.completedBy && completed.completedBy === participant.name) {
            return <span>{completed.completedBy}</span>;
        } else if (approved.approvedBy && approved.approvedBy === participant.name) {
            return <span>{approved.approvedBy}</span>;
        } else if (participant.role === OrganizationsEnum.Contractor) {
            return (
                <CustomTooltip title={tooltipComplete} arrow>
                    <Button ref={btnCompleteRef} onClick={handleCompletePunchOut}>Complete punch out</Button>
                </CustomTooltip>
            );
        } else if (completed.completedBy && participant.role === OrganizationsEnum.ConstructionCompany) {
            return (
                <CustomTooltip title={tooltipApprove} arrow>
                    <Button ref={btnApproveRef} onClick={handleApprovePunchOut}>Approve punch out</Button>
                </CustomTooltip>
            );
        } else {
            return <span>-</span>;
        }
    }, [completed, approved]);

    const handleCompletePunchOut = async (index: number): Promise<any> => {
        setLoading(true);
        if (btnCompleteRef.current) {
            btnCompleteRef.current.setAttribute('disabled', 'disabled');
        }
        try {
            await completePunchOut(index);
        } catch (error) {
            if (btnCompleteRef.current) {
                btnCompleteRef.current.removeAttribute('disabled');
            }
            showSnackbarNotification(error.message, 2000, true);
            setLoading(false);
        }     
        showSnackbarNotification('Punch out completed', 2000, true);
        setLoading(false);
    };

    const handleApprovePunchOut = async (index: number): Promise<any> => {
        setLoading(true);
        if (btnApproveRef.current) {
            btnApproveRef.current.setAttribute('disabled', 'disabled');
        }
        try {
            await approvePunchOut(index);
        } catch (error) {
            if (btnApproveRef.current) {
                btnApproveRef.current.removeAttribute('disabled');
            }
            showSnackbarNotification(error.message, 2000, true);
            setLoading(false);
        }     
        showSnackbarNotification('Punch out approved', 2000, true);
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
                                <Switch disabled={!!completed.completedBy} default label={participant.attended ? 'Attended' : 'Did not attend'} checked={participant.attended} onChange={(): void => handleEditAttended(index)}/>
                            </Cell>
                            <Cell as="td" style={{verticalAlign: 'middle', width: '40%', minWidth: '200px'}}>
                                <TextField disabled={!!completed.completedBy} value={participant.notes} onChange={(e: any): void => handleEditNotes(e, index)} />
                            </Cell>
                            <Cell as="td" style={{verticalAlign: 'middle', minWidth: '160px'}}>
                                {getSignedProperty(participant, () => handleCompletePunchOut(index), () => handleApprovePunchOut(index))}
                            </Cell>
                            <Cell as="td" style={{verticalAlign: 'middle', minWidth: '150px'}}>
                                {(completed.completedAt && completed.completedBy === participant.name)  
                                    ? `${getFormatDate(completed.completedAt)} ${getFormatTime(completed.completedAt)}` 
                                    : (approved.approvedAt && approved.approvedBy === participant.name)  
                                        ? `${getFormatDate(approved.approvedAt)} ${getFormatTime(approved.approvedAt)}` 
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
