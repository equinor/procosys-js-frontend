import { AcceptIPODto, SignIPODto } from '../../http/InvitationForPunchOutApiClient';
import { CenterContainer, CommentsContainer, CommentsIconContainer, Container, InvitationContainer, InvitationContentContainer, TabsContainer, TabStyle } from './index.style';
import { Invitation, IpoComment, Participant } from './types';
import React, { useEffect, useRef, useState } from 'react';
import { Tabs, Typography } from '@equinor/eds-core-react';

import { AttNoteData } from './GeneralInfo/ParticipantsTable';
import Attachments from './Attachments';
import { Canceler } from 'axios';
import Comments from './Comments';
import EdsIcon from '@procosys/components/EdsIcon';
import GeneralInfo from './GeneralInfo';
import History from './History';
import { IpoStatusEnum } from './enums';
import Scope from './Scope';
import Spinner from '@procosys/components/Spinner';
import { Step } from '../../types';
import ViewIPOHeader from './ViewIPOHeader';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { tokens } from '@equinor/eds-tokens';
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

const ipoHeaderSize = 136;
const ipoTabHeaderSize = 115;

const ViewIPO = (): JSX.Element => {
    const params = useParams<{ ipoId: any }>();
    const [steps, setSteps] = useState<Step[]>(initialSteps);
    const [currentStep, setCurrentStep] = useState<number>(StepsEnum.Planned);
    const [activeTab, setActiveTab] = useState(0);
    const { apiClient } = useInvitationForPunchOutContext();
    const [invitation, setInvitation] = useState<Invitation>();
    const [loading, setLoading] = useState<boolean>(false);
    const [showComments, setShowComments] = useState<boolean>(false);
    const [comments, setComments] = useState<IpoComment[]>([]);
    const [loadingComments, setLoadingComments] = useState<boolean>(false);

    const moduleContainerRef = useRef<HTMLDivElement>(null);

    const getCommentModuleHeight = (): number => {
        if (!moduleContainerRef.current) return 0;
        return (moduleContainerRef.current.clientHeight - ipoHeaderSize);
    };

    const [commentModuleHeight, setCommentModuleHeight] = useState<number>(getCommentModuleHeight);

    const getTabModuleHeight = (): number => {
        if (!moduleContainerRef.current) return 0;
        return (moduleContainerRef.current.clientHeight - ipoHeaderSize - ipoTabHeaderSize);
    };
    const [tabModuleHeight, setTabModuleHeight] = useState<number>(getTabModuleHeight);

    const updateModuleAreaHeightReference = (): void => {
        if (!moduleContainerRef.current) return;
        setCommentModuleHeight(getCommentModuleHeight);
        setTabModuleHeight(getTabModuleHeight);
    };

    /** Update module area height on module resize */
    useEffect(() => {
        updateModuleAreaHeightReference();
    }, [moduleContainerRef, showComments]);

    useEffect(() => {
        window.addEventListener('resize', updateModuleAreaHeightReference);

        return (): void => {
            window.removeEventListener('resize', updateModuleAreaHeightReference);
        };
    }, []);

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

    const getInvitation = async (requestCanceller?: (cancelCallback: Canceler) => void): Promise<void> => {
        try {
            const response = await apiClient.getIPO(params.ipoId, requestCanceller);
            setInvitation(response);
        } catch (error) {
            console.error(error.message, error.data);
            showSnackbarNotification(error.message);
        }
    };

    const getComments = async (requestCanceller?: (cancelCallback: Canceler) => void): Promise<void> => {
        try {
            const response = await apiClient.getComments(params.ipoId, requestCanceller);
            setComments(response);
        } catch (error) {
            console.error(error.message, error.data);
            showSnackbarNotification(error.message);
        }
    };

    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            setLoadingComments(true);
            await getComments((cancel: Canceler) => { requestCancellor = cancel; });
            setLoadingComments(false);
        })();
        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);


    const addComment = async (comment: string): Promise<void> => {
        setLoadingComments(true);
        try {
            await apiClient.addComment(params.ipoId, comment);
            await getComments();
        } catch (error) {
            console.error(error.message, error.data);
            showSnackbarNotification(error.message);
        }
        setLoadingComments(false);
    };


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

    const updateParticipants = async (attNoteData: AttNoteData[]): Promise<any> => {
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

    return (
        <Container ref={moduleContainerRef}>
            { loading ? (
                <CenterContainer>
                    <Spinner large />
                </CenterContainer>
            ) :
                invitation ? (
                    <InvitationContainer>
                        <ViewIPOHeader
                            ipoId={params.ipoId}
                            steps={steps}
                            currentStep={currentStep}
                            title={invitation.title}
                            organizer={invitation.createdBy}
                            participants={invitation.participants}
                            isEditable={invitation.status == IpoStatusEnum.PLANNED}
                        />
                        <InvitationContentContainer>
                            <TabsContainer>
                                <Tabs className='tabs' activeTab={activeTab} onChange={handleChange}>
                                    <TabList>
                                        <Tab>General</Tab>
                                        <Tab>Scope</Tab>
                                        <Tab>Attachments</Tab>
                                        <Tab>History</Tab>
                                        <Tab className='emptyTab'>{''}</Tab>
                                    </TabList>
                                    <TabStyle maxHeight={tabModuleHeight + 67}>
                                        <TabPanels>
                                            <TabPanel>
                                                <GeneralInfo invitation={invitation} accept={acceptPunchOut} complete={completePunchOut} sign={signPunchOut} update={updateParticipants} />
                                            </TabPanel>
                                            <TabPanel>
                                                <Scope mcPkgScope={invitation.mcPkgScope} commPkgScope={invitation.commPkgScope} projectName={invitation.projectName} />
                                            </TabPanel>
                                            <TabPanel>
                                                <Attachments ipoId={params.ipoId} />
                                            </TabPanel>
                                            <TabPanel>
                                                <History ipoId={params.ipoId} />
                                            </TabPanel>
                                        </TabPanels>
                                    </TabStyle>
                                </Tabs>
                                <CommentsIconContainer onClick={(): void => setShowComments(show => !show)}>
                                    {!showComments && <EdsIcon name={`${comments.length > 0 ? 'comment_chat' : 'comment'}`} color={tokens.colors.interactive.primary__resting.rgba} />}
                                </CommentsIconContainer>

                            </TabsContainer>
                            {showComments && (
                                <CommentsContainer maxHeight={commentModuleHeight}>
                                    <Comments comments={comments} addComment={addComment} loading={loadingComments} close={(): void => setShowComments(false)} />
                                </CommentsContainer>
                            )}

                        </InvitationContentContainer>
                    </InvitationContainer>

                ) :
                    (
                        <Typography>No invitation found</Typography>
                    )
            }
        </Container>);
};

export default ViewIPO;
