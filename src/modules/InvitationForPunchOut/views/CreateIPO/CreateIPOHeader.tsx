import { Button, Typography } from '@equinor/eds-core-react';
import { ButtonContainer, Container, HeaderContainer } from './CreateIPOHeader.style';
import React, { useEffect, useState } from 'react';

import ProgressBar from '@procosys/components/ProgressBar';
import { Step } from '../../types';
import { StepsEnum } from './CreateIPO';

type ProgressBarProps = {
    ipoId: number | null;
    title: string | null;
    steps: Step[];
    canBeCreatedOrUpdated: boolean;
    currentStep: number;
    createNewIpo: () => void;
    saveUpdatedIpo: () => void;
    next: () => void;
    previous: () => void;
    goTo: (stepNo: number) => void;
}

const CreateIPOHeader = (props: ProgressBarProps): JSX.Element => {
    const [validNext, setValidNext] = useState<boolean>(props.steps[props.currentStep - 1].isCompleted);

    useEffect(() => {
        props.currentStep == StepsEnum.UploadAttachments ?
            setValidNext(true) :
            props.currentStep == StepsEnum.SummaryAndCreate ?
                setValidNext(false) :
                setValidNext(props.steps[props.currentStep - 1].isCompleted);
    }, [props.steps, props.currentStep]);

    return (
        <Container>
            <HeaderContainer>
                {!props.ipoId && <Typography variant="h2">Create invitation for punch-out</Typography>}
                {props.ipoId && <Typography variant="h2">Edit {props.title}</Typography>}

                <ButtonContainer>
                    <Button variant='outlined'>Cancel</Button>
                    <Button
                        constiant='outlined'
                        disabled={props.currentStep === 1}
                        onClick={props.previous}>
                        Previous
                    </Button>
                    {props.currentStep == StepsEnum.SummaryAndCreate && !props.ipoId && (
                        <Button
                            disabled={!props.canBeCreatedOrUpdated}
                            onClick={props.createNewIpo}
                        >
                            Create
                        </Button>
                    )}
                    {props.currentStep == StepsEnum.SummaryAndCreate && props.ipoId && (
                        <Button
                            disabled={!props.canBeCreatedOrUpdated}
                            onClick={props.saveUpdatedIpo}
                        >
                            Save and send update
                        </Button>
                    )}
                    {props.currentStep != StepsEnum.SummaryAndCreate && (
                        (<Button
                            disabled={!validNext}
                            onClick={props.next}
                        >
                            Next
                        </Button>
                        )
                    )}
                </ButtonContainer>
            </HeaderContainer>
            <ProgressBar steps={props.steps} currentStep={props.currentStep} goTo={props.goTo} />
        </Container>
    );
};

export default CreateIPOHeader;
