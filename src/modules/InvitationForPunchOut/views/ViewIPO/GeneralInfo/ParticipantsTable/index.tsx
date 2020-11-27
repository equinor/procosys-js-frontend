import { Button, Switch, TextField } from '@equinor/eds-core-react';
import { ComponentName, IpoStatusEnum, OrganizationMap, OrganizationsEnum } from '../../utils';
import { Container, CustomTable, SpinnerContainer } from './style';
import React, { Component, useCallback, useEffect, useRef, useState } from 'react';

import CustomTooltip from './CustomTooltip';
import { Organization } from '../../../../types';
import { Participant } from '../../types';
import Spinner from '@procosys/components/Spinner';
import { Table } from '@equinor/eds-core-react';
import { format } from 'date-fns';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useDirtyContext } from '@procosys/core/DirtyContext';

const { Head, Body, Cell, Row } = Table;
const tooltipComplete = <div>When punch round has been completed<br />and any punches have been added.<br />Complete and go to next step.</div>;
const tooltipApprove = <div>Punch round has been completed<br />and checked by company</div>;


export type AttNoteData = {
    id: number;
    attended: boolean;
    note: string;
    rowVersion: string;
};

interface Props {
    participants: Participant[];
    status: string;
    complete: (p: Participant, attNoteData: AttNoteData[]) => Promise<any>;
    accept: (p: Participant, attNoteData: AttNoteData[]) => Promise<any>;
}


const ParticipantsTable = ({participants, status, complete, accept }: Props): JSX.Element => {
    const cleanData = participants.map(p => {
        const x = p.person ? p.person.person : p.functionalRole ? p.functionalRole : p.externalEmail;
        return {
            id: x.id,
            attended: p.attended,
            note: p.note ? p.note : '',
            rowVersion: x.rowVersion
        };
    });
    const [loading, setLoading] = useState<boolean>(false);
    // TODO: when current user is implemented, the user role should be found and used throughout
    const contractor = true;
    const constructionCompany = true;
    const btnCompleteRef = useRef<HTMLButtonElement>();
    const btnApproveRef = useRef<HTMLButtonElement>();
    const [attNoteData, setAttNoteData] = useState<AttNoteData[]>(cleanData);
    const { setDirtyStateFor, unsetDirtyStateFor } = useDirtyContext();

    const getCompleteButton = (status: string, completePunchout: (index: number) => void): JSX.Element => {
        return (
            <CustomTooltip title={tooltipComplete} arrow>
                <Button ref={btnCompleteRef} onClick={completePunchout}>
                    {status === IpoStatusEnum.COMPLETED ? 'Save punch out' : 'Complete punch out'}
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

    const getSignedProperty = useCallback((participant: Participant, status: string, handleCompletePunchOut: (index: number) => void, handleApprovePunchOut: (index: number) => void): JSX.Element => {
        // TODO: check if participant is current user
        // TODO: check if contractor 
        if (participant.organization === OrganizationsEnum.Contractor) {
            if (participant.signedBy && (status === IpoStatusEnum.COMPLETED || status === IpoStatusEnum.ACCEPTED )) {
                return <span>{`${participant.person.person.firstName} ${participant.person.person.lastName}`}</span>;
            } else {
                return getCompleteButton(status, handleCompletePunchOut);
            }
        // TODO: check if constructionCompany 
        } else if (participant.organization === OrganizationsEnum.ConstructionCompany) {
            if (participant.signedBy && status === IpoStatusEnum.ACCEPTED) {
                return <span>{`${participant.person.person.firstName} ${participant.person.person.lastName}`}</span>;
            } else if (status ===  IpoStatusEnum.COMPLETED) {
                return getApproveButton(handleApprovePunchOut);
            } else {
                return <span>-</span>;
            }
        } else if (participant.signedBy) {
            return <span>{`${participant.person.person.firstName} ${participant.person.person.lastName}`}</span>;
        } else {
            return <span>-</span>;
        }
    }, [contractor, constructionCompany, status]);

    const handleCompletePunchOut = async (index: number): Promise<any> => {
        setLoading(true);
        if (btnCompleteRef.current) {
            btnCompleteRef.current.setAttribute('disabled', 'disabled');
        }
        try {
            await complete(participants[index], attNoteData);
            showSnackbarNotification(`Punch out ${status === IpoStatusEnum.COMPLETED ? 'saved': 'completed'}`, 2000, true);
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

    useEffect(() => {
        if (JSON.stringify(attNoteData) !== JSON.stringify(cleanData)) {
            setDirtyStateFor(ComponentName.ParticipantsTable);
        } else {
            unsetDirtyStateFor(ComponentName.ParticipantsTable);
        }
    }, [attNoteData]);

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
                    {participants.map((participant: Participant, index: number) => {
                        const representative = participant.person ? 
                            `${participant.person.person.firstName} ${participant.person.person.lastName}` :
                            participant.functionalRole ?
                                participant.functionalRole.code :
                                participant.externalEmail.externalEmail;

                        const response = participant.person ?    
                            participant.person.response :
                            participant.functionalRole ? 
                                participant.functionalRole.response :
                                participant.externalEmail.response;

                        const id = participant.person ?    
                            participant.person.person.id :
                            participant.functionalRole ? 
                                participant.functionalRole.id :
                                participant.externalEmail.id;

                        return (
                            <Row key={index} as="tr">
                                <Cell as="td" style={{verticalAlign: 'middle'}}>{OrganizationMap.get(participant.organization as Organization)}</Cell>
                                <Cell as="td" style={{verticalAlign: 'middle'}}>{representative}</Cell>
                                <Cell as="td" style={{verticalAlign: 'middle'}}>{response}</Cell>
                                <Cell as="td" style={{verticalAlign: 'middle', minWidth: '160px'}}>
                                    <Switch 
                                        id={`attendance${id}`}
                                        disabled={!contractor || status === IpoStatusEnum.ACCEPTED} 
                                        default 
                                        label={attNoteData[index].attended ? 'Attended' : 'Did not attend'} 
                                        checked={attNoteData[index].attended} 
                                        onChange={(): void => handleEditAttended(id)}/>
                                </Cell>
                                <Cell as="td" style={{verticalAlign: 'middle', width: '40%', minWidth: '200px'}}>
                                    <TextField 
                                        id={`textfield${id}`}
                                        disabled={(!contractor && !constructionCompany) || status === IpoStatusEnum.ACCEPTED}
                                        defaultValue={attNoteData[index].note} 
                                        onChange={(e: any): void => handleEditNotes(e, id)} />
                                </Cell>
                                <Cell as="td" style={{verticalAlign: 'middle', minWidth: '160px'}}>
                                    {getSignedProperty(participant, status, () => handleCompletePunchOut(index), () => handleApprovePunchOut(index))}
                                </Cell>
                                <Cell as="td" style={{verticalAlign: 'middle', minWidth: '150px'}}>
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
