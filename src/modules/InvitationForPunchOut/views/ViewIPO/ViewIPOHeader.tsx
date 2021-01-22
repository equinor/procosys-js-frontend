import { Button, Typography } from '@equinor/eds-core-react';
import { ButtonContainer, Container, HeaderContainer, ProgressBarContainer } from './ViewIPOHeader.style';
import OutlookInfo, { OutlookStatusType } from './OutlookInfo';
import React, { useState } from 'react';

import EdsIcon from '@procosys/components/EdsIcon';
import { Link } from 'react-router-dom';
import { Participant } from './types';
import ProgressBar from '@procosys/components/ProgressBar';
import { Step } from '../../types';
import { tokens } from '@equinor/eds-tokens';

type ProgressBarProps = {
    ipoId: number;
    steps: Step[];
    currentStep: number;
    title: string;
    participants: Participant[];
    organizer: string;
    isEditable: boolean;
}

const ViewIPOHeader = (props: ProgressBarProps): JSX.Element => {
    const [displayFlyout, setDisplayFlyout] = useState<boolean>(false);

    const closeFlyout = (): void => {
        setDisplayFlyout(false);
    };

    const openFlyout = (): void => {
        setDisplayFlyout(true);
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
                        <EdsIcon name='microsoft_outlook' color={tokens.colors.interactive.primary__resting.rgba} />
                    </Button>
                </ButtonContainer>
                <ButtonContainer>
                    <Link to={`/EditIPO/${props.ipoId}`}>
                        <Button
                            disabled={!props.isEditable}
                            variant='outlined'>
                            <EdsIcon name='edit' /> Edit
                        </Button>
                    </Link>
                </ButtonContainer>
            </HeaderContainer>
            <ProgressBarContainer>
                <ProgressBar steps={props.steps} currentStep={props.currentStep} />
            </ProgressBarContainer>
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
