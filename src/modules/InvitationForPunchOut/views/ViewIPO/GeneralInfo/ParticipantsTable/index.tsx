import { Button, Switch, TextField } from '@equinor/eds-core-react';
import { ComponentName, OrganizationsEnum } from '../../../enums';
import { Container, CustomTable, SpinnerContainer } from './style';
import { ExternalEmail, FunctionalRole, Participant } from '../../types';
import { IpoStatusEnum, OutlookResponseType } from '../../enums';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import CustomTooltip from './CustomTooltip';
import { Organization } from '../../../../types';
import { OrganizationMap } from '../../../utils';
import Spinner from '@procosys/components/Spinner';
import { Table } from '@equinor/eds-core-react';
import { format } from 'date-fns';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useDirtyContext } from '@procosys/core/DirtyContext';

const { Head, Body, Cell, Row } = Table;
const tooltipComplete = <div>When punch round has been completed<br />and any punches have been added.<br />Complete and go to next step.</div>;
const tooltipUpdate = <div>Update attended status and notes for participants.</div>;
const tooltipApprove = <div>Punch round has been completed<br />and checked by company</div>;


export type AttNoteData = {
    id: number;
    attended: boolean;
    note: string;
    rowVersion: string;
};

interface ParticipantsTableProps {
    participants: Participant[];
    status: string;
    complete: (p: Participant, attNoteData: AttNoteData[]) => Promise<any>;
    accept: (p: Participant, attNoteData: AttNoteData[]) => Promise<any>;
    update: (p: Participant, attNoteData: AttNoteData[]) => Promise<any>;
    sign: (p: Participant) => Promise<any>;
}


const ParticipantsTable = ({participants, status, complete, accept, update, sign }: ParticipantsTableProps): JSX.Element => {
    const cleanData = participants.map(p => {
        const x = p.person ? p.person.person : p.functionalRole ? p.functionalRole : p.externalEmail;
        const attendedStatus = status === IpoStatusEnum.PLANNED ?
            p.person ?
                p.person.response ? p.person.response === OutlookResponseType.ATTENDING : false
                : (x as FunctionalRole | ExternalEmail).response ? (x as FunctionalRole | ExternalEmail).response === OutlookResponseType.ATTENDING : false
            : p.attended;

        return {
            id: x.id,
            attended: attendedStatus,
            note: p.note ? p.note : '',
            rowVersion: x.rowVersion
        };
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [editAttendedDisabled, setEditAttendedDisabled] = useState<boolean>(true);
    const [editNotesDisabled, setEditNotesDisabled] = useState<boolean>(true);
    const btnCompleteRef = useRef<HTMLButtonElement>();
    const btnApproveRef = useRef<HTMLButtonElement>();
    const btnUpdateRef = useRef<HTMLButtonElement>();
    const [attNoteData, setAttNoteData] = useState<AttNoteData[]>(cleanData);
    const { setDirtyStateFor, unsetDirtyStateFor } = useDirtyContext();
    const btnSignRef = useRef<HTMLButtonElement>();

    useEffect(() => {
        const participant = participants.find(p => p.canSign);
        if (participant && participant.sortKey === 0 && (status === IpoStatusEnum.PLANNED || status === IpoStatusEnum.COMPLETED) ) {
            setEditAttendedDisabled(false);
            setEditNotesDisabled(false);
        } else if (participant && participant.sortKey === 1 && (status === IpoStatusEnum.COMPLETED)) {
            setEditNotesDisabled(false);
        } else {
            setEditAttendedDisabled(true);
            setEditNotesDisabled(true);
        }
    }, [participants, status]); 


    useEffect(() => {
        if (JSON.stringify(attNoteData) !== JSON.stringify(cleanData)) {
            setDirtyStateFor(ComponentName.ParticipantsTable);
            if (btnUpdateRef.current) btnUpdateRef.current.removeAttribute('disabled');
        } else {
            unsetDirtyStateFor(ComponentName.ParticipantsTable);
            if (btnUpdateRef.current) btnUpdateRef.current.setAttribute('disabled', 'disabled');
        }
    }, [attNoteData]);

    const getCompleteButton = (completePunchout: (index: number) => void): JSX.Element => {
        return (
            <CustomTooltip title={tooltipComplete} arrow>
                <Button ref={btnCompleteRef} onClick={completePunchout}>
                    Complete punch out
                </Button>
            </CustomTooltip>
        );    
    };

    const getUpdateParticipantsButton = (updateParticipants: (index: number) => void): JSX.Element => {
        return (
            <CustomTooltip title={tooltipUpdate} arrow>
                <span>
                    <Button ref={btnUpdateRef} onClick={updateParticipants}>
                        Update
                    </Button>
                </span>
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

    const getSignButton = (signPunchOut: (index: number) => void): JSX.Element => {
        return (
            <Button ref={btnSignRef} onClick={signPunchOut}>
                    Sign punch out
            </Button>
        );
    };

    const getSignedProperty = useCallback((
        participant: Participant,
        status: string,
        handleCompletePunchOut: (index: number) => void,
        handleApprovePunchOut: (index: number) => void,
        handleUpdateParticipants: (index: number) => void,
        handleSignPunchOut: (index: number) => void): JSX.Element => {

        switch (participant.organization) {
            case OrganizationsEnum.Contractor:
                if (participant.sortKey === 0) {
                    if ((participant.signedBy && status === IpoStatusEnum.ACCEPTED) || (!participant.canSign && status === IpoStatusEnum.COMPLETED)) {
                        return <span>{`${participant.signedBy}`}</span>;
                    } else if (participant.canSign && status === IpoStatusEnum.PLANNED)  {
                        return getCompleteButton(handleCompletePunchOut);
                    } else if (participant.canSign && status === IpoStatusEnum.COMPLETED) {
                        return getUpdateParticipantsButton(handleUpdateParticipants);
                    } 
                } else {
                    if (participant.signedBy) {
                        return <span>{`${participant.signedBy}`}</span>;
                    } else if (participant.canSign && status !== IpoStatusEnum.CANCELED) {
                        return getSignButton(handleSignPunchOut);
                    }
                }
                break;
            case OrganizationsEnum.ConstructionCompany:
                if (participant.signedBy) {
                    return <span>{`${participant.signedBy}`}</span>;
                }

                if (participant.canSign && status !== IpoStatusEnum.CANCELED) {
                    if (participant.sortKey === 1) {
                        if (status === IpoStatusEnum.COMPLETED) return getApproveButton(handleApprovePunchOut);
                    } else {
                        return getSignButton(handleSignPunchOut);
                    }
                }
                break;
            case OrganizationsEnum.Operation:
            case OrganizationsEnum.TechnicalIntegrity:
            case OrganizationsEnum.Commissioning:
                if (participant.signedBy) {
                    return <span>{`${participant.signedBy}`}</span>;
                } else if (participant.canSign && status !==  IpoStatusEnum.CANCELED) {
                    return getSignButton(handleSignPunchOut);
                }
                break;
        }

        return <span>-</span>;
    }, [status]);

    const handleCompletePunchOut = async (index: number): Promise<any> => {
        setLoading(true);
        if (btnCompleteRef.current) {
            btnCompleteRef.current.setAttribute('disabled', 'disabled');
        }
        try {
            await complete(participants[index], attNoteData);
            showSnackbarNotification('Punch out completed', 2000, true);
        } catch (error) {
            showSnackbarNotification(error.message, 2000, true);
        }
        if (btnCompleteRef.current) {
            btnCompleteRef.current.removeAttribute('disabled');
        }
        setLoading(false);
        unsetDirtyStateFor(ComponentName.ParticipantsTable);
    };

    const handleApprovePunchOut = async (index: number): Promise<any> => {
        setLoading(true);
        if (btnApproveRef.current) {
            btnApproveRef.current.setAttribute('disabled', 'disabled');
        }
        try {
            await accept(participants[index], attNoteData);
            showSnackbarNotification('Punch out approved', 2000, true);
        } catch (error) {
            if (btnApproveRef.current) {
                btnApproveRef.current.removeAttribute('disabled');
            }
            showSnackbarNotification(error.message, 2000, true);
        }
        setLoading(false);
        unsetDirtyStateFor(ComponentName.ParticipantsTable);
    };

    const handleUpdateParticipants = async (index: number): Promise<any> => {
        setLoading(true);
        if (btnUpdateRef.current) {
            btnUpdateRef.current.setAttribute('disabled', 'disabled');
        }
        try {
            await update(participants[index], attNoteData);
            showSnackbarNotification('Participants updated', 2000, true);
        } catch (error) {
            if (btnUpdateRef.current) {
                btnUpdateRef.current.removeAttribute('disabled');
            }
            showSnackbarNotification(error.message, 2000, true);
        }     
        setLoading(false);
        unsetDirtyStateFor(ComponentName.ParticipantsTable);
    };


    const handleSignPunchOut = async (index: number): Promise<any> => {
        setLoading(true);
        if (btnSignRef.current) {
            btnSignRef.current.setAttribute('disabled', 'disabled');
        }
        try {
            await sign(participants[index]);
            showSnackbarNotification('Punch out signed', 2000, true);
        } catch (error) {
            if (btnSignRef.current) {
                btnSignRef.current.removeAttribute('disabled');
            }
            showSnackbarNotification(error.message, 2000, true);
        }
        setLoading(false);
    };

    const handleEditAttended = (id: number): void => {
        const updateData = [...attNoteData];
        const index = updateData.findIndex(x => x.id === id);
        updateData[index] = { ...updateData[index], attended: !updateData[index].attended };
        setAttNoteData([...updateData]);
    };

    const handleEditNotes = (event: any, id: number): void => {
        event.preventDefault();
        const updateData = [...attNoteData];
        const index = updateData.findIndex(x => x.id === id);
        updateData[index] = { ...updateData[index], note: event.target.value };
        setAttNoteData([...updateData]);
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
                        <Cell as="th" scope="col" style={{ verticalAlign: 'middle' }}>Attendance list </Cell>
                        <Cell as="th" scope="col" style={{ verticalAlign: 'middle' }}>Representative </Cell>
                        <Cell as="th" scope="col" style={{ verticalAlign: 'middle' }}>Outlook response</Cell>
                        <Cell as="th" scope="col" style={{ verticalAlign: 'middle' }}>Attended</Cell>
                        <Cell as="th" scope="col" style={{ verticalAlign: 'middle' }}>Notes</Cell>
                        <Cell as="th" scope="col" style={{ verticalAlign: 'middle' }}>Signed by</Cell>
                        <Cell as="th" scope="col" style={{ verticalAlign: 'middle' }}>Signed at</Cell>
                    </Row>
                </Head>
                <Body>
                    {participants.map((participant: Participant, index: number) => {
                        const representative = participant.person ?
                            `${participant.person.person.firstName} ${participant.person.person.lastName}` :
                            participant.functionalRole ?
                                participant.functionalRole.code :
                                participant.externalEmail.externalEmail;

                        const response = participant.person ?
                            participant.person.response ?
                                participant.person.response : ''
                            : participant.externalEmail ?
                                participant.externalEmail.response ?
                                    participant.externalEmail.response : ''
                                : participant.functionalRole ?
                                    participant.functionalRole.response ?
                                        participant.functionalRole.response : ''
                                    : '';

                        const id = participant.person ?
                            participant.person.person.id :
                            participant.functionalRole ?
                                participant.functionalRole.id :
                                participant.externalEmail.id;

                        return (
                            <Row key={participant.sortKey} as="tr">
                                <Cell as="td" style={{ verticalAlign: 'middle' }}>
                                    {OrganizationMap.get(participant.organization as Organization)}
                                </Cell>
                                <Cell as="td" style={{ verticalAlign: 'middle' }}>{representative}</Cell>
                                <Cell as="td" style={{ verticalAlign: 'middle' }}>{response}</Cell>
                                <Cell as="td" style={{ verticalAlign: 'middle', minWidth: '160px' }}>
                                    <Switch
                                        id={`attendance${id}`}
                                        disabled={editAttendedDisabled} 
                                        default 
                                        label={attNoteData[index].attended ? 'Attended' : 'Did not attend'} 
                                        checked={attNoteData[index].attended} 
                                        onChange={(): void => handleEditAttended(id)}/>
                                </Cell>
                                <Cell as="td" style={{ verticalAlign: 'middle', width: '40%', minWidth: '200px' }}>
                                    <TextField
                                        id={`textfield${id}`}
                                        disabled={editNotesDisabled}
                                        defaultValue={attNoteData[index].note} 
                                        onChange={(e: any): void => handleEditNotes(e, id)} />
                                </Cell>
                                <Cell as="td" style={{ verticalAlign: 'middle', minWidth: '160px' }}>
                                    {getSignedProperty(
                                        participant, status,
                                        () => handleCompletePunchOut(index),
                                        () => handleApprovePunchOut(index),
                                        () => handleUpdateParticipants(index),
                                        () => handleSignPunchOut(index))}
                                </Cell>
                                <Cell as="td" style={{ verticalAlign: 'middle', minWidth: '150px' }}>
                                    {participant.signedAtUtc ?
                                        `${format(new Date(participant.signedAtUtc), 'dd/MM/yyyy HH:mm')}` :
                                        '-'
                                    }
                                </Cell>
                            </Row>
                        );
                    })}
                </Body>
            </CustomTable>
        </Container>
    );
};

export default ParticipantsTable;
