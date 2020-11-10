import { ApprovedType, CompletedType, Participant, Person } from '../../types';
import { Button, Switch, TextField } from '@equinor/eds-core-react';
import { Container, CustomTable, SpinnerContainer } from './style';
import { OrganizationMap, OrganizationsEnum } from '../../utils';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import CustomTooltip from './CustomTooltip';
import { Organization } from '../../../../types';
import Spinner from '@procosys/components/Spinner';
import { Table } from '@equinor/eds-core-react';
import { format } from 'date-fns';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';

const { Head, Body, Cell, Row } = Table;
const tooltipComplete = <div>Punch round has been completed<br />and any punches have been added.<br />Set contractor final punch<br />actual date (M01)</div>;
const tooltipApprove = <div>Punch round has been completed<br />and and checked by company</div>;



export type EditData = {
    id: number;
    attended: boolean;
    notes: string;
};

interface Props {
    participants: Participant[];
    completed: CompletedType;
    approved: ApprovedType;
    completePunchOut: (index: number, editData: EditData[]) => Promise<any>;
    approvePunchOut: (index: number, editData: EditData[]) => Promise<any>;
}


const ParticipantsTable = ({participants, completed, approved, completePunchOut, approvePunchOut}: Props): JSX.Element => {
    const [loading, setLoading] = useState<boolean>(false);
    const [contractor, setContractor] = useState<boolean>(true);
    const [constructionCompany, setConstructionCompany] = useState<boolean>(true);
    const btnCompleteRef = useRef<HTMLButtonElement>();
    const btnApproveRef = useRef<HTMLButtonElement>();
    // TODO: fill from endpoint
    const [editData, setEditData] = useState<EditData[]>(Array(participants.length).fill({id: 0, attended: false, notes: ''}));

    useEffect(() => {
        // TODO: user is contractor or construction company
        // setContractor
        // setConstructionCompany
    }, []);

    const getCompleteButton = (completed: number | undefined, completePunchout: (index: number) => void): JSX.Element => {
        return (
            <CustomTooltip title={tooltipComplete} arrow>
                <Button ref={btnCompleteRef} onClick={completePunchout}>
                    {completed ? 'Save punch out' : 'Complete punch out'}
                </Button>
            </CustomTooltip>
        );    
    };

    const getApproveButton = (approvePunchout: (index: number) => void): JSX.Element => {
        return (
            <CustomTooltip title={tooltipApprove} arrow>
                <Button ref={btnApproveRef} onClick={approvePunchout}>
                    Approve punch out
                </Button>
            </CustomTooltip>
        );    
    };

    const getSignedProperty = useCallback((participant: Participant, handleCompletePunchOut: (index: number) => void, handleApprovePunchOut: (index: number) => void): JSX.Element => {
        // TODO: check if participant is current user
        // TODO: check if contractor 
        if (participant.organization === OrganizationsEnum.Contractor) {
            if (approved.approvedBy) {
                return <span>{`${participant.person.firstName} ${participant.person.lastName}`}</span>;
            } else {
                return getCompleteButton(completed.completedBy, handleCompletePunchOut);
            }
        // TODO: check if constructionCompany 
        } else if (completed.completedBy && participant.organization === OrganizationsEnum.ConstructionCompany) {
            if (approved.approvedBy) {
                return <span>{`${participant.person.firstName} ${participant.person.lastName}`}</span>;
            } else {
                return getApproveButton(handleApprovePunchOut);
            }
        } else if (participant.person && completed.completedBy && completed.completedBy === participant.person.id) {
            return <span>{`${participant.person.firstName} ${participant.person.lastName}`}</span>;
        } else if (participant.person && approved.approvedBy && approved.approvedBy === participant.person.id) {
            return <span>{`${participant.person.firstName} ${participant.person.lastName}`}</span>;
        } else {
            return <span>-</span>;
        }
    }, [completed, approved, contractor, constructionCompany]);

    const handleCompletePunchOut = async (index: number): Promise<any> => {
        setLoading(true);
        if (btnCompleteRef.current) {
            btnCompleteRef.current.setAttribute('disabled', 'disabled');
        }
        try {
            await completePunchOut(index, editData);
        } catch (error) {
            if (btnCompleteRef.current) {
                btnCompleteRef.current.removeAttribute('disabled');
            }
            showSnackbarNotification(error.message, 2000, true);
            setLoading(false);
        }     
        showSnackbarNotification(`Punch out ${completed.completedBy ? 'saved': 'completed'}`, 2000, true);
        if (btnCompleteRef.current) {
            btnCompleteRef.current.removeAttribute('disabled');
        }
        setLoading(false);
    };

    const handleApprovePunchOut = async (index: number): Promise<any> => {
        setLoading(true);
        if (btnApproveRef.current) {
            btnApproveRef.current.setAttribute('disabled', 'disabled');
        }
        try {
            await approvePunchOut(index, editData);
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
                                <Switch 
                                    disabled={!contractor} 
                                    default 
                                    label={editData[index].attended ? 'Attended' : 'Did not attend'} 
                                    checked={editData[index].attended} 
                                    onChange={(): void => handleEditAttended(index)}/>
                            </Cell>
                            <Cell as="td" style={{verticalAlign: 'middle', width: '40%', minWidth: '200px'}}>
                                <TextField 
                                    disabled={!contractor && !constructionCompany}
                                    value={editData[index].notes} 
                                    onChange={(e: any): void => handleEditNotes(e, index)} />
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
