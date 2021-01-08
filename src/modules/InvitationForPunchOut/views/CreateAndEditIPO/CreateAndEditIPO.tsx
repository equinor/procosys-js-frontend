import { Attachment, CommPkgRow, GeneralInfoDetails, McScope, Participant, RoleParticipant, Step } from '../../types';
import React, { useEffect, useState } from 'react';
import { ComponentName } from '../enums';
import Attachments from './Attachments/Attachments';
import { Container } from './CreateAndEditIPO.style';
import CreateAndEditIPOHeader from './CreateAndEditIPOHeader';
import GeneralInfo from './GeneralInfo/GeneralInfo';
import Participants from './Participants/Participants';
import SelectScope from './SelectScope/SelectScope';
import Summary from './Summary/Summary';
import { useDirtyContext } from '@procosys/core/DirtyContext';
import { useParams } from 'react-router-dom';

export enum StepsEnum {
    GeneralInfo = 1,
    Scope = 2,
    Participants = 3,
    UploadAttachments = 4,
    SummaryAndCreate = 5
};

interface CreateAndEditProps {
    saveIpo: () => void;
    generalInfo: GeneralInfoDetails;
    setGeneralInfo: React.Dispatch<React.SetStateAction<GeneralInfoDetails>>;
    selectedCommPkgScope: CommPkgRow[];
    setSelectedCommPkgScope: React.Dispatch<React.SetStateAction<CommPkgRow[]>>;
    selectedMcPkgScope: McScope;
    setSelectedMcPkgScope: React.Dispatch<React.SetStateAction<McScope>>;
    participants: Participant[];
    setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
    attachments: Attachment[];
    setAttachments: React.Dispatch<React.SetStateAction<Attachment[]>>;
    availableRoles: RoleParticipant[];
    fromMain: boolean;
};

const CreateAndEditIPO = ({
    saveIpo,
    generalInfo,
    setGeneralInfo,
    selectedCommPkgScope,
    setSelectedCommPkgScope,
    selectedMcPkgScope,
    setSelectedMcPkgScope,
    participants,
    setParticipants,
    attachments,
    setAttachments,
    availableRoles,
    fromMain
}: CreateAndEditProps): JSX.Element => {

    const [currentStep, setCurrentStep] = useState<number>(StepsEnum.GeneralInfo);
    const [canCreateOrUpdate, setCanCreateOrUpdate] = useState<boolean>(false);

    const params = useParams<{ ipoId: any; projectId: any; commPkgNo: any }>();

    const initialGeneralInfo = { ...generalInfo };
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
            setDirtyStateFor(ComponentName.CreateAndEditIPO);
        } else {
            unsetDirtyStateFor(ComponentName.CreateAndEditIPO);
        }
    }, [generalInfo]);

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

    return (<Container>
        <CreateAndEditIPOHeader
            ipoId={params.ipoId}
            title={generalInfo.title}
            steps={steps}
            currentStep={currentStep}
            canBeCreatedOrUpdated={canCreateOrUpdate}
            saveIpo={saveIpo}
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
                availableRoles={availableRoles ? availableRoles : []}
            />
        }
        {currentStep == StepsEnum.UploadAttachments &&
            <Attachments
                attachments={attachments}
                setAttachments={setAttachments}
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

export default CreateAndEditIPO;
