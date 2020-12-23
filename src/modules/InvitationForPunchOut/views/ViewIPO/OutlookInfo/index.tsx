import { BadgeContainer, Card, CardDetail, Container, HeaderContainer, InlineContainer, OutlookInformationHeaderContainer, OutlookInformationStatusContainer, ParticipantContainer, ParticipantListContainer, StatusContainer } from './style';
import React, { useCallback, useEffect, useState } from 'react';

import { Button } from '@equinor/eds-core-react';
import EdsIcon from '@procosys/components/EdsIcon';
import Flyout from '@procosys/components/Flyout';
import { OutlookResponseType } from '../enums';
import { Participant } from '../types';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';

export enum OutlookStatusType {
    OK = 'Ok',
    CANCELLED = 'Cancelled'
}


type OutlookInfoProps = {
    close: () => void;
    organizer: string;
    participants?: Participant[];
    status: OutlookStatusType;
}

const OutlookInfo = ({ close, organizer, participants, status }: OutlookInfoProps): JSX.Element => {
    const [attending, setAttending] = useState<Participant[]>([]);
    const [tentative, setTentative] = useState<Participant[]>([]);
    const [notResponded, setNotResponded] = useState<Participant[]>([]);
    const [declined, setDeclined] = useState<Participant[]>([]);

    const setOutlookResponses = useCallback(() => {
        participants && participants.forEach(p => {
            const role = p.person ? p.person : p.functionalRole ? p.functionalRole : null;
            if (role) {
                switch (role.response) {
                    case OutlookResponseType.ATTENDING:
                        setAttending(a => [...a, p]);
                        break;
                    case OutlookResponseType.TENTATIVE:
                    case OutlookResponseType.TENTATIVELY_ACCEPTED:
                        setTentative(a => [...a, p]);
                        break;
                    case OutlookResponseType.NONE:
                        setNotResponded(a => [...a, p]);
                        break;
                    case OutlookResponseType.DECLINED:
                        setDeclined(a => [...a, p]);
                        break;
                    default:
                        break;
                }
            }         
        });
    }, [participants]);

    useEffect(() => {
        setOutlookResponses();
    }, [participants]);

    return (
        <Flyout close={close}>
            <Container>
                <OutlookInformationHeaderContainer>
                    <Typography variant="h2">Outlook Information</Typography>
                    <Button variant="ghost" title='Close' onClick={close}>
                        <EdsIcon name="close" />
                    </Button>
                </OutlookInformationHeaderContainer>
                <StatusContainer>
                    <OutlookInformationStatusContainer>
                        <InlineContainer>
                            <Typography variant="h6">Status:</Typography>
                            <EdsIcon name="microsoft_outlook" color={ tokens.colors.interactive.primary__resting.rgba } />
                            <Typography>{status}</Typography>
                        </InlineContainer>
                    </OutlookInformationStatusContainer>
                    <Typography variant="h6">Organizer</Typography>
                    {organizer && (
                        <Card>
                            <CardDetail>
                                <EdsIcon
                                    name="account_circle"
                                    color="grey"
                                    size={48}
                                />
                                <Typography variant="body_long">{`${organizer}`}</Typography>
                            </CardDetail>
                        </Card>
                    )}
                </StatusContainer>
                <ParticipantListContainer>
                    <HeaderContainer>
                        <Typography variant="h5">Response from participants</Typography>
                    </HeaderContainer>
                    <ParticipantContainer data-testid="attending" >
                        <Typography variant="body_long_bold">Attending</Typography>
                        {attending.map(p => {
                            return (
                                <BadgeContainer key={p.sortKey} iconBackground="green">
                                    <EdsIcon name="done" color="white" size={16}/>
                                    {p.person ? (
                                        <Typography>{`${p.person.person.firstName} ${p.person.person.lastName}`}</Typography>
                                    ) : (
                                        p.functionalRole ? (
                                            <div>
                                                <Typography>{`${p.functionalRole.code}`}</Typography>
                                                <Typography>{`${p.functionalRole.email}`}</Typography> 
                                            </div>
                                        ) : (
                                            null
                                        )
                                    )}
                                </BadgeContainer>
                            );
                        }
                        )}
                    </ParticipantContainer>
                    <ParticipantContainer data-testid="tentative">
                        <Typography variant="body_long_bold">Tentative</Typography>
                        {tentative.map(p => {
                            return (
                                <BadgeContainer key={p.sortKey} iconBorder>
                                    <EdsIcon name="more_horizontal" size={16}/>
                                    {p.person ? (
                                        <Typography>{`${p.person.person.firstName} ${p.person.person.lastName}`}</Typography>
                                    ) : (
                                        p.functionalRole ? (
                                            <div>
                                                <Typography>{`${p.functionalRole.code}`}</Typography>
                                                <Typography>{`${p.functionalRole.email}`}</Typography> 
                                            </div>
                                        ) : (
                                            null
                                        )
                                    )}
                                </BadgeContainer>
                            );
                        }
                        )}
                    </ParticipantContainer>
                    <ParticipantContainer data-testid="not_responded">
                        <Typography variant="body_long_bold">Not responded</Typography>
                        {notResponded.map(p => {
                            return (
                                <BadgeContainer key={p.sortKey} iconBorder>
                                    <h6>?</h6>
                                    {p.person ? (
                                        <Typography>{`${p.person.person.firstName} ${p.person.person.lastName}`}</Typography>
                                    ) : (
                                        p.functionalRole ? (
                                            <div>
                                                <Typography>{`${p.functionalRole.code}`}</Typography>
                                                <Typography>{`${p.functionalRole.email}`}</Typography> 
                                            </div>) : (
                                            null
                                        )
                                    )}
                                </BadgeContainer>
                            );
                        }
                        )}
                    </ParticipantContainer>
                    <ParticipantContainer data-testid="declined">
                        <Typography variant="body_long_bold">Declined</Typography>
                        {declined.map(p => {
                            return (
                                <BadgeContainer key={p.sortKey} iconBackground="darkred">
                                    <div></div>
                                    {p.person ? (
                                        <Typography>{`${p.person.person.firstName} ${p.person.person.lastName}`}</Typography>
                                    ) : (
                                        p.functionalRole ? (
                                            <div>
                                                <Typography>{`${p.functionalRole.code}`}</Typography>
                                                <Typography>{`${p.functionalRole.email}`}</Typography> 
                                            </div>
                                        ) : (
                                            null
                                        )
                                    )}
                                </BadgeContainer>
                            );
                        }
                        )}
                    </ParticipantContainer>
                </ParticipantListContainer>
            </Container >
        </Flyout>
    );
};

export default OutlookInfo;
