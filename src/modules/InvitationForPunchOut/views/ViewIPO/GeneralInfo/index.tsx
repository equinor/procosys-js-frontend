import { Container, DateTimeItem, DetailContainer, HeaderContainer, ProjectInfoContainer, ProjectInfoDetail } from './style';
import React, { useEffect, useState } from 'react';
import { getFormatDate, getFormatTime } from './utils';

import { Participant } from './types';
import ParticipantsTable from './ParticipantsTable';
import { Typography } from '@material-ui/core';
import { generalInfo } from './dummyData';

const GeneralInfo = (): JSX.Element => {
    const [participantList, setParticipantList] = useState<Participant[]>([]);

    useEffect(() => {
        // TODO: Get IPO data
        setParticipantList(generalInfo.participants);
    }, []);

    return (
        <Container>
            <HeaderContainer>
                <Typography variant="h6">General generalInfo</Typography>
            </HeaderContainer>
            <ProjectInfoContainer>
                <ProjectInfoDetail>
                    <Typography variant="caption">Selected project</Typography>
                    <Typography variant="body1">{generalInfo.project}</Typography>
                </ProjectInfoDetail>
                <ProjectInfoDetail>
                    <Typography variant="caption">Type</Typography>
                    <Typography variant="body1">{generalInfo.type}</Typography>
                </ProjectInfoDetail>
                <ProjectInfoDetail>
                    <Typography variant="caption">Title</Typography>
                    <Typography variant="body1">{generalInfo.title}</Typography>
                </ProjectInfoDetail>
                <ProjectInfoDetail>
                    <Typography variant="caption">Description</Typography>
                    <Typography variant="body1">{generalInfo.description}</Typography>
                </ProjectInfoDetail>
            </ProjectInfoContainer>
            <HeaderContainer>
                <Typography variant="h6">Date and time for punch round</Typography>
            </HeaderContainer>
            <ProjectInfoContainer>
                <ProjectInfoDetail>
                    <DetailContainer>
                        <DateTimeItem>
                            <Typography variant="caption">From</Typography>
                            <Typography variant="body1">{getFormatDate(generalInfo.punchRoundTime.from)}</Typography>
                        </DateTimeItem>
                        <DateTimeItem>
                            <Typography variant="caption">Time</Typography>
                            <Typography variant="body1">{getFormatTime(generalInfo.punchRoundTime.from)}</Typography>
                        </DateTimeItem>
                        <DateTimeItem>
                            <Typography variant="caption">To</Typography>
                            <Typography variant="body1">{getFormatDate(generalInfo.punchRoundTime.to)}</Typography>
                        </DateTimeItem>
                        <DateTimeItem>
                            <Typography variant="caption">Time</Typography>
                            <Typography variant="body1">{getFormatTime(generalInfo.punchRoundTime.to)}</Typography>
                        </DateTimeItem>
                    </DetailContainer>
                </ProjectInfoDetail>
            </ProjectInfoContainer>
            <HeaderContainer>
                <Typography variant="h6">Participants</Typography>
            </HeaderContainer>
            <ProjectInfoContainer>
                <ProjectInfoDetail>
                    <Typography variant="caption">Meeting point</Typography>
                    <Typography variant="body1">{generalInfo.meetingPoint}</Typography>
                </ProjectInfoDetail>
            </ProjectInfoContainer>
            <ParticipantsTable participants={participantList} setParticipants={setParticipantList} />
        </Container>
    );
};

export default GeneralInfo;

