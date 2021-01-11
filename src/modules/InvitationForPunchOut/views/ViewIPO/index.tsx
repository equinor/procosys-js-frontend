import { AcceptIPODto, CompleteIPODto, SignIPODto } from '../../http/InvitationForPunchOutApiClient';
import { CenterContainer, Container } from './index.style';
import { Invitation, Participant } from './types';
import React, { useCallback, useEffect, useState } from 'react';
import { Tabs, Typography } from '@equinor/eds-core-react';

import { AttNoteData } from './GeneralInfo/ParticipantsTable';
import Attachments from './Attachments';
import { Canceler } from 'axios';
import GeneralInfo from './GeneralInfo';
import History from './History';
import { IpoStatusEnum } from './enums';
import Scope from './Scope';
import Spinner from '@procosys/components/Spinner';
import { Step } from '../../types';
import ViewIPOHeader from './ViewIPOHeader';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useInvitationForPunchOutContext } from '../../context/InvitationForPunchOutContext';
import { useParams } from 'react-router-dom';

const { TabList, Tab, TabPanels, TabPanel } = Tabs;

const initialSteps: Step[] = [
    { title: 'Invitation for puch out sent', isCompleted: true },
    { title: 'Punch out completed', isCompleted: false },
    { title: 'Punch out accepted by company', isCompleted: false }
];

enum StepsEnum {
    Planned = 1,
    Completed = 2,
    Accepted = 3
};

const ViewIPO = (): JSX.Element => {
    const params = useParams<{ ipoId: any }>();
    const [steps, setSteps] = useState<Step[]>(initialSteps);
    const [currentStep, setCurrentStep] = useState<number>(StepsEnum.Planned);
    const [activeTab, setActiveTab] = useState(0);
    const { apiClient } = useInvitationForPunchOutContext();
    const [invitation, setInvitation] = useState<Invitation>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (invitation) {
            switch (invitation.status) {
                case StepsEnum[1]:
                    setCurrentStep(StepsEnum.Planned + 1);
                    break;
                case StepsEnum[2]:
                    completeStep(StepsEnum.Completed);
                    setCurrentStep(StepsEnum.Completed + 1);
                    break;
                case StepsEnum[3]:
                    setSteps((steps): Step[] => steps.map((step): Step => { return { ...step, isCompleted: true }; }));
                    setCurrentStep(StepsEnum.Accepted + 1);
                    break;
                default:
                    setCurrentStep(StepsEnum.Planned + 1);
            }
        }
    }, [invitation]);

    const getInvitation = useCallback(async (requestCanceller?: (cancelCallback: Canceler) => void): Promise<void> => {
        try {
            const response = await apiClient.getIPO(params.ipoId, requestCanceller);
            setInvitation(response);
        } catch (error) {
            console.error(error.message, error.data);
            showSnackbarNotification(error.message);
        }
    }, [params.ipoId]);

    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            setLoading(true);
            await getInvitation((cancel: Canceler) => { requestCancellor = cancel; });
            setLoading(false);
        })();
        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    const handleChange = (index: number): void => {
        setActiveTab(index);
    };

    const completeStep = (stepNo: number): void => {
        const modifiedSteps = [...steps];
        modifiedSteps[stepNo - 1] = { ...modifiedSteps[stepNo - 1], isCompleted: true };
        setSteps(modifiedSteps);
    };

    const updateParticipants = async (participant: Participant, attNoteData: AttNoteData[]): Promise<any> => {
        await apiClient.attendedStatusAndNotes(params.ipoId, attNoteData);
        await getInvitation();
    };
    
    const completePunchOut = async (participant: Participant, attNoteData: AttNoteData[]): Promise<any> => {
        const signer = participant.person ? participant.person.person :
            participant.functionalRole ? participant.functionalRole : undefined;

        if (!signer || !invitation) return;

        await apiClient.completePunchOut(params.ipoId, {
            invitationRowVersion: invitation.rowVersion,
            participantRowVersion: signer.rowVersion,
            participants: attNoteData
        });
        await getInvitation();
    };

    const acceptPunchOut = async (participant: Participant, attNoteData: AttNoteData[]): Promise<any> => {
        const signer = participant.person ? participant.person.person :
            participant.functionalRole ? participant.functionalRole : undefined;

        if (!signer || !invitation) return;

        const acceptDetails: AcceptIPODto = {
            invitationRowVersion: invitation.rowVersion,
            participantRowVersion: signer.rowVersion,
            participants: attNoteData
        };

        await apiClient.acceptPunchOut(params.ipoId, acceptDetails);
        await getInvitation();
    };

    const signPunchOut = async (participant: Participant): Promise<any> => {
        const signer = participant.person ? participant.person.person :
            participant.functionalRole ? participant.functionalRole : undefined;

        if (!signer || !invitation) return;

        const signDetails: SignIPODto = {
            participantId: signer.id,
            participantRowVersion: signer.rowVersion
        };

        await apiClient.signPunchOut(params.ipoId, signDetails);
        await getInvitation();
    };


    return (<Container>
        { loading ? (
            <CenterContainer>
                <Spinner large />
            </CenterContainer>
        ) :
            invitation ? (
                <>
                    <ViewIPOHeader
                        ipoId={params.ipoId}
                        steps={steps}
                        currentStep={currentStep}
                        title={invitation.title}
                        organizer={invitation.createdBy}
                        participants={invitation.participants}
                        isEditable={invitation.status == IpoStatusEnum.PLANNED}
                    />
                    <Tabs className='tabs' activeTab={activeTab} onChange={handleChange}>
                        <TabList>
                            <Tab>General</Tab>
                            <Tab>Scope</Tab>
                            <Tab>Attachments</Tab>
                            <Tab>History</Tab>
                            <Tab className='emptyTab'>{''}</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel><GeneralInfo invitation={invitation} accept={acceptPunchOut} complete={completePunchOut} sign={signPunchOut} update={updateParticipants}/></TabPanel>
                            <TabPanel><Scope mcPkgScope={invitation.mcPkgScope} commPkgScope={invitation.commPkgScope} projectName={invitation.projectName} /> </TabPanel>
                            <TabPanel><Attachments ipoId={params.ipoId} /></TabPanel>
                            <TabPanel><History ipoId={params.ipoId} /></TabPanel>
                        </TabPanels>
                    </Tabs>
                </>

            ) :
                (
                    <Typography>No invitation found</Typography>
                )
        }
    </Container>);
};

export default ViewIPO;
