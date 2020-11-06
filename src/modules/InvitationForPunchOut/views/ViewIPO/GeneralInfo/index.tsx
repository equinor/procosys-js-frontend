import { Container, DateTimeItem, DetailContainer, HeaderContainer, ProjectInfoContainer, ProjectInfoDetail } from './style';
import React, { useState } from 'react';

import { CompletedType } from '../types';
import { InvitationResponse } from '@procosys/modules/InvitationForPunchOut/http/InvitationForPunchOutApiClient';
import ParticipantsTable from './ParticipantsTable';
import { Typography } from '@equinor/eds-core-react';
import { format } from 'date-fns';

interface Props {
    invitation: InvitationResponse;
}

const GeneralInfo = ({ invitation }: Props): JSX.Element => {
    const [completed, setCompleted] = useState<CompletedType>({});


    const completePunchOut = async (index: number): Promise<any> => {
        // eslint-disable-next-line no-useless-catch
        await new Promise((resolve, reject) => {
            try { 
                // TODO: await api complete punch out
                // {
                //     ...generalInfo,
                //     participants: data,
                //     completedBy: data[index].name,
                //     completedAt: new Date()
                // }
                setCompleted({
                    completedBy: invitation.participants[index].person.lastName,
                    completedAt: new Date()
                });
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    };

    return (
        <Container>
            <HeaderContainer>
                <Typography variant="h5">General info</Typography>
            </HeaderContainer>
            <ProjectInfoContainer>
                <ProjectInfoDetail>
                    <Typography variant="meta">Selected project</Typography>
                    <Typography variant="body_long">{invitation.projectName}</Typography>
                </ProjectInfoDetail>
                <ProjectInfoDetail>
                    <Typography variant="meta">Type</Typography>
                    <Typography variant="body_long">{invitation.type}</Typography>
                </ProjectInfoDetail>
                <ProjectInfoDetail>
                    <Typography variant="meta">Title</Typography>
                    <Typography variant="body_long">{invitation.title}</Typography>
                </ProjectInfoDetail>
                <ProjectInfoDetail>
                    <Typography variant="meta">Description</Typography>
                    <Typography variant="body_long">{invitation.description}</Typography>
                </ProjectInfoDetail>
            </ProjectInfoContainer>
            <HeaderContainer>
                <Typography variant="h5">Date and time for punch round</Typography>
            </HeaderContainer>
            <ProjectInfoContainer>
                <ProjectInfoDetail>
                    <DetailContainer>
                        <DateTimeItem>
                            <Typography variant="meta">Date</Typography>
                            <Typography variant="body_long">{format(new Date(invitation.startTime), 'dd/MM/yyyy')}</Typography>
                        </DateTimeItem>
                        <DateTimeItem>
                            <Typography variant="meta">From</Typography>
                            <Typography variant="body_long">{format(new Date(invitation.startTime), 'HH:mm')}</Typography>
                        </DateTimeItem>
                        <DateTimeItem>
                            <Typography variant="meta">To</Typography>
                            <Typography variant="body_long">{format(new Date(invitation.endTime), 'HH:mm')}</Typography>
                        </DateTimeItem>
                    </DetailContainer>
                </ProjectInfoDetail>
                <ProjectInfoDetail>
                    <Typography variant="meta">Location</Typography>
                    <Typography variant="body_long">{invitation.location}</Typography>
                </ProjectInfoDetail>
            </ProjectInfoContainer>
            <HeaderContainer>
                <Typography variant="h5">Participants</Typography>
            </HeaderContainer>
            <br />
            <ParticipantsTable participants={invitation.participants} completed={completed} completePunchOut={completePunchOut} />
        </Container>
    );
};

export default GeneralInfo;

