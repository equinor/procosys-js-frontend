import { Button, Switch, TextField } from '@equinor/eds-core-react';
import { Container, CustomTable, SpinnerContainer } from './style';
import { IpoStatusEnum, OrganizationMap, OrganizationsEnum } from '../../utils';
import React, { useCallback, useRef, useState } from 'react';

import CustomTooltip from './CustomTooltip';
import { Organization } from '../../../../types';
import { Participant } from '../../types';
import Spinner from '@procosys/components/Spinner';
import { Table } from '@equinor/eds-core-react';
import { format } from 'date-fns';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';

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
    sign: (p: Participant) => Promise<any>;
}


const ParticipantsTable = ({participants, status, complete, accept, sign }: Props): JSX.Element => {
    const [loading, setLoading] = useState<boolean>(false);
    const [contractor, setContractor] = useState<boolean>(true);
    const [constructionCompany, setConstructionCompany] = useState<boolean>(true);
    const btnCompleteRef = useRef<HTMLButtonElement>();
    const btnApproveRef = useRef<HTMLButtonElement>();
    const btnSignRef = useRef<HTMLButtonElement>();
    const [attNoteData, setAttNoteData] = useState<AttNoteData[]>(
        participants.map(p => {
            const x = p.person ? p.person.person : p.functionalRole ? p.functionalRole : p.externalEmail;
            return {
                id: x.id,
                attended: p.attended,
                note: p.note,
                rowVersion: x.rowVersion
            };
        })
    ); 

    const getCompleteButton = useCallback((status: string, completePunchout: (index: number) => void): JSX.Element => {
        return (
            <CustomTooltip title={tooltipComplete} arrow>
                <Button ref={btnCompleteRef} onClick={completePunchout}>
                    {status === IpoStatusEnum.COMPLETED ? 'Save punch out' : 'Complete punch out'}
                </Button>
            </CustomTooltip>
        );    
    }, [status]);

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
            <CustomTooltip title={tooltipApprove} arrow>
                <Button ref={btnSignRef} onClick={signPunchOut}>
                    Sign punch out
                </Button>
            </CustomTooltip>
        );    
    };

    const getSignedProperty = useCallback((   
        participant: Participant, 
        status: string, 
        handleCompletePunchOut: (index: number) => void, 
        handleApprovePunchOut: (index: number) => void,
        handleSignPunchOut: (index: number) => void): JSX.Element => {

        switch (participant.organization) {
            case OrganizationsEnum.Contractor:
                // TODO: check if participant is current user
                if (participant.signedBy) {
                    return <span>{`${participant.signedBy}`}</span>;
                } else if (status === IpoStatusEnum.PLANNED || status === IpoStatusEnum.COMPLETED) {
                    return getCompleteButton(status, handleCompletePunchOut);
                } 
                break;
            case OrganizationsEnum.ConstructionCompany:
                if (participant.signedBy) {
                    return <span>{`${participant.signedBy}`}</span>;
                } else if (status ===  IpoStatusEnum.COMPLETED) {
                    // TODO: check if participant is current user
                    return getApproveButton(handleApprovePunchOut);
                } 
                break;
            case OrganizationsEnum.Operation:
            case OrganizationsEnum.TechnicalIntegrity:
            case OrganizationsEnum.Commissioning:
                if (participant.signedBy) {
                    return <span>{`${participant.signedBy}`}</span>;
                } else if (status !==  IpoStatusEnum.CANCELED) {
                    // TODO: check if participant is current user
                    return getSignButton(handleSignPunchOut);
                }
                break;
        }

        return <span>-</span>;
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
                                <Cell as="td" style={{verticalAlign: 'middle'}}>
                                    {OrganizationMap.get(participant.organization as Organization)}
                                </Cell>
                                <Cell as="td" style={{verticalAlign: 'middle'}}>{representative}</Cell>
                                <Cell as="td" style={{verticalAlign: 'middle'}}>{response}</Cell>
                                <Cell as="td" style={{verticalAlign: 'middle', minWidth: '160px'}}>
                                    <Switch 
                                        disabled={!contractor || status === IpoStatusEnum.ACCEPTED} 
                                        default 
                                        label={attNoteData[index].attended ? 'Attended' : 'Did not attend'} 
                                        checked={attNoteData[index].attended} 
                                        onChange={(): void => handleEditAttended(id)}/>
                                </Cell>
                                <Cell as="td" style={{verticalAlign: 'middle', width: '40%', minWidth: '200px'}}>
                                    <TextField 
                                        id={index.toString()}
                                        disabled={(!contractor && !constructionCompany) || status === IpoStatusEnum.ACCEPTED}
                                        defaultValue={attNoteData[index].note} 
                                        onChange={(e: any): void => handleEditNotes(e, id)} />
                                </Cell>
                                <Cell as="td" style={{verticalAlign: 'middle', minWidth: '160px'}}>
                                    {getSignedProperty(
                                        participant, status,
                                        () => handleCompletePunchOut(index),
                                        () => handleApprovePunchOut(index),
                                        () => handleSignPunchOut(index))}
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
