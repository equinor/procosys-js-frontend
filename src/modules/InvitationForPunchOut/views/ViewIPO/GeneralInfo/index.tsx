import { Container, DateTimeItem, DetailContainer, HeaderContainer, ProjectInfoContainer, ProjectInfoDetail } from './style';
import { Invitation, Participant } from '../types';
import ParticipantsTable, { AttNoteData } from './ParticipantsTable';
import { getFormattedDate, getFormattedTime } from '@procosys/core/services/DateService';

import React from 'react';
import { Typography } from '@equinor/eds-core-react';

interface GeneralInfoProps {
    invitation: Invitation;
    complete: (p: Participant, e: AttNoteData[]) => Promise<any>;
    accept: (p: Participant, e: AttNoteData[]) => Promise<any>;
    update: (e: AttNoteData[]) => Promise<any>;
    sign: (p: Participant) => Promise<any>;
    unaccept: (p: Participant) => Promise<any>;
    uncomplete: (p: Participant) => Promise<any>;
}

const GeneralInfo = ({ invitation, complete, accept, update, sign, unaccept, uncomplete }: GeneralInfoProps): JSX.Element => {
    const participants = invitation.participants.sort((p1, p2): number => p1.sortKey - p2.sortKey);

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
                            <Typography variant="body_long">{getFormattedDate(invitation.startTimeUtc)}</Typography>
                        </DateTimeItem>
                        <DateTimeItem>
                            <Typography token={{ fontSize: '12px' }}>Start</Typography>
                            <Typography variant="body_long">{getFormattedTime(invitation.startTimeUtc)}</Typography>
                        </DateTimeItem>
                        <DateTimeItem>
                            <Typography token={{ fontSize: '12px' }}>End</Typography>
                            <Typography variant="body_long">{getFormattedTime(invitation.endTimeUtc)}</Typography>
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
            <ParticipantsTable participants={participants} status={invitation.status} complete={complete} accept={accept} update={update} sign={sign} unaccept={unaccept} uncomplete={uncomplete} />
        </Container>
    );
};

export default GeneralInfo;

