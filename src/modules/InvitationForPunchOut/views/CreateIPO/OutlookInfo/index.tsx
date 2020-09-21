import { BadgeContainer, Card, CardDetail, Container, FlexContainer, InlineContainer, StatusContainer } from './style';
import React, { useEffect, useState } from 'react';

import { Button } from '@equinor/eds-core-react';
import EdsIcon from '@procosys/components/EdsIcon';
import Flyout from '@procosys/components/Flyout';
import { Link } from '@material-ui/core';
import { Typography } from '@equinor/eds-core-react';

export enum ResponseType {
    ATTENDING = 'Attending',
    TENTATIVE = 'Tentative',
    NOT_RESPONDED = 'Not responded',
    DECLINED = 'Declined'
}

export enum OutlookStatusType {
    OK = 'Ok',
    CANCELLED = 'Cancelled'
}

export type Participant = {
    name: string;
    email: string;
    company: string;
    response?: ResponseType
    avatar?: string;
}

type Props = {
    close: () => void;
    participants: Participant[];
    organizer: Participant;
    status: OutlookStatusType;
}

const OutlookInfo = ({ close, participants, organizer, status }: Props): JSX.Element => {
    const [attending, setAttending] = useState<Participant[]>([]);
    const [tentative, setTentative] = useState<Participant[]>([]);
    const [notResponded, setNotResponded] = useState<Participant[]>([]);
    const [declined, setDeclined] = useState<Participant[]>([]);

    useEffect(() => {
        participants.forEach(p => {
            switch (p.response) {
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
        });
    }, [participants]);

    const disableOutlook = (): void => {
        console.log('disableOutlook not implemented');
    };

    return (
        <Flyout close={close}>
            <Container>
                <FlexContainer padding="calc(var(--grid-unit) * 2)">
                    <Typography variant="h2">Outlook Information</Typography>
                    <Button variant='ghost' title='Close' onClick={close}>
                        <EdsIcon name="close" />
                    </Button>
                </FlexContainer>
                <StatusContainer>
                    <FlexContainer padding="var(--grid-unit) 0">
                        <InlineContainer>
                            <Typography variant="h6">Status:</Typography>
                            <EdsIcon name="microsoft_outlook" color="green" />
                            <Typography>{status}</Typography>
                        </InlineContainer>
                        <Button onClick={disableOutlook} variant="outlined" variantColor="green" title="Disable outlook">Disable outlook</Button>
                    </FlexContainer>
                    <Typography variant="h6">Organizer</Typography>
                    <Card>
                        <CardDetail>
                            <EdsIcon
                                name="account_circle"
                                color="grey"
                                size={48}
                            />
                            <div>
                                <Typography variant="body_long_bold">{organizer.company}</Typography>
                                <Typography variant="body_long">{organizer.name}</Typography>
                                <Link href={`mailto:${organizer.email}`}>
                                    <Typography variant="body_long_link">{organizer.email}</Typography>
                                </Link>
                            </div>
                        </CardDetail>
                    </Card>
                </StatusContainer>
                <FlexContainer padding="calc(var(--grid-unit) * 2)" direction="column">
                    <FlexContainer padding="calc(var(--grid-unit) * 2)">
                        <Typography variant="h5">Response from participants</Typography>
                    </FlexContainer>
                    <FlexContainer data-testid="attending" padding="var(--grid-unit) calc(var(--grid-unit) * 2)" direction="column">
                        <Typography variant="body_long_bold">Attending</Typography>
                        {attending.map(p => {
                            return (
                                <BadgeContainer key={p.email} iconBackground="green">
                                    <EdsIcon name="done" color="white" size={16}/>
                                    <Typography>{p.name}</Typography>
                                </BadgeContainer>
                            );
                        }
                        )}
                    </FlexContainer>
                    <FlexContainer data-testid="tentative" padding="var(--grid-unit) calc(var(--grid-unit) * 2)" direction="column">
                        <Typography variant="body_long_bold">Tentative</Typography>
                        {tentative.map(p => {
                            return (
                                <BadgeContainer key={p.email} iconBorder>
                                    <EdsIcon name="more_horizontal" size={16}/>
                                    <Typography>{p.name}</Typography>
                                </BadgeContainer>
                            );
                        }
                        )}
                    </FlexContainer>
                    <FlexContainer data-testid="not_responded" padding="var(--grid-unit) calc(var(--grid-unit) * 2)" direction="column">
                        <Typography variant="body_long_bold">Not responded</Typography>
                        {notResponded.map(p => {
                            return (
                                <BadgeContainer key={p.email} iconBorder>
                                    <h6>?</h6>
                                    <Typography>{p.name}</Typography>
                                </BadgeContainer>
                            );
                        }
                        )}
                    </FlexContainer>
                    <FlexContainer data-testid="declined" padding="var(--grid-unit) calc(var(--grid-unit) * 2)" direction="column">
                        <Typography variant="body_long_bold">Declined</Typography>
                        {declined.map(p => {
                            return (
                                <BadgeContainer key={p.email} iconBackground="darkred">
                                    <div></div>
                                    <Typography>{p.name}</Typography>
                                </BadgeContainer>
                            );
                        }
                        )}
                    </FlexContainer>
                </FlexContainer>
            </Container >
        </Flyout>
    );
};

export default OutlookInfo;
