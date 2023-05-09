import {
    Attachment,
    CommPkgRow,
    GeneralInfoDetails,
    McScope,
    Participant,
    RoleParticipant,
    Step,
} from '../../types';
import { ComponentName, IpoCustomEvents, OrganizationsEnum } from '../enums';
import {
    FunctionalRoleDto,
    ParticipantDto,
    PersonDto,
} from '../../http/InvitationForPunchOutApiClient';
import React, { useEffect, useState } from 'react';
import { getEndTime, getNextHalfHourTimeString } from './utils';

import { Canceler } from 'axios';
import { Container } from './CreateAndEditIPO.style';
import CreateAndEditIPO from './CreateAndEditIPO';
import Loading from '@procosys/components/Loading';
import { OrganizationMap } from '../utils';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useAnalytics } from '@procosys/core/services/Analytics/AnalyticsContext';
import { useCurrentUser } from '../../../../core/UserContext';
import { useDirtyContext } from '@procosys/core/DirtyContext';
import { useInvitationForPunchOutContext } from '../../context/InvitationForPunchOutContext';
import { useParams } from 'react-router-dom';
import useRouter from '@procosys/hooks/useRouter';
import { set } from 'date-fns';

const initialDate = getNextHalfHourTimeString(new Date());
const initialEnd = getEndTime(initialDate);

const emptyGeneralInfo: GeneralInfoDetails = {
    projectName: '',
    poType: null,
    title: '',
    description: '',
    date: initialDate,
    startTime: set(new Date(), {
        hours: initialDate.getHours(),
        minutes: initialDate.getMinutes(),
    }),
    endTime: set(new Date(), {
        hours: initialEnd.getHours(),
        minutes: initialEnd.getMinutes(),
    }),
    location: '',
};

const initialParticipants: Participant[] = [
    {
        organization: {
            text: OrganizationMap.get(OrganizationsEnum.Contractor) as string,
            value: OrganizationsEnum.Contractor,
        },
        sortKey: null,
        type: 'Functional role',
        externalEmail: null,
        person: null,
        role: null,
        signedAt: null,
    },
    {
        organization: {
            text: OrganizationMap.get(
                OrganizationsEnum.ConstructionCompany
            ) as string,
            value: OrganizationsEnum.ConstructionCompany,
        },
        sortKey: null,
        type: 'Functional role',
        externalEmail: null,
        person: null,
        role: null,
        signedAt: null,
    },
    {
        organization: {
            text: OrganizationMap.get(
                OrganizationsEnum.Commissioning
            ) as string,
            value: OrganizationsEnum.Commissioning,
        },
        sortKey: null,
        type: 'Functional role',
        externalEmail: null,
        person: null,
        role: null,
        signedAt: null,
    },
    {
        organization: {
            text: OrganizationMap.get(OrganizationsEnum.Operation) as string,
            value: OrganizationsEnum.Operation,
        },
        sortKey: null,
        type: 'Functional role',
        externalEmail: null,
        person: null,
        role: null,
        signedAt: null,
    },
    {
        organization: {
            text: OrganizationMap.get(
                OrganizationsEnum.TechnicalIntegrity
            ) as string,
            value: OrganizationsEnum.TechnicalIntegrity,
        },
        sortKey: null,
        type: 'Functional role',
        externalEmail: null,
        person: null,
        role: null,
        signedAt: null,
    },
];

const CreateIPO = (): JSX.Element => {
    const user = useCurrentUser();
    const params = useParams<{
        ipoId: any;
        projectName: any;
        commPkgNo: any;
    }>();

    const initialSteps: Step[] = [
        { title: 'General info', isCompleted: false },
        { title: 'Scope', isCompleted: false },
        { title: 'Participants', isCompleted: false },
        { title: 'Upload attachments', isCompleted: false },
        { title: 'Summary & create', isCompleted: false },
    ];

    const initialGeneralInfo = {
        ...emptyGeneralInfo,
        projectName: params.projectName ? params.projectName : '',
    };
    const [generalInfo, setGeneralInfo] =
        useState<GeneralInfoDetails>(initialGeneralInfo);
    const [confirmationChecked, setConfirmationChecked] =
        useState<boolean>(false);
    const [selectedCommPkgScope, setSelectedCommPkgScope] = useState<
        CommPkgRow[]
    >([]);
    const [selectedMcPkgScope, setSelectedMcPkgScope] = useState<McScope>({
        system: null,
        multipleDisciplines: false,
        selected: [],
    });
    const [participants, setParticipants] =
        useState<Participant[]>(initialParticipants);
    const [fromMain, setFromMain] = useState<boolean>(false);
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [availableRoles, setAvailableRoles] = useState<RoleParticipant[]>([]);
    const { apiClient } = useInvitationForPunchOutContext();
    const { history } = useRouter();
    const [steps, setSteps] = useState<Step[]>(initialSteps);
    const [projectNameFromMain] = useState<string | null>(
        params.projectName ? decodeURIComponent(params.projectName) : null
    );
    const [commPkgNoFromMain] = useState<string | null>(
        params.commPkgNo ? decodeURIComponent(params.commPkgNo) : null
    );

    const { setDirtyStateFor, unsetDirtyStateFor, unsetDirtyStateForMany } =
        useDirtyContext();
    const analystics = useAnalytics();

    useEffect(() => {
        if (
            JSON.stringify(generalInfo) !== JSON.stringify(initialGeneralInfo)
        ) {
            setDirtyStateFor(ComponentName.GeneralInfo);
        } else {
            unsetDirtyStateFor(ComponentName.GeneralInfo);
        }
    }, [generalInfo]);

    /**
     * Fetch available functional roles
     */
    useEffect(() => {
        let requestCanceler: Canceler;
        try {
            (async (): Promise<void> => {
                const functionalRoles = await apiClient
                    .getFunctionalRolesAsync()
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
            })();
            return (): void => requestCanceler && requestCanceler();
        } catch (error) {
            showSnackbarNotification(error.message);
        }
    }, []);

    useEffect(() => {
        setParticipants((p) => {
            const participantsCopy = [...p];
            participantsCopy[0].type = 'Person';
            participantsCopy[0].role = null;
            participantsCopy[0].person = {
                azureOid: user.id,
                name: user.name,
                email: '',
                radioOption: null,
            };
            return participantsCopy;
        });
    }, [user]);

    const getPerson = (participant: Participant): PersonDto | null => {
        if (!participant.person) {
            return null;
        }
        return {
            id: participant.id,
            azureOid: participant.person.azureOid,
            email: participant.person.email,
            required: participant.person.radioOption == 'to',
        };
    };

    const getPersons = (role: RoleParticipant): PersonDto[] | null => {
        if (!role.persons || role.persons.length == 0) {
            return null;
        }
        return role.persons.map((p) => {
            return {
                id: p.id,
                azureOid: p.azureOid,
                email: p.email,
                required: p.radioOption == 'to' || role.usePersonalEmail,
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
        };
    };

    const getCommPkgScope = (): string[] => {
        return selectedCommPkgScope.map((c) => {
            return c.commPkgNo;
        });
    };

    const getMcScope = (): string[] | null =>
        selectedMcPkgScope.selected.map((mc) => mc.mcPkgNo);

    const getParticipants = (): ParticipantDto[] => {
        return participants.map((p, i) => {
            return {
                organization: p.organization.value,
                sortKey: i,
                externalEmail: p.externalEmail,
                person: getPerson(p),
                functionalRole: getFunctionalRole(p),
            };
        });
    };

    const uploadAllAttachments = async (ipoId: number): Promise<any> => {
        await Promise.all(
            attachments.map(async (attachment) => {
                if (attachment.file) {
                    try {
                        await apiClient.uploadAttachment(
                            ipoId,
                            attachment.file,
                            true
                        );
                    } catch (error) {
                        console.error(
                            'Upload attachment failed: ',
                            error.message,
                            error.data
                        );
                        showSnackbarNotification(error.message);
                    }
                }
            })
        );
    };

    const createNewIpo = async (): Promise<void> => {
        setIsCreating(true);
        if (
            generalInfo.title &&
            generalInfo.projectName &&
            generalInfo.poType &&
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

                const newIpoId = await apiClient.createIpo(
                    generalInfo.title,
                    generalInfo.projectName,
                    generalInfo.poType.value,
                    startTime,
                    endTime,
                    generalInfo.description ? generalInfo.description : null,
                    generalInfo.location ? generalInfo.location : null,
                    ipoParticipants,
                    mcPkgScope,
                    commPkgScope
                );
                analystics.trackUserAction(IpoCustomEvents.CREATED, {
                    project: generalInfo.projectName,
                    type: generalInfo.poType.value,
                });

                await uploadAllAttachments(newIpoId);

                unsetDirtyStateForMany([
                    ComponentName.Attachments,
                    ComponentName.GeneralInfo,
                ]);
                history.push('/' + newIpoId);
            } catch (error) {
                console.error('Create IPO failed: ', error.message, error.data);
                showSnackbarNotification(error.message);
            }
        }
        setIsCreating(false);
    };

    useEffect(() => {
        if (params.projectName && params.commPkgNo) {
            setFromMain(true);
            setGeneralInfo((gi) => {
                return { ...gi, projectName: projectNameFromMain };
            });
        }
    }, [projectNameFromMain]);

    if (isCreating) {
        return (
            <Container>
                <Loading title="Creating new IPO" />
            </Container>
        );
    }

    return (
        <CreateAndEditIPO
            saveIpo={createNewIpo}
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
            fromMain={fromMain}
            confirmationChecked={confirmationChecked}
            setConfirmationChecked={setConfirmationChecked}
            commPkgNoFromMain={commPkgNoFromMain}
        />
    );
};

export default CreateIPO;
