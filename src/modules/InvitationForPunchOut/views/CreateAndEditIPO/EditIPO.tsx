import {
    Attachment,
    CommPkgRow,
    ExternalEmail,
    GeneralInfoDetails,
    McScope,
    Participant,
    Person,
    PersonInRole,
    RoleParticipant,
    Step,
} from '../../types';
import { CenterContainer, Container } from './CreateAndEditIPO.style';
import { ComponentName, IpoCustomEvents, IpoStatusEnum } from '../enums';
import {
    ExternalEmailDto,
    FunctionalRoleDto,
    IpoApiError,
    ParticipantDto,
    PersonDto,
    PersonInRoleDto,
} from '../../http/InvitationForPunchOutApiClient';
import React, { useCallback, useEffect, useState } from 'react';

import { Canceler } from 'axios';
import CreateAndEditIPO from './CreateAndEditIPO';
import { Invitation } from '../ViewIPO/types';
import Loading from '@procosys/components/Loading';
import { Organization } from '../../types';
import { OrganizationMap } from '../utils';
import { SelectItem } from '@procosys/components/Select';
import { poTypes } from './GeneralInfo/GeneralInfo';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useAnalytics } from '@procosys/core/services/Analytics/AnalyticsContext';
import { useDirtyContext } from '@procosys/core/DirtyContext';
import { useInvitationForPunchOutContext } from '../../context/InvitationForPunchOutContext';
import { useParams } from 'react-router-dom';
import useRouter from '@procosys/hooks/useRouter';
import { set } from 'date-fns';

const emptyGeneralInfo: GeneralInfoDetails = {
    projectName: '',
    poType: null,
    title: '',
    description: '',
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    location: '',
    isOnline: false,
};

const EditIPO = (): JSX.Element => {
    const initialSteps: Step[] = [
        { title: 'General info', isCompleted: true },
        { title: 'Scope', isCompleted: true },
        { title: 'Participants', isCompleted: true },
        { title: 'Upload attachments', isCompleted: true },
        { title: 'Summary & update', isCompleted: true },
    ];

    const params = useParams<{ ipoId: any }>();
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [generalInfo, setGeneralInfo] =
        useState<GeneralInfoDetails>(emptyGeneralInfo);
    const [initialGeneralInfo, setInitialGeneralInfo] =
        useState<GeneralInfoDetails>(emptyGeneralInfo);
    const [confirmationChecked, setConfirmationChecked] =
        useState<boolean>(true);
    const [isOnline, setIsOnline] = useState<boolean>(
        generalInfo.isOnline ? generalInfo.isOnline : false
    );
    const [selectedCommPkgScope, setSelectedCommPkgScope] = useState<
        CommPkgRow[]
    >([]);
    const [initialSelectedCommPkgScope, setInitialSelectedCommPkgScope] =
        useState<CommPkgRow[]>([]);
    const [selectedMcPkgScope, setSelectedMcPkgScope] = useState<McScope>({
        system: null,
        multipleDisciplines: false,
        selected: [],
    });
    const [initialSelectedMcPkgScope, setInitialSelectedMcPkgScope] =
        useState<McScope>({
            system: null,
            multipleDisciplines: false,
            selected: [],
        });
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [initialParticipants, setInitialParticipants] = useState<
        Participant[]
    >([]);

    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [invitation, setInvitation] = useState<Invitation>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [availableRoles, setAvailableRoles] = useState<RoleParticipant[]>([]);

    const { apiClient } = useInvitationForPunchOutContext();
    const { history } = useRouter();
    const { setDirtyStateFor, unsetDirtyStateFor, unsetDirtyStateForMany } =
        useDirtyContext();
    const analystics = useAnalytics();
    const [steps, setSteps] = useState<Step[]>(initialSteps);

    /**
     * Check and set dirty state for all components
     */
    useEffect(() => {
        if (
            JSON.stringify(generalInfo) !== JSON.stringify(initialGeneralInfo)
        ) {
            setDirtyStateFor(ComponentName.GeneralInfo);
        } else {
            unsetDirtyStateFor(ComponentName.GeneralInfo);
        }
    }, [generalInfo]);

    useEffect(() => {
        const newScope = selectedCommPkgScope.map(({ commPkgNo }) => commPkgNo);
        const initialScope = initialSelectedCommPkgScope.map(
            ({ commPkgNo }) => commPkgNo
        );
        if (JSON.stringify(newScope) !== JSON.stringify(initialScope)) {
            setDirtyStateFor(ComponentName.Scope);
        } else {
            unsetDirtyStateFor(ComponentName.Scope);
        }
    }, [selectedCommPkgScope]);

    useEffect(() => {
        const mcPkgs = selectedMcPkgScope.selected.map(
            ({ mcPkgNo }) => mcPkgNo
        );
        const initialMcPkgs = initialSelectedMcPkgScope.selected.map(
            ({ mcPkgNo }) => mcPkgNo
        );
        if (
            JSON.stringify(mcPkgs) !== JSON.stringify(initialMcPkgs) ||
            selectedMcPkgScope.system !== initialSelectedMcPkgScope.system
        ) {
            setDirtyStateFor(ComponentName.Scope);
        } else {
            unsetDirtyStateFor(ComponentName.Scope);
        }
    }, [selectedMcPkgScope]);

    useEffect(() => {
        if (
            JSON.stringify(participants) !== JSON.stringify(initialParticipants)
        ) {
            setDirtyStateFor(ComponentName.Participants);
        } else {
            unsetDirtyStateFor(ComponentName.Participants);
        }
    }, [participants]);

    /**
     * Fetch and set available functional roles
     */
    const getFunctionalRoles = useCallback(
        async (
            requestCanceller?: (cancelCallback: Canceler) => void
        ): Promise<void> => {
            try {
                const functionalRoles = await apiClient
                    .getFunctionalRolesAsync(requestCanceller)
                    .then((roles) =>
                        roles.map((role): RoleParticipant => {
                            return {
                                code: role.code,
                                description: role.description,
                                usePersonalEmail: role.usePersonalEmail,
                                notify: false,
                                persons: role.persons.map((p) => {
                                    return {
                                        azureOid: p.azureOid,
                                        name: `${p.firstName} ${p.lastName}`,
                                        email: p.email,
                                        radioOption: role.usePersonalEmail
                                            ? 'to'
                                            : null,
                                    };
                                }),
                            };
                        })
                    );
                setAvailableRoles(functionalRoles);
            } catch (error) {
                if (!(error instanceof IpoApiError)) {
                    console.error(error);
                    showSnackbarNotification('Unknown error');
                    return;
                }
                console.error(error.message, error.data);
                showSnackbarNotification(error.message);
            }
        },
        [params.ipoId]
    );

    const getCommPkgScope = (): string[] => {
        return selectedCommPkgScope.map((c) => {
            return c.commPkgNo;
        });
    };

    const getMcScope = (): string[] | null =>
        selectedMcPkgScope.selected.map((mc) => mc.mcPkgNo);

    const getPerson = (participant: Participant): PersonDto | null => {
        if (!participant.person) {
            return null;
        }
        return {
            id: participant.id,
            azureOid: participant.person.azureOid,
            email: participant.person.email,
            required: participant.person.radioOption == 'to',
            rowVersion: participant.rowVersion,
        };
    };

    const getPersons = (role: RoleParticipant): PersonInRoleDto[] | null => {
        if (!role.persons || role.persons.length == 0) {
            return null;
        }
        return role.persons.map((p) => {
            return {
                id: p.id,
                azureOid: p.azureOid,
                email: p.email,
                required: p.radioOption == 'to' || role.usePersonalEmail,
                rowVersion: p.rowVersion,
            };
        });
    };

    const getFunctionalRole = (
        participant: Participant
    ): FunctionalRoleDto | null => {
        if (!participant.role) {
            return null;
        }
        return {
            id: participant.id,
            code: participant.role.code,
            persons: getPersons(participant.role),
            rowVersion: participant.rowVersion,
        };
    };

    const getExternalEmail = (
        participant: Participant
    ): ExternalEmailDto | null => {
        if (!participant.externalEmail) return null;
        return {
            id: participant.id,
            email: participant.externalEmail.email,
            rowVersion: participant.rowVersion,
        };
    };

    const getParticipants = (): ParticipantDto[] => {
        return participants.map((p, i) => {
            return {
                organization: p.organization.value,
                sortKey: i,
                externalEmail: getExternalEmail(p),
                person: getPerson(p),
                functionalRole: getFunctionalRole(p),
            };
        });
    };

    const uploadOrRemoveAttachments = async (ipoId: number): Promise<any> => {
        await Promise.all(
            attachments.map(async (attachment) => {
                try {
                    //Attachments without 'file' is already uploaded
                    if (attachment.file) {
                        await apiClient.uploadAttachment(
                            ipoId,
                            attachment.file,
                            true
                        );
                    }

                    //Attachments already uploaded can be marked to be deleted
                    if (
                        attachment.id &&
                        attachment.rowVersion &&
                        attachment.toBeDeleted
                    ) {
                        await apiClient.deleteAttachment(
                            ipoId,
                            attachment.id,
                            attachment.rowVersion
                        );
                    }
                } catch (error) {
                    if (!(error instanceof IpoApiError)) {
                        console.error(error);
                        showSnackbarNotification('Unknown error');
                        return;
                    }
                    console.error(
                        'Upload or delete of attachment failed: ',
                        error.message,
                        error.data
                    );
                    showSnackbarNotification(error.message);
                }
            })
        );
    };

    const getAttachments = async (
        requestCanceller?: (cancelCallback: Canceler) => void
    ): Promise<void> => {
        try {
            const response = await apiClient.getAttachments(
                params.ipoId,
                requestCanceller
            );
            setAttachments(response);
        } catch (error) {
            if (!(error instanceof IpoApiError)) {
                console.error(error);
                showSnackbarNotification('Unknown error');
                return;
            }
            console.error(error.message, error.data);
            showSnackbarNotification(error.message);
        }
    };

    const saveUpdatedIpo = async (): Promise<void> => {
        setIsSaving(true);
        if (
            generalInfo.title &&
            generalInfo.projectName &&
            generalInfo.poType &&
            invitation &&
            generalInfo.date &&
            generalInfo.startTime &&
            generalInfo.endTime
        ) {
            try {
                const commPkgScope = getCommPkgScope();
                const mcPkgScope = getMcScope();
                const ipoParticipants = getParticipants();
                // start and end time fields always use the current date
                // this adds date set in date field to the start and end time
                const startTime = set(generalInfo.date, {
                    hours: generalInfo.startTime.getHours(),
                    minutes: generalInfo.startTime.getMinutes(),
                });
                const endTime = set(generalInfo.date, {
                    hours: generalInfo.endTime.getHours(),
                    minutes: generalInfo.endTime.getMinutes(),
                });

                if (invitation?.status != IpoStatusEnum.PLANNED) {
                    await apiClient.updateIpoParticipants(
                        params.ipoId,
                        ipoParticipants
                    );
                } else {
                    await apiClient.updateIpo(
                        params.ipoId,
                        generalInfo.title,
                        generalInfo.poType.value,
                        startTime,
                        endTime,
                        generalInfo.description
                            ? generalInfo.description
                            : null,
                        generalInfo.location ? generalInfo.location : null,
                        ipoParticipants,
                        mcPkgScope,
                        commPkgScope,
                        invitation.rowVersion
                    );
                }
                analystics.trackUserAction(IpoCustomEvents.EDITED, {
                    project: generalInfo.projectName,
                    type: generalInfo.poType.value,
                });

                await uploadOrRemoveAttachments(params.ipoId);

                unsetDirtyStateForMany([
                    ComponentName.GeneralInfo,
                    ComponentName.Scope,
                    ComponentName.Participants,
                    ComponentName.Attachments,
                ]);
                history.push('/' + params.ipoId);
            } catch (error) {
                if (!(error instanceof IpoApiError)) {
                    console.error(error);
                    showSnackbarNotification('Unknown error');
                    return;
                }
                console.error(
                    'Save updated IPO failed: ',
                    error.message,
                    error.data
                );
                showSnackbarNotification(error.message);
            }
        }
        setIsSaving(false);
    };

    const getInvitation = useCallback(
        async (
            requestCanceller?: (cancelCallback: Canceler) => void
        ): Promise<void> => {
            try {
                const response = await apiClient.getIPO(
                    params.ipoId,
                    requestCanceller
                );
                setInvitation(response);
            } catch (error) {
                if (!(error instanceof IpoApiError)) {
                    console.error(error);
                    showSnackbarNotification('Unknown error');
                    return;
                }
                console.error(error.message, error.data);
                showSnackbarNotification(error.message);
            }
        },
        [params.ipoId]
    );

    /**
     *  Populate forms based on invitation to edit
     */
    useEffect(() => {
        console.log(invitation);
        if (invitation) {
            //General information
            const poType = poTypes.find(
                (p: SelectItem) => p.value === invitation.type
            );
            const startTime = new Date(invitation.startTimeUtc);
            const endTime = new Date(invitation.endTimeUtc);
            const info = {
                ...emptyGeneralInfo,
                projectName: invitation.projectName
                    ? invitation.projectName
                    : '',
                poType: poType ? poType : null,
                title: invitation.title ? invitation.title : '',
                description: invitation.description
                    ? invitation.description
                    : '',
                date: startTime,
                // start and end time fields needs to use current date, not the date set in the date field
                startTime: set(new Date(), {
                    hours: startTime.getHours(),
                    minutes: startTime.getMinutes(),
                }),
                endTime: set(new Date(), {
                    hours: endTime.getHours(),
                    minutes: endTime.getMinutes(),
                }),
                location: invitation.location ? invitation.location : '',
                isOnline: invitation.isOnline,
            };
            setGeneralInfo({ ...info });
            setInitialGeneralInfo({ ...info });

            //CommPkg
            const commPkgScope: CommPkgRow[] = [];

            if (invitation.commPkgScope && invitation.commPkgScope.length > 0) {
                invitation.commPkgScope.forEach((commPkg) => {
                    commPkgScope.push({
                        commPkgNo: commPkg.commPkgNo,
                        description: commPkg.description,
                        system: commPkg.system,
                        status: commPkg.status,
                    });
                });
                setSelectedCommPkgScope(commPkgScope);
                setInitialSelectedCommPkgScope(commPkgScope);
            } else if (
                invitation.mcPkgScope &&
                invitation.mcPkgScope.length > 0
            ) {
                //MCPkg
                const mcPkgScope: McScope = {
                    system: null,
                    multipleDisciplines: false,
                    selected: [],
                };

                invitation.mcPkgScope.forEach((mcPkg) => {
                    if (!mcPkgScope.system) {
                        mcPkgScope.system = mcPkg.system;
                    }
                    mcPkgScope.selected.push({
                        mcPkgNo: mcPkg.mcPkgNo,
                        description: mcPkg.description,
                        system: mcPkg.system,
                        commPkgNo: mcPkg.commPkgNo,
                        discipline: '',
                    });
                });
                setSelectedMcPkgScope(mcPkgScope);
                setInitialSelectedMcPkgScope(mcPkgScope);
            }

            //Participants
            const participants: Participant[] = [];
            invitation.participants.forEach((participant) => {
                let participantType = '';
                let person: Person | null = null;
                let roleParticipant: RoleParticipant | null = null;
                let externalEmail: ExternalEmail | null = null;

                if (participant.person) {
                    participantType = 'Person';
                    person = {
                        azureOid: participant.person.azureOid,
                        name: `${participant.person.firstName} ${participant.person.lastName}`,
                        email: participant.person.email,
                        radioOption: null,
                    };
                } else if (participant.functionalRole) {
                    participantType = 'Functional role';

                    const persons: PersonInRole[] = [];
                    participant.functionalRole.persons.forEach((person) => {
                        persons.push({
                            id: person.id,
                            azureOid: person.azureOid,
                            name: `${person.firstName} ${person.lastName}`,
                            email: person.email,
                            rowVersion: person.rowVersion,
                            radioOption: person.required ? 'to' : 'cc',
                        });
                    });

                    const funcRole = availableRoles
                        ? availableRoles.find(
                              (role) =>
                                  role.code === participant.functionalRole.code
                          )
                        : null;
                    roleParticipant = {
                        code: participant.functionalRole.code,
                        description: funcRole ? funcRole.description : '',
                        usePersonalEmail: funcRole
                            ? funcRole.usePersonalEmail
                            : false,
                        notify: persons && persons.length > 0 ? true : false,
                        persons: persons,
                    };
                } else if (participant.externalEmail) {
                    participantType = 'Person';
                    externalEmail = {
                        email: participant.externalEmail.externalEmail,
                    };
                }
                const organizationText = OrganizationMap.get(
                    participant.organization as Organization
                );
                const newParticipant: Participant = {
                    id: participant.id,
                    organization: {
                        text: organizationText ? organizationText : 'Unknown',
                        value: participant.organization,
                    },
                    sortKey: participant.sortKey,
                    type: participantType,
                    rowVersion: participant.rowVersion,
                    externalEmail: externalEmail,
                    person: person,
                    role: roleParticipant,
                    signedAt: participant.signedAtUtc,
                };
                participants.push(newParticipant);
            });

            setParticipants(participants);
            setInitialParticipants(participants);
        }
    }, [invitation]);

    /**
     * For edit, fetch data for existing ipo
     */
    useEffect(() => {
        if (params.ipoId && availableRoles) {
            let requestCancellor: Canceler | null = null;
            (async (): Promise<void> => {
                setIsLoading(true);
                await getFunctionalRoles((cancel: Canceler) => {
                    requestCancellor = cancel;
                });
                await getInvitation((cancel: Canceler) => {
                    requestCancellor = cancel;
                });
                await getAttachments((cancel: Canceler) => {
                    requestCancellor = cancel;
                });
                setIsLoading(false);
            })();
            return (): void => {
                requestCancellor && requestCancellor();
            };
        }
    }, [params.ipoId]);

    if (isSaving) {
        return (
            <Container>
                <Loading title="Save updated IPO" />
            </Container>
        );
    }

    if (isLoading) {
        return (
            <CenterContainer>
                <Loading title="Fetching IPO" />
            </CenterContainer>
        );
    }

    return (
        <CreateAndEditIPO
            saveIpo={saveUpdatedIpo}
            steps={steps}
            setSteps={setSteps}
            generalInfo={generalInfo}
            setGeneralInfo={setGeneralInfo}
            selectedCommPkgScope={selectedCommPkgScope}
            setSelectedCommPkgScope={setSelectedCommPkgScope}
            selectedMcPkgScope={selectedMcPkgScope}
            setSelectedMcPkgScope={setSelectedMcPkgScope}
            participants={participants}
            setParticipants={setParticipants}
            attachments={attachments}
            setAttachments={setAttachments}
            availableRoles={availableRoles}
            fromMain={false}
            confirmationChecked={confirmationChecked}
            setConfirmationChecked={setConfirmationChecked}
            isEditMode={true}
            ipoId={params.ipoId}
            status={invitation?.status}
        />
    );
};

export default EditIPO;
