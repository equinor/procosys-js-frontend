import { BadgeContainer, Card, CardDetail, Container, HeaderContainer, InlineContainer, OutlookInformationHeaderContainer, OutlookInformationStatusContainer, ParticipantContainer, ParticipantListContainer, StatusContainer } from './style';
import React, { useCallback, useEffect, useState } from 'react';

import { Button } from '@equinor/eds-core-react';
import EdsIcon from '@procosys/components/EdsIcon';
import Flyout from '@procosys/components/Flyout';
import { Participant } from '../types';
import { Typography } from '@equinor/eds-core-react';

export enum ResponseType {
    ATTENDING = 'Accepted',
    TENTATIVE = 'Tentative',
    NONE = 'None',
    UNKNOWN = 'Unknown',
    DECLINED = 'Declined'
}

export enum OutlookStatusType {
    OK = 'Ok',
    CANCELLED = 'Cancelled'
}


type Props = {
    close: () => void;
    organizer: string;
    participants?: Participant[];
    status: OutlookStatusType;
}

const OutlookInfo = ({ close, organizer, participants, status }: Props): JSX.Element => {
    const [attending, setAttending] = useState<Participant[]>([]);
    const [tentative, setTentative] = useState<Participant[]>([]);
    const [notResponded, setNotResponded] = useState<Participant[]>([]);
    const [declined, setDeclined] = useState<Participant[]>([]);

    const setOutlookResponses = useCallback(() => {
        participants && participants.forEach(p => {
            const role = p.person ? p.person : p.functionalRole ? p.functionalRole : null;
            if (role) {
                switch (role.response) {
                    case ResponseType.ATTENDING:
                        setAttending(a => [...a, p]);
                        break;
                    case ResponseType.TENTATIVE:
                        setTentative(a => [...a, p]);
                        break;
                    case ResponseType.NONE:
                        setNotResponded(a => [...a, p]);
                        break;
                    case ResponseType.DECLINED:
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
                                {/* <div> */}
                                {/* <Typography variant="body_long_bold">{organizer.organization}</Typography> */}
                                <Typography variant="body_long">{`${organizer}`}</Typography>
                                {/* <Link href={`mailto:${organizer.person.person.email}`}>
                                        <Typography variant="body_long_link">{organizer.person.person.email}</Typography>
                                    </Link> */}
                                {/* </div> */}
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
