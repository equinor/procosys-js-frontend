import { Attachment, CommPkgRow, GeneralInfoDetails, McScope, Participant, Person, RoleParticipant, Step } from '../../types';
import React, { useCallback, useEffect, useState } from 'react';
import { Canceler } from 'axios';
import { ComponentName } from '../enums';
import { FunctionalRoleDto, ParticipantDto, PersonDto } from '../../http/InvitationForPunchOutApiClient';
import { getEndTime, getNextHalfHourTimeString } from './utils';

import Attachments from './Attachments/Attachments';
import { CenterContainer, Container } from './CreateAndEditIPO.style';
import CreateIPOHeader from './CreateAndEditIPOHeader';
import GeneralInfo, { poTypes } from './GeneralInfo/GeneralInfo';
import Loading from '@procosys/components/Loading';
import Participants from './Participants/Participants';
import SelectScope from './SelectScope/SelectScope';
import Summary from './Summary/Summary';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useDirtyContext } from '@procosys/core/DirtyContext';
import { useInvitationForPunchOutContext } from '../../context/InvitationForPunchOutContext';
import { useParams } from 'react-router-dom';
import useRouter from '@procosys/hooks/useRouter';
import { Invitation } from '../ViewIPO/types';
import { SelectItem } from '@procosys/components/Select';
import { OrganizationMap, OrganizationsEnum } from '../utils';

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

export enum StepsEnum {
    GeneralInfo = 1,
    Scope = 2,
    Participants = 3,
    UploadAttachments = 4,
    SummaryAndCreate = 5
};

const CreateIPO = (): JSX.Element => {
    const [fromMain, setFromMain] = useState<boolean>(false);
    const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [currentStep, setCurrentStep] = useState<number>(StepsEnum.GeneralInfo);
    const [selectedCommPkgScope, setSelectedCommPkgScope] = useState<CommPkgRow[]>([]);
    const [selectedMcPkgScope, setSelectedMcPkgScope] = useState<McScope>({
        commPkgNoParent: null,
        multipleDisciplines: false,
        selected: []
    });
    const [canCreateOrUpdate, setCanCreateOrUpdate] = useState<boolean>(false);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [invitation, setInvitation] = useState<Invitation>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const params = useParams<{ ipoId: any; projectId: any; commPkgNo: any }>();

    const initialGeneralInfo = { ...emptyGeneralInfo, projectId: params.projectId };
    const [generalInfo, setGeneralInfo] = useState<GeneralInfoDetails>(initialGeneralInfo);
    const { apiClient } = useInvitationForPunchOutContext();
    const { history } = useRouter();
    const { setDirtyStateFor, unsetDirtyStateFor } = useDirtyContext();

    const initialSteps: Step[] = [
        { title: 'General info', isCompleted: false },
        { title: 'Scope', isCompleted: false },
        { title: 'Participants', isCompleted: false },
        { title: 'Upload attachments', isCompleted: (params.ipoId ? true : false) },
        { title: 'Summary & ' + (params.ipoId ? 'update' : 'create'), isCompleted: false }
    ];

    const [steps, setSteps] = useState<Step[]>(initialSteps);

    useEffect(() => {
        if (JSON.stringify(generalInfo) !== JSON.stringify(initialGeneralInfo)) {
            setDirtyStateFor(ComponentName.CreateIPO);
        } else {
            unsetDirtyStateFor(ComponentName.CreateIPO);
        }
    }, [generalInfo]);

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
                sortKey: p.sortKey ? p.sortKey : i,
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
                console.error('Upload attachment failed: ', error.message, error.data);
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

                await uploadOrRemoveAttachments(newIpoId);

                unsetDirtyStateFor(ComponentName.CreateIPO);
                setIsCreating(false);
                history.push('/' + newIpoId);
            } catch (error) {
                setIsCreating(false);
                console.error('Create IPO failed: ', error.message, error.data);
                showSnackbarNotification(error.message);
            }
        }
    };

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

                history.push('/' + params.ipoId);
            } catch (error) {
                setIsCreating(false);
                console.error('Save updated IPO failed: ', error.message, error.data);
                showSnackbarNotification(error.message);
            }
        }
        setIsSaving(false);
    };

    useEffect(() => {
        if (params.projectId && params.commPkgNo) {
            setFromMain(true);
            setGeneralInfo(gi => { return { ...gi, projectId: params.projectId }; });
        }
    }, [fromMain]);

    const goToNextStep = (): void => {
        if (currentStep > StepsEnum.Participants) {
            changeCompletedStatus(true, currentStep);
            if (currentStep == StepsEnum.UploadAttachments) {
                changeCompletedStatus(true, StepsEnum.SummaryAndCreate);
            }
        }
        setCurrentStep(currentStep => {
            if (currentStep >= StepsEnum.SummaryAndCreate) {
                return currentStep;
            }
            return currentStep + 1;
        });
    };

    const goToPreviousStep = (): void => {
        setCurrentStep(currentStep => {
            if (currentStep >= StepsEnum.Scope) {
                return currentStep - 1;
            }
            return currentStep;
        });
    };

    const goToStep = (stepNo: number): void => {
        if (steps[stepNo >= 2 ? stepNo - 2 : 0].isCompleted) {
            if (stepNo > StepsEnum.Participants) {
                changeCompletedStatus(true, stepNo);
            }
            setCurrentStep(stepNo);
        }
    };

    const changeCompletedStatus = (isValid: boolean, step: number): void => {
        setSteps(currentSteps => {
            const updatedSteps = [...currentSteps];
            updatedSteps[step - 1].isCompleted = isValid;
            return updatedSteps;
        });
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
                        discipline: ''  //TODO? 
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

                    //The information here will be updated in Participants-component after fetching the functional roles 
                    const persons: Person[] = [];
                    participant.functionalRole.persons.forEach((person) => {
                        persons.push({
                            id: person.person.id,
                            rowVersion: person.person.rowVersion,
                            azureOid: person.person.azureOid,
                            firstName: person.person.firstName,
                            lastName: person.person.lastName,
                            email: person.person.email,
                            radioOption: null
                        });
                    });

                    roleParticipant = {
                        id: participant.functionalRole.id,
                        rowVersion: participant.functionalRole.rowVersion,
                        code: participant.functionalRole.code,
                        description: 'description',
                        usePersonalEmail: false,
                        notify: false,
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
        if (params.ipoId) {
            let requestCancellor: Canceler | null = null;
            (async (): Promise<void> => {
                setIsLoading(true);
                await getInvitation((cancel: Canceler) => { requestCancellor = cancel; });
                await getAttachments((cancel: Canceler) => { requestCancellor = cancel; });
                setIsLoading(false);
            })();
            return (): void => {
                requestCancellor && requestCancellor();
            };
        }
    }, [params.ipoId]);

    useEffect(() => {
        if (generalInfo.poType && generalInfo.projectName && generalInfo.title && generalInfo.startTime && generalInfo.endTime && (generalInfo.startTime <= generalInfo.endTime)) {
            changeCompletedStatus(true, StepsEnum.GeneralInfo);
        } else {
            changeCompletedStatus(false, StepsEnum.GeneralInfo);
        }
    }, [generalInfo]);

    useEffect(() => {
        if (selectedCommPkgScope.length > 0 || selectedMcPkgScope.selected.length > 0) {
            changeCompletedStatus(true, StepsEnum.Scope);
        } else {
            changeCompletedStatus(false, StepsEnum.Scope);
        }
    }, [selectedCommPkgScope, selectedMcPkgScope]);

    useEffect(() => {
        let canBeCreatedOrSaved = true;
        steps.forEach(step => {
            if (!step.isCompleted) {
                canBeCreatedOrSaved = false;
            }
        });
        setCanCreateOrUpdate(canBeCreatedOrSaved);
    }, [steps]);

    const clearScope = (): void => {
        setSelectedMcPkgScope({
            commPkgNoParent: null,
            multipleDisciplines: false,
            selected: []
        });
        setSelectedCommPkgScope([]);
    };

    useEffect(() => {
        const incompleteParticipantRows = participants.filter(p => !p.organization || (!p.role && !p.person && !p.externalEmail));
        if (incompleteParticipantRows.length > 0) {
            changeCompletedStatus(false, StepsEnum.Participants);
        } else {
            changeCompletedStatus(true, StepsEnum.Participants);
        }
    }, [participants]);

    const removeAttachment = (index: number): void => {
        if (attachments[index].id) {
            //Attachments already uploaded will be deleted when ipo i saved
            attachments[index].toBeDeleted = true;
            setAttachments([...attachments]);
        } else {
            //Attachments not yet uploaded can be removed from the attachments array
            setAttachments(currentAttachments =>
                [...currentAttachments.slice(0, index), ...currentAttachments.slice(index + 1)]
            );
        }
    };

    const addAttachments = (files: File[]): void => {
        files.forEach((file) => {
            setAttachments(currentAttachments => currentAttachments.concat({ fileName: file.name, file: file }));
        });
    };

    if (isCreating) {
        return (
            <Container>
                <Loading title="Creating new IPO" />
            </Container>
        );
    };

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

    return (<Container>
        <CreateIPOHeader
            ipoId={params.ipoId}
            title={generalInfo.title}
            steps={steps}
            currentStep={currentStep}
            canBeCreatedOrUpdated={canCreateOrUpdate}
            createNewIpo={createNewIpo}
            saveUpdatedIpo={saveUpdatedIpo}
            next={goToNextStep}
            previous={goToPreviousStep}
            goTo={goToStep}
        />
        {currentStep == StepsEnum.GeneralInfo &&
            <GeneralInfo
                generalInfo={generalInfo}
                setGeneralInfo={setGeneralInfo}
                fromMain={fromMain}
                isEditMode={params.ipoId != null}
                clearScope={clearScope}
            />
        }
        { (currentStep == StepsEnum.Scope && generalInfo.poType != null && generalInfo.projectName != null) &&
            <SelectScope
                type={generalInfo.poType.value}
                commPkgNo={params.commPkgNo ? params.commPkgNo : null}
                selectedCommPkgScope={selectedCommPkgScope}
                setSelectedCommPkgScope={setSelectedCommPkgScope}
                selectedMcPkgScope={selectedMcPkgScope}
                setSelectedMcPkgScope={setSelectedMcPkgScope}
                projectName={generalInfo.projectName}
            />
        }
        {currentStep == StepsEnum.Participants &&
            <Participants
                participants={participants}
                setParticipants={setParticipants}
            />
        }
        {currentStep == StepsEnum.UploadAttachments &&
            <Attachments
                attachments={attachments}
                addAttachments={addAttachments}
                removeAttachment={removeAttachment}
            />
        }
        {currentStep == StepsEnum.SummaryAndCreate &&
            <Summary
                generalInfo={generalInfo}
                mcPkgScope={selectedMcPkgScope.selected}
                commPkgScope={selectedCommPkgScope}
                participants={participants}
                attachments={attachments}
            />
        }
    </Container>);
};

export default CreateIPO;
