import { Button, Typography } from '@equinor/eds-core-react';
import {
    ButtonContainer,
    ButtonSpacer,
    Container,
    HeaderContainer,
} from './CreateAndEditIPOHeader.style';
import React, { useEffect, useState } from 'react';

import { Link, useLocation } from 'react-router-dom';
import ProgressBar from '@procosys/components/ProgressBar';
import { Step } from '../../types';
import { StepsEnum } from './CreateAndEditIPO';

type ProgressBarProps = {
    ipoId: number | null;
    title: string | null;
    steps: Step[];
    canBeCreatedOrUpdated: boolean;
    currentStep: number;
    saveIpo: () => void;
    next: () => void;
    previous: () => void;
    goTo: (stepNo: number) => void;
};

const CreateAndEditIPOHeader = (props: ProgressBarProps): JSX.Element => {
    const [validNext, setValidNext] = useState<boolean>(
        props.steps[props.currentStep - 1].isCompleted
    );
    const { pathname } = useLocation();
    const newPathname = pathname.replace('/EditIPO', '');

    useEffect(() => {
        props.currentStep == StepsEnum.UploadAttachments
            ? setValidNext(true)
            : props.currentStep == StepsEnum.SummaryAndCreate
              ? setValidNext(false)
              : setValidNext(props.steps[props.currentStep - 1].isCompleted);
    }, [props.steps, props.currentStep]);

    const cancel = (): void => {
        history.back();
    };

    return (
        <Container>
            <HeaderContainer>
                {!props.ipoId && (
                    <Typography variant="h2">
                        Create invitation for punch-out
                    </Typography>
                )}
                {props.ipoId && (
                    <Typography variant="h2">Edit {props.title}</Typography>
                )}

                <ButtonContainer>
                    {props.ipoId && (
                        <Link to={`${newPathname}`}>
                            <Button variant="outlined">Cancel</Button>
                        </Link>
                    )}

                    {!props.ipoId && (
                        <Button onClick={cancel} variant="outlined">
                            Cancel
                        </Button>
                    )}

                    <ButtonSpacer />

                    <Button
                        constiant="outlined"
                        disabled={props.currentStep === 1}
                        onClick={props.previous}
                    >
                        Previous
                    </Button>

                    <ButtonSpacer />

                    {props.currentStep == StepsEnum.SummaryAndCreate && (
                        <Button
                            disabled={!props.canBeCreatedOrUpdated}
                            onClick={props.saveIpo}
                        >
                            {!props.ipoId ? 'Create' : 'Save and send update'}
                        </Button>
                    )}
                    {props.currentStep != StepsEnum.SummaryAndCreate && (
                        <Button disabled={!validNext} onClick={props.next}>
                            Next
                        </Button>
                    )}
                </ButtonContainer>
            </HeaderContainer>
            <ProgressBar
                steps={props.steps}
                currentStep={props.currentStep}
                goTo={props.goTo}
            />
        </Container>
    );
};

export default CreateAndEditIPOHeader;
