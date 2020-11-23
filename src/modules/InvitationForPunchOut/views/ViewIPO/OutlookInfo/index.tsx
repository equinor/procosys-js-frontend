import { BadgeContainer, Card, CardDetail, Container, HeaderContainer, InlineContainer, OutlookInformationHeaderContainer, OutlookInformationStatusContainer, ParticipantContainer, ParticipantListContainer, StatusContainer } from './style';
import React, { useCallback, useEffect, useState } from 'react';

import { Button } from '@equinor/eds-core-react';
import EdsIcon from '@procosys/components/EdsIcon';
import Flyout from '@procosys/components/Flyout';
import { Link } from '@material-ui/core';
import { OrganizationsEnum } from '../../CreateIPO/utils';
import { Participant } from '../types';
import { Typography } from '@equinor/eds-core-react';

export enum ResponseType {
    ATTENDING = 'Attending',
    TENTATIVE = 'Tentative',
    NOT_RESPONDED = 'None',
    DECLINED = 'Declined'
}

export enum OutlookStatusType {
    OK = 'Ok',
    CANCELLED = 'Cancelled'
}


type Props = {
    close: () => void;
    participants?: Participant[];
    status: OutlookStatusType;
}

const OutlookInfo = ({ close, participants, status }: Props): JSX.Element => {
    const [attending, setAttending] = useState<Participant[]>([]);
    const [tentative, setTentative] = useState<Participant[]>([]);
    const [notResponded, setNotResponded] = useState<Participant[]>([]);
    const [declined, setDeclined] = useState<Participant[]>([]);
    const [organizer, setOrganizer] = useState<Participant>();

    const setOutlookResponses = useCallback(() => {
        participants && participants.forEach(p => {
            if (p.person && p.organization !== OrganizationsEnum.Contractor) {
                switch (p.person.response) {
                    case ResponseType.ATTENDING:
                        setAttending(a => [...a, p]);
                        break;
                    case ResponseType.TENTATIVE:
                        setTentative(a => [...a, p]);
                        break;
                    case ResponseType.NOT_RESPONDED:
                        setNotResponded(a => [...a, p]);
                        break;
                    case ResponseType.DECLINED:
                        setDeclined(a => [...a, p]);
                        break;
                    default:
                        break;
                }
            } else if (p.person && p.organization === OrganizationsEnum.Contractor) {
                setOrganizer(p);
            }
        });
    }, [participants]);

    useEffect(() => {
        console.log(participants);
        setOutlookResponses();
    }, [participants]);

    const disableOutlook = (): void => {
        console.log('disableOutlook not implemented');
    };

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
                            <EdsIcon name="microsoft_outlook" color="green" />
                            <Typography>{status}</Typography>
                        </InlineContainer>
                        <Button onClick={disableOutlook} variant="outlined" variantColor="green" title="Disable outlook">Disable outlook</Button>
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
                                <div>
                                    <Typography variant="body_long_bold">{organizer.organization}</Typography>
                                    <Typography variant="body_long">{`${organizer.person.person.firstName} ${organizer.person.person.lastName}`}</Typography>
                                    <Link href={`mailto:${organizer.person.person.email}`}>
                                        <Typography variant="body_long_link">{organizer.person.person.email}</Typography>
                                    </Link>
                                </div>
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
                                <BadgeContainer key={p.person.person.email} iconBackground="green">
                                    <EdsIcon name="done" color="white" size={16}/>
                                    <Typography>{`${p.person.person.firstName} ${p.person.person.lastName}`}</Typography>
                                </BadgeContainer>
                            );
                        }
                        )}
                    </ParticipantContainer>
                    <ParticipantContainer data-testid="tentative">
                        <Typography variant="body_long_bold">Tentative</Typography>
                        {tentative.map(p => {
                            return (
                                <BadgeContainer key={p.person.person.email} iconBorder>
                                    <EdsIcon name="more_horizontal" size={16}/>
                                    <Typography>{`${p.person.person.firstName} ${p.person.person.lastName}`}</Typography>
                                </BadgeContainer>
                            );
                        }
                        )}
                    </ParticipantContainer>
                    <ParticipantContainer data-testid="not_responded">
                        <Typography variant="body_long_bold">Not responded</Typography>
                        {notResponded.map(p => {
                            return (
                                <BadgeContainer key={p.person.person.email} iconBorder>
                                    <h6>?</h6>
                                    <Typography>{`${p.person.person.firstName} ${p.person.person.lastName}`}</Typography>
                                </BadgeContainer>
                            );
                        }
                        )}
                    </ParticipantContainer>
                    <ParticipantContainer data-testid="declined">
                        <Typography variant="body_long_bold">Declined</Typography>
                        {declined.map(p => {
                            return (
                                <BadgeContainer key={p.person.person.email} iconBackground="darkred">
                                    <div></div>
                                    <Typography>{`${p.person.person.firstName} ${p.person.person.lastName}`}</Typography>
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
