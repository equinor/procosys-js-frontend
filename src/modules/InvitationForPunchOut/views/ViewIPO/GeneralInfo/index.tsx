import { ApprovedType, CompletedType, Participant } from './types';
import { Container, DateTimeItem, DetailContainer, HeaderContainer, ProjectInfoContainer, ProjectInfoDetail } from './style';
import React, { useEffect, useState } from 'react';
import { getFormatDate, getFormatTime } from './utils';

import ParticipantsTable from './ParticipantsTable';
import { Typography } from '@equinor/eds-core-react';
import { generalInfo } from './dummyData';

const GeneralInfo = (): JSX.Element => {
    const [participantList, setParticipantList] = useState<Participant[]>([]);
    const [completed, setCompleted] = useState<CompletedType>({});
    const [approved, setApproved] = useState<ApprovedType>({});

    useEffect(() => {
        // TODO: Get IPO data
        setParticipantList(generalInfo.participants);
        setCompleted({
            completedBy: generalInfo.completedBy,
            completedAt: generalInfo.completedAt
        });
        setApproved({
            approvedAt: generalInfo.approvedAt,
            approvedBy: generalInfo.approvedBy
        });
    }, []);

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
                    completedBy: participantList[index].name,
                    completedAt: new Date()
                });
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    };

    const approvePunchOut = async (index: number): Promise<any> => {
        // eslint-disable-next-line no-useless-catch
        await new Promise((resolve, reject) => {
            try { 
                // TODO: await api approve punch out
                // {
                //     ...generalInfo,
                //     participants: data,
                //     approvedBy: data[index].name,
                //     approvedAt: new Date()
                // }
                setApproved({
                    approvedBy: participantList[index].name,
                    approvedAt: new Date()
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
                    <Typography variant="body_long">{generalInfo.project}</Typography>
                </ProjectInfoDetail>
                <ProjectInfoDetail>
                    <Typography variant="meta">Type</Typography>
                    <Typography variant="body_long">{generalInfo.type}</Typography>
                </ProjectInfoDetail>
                <ProjectInfoDetail>
                    <Typography variant="meta">Title</Typography>
                    <Typography variant="body_long">{generalInfo.title}</Typography>
                </ProjectInfoDetail>
                <ProjectInfoDetail>
                    <Typography variant="meta">Description</Typography>
                    <Typography variant="body_long">{generalInfo.description}</Typography>
                </ProjectInfoDetail>
            </ProjectInfoContainer>
            <HeaderContainer>
                <Typography variant="h5">Date and time for punch round</Typography>
            </HeaderContainer>
            <ProjectInfoContainer>
                <ProjectInfoDetail>
                    <DetailContainer>
                        <DateTimeItem>
                            <Typography variant="meta">From</Typography>
                            <Typography variant="body_long">{getFormatDate(generalInfo.punchRoundTime.from)}</Typography>
                        </DateTimeItem>
                        <DateTimeItem>
                            <Typography variant="meta">Time</Typography>
                            <Typography variant="body_long">{getFormatTime(generalInfo.punchRoundTime.from)}</Typography>
                        </DateTimeItem>
                        <DateTimeItem>
                            <Typography variant="meta">To</Typography>
                            <Typography variant="body_long">{getFormatDate(generalInfo.punchRoundTime.to)}</Typography>
                        </DateTimeItem>
                        <DateTimeItem>
                            <Typography variant="meta">Time</Typography>
                            <Typography variant="body_long">{getFormatTime(generalInfo.punchRoundTime.to)}</Typography>
                        </DateTimeItem>
                    </DetailContainer>
                </ProjectInfoDetail>
                <ProjectInfoDetail>
                    <Typography variant="meta">Location</Typography>
                    <Typography variant="body_long">{generalInfo.location}</Typography>
                </ProjectInfoDetail>
            </ProjectInfoContainer>
            <HeaderContainer>
                <Typography variant="h5">Participants</Typography>
            </HeaderContainer>
            <br />
            <ParticipantsTable participants={participantList} completed={completed} approved={approved} completePunchOut={completePunchOut} approvePunchOut={approvePunchOut} />
        </Container>
    );
};

export default GeneralInfo;

