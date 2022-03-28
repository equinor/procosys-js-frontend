import { Button, Typography } from '@equinor/eds-core-react';
import {
    ButtonContainer,
    ButtonSpacer,
    Container,
    HeaderContainer,
    ProgressBarContainer,
} from './ViewIPOHeader.style';
import React, { useState } from 'react';

import EdsIcon from '@procosys/components/EdsIcon';
import { Link } from 'react-router-dom';
import { Participant } from './types';
import ProgressBar from '@procosys/components/ProgressBar';
import { Step } from '../../types';
import { showModalDialog } from '@procosys/core/services/ModalDialogService';
import { Switch } from '@equinor/eds-core-react';

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
    isAdmin: boolean;
    isUsingAdminRights: boolean;
    setIsUsingAdminRights: (b: React.SetStateAction<boolean>) => void;
};

const ViewIPOHeader = ({
    ipoId,
    steps,
    currentStep,
    title,
    participants,
    organizer,
    isEditable,
    showEditButton,
    isCancelable,
    cancelPunchOut,
    isAdmin,
    isUsingAdminRights,
    setIsUsingAdminRights,
}: ProgressBarProps): JSX.Element => {
    const confirmCancelIpo = (): void => {
        showModalDialog(
            'Cancel IPO',
            <div>
                Are you sure you want to cancel the IPO and send a cancellation
                to invited participants?
            </div>,
            '18vw',
            'No',
            null,
            'Yes',
            cancelPunchOut,
            true
        );
    };

    return (
        <Container>
            <HeaderContainer>
                <ButtonContainer>
                    <Typography variant="h2">{`IPO-${ipoId}: ${title}`}</Typography>
                </ButtonContainer>
                <ButtonContainer>
                    <Button
                        disabled={!isCancelable}
                        variant="outlined"
                        onClick={(): void => confirmCancelIpo()}
                    >
                        <EdsIcon name="calendar_reject" /> Cancel IPO
                    </Button>
                    {showEditButton && (
                        <>
                            <ButtonSpacer />
                            <Link to={`/EditIPO/${ipoId}`}>
                                <Button
                                    disabled={!isEditable}
                                    variant="outlined"
                                >
                                    <EdsIcon name="edit" /> Edit
                                </Button>
                            </Link>
                        </>
                    )}
                    {isAdmin && (
                        <>
                            <ButtonSpacer />
                            <Switch
                                default
                                checked={isUsingAdminRights}
                                onChange={(): void =>
                                    setIsUsingAdminRights(
                                        (prevValue: boolean) => !prevValue
                                    )
                                }
                                label={'Admin mode'}
                            />
                        </>
                    )}
                </ButtonContainer>
            </HeaderContainer>
            <ProgressBarContainer>
                <ProgressBar steps={steps} currentStep={currentStep} />
            </ProgressBarContainer>
        </Container>
    );
};

export default ViewIPOHeader;
