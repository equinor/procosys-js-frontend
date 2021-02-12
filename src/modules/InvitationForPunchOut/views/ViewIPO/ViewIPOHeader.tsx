import { Button, Typography } from '@equinor/eds-core-react';
import { ButtonContainer, ButtonSpacer, Container, HeaderContainer, ProgressBarContainer } from './ViewIPOHeader.style';
import OutlookInfo, { OutlookStatusType } from './OutlookInfo';
import React, { useState } from 'react';

import EdsIcon from '@procosys/components/EdsIcon';
import { Link } from 'react-router-dom';
import { Participant } from './types';
import ProgressBar from '@procosys/components/ProgressBar';
import { Step } from '../../types';
import { showModalDialog } from '@procosys/core/services/ModalDialogService';
import { tokens } from '@equinor/eds-tokens';

type ProgressBarProps = {
    ipoId: number;
    steps: Step[];
    currentStep: number;
    title: string;
    participants: Participant[];
    organizer: string;
    isEditable: boolean;
    showEditButton: boolean;
    isCancelable: boolean;
    cancelPunchOut: () => void;
}

const ViewIPOHeader = (props: ProgressBarProps): JSX.Element => {
    const [displayFlyout, setDisplayFlyout] = useState<boolean>(false);

    const closeFlyout = (): void => {
        setDisplayFlyout(false);
    };

    const openFlyout = (): void => {
        setDisplayFlyout(true);
    };

    const confirmCancelIpo = (): void => {
        showModalDialog(
            'Cancel IPO',
            <div>Are you sure you want to cancel the IPO and send a cancellation to invited participants?</div>,
            '18vw',
            'No',
            null,
            'Yes',
            props.cancelPunchOut,
            true);
    };

    return (
        <Container>
            <HeaderContainer>
                <ButtonContainer>
                    <Typography variant="h2">{`IPO-${props.ipoId}: ${props.title}`}</Typography>
                    <Button
                        variant='ghost_icon'
                        onClick={(): void => openFlyout()}
                    >
                        <EdsIcon name='microsoft_outlook' color={tokens.colors.interactive.primary__resting.rgba} />
                    </Button>
                </ButtonContainer>
                <ButtonContainer>
                    <Button
                        disabled={!props.isCancelable}
                        variant='outlined'
                        onClick={(): void => confirmCancelIpo()}
                    >
                        <EdsIcon name='calendar_reject' /> Cancel IPO
                    </Button>
                    { props.showEditButton && (
                        <>
                            <ButtonSpacer />
                            <Link to={`/EditIPO/${props.ipoId}`}>
                                <Button
                                    disabled={!props.isEditable}
                                    variant='outlined'>
                                    <EdsIcon name='edit' /> Edit
                                </Button>
                            </Link>
                        </>
                    )}
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
