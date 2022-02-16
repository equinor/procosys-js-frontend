import {
    AcceptIPODto,
    SignIPODto,
} from '../../http/InvitationForPunchOutApiClient';
import {
    CenterContainer,
    CommentsContainer,
    CommentsIconContainer,
    Container,
    InvitationContainer,
    InvitationContentContainer,
    TabStyle,
    TabsContainer,
} from './index.style';
import { Invitation, IpoComment, Participant } from './types';
import { IpoCustomEvents, IpoStatusEnum } from '../enums';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Tabs, Typography } from '@equinor/eds-core-react';

import { AttNoteData } from './GeneralInfo/ParticipantsTable';
import Attachments from './Attachments';
import { Button } from '@equinor/eds-core-react';
import { Canceler } from 'axios';
import Comments from './Comments';
import EdsIcon from '@procosys/components/EdsIcon';
import GeneralInfo from './GeneralInfo';
import History from './History';
import Scope from './Scope';
import Spinner from '@procosys/components/Spinner';
import { Step } from '../../types';
import ViewIPOHeader from './ViewIPOHeader';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { tokens } from '@equinor/eds-tokens';
import { useAnalytics } from '@procosys/core/services/Analytics/AnalyticsContext';
import { useInvitationForPunchOutContext } from '../../context/InvitationForPunchOutContext';
import { useParams } from 'react-router-dom';
import { useCurrentPlant } from '@procosys/core/PlantContext';

const initialSteps: Step[] = [
    { title: 'Invitation for punch-out sent', isCompleted: true },
    { title: 'Punch-out completed', isCompleted: false },
    { title: 'Punch-out accepted by company', isCompleted: false },
];

const stepsWhenCanceled: Step[] = [
    { title: 'Invitation for punch-out sent', isCompleted: true },
    { title: 'Punch-out is canceled', isCompleted: true },
];

enum StepsEnum {
    Planned = 1,
    Completed = 2,
    Accepted = 3,
    Canceled = 4,
}

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
    const [showComments, setShowComments] = useState<boolean>(true);
    const [comments, setComments] = useState<IpoComment[]>([]);
    const [loadingComments, setLoadingComments] = useState<boolean>(false);
    const analytics = useAnalytics();
    const [isUsingAdminRights, setIsUsingAdminRights] =
        useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const { permissions } = useCurrentPlant();

    const moduleContainerRef = useRef<HTMLDivElement>(null);

    const getCommentModuleHeight = (): number => {
        if (!moduleContainerRef.current) return 0;
        return moduleContainerRef.current.clientHeight - ipoHeaderSize;
    };

    const [commentModuleHeight, setCommentModuleHeight] = useState<number>(
        getCommentModuleHeight
    );

    const getTabModuleHeight = (): number => {
        if (!moduleContainerRef.current) return 0;
        return (
            moduleContainerRef.current.clientHeight -
            ipoHeaderSize -
            ipoTabHeaderSize
        );
    };
    const [tabModuleHeight, setTabModuleHeight] =
        useState<number>(getTabModuleHeight);

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
            window.removeEventListener(
                'resize',
                updateModuleAreaHeightReference
            );
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
                    setSteps((steps): Step[] =>
                        steps.map((step): Step => {
                            return { ...step, isCompleted: true };
                        })
                    );
                    setCurrentStep(StepsEnum.Accepted + 1);
                    break;
                case StepsEnum[4]:
                    setSteps(stepsWhenCanceled);
                    setCurrentStep(StepsEnum.Canceled + 1);
                    break;
                default:
                    setCurrentStep(StepsEnum.Planned + 1);
            }
        }
    }, [invitation]);

    useEffect(() => {
        // TODO: change to actual value
        //setIsAdmin(permissions.includes('IPO/ADMIN'));
        setIsAdmin(true);
    });

    const getInvitation = async (
        requestCanceller?: (cancelCallback: Canceler) => void
    ): Promise<void> => {
        try {
            const response = await apiClient.getIPO(
                params.ipoId,
                requestCanceller
            );
            setInvitation(response);
        } catch (error) {
            console.error(error.message, error.data);
            showSnackbarNotification(error.message);
        }
    };

    const getComments = async (
        requestCanceller?: (cancelCallback: Canceler) => void
    ): Promise<void> => {
        try {
            const response = await apiClient.getComments(
                params.ipoId,
                requestCanceller
            );
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
            await getComments((cancel: Canceler) => {
                requestCancellor = cancel;
            });
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
            invitation &&
                analytics.trackUserAction(IpoCustomEvents.COMMENT_ADDED, {
                    project: invitation.projectName,
                    type: invitation.type,
                });
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
            await getInvitation((cancel: Canceler) => {
                requestCancellor = cancel;
            });
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
        modifiedSteps[stepNo - 1] = {
            ...modifiedSteps[stepNo - 1],
            isCompleted: true,
        };
        setSteps(modifiedSteps);
    };

    const updateParticipants = async (
        attNoteData: AttNoteData[]
    ): Promise<any> => {
        try {
            await apiClient.attendedStatusAndNotes(params.ipoId, attNoteData);
            invitation &&
                analytics.trackUserAction(
                    IpoCustomEvents.UPDATED_PARTICIPANTS,
                    { project: invitation.projectName, type: invitation.type }
                );
            await getInvitation();
            showSnackbarNotification('Participants updated');
        } catch (error) {
            console.error(error.message, error.data);
            showSnackbarNotification(error.message);
        }
    };

    const completePunchOut = async (
        participant: Participant,
        attNoteData: AttNoteData[]
    ): Promise<any> => {
        const signer = participant.person
            ? participant.person
            : participant.functionalRole
            ? participant.functionalRole
            : undefined;

        if (!signer || !invitation) return;

        try {
            await apiClient.completePunchOut(params.ipoId, {
                invitationRowVersion: invitation.rowVersion,
                participantRowVersion: participant.rowVersion,
                participants: attNoteData,
            });
            analytics.trackUserAction(IpoCustomEvents.COMPLETED, {
                project: invitation.projectName,
                type: invitation.type,
            });
            await getInvitation();
            showSnackbarNotification('Punch-out completed');
        } catch (error) {
            console.error(error.message, error.data);
            showSnackbarNotification(error.message);
        }
    };

    const uncompletePunchOut = async (
        participant: Participant
    ): Promise<any> => {
        const signer = participant.person
            ? participant.person
            : participant.functionalRole
            ? participant.functionalRole
            : undefined;

        if (!signer || !invitation) return;

        try {
            await apiClient.uncompletePunchOut(
                params.ipoId,
                invitation.rowVersion,
                participant.rowVersion
            );
            analytics.trackUserAction(IpoCustomEvents.UNCOMPLETED, {
                project: invitation.projectName,
                type: invitation.type,
            });
            await getInvitation();
            showSnackbarNotification('Punch-out uncompleted');
        } catch (error) {
            console.error(error.message, error.data);
            showSnackbarNotification(error.message);
        }
    };

    const acceptPunchOut = async (
        participant: Participant,
        attNoteData: AttNoteData[]
    ): Promise<any> => {
        const signer = participant.person
            ? participant.person
            : participant.functionalRole
            ? participant.functionalRole
            : undefined;

        if (!signer || !invitation) return;

        const acceptDetails: AcceptIPODto = {
            invitationRowVersion: invitation.rowVersion,
            participantRowVersion: participant.rowVersion,
            participants: attNoteData,
        };
        try {
            await apiClient.acceptPunchOut(params.ipoId, acceptDetails);
            analytics.trackUserAction(IpoCustomEvents.ACCEPTED, {
                project: invitation.projectName,
                type: invitation.type,
            });
            await getInvitation();
            showSnackbarNotification('Punch-out accepted');
        } catch (error) {
            console.error(error.message, error.data);
            showSnackbarNotification(error.message);
        }
    };

    const unacceptPunchOut = async (participant: Participant): Promise<any> => {
        const signer = participant.person
            ? participant.person
            : participant.functionalRole
            ? participant.functionalRole
            : undefined;

        if (!signer || !invitation) return;

        try {
            await apiClient.unacceptPunchOut(
                params.ipoId,
                invitation.rowVersion,
                participant.rowVersion
            );
            analytics.trackUserAction(IpoCustomEvents.UNACCEPTED, {
                project: invitation.projectName,
                type: invitation.type,
            });
            await getInvitation();
            showSnackbarNotification('Punch-out unaccepted');
        } catch (error) {
            console.error(error.message, error.data);
            showSnackbarNotification(error.message);
        }
    };

    const signPunchOut = async (participant: Participant): Promise<any> => {
        const signer = participant.person
            ? participant.person
            : participant.functionalRole
            ? participant.functionalRole
            : undefined;

        if (!signer || !invitation) return;

        const signDetails: SignIPODto = {
            participantId: participant.id,
            participantRowVersion: participant.rowVersion,
        };

        try {
            await apiClient.signPunchOut(params.ipoId, signDetails);
            analytics.trackUserAction(IpoCustomEvents.SIGNED, {
                project: invitation.projectName,
                type: invitation.type,
            });
            await getInvitation();
            showSnackbarNotification('Punch-out signed');
        } catch (error) {
            console.error(error.message, error.data);
            showSnackbarNotification(error.message);
        }
    };

    const unsignPunchOut = async (participant: Participant): Promise<any> => {
        const signer = participant.person
            ? participant.person
            : participant.functionalRole
            ? participant.functionalRole
            : undefined;

        if (!signer || !invitation) return;

        try {
            await apiClient.unsignPunchOut(
                params.ipoId,
                participant.id,
                participant.rowVersion
            );
            analytics.trackUserAction(IpoCustomEvents.UNSIGNED, {
                project: invitation.projectName,
                type: invitation.type,
            });
            await getInvitation();
            showSnackbarNotification('Punch-out unsigned');
        } catch (error) {
            console.error(error.message, error.data);
            showSnackbarNotification(error.message);
        }
    };

    const cancelPunchOut = async (): Promise<any> => {
        if (invitation) {
            try {
                await apiClient.cancelPunchOut(
                    params.ipoId,
                    invitation.rowVersion
                );
                analytics.trackUserAction(IpoCustomEvents.CANCELED, {
                    project: invitation.projectName,
                    type: invitation.type,
                });
                await getInvitation();
                showSnackbarNotification(
                    'Invitation for punch-out is cancelled.'
                );
            } catch (error) {
                console.error(error.message, error.data);
                showSnackbarNotification(error.message);
            }
        }
    };

    return (
        <Container ref={moduleContainerRef}>
            {loading ? (
                <CenterContainer>
                    <Spinner large />
                </CenterContainer>
            ) : invitation ? (
                <InvitationContainer>
                    <ViewIPOHeader
                        ipoId={params.ipoId}
                        steps={steps}
                        currentStep={currentStep}
                        title={invitation.title}
                        organizer={`${invitation.createdBy.firstName} ${invitation.createdBy.lastName}`}
                        participants={invitation.participants}
                        isEditable={invitation.status == IpoStatusEnum.PLANNED}
                        showEditButton={invitation.canEdit}
                        isCancelable={
                            invitation.status == IpoStatusEnum.PLANNED ||
                            invitation.status == IpoStatusEnum.COMPLETED
                        }
                        cancelPunchOut={cancelPunchOut}
                        isAdmin={isAdmin}
                        isUsingAdminRights={isUsingAdminRights}
                        setIsUsingAdminRights={setIsUsingAdminRights}
                    />
                    <InvitationContentContainer>
                        <TabsContainer>
                            <Tabs
                                className="tabs"
                                activeTab={activeTab}
                                onChange={handleChange}
                            >
                                <Tabs.List>
                                    <Tabs.Tab>General</Tabs.Tab>
                                    <Tabs.Tab>Scope</Tabs.Tab>
                                    <Tabs.Tab>Attachments</Tabs.Tab>
                                    <Tabs.Tab>History</Tabs.Tab>
                                    <Tabs.Tab className="emptyTab">
                                        {''}
                                    </Tabs.Tab>
                                </Tabs.List>
                                <TabStyle maxHeight={tabModuleHeight + 67}>
                                    <Tabs.Panels>
                                        <Tabs.Panel>
                                            <GeneralInfo
                                                invitation={invitation}
                                                accept={acceptPunchOut}
                                                complete={completePunchOut}
                                                sign={signPunchOut}
                                                update={updateParticipants}
                                                unaccept={unacceptPunchOut}
                                                uncomplete={uncompletePunchOut}
                                                unsign={unsignPunchOut}
                                            />
                                        </Tabs.Panel>
                                        <Tabs.Panel>
                                            <Scope
                                                mcPkgScope={
                                                    invitation.mcPkgScope
                                                }
                                                commPkgScope={
                                                    invitation.commPkgScope
                                                }
                                                projectName={
                                                    invitation.projectName
                                                }
                                            />
                                        </Tabs.Panel>
                                        <Tabs.Panel>
                                            <Attachments ipoId={params.ipoId} />
                                        </Tabs.Panel>
                                        <Tabs.Panel>
                                            <History ipoId={params.ipoId} />
                                        </Tabs.Panel>
                                    </Tabs.Panels>
                                </TabStyle>
                            </Tabs>
                            <CommentsIconContainer>
                                {!showComments && (
                                    <Button
                                        variant="ghost_icon"
                                        onClick={(): void =>
                                            setShowComments((show) => !show)
                                        }
                                    >
                                        <EdsIcon
                                            name={`${
                                                comments.length > 0
                                                    ? 'comment_chat'
                                                    : 'comment'
                                            }`}
                                            color={
                                                tokens.colors.interactive
                                                    .primary__resting.rgba
                                            }
                                        />
                                    </Button>
                                )}
                            </CommentsIconContainer>
                        </TabsContainer>
                        {showComments && (
                            <CommentsContainer maxHeight={commentModuleHeight}>
                                <Comments
                                    comments={comments}
                                    addComment={addComment}
                                    loading={loadingComments}
                                    close={(): void => setShowComments(false)}
                                />
                            </CommentsContainer>
                        )}
                    </InvitationContentContainer>
                </InvitationContainer>
            ) : (
                <Typography>No invitation found</Typography>
            )}
        </Container>
    );
};

export default ViewIPO;
