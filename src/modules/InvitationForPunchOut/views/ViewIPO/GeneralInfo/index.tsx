import { Checkbox, Typography } from '@material-ui/core';
import { Container, DateTimeItem, DetailContainer, HeaderContainer, ProjectInfoContainer, ProjectInfoDetail } from './style';
import React, { useEffect, useState } from 'react';

import ParticipantsTable from './ParticipantsTable';
import { ResponseType } from '../OutlookInfo';
import { generalInfo } from './dummyData';

export type Participant = {
    id: string;
    name: string;
    role: string;
    response: ResponseType;
    attended: boolean;
    notes: string;
    signedBy?: string;
    signedAt?: Date;
};
        
export type GeneralInfoType = {
    project: string;
    type: string;
    title: string;
    description: string;
    punchRoundTime: {
        from: Date;
        to: Date;
    },
    participants: Participant[];
    meetingPoint: string;
    invitationSent: boolean;
}


const GeneralInfo = (): JSX.Element => {

    const [participantList, setParticipantList] = useState<Participant[]>([]);

    useEffect(() => {
        // TODO: Get data
        setParticipantList(generalInfo.participants);
    }, []);

    const getFormatDate = (date: Date): string => {
        if (date === null) {
            return '';
        }
        const newDate = new Date(date);
        const d = newDate.getDate();
        const m = newDate.getMonth() + 1;
        const y = newDate.getFullYear();
        return '' + (d <= 9 ? '0' + d : d) + '/' + (m <= 9 ? '0' + m : m) + '/' + y;
    };

    const getFormatTime = (date: Date): string => {
        if (date === null) {
            return '';
        }
        const newDate = new Date(date);
        const h = newDate.getHours();
        const min = newDate.getMinutes();
        return '' + (h <= 9 ? '0' + h : h) + ':' + (min <= 9 ? '0' + min : min);
    };

    const handleSetAttended = (id: string): void => {
        const index = participantList.findIndex(p => p.id === id);
        const pList = [...participantList];
        pList[index].attended = !pList[index].attended;
        setParticipantList(pList);
        // TODO: Sync data
    };

    const handleSetNotes = (e: any, id: string): void => {
        const text = e.target.value;
        const index = participantList.findIndex(p => p.id === id);
        const pList = [...participantList];
        pList[index].notes = text;;
        setParticipantList(pList);
        // TODO: Sync data
    };

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
                {/* <ProjectInfoDetail>
                    <DetailContainer>
                        <Checkbox disabled checked={generalInfo.invitationSent} style={{'padding': '0 6px 0 0'}}/>
                        <Typography variant="body2">Outlook invitation sent</Typography>
                    </DetailContainer>
                </ProjectInfoDetail> */}
            </ProjectInfoContainer>
            <ParticipantsTable participants={participantList} handleSetAttended={handleSetAttended} handleSetNotes={handleSetNotes} />
        </Container>
    );
};

export default GeneralInfo;

