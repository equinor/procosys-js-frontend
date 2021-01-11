import { Attachment, CommPkgRow, GeneralInfoDetails, McScope, Participant, Person, RoleParticipant } from '../../types';
import { CenterContainer, Container } from './CreateAndEditIPO.style';
import { FunctionalRoleDto, ParticipantDto, PersonDto } from '../../http/InvitationForPunchOutApiClient';
import React, { useCallback, useEffect, useState } from 'react';

import { Canceler } from 'axios';
import { ComponentName } from '../enums';
import CreateAndEditIPO from './CreateAndEditIPO';
import { Invitation } from '../ViewIPO/types';
import Loading from '@procosys/components/Loading';
import { SelectItem } from '@procosys/components/Select';
import { poTypes } from './GeneralInfo/GeneralInfo';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useDirtyContext } from '@procosys/core/DirtyContext';
import { useInvitationForPunchOutContext } from '../../context/InvitationForPunchOutContext';
import { useParams } from 'react-router-dom';
import useRouter from '@procosys/hooks/useRouter';

const emptyGeneralInfo: GeneralInfoDetails = {
    projectId: null,
    projectName: null,
    poType: null,
    title: null,
    description: null,
    startTime: new Date(),
    endTime: new Date(),
    location: ''
};

const EditIPO = (): JSX.Element => {
    const params = useParams<{ ipoId: any }>();
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [generalInfo, setGeneralInfo] = useState<GeneralInfoDetails>(emptyGeneralInfo);
    const [confirmationChecked, setConfirmationChecked] = useState<boolean>(true);
    const [selectedCommPkgScope, setSelectedCommPkgScope] = useState<CommPkgRow[]>([]);
    const [selectedMcPkgScope, setSelectedMcPkgScope] = useState<McScope>({
        commPkgNoParent: null,
        multipleDisciplines: false,
        selected: []
    });
    const [participants, setParticipants] = useState<Participant[]>([]);

    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [invitation, setInvitation] = useState<Invitation>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [availableRoles, setAvailableRoles] = useState<RoleParticipant[]>([]);

    const { apiClient } = useInvitationForPunchOutContext();
    const { history } = useRouter();
    const { setDirtyStateFor, unsetDirtyStateFor } = useDirtyContext();

    /**
     * Fetch and set available functional roles 
     */
    const getFunctionalRoles = useCallback(async (requestCanceller?: (cancelCallback: Canceler) => void): Promise<void> => {
        try {
            const functionalRoles = await apiClient.getFunctionalRolesAsync(requestCanceller)
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
        } catch (error) {
            console.error(error.message, error.data);
            showSnackbarNotification(error.message);
        }
    }, [params.ipoId]);

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

    const uploadOrRemoveAttachments = async (ipoId: number): Promise<any> => {
        await Promise.all(attachments.map(async (attachment) => {
            try {
                //Attachments without 'file' is already uploaded
                if (attachment.file) {
                    await apiClient.uploadAttachment(ipoId, attachment.file, true);
                }

                //Attachments already uploaded can be marked to be deleted
                if (attachment.id && attachment.rowVersion && attachment.toBeDeleted) {
                    await apiClient.deleteAttachment(ipoId, attachment.id, attachment.rowVersion);
                }
            } catch (error) {
                console.error('Upload or delete of attachment failed: ', error.message, error.data);
                showSnackbarNotification(error.message);
            }
        }));
    };

    const getAttachments = useCallback(async (requestCanceller?: (cancelCallback: Canceler) => void): Promise<void> => {
        try {
            const response = await apiClient.getAttachments(params.ipoId, requestCanceller);
            setAttachments(response);
        } catch (error) {
            console.error(error.message, error.data);
            showSnackbarNotification(error.message);
        }
    }, [params.ipoId]);

    const saveUpdatedIpo = async (): Promise<void> => {
        setIsSaving(true);
        if (generalInfo.title && generalInfo.projectName && generalInfo.poType && invitation) {
            try {
                const commPkgScope = getCommPkgScope();
                const mcPkgScope = getMcScope();
                const ipoParticipants = getParticipants();

                await apiClient.updateIpo(
                    params.ipoId,
                    generalInfo.title,
                    generalInfo.poType.value,
                    generalInfo.startTime,
                    generalInfo.endTime,
                    generalInfo.description ? generalInfo.description : null,
                    generalInfo.location ? generalInfo.location : null,
                    ipoParticipants,
                    mcPkgScope,
                    commPkgScope,
                    invitation.rowVersion
                );

                await uploadOrRemoveAttachments(params.ipoId);

                unsetDirtyStateFor(ComponentName.CreateAndEditIPO);
                history.push('/' + params.ipoId);
            } catch (error) {
                console.error('Save updated IPO failed: ', error.message, error.data);
                showSnackbarNotification(error.message);
            }
        }
        setIsSaving(false);
    };

    const getInvitation = useCallback(async (requestCanceller?: (cancelCallback: Canceler) => void): Promise<void> => {
        try {
            const response = await apiClient.getIPO(params.ipoId, requestCanceller);
            setInvitation(response);
        } catch (error) {
            console.error(error.message, error.data);
            showSnackbarNotification(error.message);
        }
    }, [params.ipoId]);

    /**
     *  Populate forms based on invitation to edit 
     */
    useEffect(() => {
        if (invitation) {
            //General information
            const poType = poTypes.find((p: SelectItem) => p.value === invitation.type);
            setGeneralInfo({
                ...emptyGeneralInfo,
                projectName: invitation.projectName,
                poType: poType ? poType : null,
                title: invitation.title,
                description: invitation.description,
                startTime: new Date(invitation.startTimeUtc),
                endTime: new Date(invitation.endTimeUtc),
                location: invitation.location
            });

            //CommPkg
            const commPkgScope: CommPkgRow[] = [];

            if (invitation.commPkgScope && invitation.commPkgScope.length > 0) {
                invitation.commPkgScope.forEach((commPkg) => {
                    commPkgScope.push({
                        commPkgNo: commPkg.commPkgNo,
                        description: commPkg.description,
                        status: commPkg.status
                    });
                });
                setSelectedCommPkgScope(commPkgScope);
            } else if (invitation.mcPkgScope && invitation.mcPkgScope.length > 0) {
                //MCPkg
                const mcPkgScope: McScope = { commPkgNoParent: null, multipleDisciplines: false, selected: [] };

                invitation.mcPkgScope.forEach((mcPkg) => {
                    if (!mcPkgScope.commPkgNoParent) {
                        mcPkgScope.commPkgNoParent = mcPkg.commPkgNo;
                    }
                    mcPkgScope.selected.push({
                        mcPkgNo: mcPkg.mcPkgNo,
                        description: mcPkg.description,
                        discipline: ''
                    });
                });
                setSelectedMcPkgScope(mcPkgScope);
            }

            //Participants
            const participants: Participant[] = [];
            invitation.participants.forEach((participant) => {

                let participantType = '';
                let person: Person | null = null;
                let roleParticipant: RoleParticipant | null = null;

                if (participant.person) {
                    participantType = 'Person';
                    person = {
                        id: participant.person.person.id,
                        rowVersion: participant.person.person.rowVersion,
                        azureOid: participant.person.person.azureOid,
                        firstName: participant.person.person.firstName,
                        lastName: participant.person.person.lastName,
                        email: participant.person.person.email,
                        radioOption: null
                    };
                } else if (participant.functionalRole) {
                    participantType = 'Functional role';

                    const persons: Person[] = [];
                    participant.functionalRole.persons.forEach((person) => {
                        persons.push({
                            id: person.person.id,
                            rowVersion: person.person.rowVersion,
                            azureOid: person.person.azureOid,
                            firstName: person.person.firstName,
                            lastName: person.person.lastName,
                            email: person.person.email,
                            radioOption: person.required ? 'to' : 'cc'
                        });
                    });

                    const funcRole = availableRoles ? availableRoles.find((role) => role.code === participant.functionalRole.code) : null;
                    roleParticipant = {
                        id: participant.functionalRole.id,
                        rowVersion: participant.functionalRole.rowVersion,
                        code: participant.functionalRole.code,
                        description: funcRole ? funcRole.description : '',
                        usePersonalEmail: funcRole ? funcRole.usePersonalEmail : false,
                        notify: (persons && persons.length > 0) ? true : false,
                        persons: persons
                    };
                }

                const newParticipant: Participant = {
                    organization: { text: participant.organization, value: participant.organization },
                    sortKey: participant.sortKey,
                    type: participantType,
                    externalEmail: null,
                    person: person,
                    role: roleParticipant
                };
                participants.push(newParticipant);
            });

            setParticipants(participants);
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
                await getFunctionalRoles((cancel: Canceler) => { requestCancellor = cancel; });
                await getInvitation((cancel: Canceler) => { requestCancellor = cancel; });
                await getAttachments((cancel: Canceler) => { requestCancellor = cancel; });
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
    };

    if (isLoading) {
        return (
            <CenterContainer>
                <Loading title="Fetching IPO" />
            </CenterContainer>
        );
    };

    return (<CreateAndEditIPO
        saveIpo={saveUpdatedIpo}
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
    />);
};

export default EditIPO;