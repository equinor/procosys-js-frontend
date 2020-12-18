import { Button, Typography } from '@equinor/eds-core-react';
import { ButtonContainer, Container, HeaderContainer } from './ViewIPOHeader.style';
import OutlookInfo, { OutlookStatusType } from './OutlookInfo';
import React, { useState } from 'react';

import EdsIcon from '@procosys/components/EdsIcon';
import { Participant } from './types';
import ProgressBar from '@procosys/components/ProgressBar';
import { Step } from '../../types';
import { Link } from 'react-router-dom';
import { IpoStatusEnum } from './enums';

type ProgressBarProps = {
    ipoId: number;
    steps: Step[];
    currentStep: number;
    title: string;
    participants: Participant[];
    organizer: string;
    status: string;
}

const ViewIPOHeader = (props: ProgressBarProps): JSX.Element => {
    const [displayFlyout, setDisplayFlyout] = useState<boolean>(false);

    const closeFlyout = (): void => {
        setDisplayFlyout(false);
    };

    const openFlyout = (): void => {
        setDisplayFlyout(true);
    };

    const isNotEditable = (): boolean => {
        return (props.status == IpoStatusEnum.ACCEPTED || props.status == IpoStatusEnum.COMPLETED || props.status == IpoStatusEnum.CANCELED);
    };

    return (
        <Container>
            <HeaderContainer>
                <ButtonContainer>
                    <Typography variant="h2">{props.title}</Typography>
                    <Button
                        variant='ghost_icon'
                        onClick={(): void => openFlyout()}
                    >
                        <EdsIcon name='microsoft_outlook' />
                    </Button>
                </ButtonContainer>
                <ButtonContainer>
                    <Link to={`/EditIPO/${props.ipoId}`}>
                        <Button
                            disabled={isNotEditable()}
                            variant='outlined'>
                            <EdsIcon name='edit' /> Edit
                        </Button>
                    </Link>
                </ButtonContainer>
            </HeaderContainer>
            <ProgressBar steps={props.steps} currentStep={props.currentStep} />
            {
                displayFlyout && (
                    <OutlookInfo
                        close={closeFlyout}
                        organizer={props.organizer}
                        participants={props.participants}
                        status={OutlookStatusType.OK}
                    />
                )
            }
        </Container>
    );
};

export default ViewIPOHeader;
