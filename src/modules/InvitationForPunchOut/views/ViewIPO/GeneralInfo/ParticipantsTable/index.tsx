import { ApprovedType, CompletedType, Participant } from '../../types';
import { Button, Switch, TextField } from '@equinor/eds-core-react';
import { Container, CustomTable, SpinnerContainer } from './style';
import { OrganizationMap, OrganizationsEnum } from '../../utils';
import React, { useCallback, useRef, useState } from 'react';

import CustomTooltip from './CustomTooltip';
import { Organization } from '../../../../types';
import Spinner from '@procosys/components/Spinner';
import { Table } from '@equinor/eds-core-react';
import { format } from 'date-fns';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';

const { Head, Body, Cell, Row } = Table;
const tooltipComplete = <div>Punch round has been completed<br />and any punches have been added.<br />Set contractor final punch<br />actual date (M01)</div>;
const tooltipApprove = <div>Punch round has been completed<br />and and checked by company</div>;



type EditData = {
    id: number | null;
    attended: boolean;
    notes: string;
};

interface Props {
    participants: Participant[];
    completed: CompletedType;
    approved: ApprovedType;
    completePunchOut: (index: number) => Promise<any>;
    approvePunchOut: (index: number) => Promise<any>;
}

const ParticipantsTable = ({participants, completed, approved, completePunchOut, approvePunchOut}: Props): JSX.Element => {
    const [loading, setLoading] = useState<boolean>(false);
    const btnCompleteRef = useRef<HTMLButtonElement>();
    const btnApproveRef = useRef<HTMLButtonElement>();
    const [editData, setEditData] = useState<EditData[]>([]);


    const getSignedProperty = useCallback((participant: Participant, handleCompletePunchOut: (index: number) => void, handleApprovePunchOut: (index: number) => void): JSX.Element => {
        if (participant.person && completed.completedBy && completed.completedBy === participant.person.id) {
            return <span>{`${participant.person.firstName} ${participant.person.lastName}`}</span>;
        } else if (participant.person && approved.approvedBy && approved.approvedBy === participant.person.id) {
            return <span>{`${participant.person.firstName} ${participant.person.lastName}`}</span>;
        } else if (participant.organization === OrganizationsEnum.Contractor) {
            return (
                <CustomTooltip title={tooltipComplete} arrow>
                    <Button ref={btnCompleteRef} onClick={handleCompletePunchOut}>Complete punch out</Button>
                </CustomTooltip>
            );
        } else if (completed.completedBy && participant.organization === OrganizationsEnum.ConstructionCompany) {
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
        const updateData = [...editData];
        updateData[index] = { ...updateData[index], attended: !updateData[index].attended };
        setEditData([...updateData]);
    };

    const handleEditNotes = (event: any, index: number): void => {
        event.preventDefault();
        const updateData = [...editData];
        updateData[index] = { ...updateData[index], notes: event.target.value };
        setEditData([...updateData]);
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
                    {participants.map((participant: Participant, index: number) => (
                        <Row key={index} as="tr">
                            <Cell as="td" style={{verticalAlign: 'middle'}}>{OrganizationMap.get(participant.organization as Organization)}</Cell>
                            <Cell as="td" style={{verticalAlign: 'middle'}}>{
                                participant.person ? 
                                    `${participant.person.firstName} ${participant.person.lastName}` :
                                    participant.functionalRole ?
                                        participant.functionalRole.code :
                                        participant.externalEmail.externalEmail
                            }</Cell>
                            <Cell as="td" style={{verticalAlign: 'middle'}}>{
                                participant.person ?    
                                    participant.person.response :
                                    participant.functionalRole ? 
                                        participant.functionalRole.response :
                                        participant.externalEmail.response
                            }</Cell>
                            <Cell as="td" style={{verticalAlign: 'middle', minWidth: '160px'}}>
                                <Switch default label={editData[index].attended ? 'Attended' : 'Did not attend'} checked={editData[index].attended} onChange={(): void => handleEditAttended(index)}/>
                            </Cell>
                            <Cell as="td" style={{verticalAlign: 'middle', width: '40%', minWidth: '200px'}}>
                                <TextField value={editData[index].notes} onChange={(e: any): void => handleEditNotes(e, index)} />
                                <Switch label={editData[index].attended ? 'Attended' : 'Did not attend'} checked={editData[index].attended} onChange={(): void => handleEditAttended(index)}/>
                            </Cell>
                            <Cell as="td" style={{verticalAlign: 'middle', width: '40%', minWidth: '200px'}}>
                                <TextField id={`${participant.sortKey}`} value={editData[index].notes} onChange={(e: any): void => handleEditNotes(e, index)} />
                            </Cell>
                            <Cell as="td" style={{verticalAlign: 'middle', minWidth: '160px'}}>
                                {getSignedProperty(participant, () => handleCompletePunchOut(index), () => handleApprovePunchOut(index))}
                            </Cell>
                            <Cell as="td" style={{verticalAlign: 'middle', minWidth: '150px'}}>
                                {(completed.completedAt && completed.completedBy === participant.person.id)  
                                    ? `${format(completed.completedAt, 'dd/MM/yyyy HH:mm')}`
                                    : (approved.approvedAt && approved.approvedBy === participant.person.id)  
                                        ? `${format(approved.approvedAt, 'dd/MM/yyyy HH:mm')}`
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
