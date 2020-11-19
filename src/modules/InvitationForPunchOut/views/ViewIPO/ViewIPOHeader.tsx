import React, { useState } from 'react';
import { Button, Typography } from '@equinor/eds-core-react';
import ProgressBar from '@procosys/components/ProgressBar';
import { Step } from '../../types';
import { Container, HeaderContainer } from './ViewIPOHeader.style';
import EdsIcon from '@procosys/components/EdsIcon';
import OutlookInfo, { OutlookStatusType } from './OutlookInfo';
import { participants, organizer } from './dummyData';

type ProgressBarProps = {
    steps: Step[];
    currentStep: number;
    title: string
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
                <Typography variant="h2">{props.title}</Typography>
                <Button 
                    variant='ghost_icon'
                    onClick={(): void => openFlyout()}
                >
                    <EdsIcon name='microsoft_outlook' />
                </Button>
            </HeaderContainer>
            <ProgressBar steps={props.steps} currentStep={props.currentStep} />
            {
                displayFlyout && (
                    <OutlookInfo
                        close={closeFlyout}
                        organizer={organizer}
                        participants={participants}
                        status={OutlookStatusType.OK}
                    />
                )
            }
        </Container>
    );
};

export default ViewIPOHeader;
