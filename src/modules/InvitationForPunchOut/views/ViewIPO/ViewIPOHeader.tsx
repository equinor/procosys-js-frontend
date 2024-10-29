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
import { Link, useLocation } from 'react-router-dom';
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
    canCancel: boolean;
    canDelete: boolean;
    cancelPunchOut: () => void;
    deletePunchOut: () => void;
    isCancelled: boolean;
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
    canCancel,
    canDelete,
    cancelPunchOut,
    deletePunchOut,
    isCancelled,
    isAdmin,
    isUsingAdminRights,
    setIsUsingAdminRights,
}: ProgressBarProps): JSX.Element => {
    const { pathname } = useLocation();
    const pathParts = pathname.split('/');
    pathParts.pop();
    const newPathname = pathParts.join('/');

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

    const confirmDeleteIpo = (): void => {
        showModalDialog(
            'Delete IPO',
            <div>Are you sure you want to delete the IPO?</div>,
            '18vw',
            'No',
            null,
            'Yes',
            deletePunchOut,
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
                    {canDelete && (
                        <>
                            <Button
                                variant="outlined"
                                color="danger"
                                onClick={(): void => confirmDeleteIpo()}
                            >
                                <EdsIcon name="delete_forever" /> Delete IPO
                            </Button>
                        </>
                    )}
                    {canCancel && (
                        <>
                            <ButtonSpacer />
                            <Button
                                variant="outlined"
                                onClick={(): void => confirmCancelIpo()}
                            >
                                <EdsIcon name="calendar_reject" /> Cancel IPO
                            </Button>
                        </>
                    )}
                    {showEditButton && (
                        <>
                            <ButtonSpacer />
                            <Link to={`${newPathname}/EditIPO/${ipoId}`}>
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
