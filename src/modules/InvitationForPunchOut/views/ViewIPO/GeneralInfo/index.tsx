import { Container, DateTimeItem, DetailContainer, HeaderContainer, ProjectInfoContainer, ProjectInfoDetail } from './style';
import { Invitation, Participant } from '../types';
import ParticipantsTable, { AttNoteData } from './ParticipantsTable';

import React from 'react';
import { Typography } from '@equinor/eds-core-react';
import { format } from 'date-fns';

interface GeneralInfoProps {
    invitation: Invitation;
    complete: (p: Participant, e: AttNoteData[]) => Promise<any>;
    accept: (p: Participant, e: AttNoteData[]) => Promise<any>;
    update: (p: Participant, e: AttNoteData[]) => Promise<any>;
    sign: (p: Participant) => Promise<any>;
}

const GeneralInfo = ({ invitation, complete, accept, update, sign }: GeneralInfoProps): JSX.Element => {
    const participants = invitation.participants.sort((p1, p2): number => p1.sortKey - p2.sortKey );

    return (
        <Container>
            <HeaderContainer>
                <Typography variant="h5">General info</Typography>
            </HeaderContainer>
            <ProjectInfoContainer>
                <ProjectInfoDetail>
                    <Typography token={{ fontSize: '12px' }}>Selected project</Typography>
                    <Typography variant="body_long">{invitation.projectName}</Typography>
                </ProjectInfoDetail>
                <ProjectInfoDetail>
                    <Typography token={{ fontSize: '12px' }}>Type</Typography>
                    <Typography variant="body_long">{invitation.type}</Typography>
                </ProjectInfoDetail>
                <ProjectInfoDetail>
                    <Typography token={{ fontSize: '12px' }}>Title</Typography>
                    <Typography variant="body_long">{invitation.title}</Typography>
                </ProjectInfoDetail>
                <ProjectInfoDetail>
                    <Typography token={{ fontSize: '12px' }}>Description</Typography>
                    <Typography variant="body_long">{invitation.description ? invitation.description : '-'}</Typography>
                </ProjectInfoDetail>
            </ProjectInfoContainer>
            <HeaderContainer>
                <Typography variant="h5">Date and time for punch round</Typography>
            </HeaderContainer>
            <ProjectInfoContainer>
                <ProjectInfoDetail>
                    <DetailContainer>
                        <DateTimeItem>
                            <Typography token={{ fontSize: '12px' }}>Date</Typography>
                            <Typography variant="body_long">{format(new Date(invitation.startTimeUtc), 'dd/MM/yyyy')}</Typography>
                        </DateTimeItem>
                        <DateTimeItem>
                            <Typography token={{ fontSize: '12px' }}>Start</Typography>
                            <Typography variant="body_long">{format(new Date(invitation.startTimeUtc), 'HH:mm')}</Typography>
                        </DateTimeItem>
                        <DateTimeItem>
                            <Typography token={{ fontSize: '12px' }}>End</Typography>
                            <Typography variant="body_long">{format(new Date(invitation.endTimeUtc), 'HH:mm')}</Typography>
                        </DateTimeItem>
                    </DetailContainer>
                </ProjectInfoDetail>
                <ProjectInfoDetail>
                    <Typography token={{ fontSize: '12px' }}>Location</Typography>
                    <Typography variant="body_long">{invitation.location ? invitation.location : '-'}</Typography>
                </ProjectInfoDetail>
            </ProjectInfoContainer>
            <HeaderContainer>
                <Typography variant="h5">Participants</Typography>
            </HeaderContainer>
            <br />
            <ParticipantsTable participants={participants} status={invitation.status} complete={complete} accept={accept} update={update} sign={sign} />
        </Container>
    );
};

export default GeneralInfo;

