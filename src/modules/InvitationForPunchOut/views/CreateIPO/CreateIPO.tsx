import { CommPkgRow, GeneralInfoDetails, McScope, Participant, RoleParticipant, Step } from '../../types';
import { FunctionalRoleDto, ParticipantDto, PersonDto } from '../../http/InvitationForPunchOutApiClient';
import { OrganizationMap, OrganizationsEnum } from './utils';
import React, { useEffect, useState } from 'react';
import { addHours, addMinutes } from 'date-fns';

import Attachments from './Attachments/Attachments';
import { Container } from './CreateIPO.style';
import CreateIPOHeader from './CreateIPOHeader';
import GeneralInfo from './GeneralInfo/GeneralInfo';
import Loading from '@procosys/components/Loading';
import Participants from './Participants/Participants';
import SelectScope from './SelectScope/SelectScope';
import Summary from './Summary/Summary';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useInvitationForPunchOutContext } from '../../context/InvitationForPunchOutContext';
import { useParams } from 'react-router-dom';
import useRouter from '@procosys/hooks/useRouter';

const getEndTime = (): Date => {
    const date = new Date();
    if (date.getHours() === 23) {
        const minutes = date.getMinutes();
        return addMinutes(date, 59 - minutes); // TODO: minutes - 80
    } else {
        return addHours(date, 1);
    }
};

const emptyGeneralInfo: GeneralInfoDetails = {
    projectId: null,
    projectName: null,
    poType: null,
    title: null,
    description: null,
    startTime: new Date(),
    endTime: getEndTime(),
    location: null
};

const initialParticipants: Participant[] = [
    {
        organization: { text: OrganizationMap.get(OrganizationsEnum.Contractor) as string, value: OrganizationsEnum.Contractor },
        type: 'Functional role',
        externalEmail: null,
        person: null,
        role: null
    },
    {
        organization: { text: OrganizationMap.get(OrganizationsEnum.ConstructionCompany) as string, value: OrganizationsEnum.ConstructionCompany  },
        type: 'Functional role',
        externalEmail: null,
        person: null,
        role: null
    },
    {
        organization: { text: OrganizationMap.get(OrganizationsEnum.Commissioning) as string, value: OrganizationsEnum.Commissioning },
        type: 'Functional role',
        externalEmail: null,
        person: null,
        role: null
    },
    {
        organization: { text: OrganizationMap.get(OrganizationsEnum.Operation) as string, value: OrganizationsEnum.Operation },
        type: 'Functional role',
        externalEmail: null,
        person: null,
        role: null
    },
    {
        organization: { text: OrganizationMap.get(OrganizationsEnum.TechnicalIntegrity) as string, value: OrganizationsEnum.TechnicalIntegrity },
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

const initialSteps: Step[] = [
    {title: 'General info', isCompleted: false},
    {title: 'Scope', isCompleted: false},
    {title: 'Participants', isCompleted: false},
    {title: 'Upload attachments', isCompleted: false},
    {title: 'Summary & create', isCompleted: false}
];

const CreateIPO = (): JSX.Element => {
    const [fromMain, setFromMain] = useState<boolean>(false);
    const [generalInfo, setGeneralInfo] = useState<GeneralInfoDetails>(emptyGeneralInfo);
    const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
    const [attachments, setAttachments] = useState<File[]>([]);
    const [currentStep, setCurrentStep] = useState<number>(StepsEnum.GeneralInfo);
    const [selectedCommPkgScope, setSelectedCommPkgScope] = useState<CommPkgRow[]>([]);
    const [selectedMcPkgScope, setSelectedMcPkgScope] = useState<McScope>({
        commPkgNoParent: null, 
        multipleDisciplines: false, 
        selected: []
    });
    const [steps, setSteps] = useState<Step[]>(initialSteps);
    const [canCreate, setCanCreate] = useState<boolean>(false);
    const [isCreating, setIsCreating] = useState<boolean>(false);

    const params = useParams<{projectId: any; commPkgNo: any}>();
    const { apiClient } = useInvitationForPunchOutContext();
    const { history } = useRouter();

    const getPerson = (participant: Participant): PersonDto | null => {
        if (!participant.person) {
            return null;
        }
        return {
            azureOid: participant.person.azureOid,
            firstName: participant.person.firstName,
            lastName: participant.person.lastName,
            email: participant.person.email,
            required: participant.person.radioOption == 'to'
        };
    };

    const getPersons = (role: RoleParticipant): PersonDto[] | null => {
        if(!role.persons || role.persons.length == 0) {
            return null;
        }
        return role.persons.map(p => {
            return {
                azureOid: p.azureOid,
                firstName: p.firstName,
                lastName: p.lastName,
                email: p.email,
                required: p.radioOption == 'to' || role.usePersonalEmail
            };
        });
    };

    const getFunctionalRole = (participant: Participant): FunctionalRoleDto | null => {
        if (!participant.role) {
            return null;
        }
        return {
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
                externalEmail: p.externalEmail ? { email: p.externalEmail } : null,
                person: getPerson(p),
                functionalRole: getFunctionalRole(p)
            };
        });
    };

    const uploadAllAttachments = async (ipoId: number): Promise<any> => {
        await Promise.all(attachments.map(async (attachment) => {
            try {
                await apiClient.uploadAttachment(ipoId, attachment, true);
            } catch (error) {
                console.error('Upload attachment failed: ', error.message, error.data);
                showSnackbarNotification(error.message);
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

                setIsCreating(false);
                history.push('/' + newIpoId);
            } catch (error) {
                setIsCreating(false);
                console.error('Create IPO failed: ', error.message, error.data);
                showSnackbarNotification(error.message);
            }
        }
    };

    useEffect(() => {
        if (params.projectId && params.commPkgNo) {
            setFromMain(true);
            setGeneralInfo(gi => {return {...gi, projectId: params.projectId};});
        }
    }, [fromMain]);

    const goToNextStep = (): void => {
        if(currentStep > StepsEnum.Participants) {
            changeCompletedStatus(true, currentStep);
            if(currentStep == StepsEnum.UploadAttachments) {
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
        if (steps[stepNo >= 2 ? stepNo-2 : 0].isCompleted) {
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

    useEffect(() => {
        if (generalInfo.poType && generalInfo.projectId && generalInfo.title && generalInfo.startTime && generalInfo.endTime && (generalInfo.startTime <= generalInfo.endTime)) {
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
        let canBeCreated = true;
        steps.forEach(step => {
            if(!step.isCompleted) {
                canBeCreated = false;
            }
        });
        setCanCreate(canBeCreated);
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
        setAttachments(currentAttachments =>
            [...currentAttachments.slice(0, index), ...currentAttachments.slice(index + 1)]
        );
    };

    const addAttachments = (files: File[]): void => {
        setAttachments(currentAttachments => currentAttachments.concat(files));
    };

    if (isCreating) {
        return (
            <Container>
                <Loading title="Creating new IPO" />
            </Container>
        );
    };

    return (<Container>
        <CreateIPOHeader
            steps={steps}
            currentStep={currentStep}
            canBeCreated={canCreate}
            createNewIpo={createNewIpo}
            next={goToNextStep}
            previous={goToPreviousStep}
            goTo={goToStep}
        />
        {currentStep == StepsEnum.GeneralInfo &&
            <GeneralInfo
                generalInfo={generalInfo}
                setGeneralInfo={setGeneralInfo}
                fromMain={fromMain}
                clearScope={clearScope}
            /> 
        } 
        { (currentStep == StepsEnum.Scope && generalInfo.poType != null && generalInfo.projectId != null && generalInfo.projectName != null) &&
            <SelectScope 
                type={generalInfo.poType.value}
                commPkgNo={params.commPkgNo ? params.commPkgNo : null}
                selectedCommPkgScope={selectedCommPkgScope}
                setSelectedCommPkgScope={setSelectedCommPkgScope}
                selectedMcPkgScope={selectedMcPkgScope}
                setSelectedMcPkgScope={setSelectedMcPkgScope}
                projectId={generalInfo.projectId}
                projectName={generalInfo.projectName}
            /> 
        }
        { currentStep == StepsEnum.Participants && 
            <Participants 
                participants={participants}
                setParticipants={setParticipants}
            />
        }
        { currentStep == StepsEnum.UploadAttachments && 
            <Attachments 
                attachments={attachments}
                addAttachments={addAttachments}
                removeAttachment={removeAttachment}
            />
        }
        { currentStep == StepsEnum.SummaryAndCreate && 
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
