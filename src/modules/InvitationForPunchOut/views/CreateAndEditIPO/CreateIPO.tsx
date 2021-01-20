import { Attachment, CommPkgRow, GeneralInfoDetails, McScope, Participant, RoleParticipant, Step } from '../../types';
import { ComponentName, OrganizationsEnum } from '../enums';
import { FunctionalRoleDto, ParticipantDto, PersonDto } from '../../http/InvitationForPunchOutApiClient';
import React, { useEffect, useState } from 'react';
import { getEndTime, getNextHalfHourTimeString } from './utils';

import { Canceler } from 'axios';
import { Container } from './CreateAndEditIPO.style';
import CreateAndEditIPO from './CreateAndEditIPO';
import Loading from '@procosys/components/Loading';
import { OrganizationMap } from '../utils';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useDirtyContext } from '@procosys/core/DirtyContext';
import { useInvitationForPunchOutContext } from '../../context/InvitationForPunchOutContext';
import { useParams } from 'react-router-dom';
import useRouter from '@procosys/hooks/useRouter';

const initialDate = getNextHalfHourTimeString(new Date());

const emptyGeneralInfo: GeneralInfoDetails = {
    projectId: null,
    projectName: '',
    poType: null,
    title: '',
    description: '',
    startTime: initialDate,
    endTime: getEndTime(initialDate),
    location: ''
};

const initialParticipants: Participant[] = [
    {
        organization: { text: OrganizationMap.get(OrganizationsEnum.Contractor) as string, value: OrganizationsEnum.Contractor },
        sortKey: null,
        type: 'Functional role',
        externalEmail: null,
        person: null,
        role: null
    },
    {
        organization: { text: OrganizationMap.get(OrganizationsEnum.ConstructionCompany) as string, value: OrganizationsEnum.ConstructionCompany },
        sortKey: null,
        type: 'Functional role',
        externalEmail: null,
        person: null,
        role: null
    },
    {
        organization: { text: OrganizationMap.get(OrganizationsEnum.Commissioning) as string, value: OrganizationsEnum.Commissioning },
        sortKey: null,
        type: 'Functional role',
        externalEmail: null,
        person: null,
        role: null
    },
    {
        organization: { text: OrganizationMap.get(OrganizationsEnum.Operation) as string, value: OrganizationsEnum.Operation },
        sortKey: null,
        type: 'Functional role',
        externalEmail: null,
        person: null,
        role: null
    },
    {
        organization: { text: OrganizationMap.get(OrganizationsEnum.TechnicalIntegrity) as string, value: OrganizationsEnum.TechnicalIntegrity },
        sortKey: null,
        type: 'Functional role',
        externalEmail: null,
        person: null,
        role: null
    }
];

const CreateIPO = (): JSX.Element => {

    const params = useParams<{ ipoId: any; projectId: any; commPkgNo: any }>();

    const initialSteps: Step[] = [
        { title: 'General info', isCompleted: false },
        { title: 'Scope', isCompleted: false },
        { title: 'Participants', isCompleted: false },
        { title: 'Upload attachments', isCompleted: false },
        { title: 'Summary & create', isCompleted: false }
    ];

    const initialGeneralInfo = { ...emptyGeneralInfo, projectId: params.projectId };
    const [generalInfo, setGeneralInfo] = useState<GeneralInfoDetails>(initialGeneralInfo);
    const [confirmationChecked, setConfirmationChecked] = useState<boolean>(false);
    const [selectedCommPkgScope, setSelectedCommPkgScope] = useState<CommPkgRow[]>([]);
    const [selectedMcPkgScope, setSelectedMcPkgScope] = useState<McScope>({
        commPkgNoParent: null,
        multipleDisciplines: false,
        selected: []
    });
    const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
    const [fromMain, setFromMain] = useState<boolean>(false);
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [availableRoles, setAvailableRoles] = useState<RoleParticipant[]>([]);
    const { apiClient } = useInvitationForPunchOutContext();
    const { history } = useRouter();
    const { unsetDirtyStateFor } = useDirtyContext();
    const [steps, setSteps] = useState<Step[]>(initialSteps);


    /**
     * Fetch available functional roles 
     */
    useEffect(() => {
        let requestCanceler: Canceler;
        try {
            (async (): Promise<void> => {
                const functionalRoles = await apiClient.getFunctionalRolesAsync()
                    .then(roles => roles.map((role): RoleParticipant => {
                        return {
                            code: role.code,
                            description: role.description,
                            usePersonalEmail: role.usePersonalEmail,
                            notify: false,
                            persons: role.persons.map(p => {
                                return {
                                    azureOid: p.azureOid,
                                    firstName: p.firstName,
                                    lastName: p.lastName,
                                    email: p.email,
                                    radioOption: role.usePersonalEmail ? 'to' : null,
                                };
                            })
                        };
                    }));
                setAvailableRoles(functionalRoles);
            })();
            return (): void => requestCanceler && requestCanceler();
        } catch (error) {
            showSnackbarNotification(error.message);
        }
    }, []);

    const getPerson = (participant: Participant): PersonDto | null => {
        if (!participant.person) {
            return null;
        }
        return {
            id: participant.person.id,
            azureOid: participant.person.azureOid,
            firstName: participant.person.firstName,
            lastName: participant.person.lastName,
            email: participant.person.email,
            rowVersion: participant.person.rowVersion,
            required: participant.person.radioOption == 'to'
        };
    };

    const getPersons = (role: RoleParticipant): PersonDto[] | null => {
        if (!role.persons || role.persons.length == 0) {
            return null;
        }
        return role.persons.map(p => {
            return {
                id: p.id,
                azureOid: p.azureOid,
                firstName: p.firstName,
                lastName: p.lastName,
                email: p.email,
                rowVersion: p.rowVersion,
                required: p.radioOption == 'to' || role.usePersonalEmail
            };
        });
    };

    const getFunctionalRole = (participant: Participant): FunctionalRoleDto | null => {
        if (!participant.role) {
            return null;
        }
        return {
            id: participant.role.id,
            rowVersion: participant.role.rowVersion,
            code: participant.role.code,
            persons: getPersons(participant.role)
        };
    };

    const getCommPkgScope = (): string[] => {
        return selectedCommPkgScope.map(c => {
            return c.commPkgNo;
        });
    };

    const getMcScope = (): string[] | null => {
        const commPkgNoContainingMcScope = selectedMcPkgScope.commPkgNoParent;
        let mcPkgScope = null;
        if (commPkgNoContainingMcScope) {
            mcPkgScope = selectedMcPkgScope.selected.map(mc => {
                return mc.mcPkgNo;
            });
        }
        return mcPkgScope;
    };

    const getParticipants = (): ParticipantDto[] => {
        return participants.map((p, i) => {
            return {
                organization: p.organization.value,
                sortKey: i,
                externalEmail: p.externalEmail,
                person: getPerson(p),
                functionalRole: getFunctionalRole(p)
            };
        });
    };

    const uploadAllAttachments = async (ipoId: number): Promise<any> => {
        await Promise.all(attachments.map(async (attachment) => {
            if (attachment.file) {
                try {
                    await apiClient.uploadAttachment(ipoId, attachment.file, true);
                } catch (error) {
                    console.error('Upload attachment failed: ', error.message, error.data);
                    showSnackbarNotification(error.message);
                }
            }
        }));
    };

    const createNewIpo = async (): Promise<void> => {
        setIsCreating(true);
        if (generalInfo.title && generalInfo.projectName && generalInfo.poType) {
            try {
                const commPkgScope = getCommPkgScope();
                const mcPkgScope = getMcScope();
                const ipoParticipants = getParticipants();

                const newIpoId = await apiClient.createIpo(
                    generalInfo.title,
                    generalInfo.projectName,
                    generalInfo.poType.value,
                    generalInfo.startTime,
                    generalInfo.endTime,
                    generalInfo.description ? generalInfo.description : null,
                    generalInfo.location ? generalInfo.location : null,
                    ipoParticipants,
                    mcPkgScope,
                    commPkgScope
                );

                await uploadAllAttachments(newIpoId);

                unsetDirtyStateFor(ComponentName.CreateAndEditIPO);
                history.push('/' + newIpoId);
            } catch (error) {
                console.error('Create IPO failed: ', error.message, error.data);
                showSnackbarNotification(error.message);
            }
        }
        setIsCreating(false);

    };

    useEffect(() => {
        if (params.projectId && params.commPkgNo) {
            setFromMain(true);
            setGeneralInfo(gi => { return { ...gi, projectId: params.projectId }; });
        }
    }, [fromMain]);

    if (isCreating) {
        return (
            <Container>
                <Loading title="Creating new IPO" />
            </Container>
        );
    };

    return (<CreateAndEditIPO
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
    />);
};

export default CreateIPO;
