import { ButtonsContainer, Container, DateTimeItem, DetailContainer, HeaderContainer, ProjectInfoContainer, ProjectInfoDetail } from './style';
import React, { useEffect, useState } from 'react';
import { Tooltip, Typography, withStyles } from '@material-ui/core';
import { getFormatDate, getFormatTime } from './utils';

import { Button } from '@equinor/eds-core-react';
import EdsIcon from '@procosys/components/EdsIcon';
import { Participant } from './types';
import ParticipantsTable from './ParticipantsTable';
import { generalInfo } from './dummyData';

const CustomTooltip = withStyles({
    tooltip: {
        backgroundColor: '#000',
        width: '191px',
        textAlign: 'center'
    }
})(Tooltip);


const tooltipText = <div>Punch round has been completed<br />and any punches have been added.<br />Set contractor final punch<br />actual date (M01)</div>;


const GeneralInfo = (): JSX.Element => {
    const [participantList, setParticipantList] = useState<Participant[]>([]);
    const [editMode, setEditMode] = useState<boolean>(false);

    useEffect(() => {
        // TODO: Get data
        setParticipantList(generalInfo.participants);
    }, []);

    // TODO: Determine edit permissions

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
            <ParticipantsTable participants={participantList} setParticipants={setParticipantList} editable={editMode} />
        </Container>
    );
};

export default GeneralInfo;

