import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GeneralInfo from './GeneralInfo/GeneralInfo';
import Participants from './Participants/Participants';
import CreateIPOHeader from './CreateIPOHeader';
import { GeneralInfoDetails, CommPkgRow, Step, McScope, Participant } from '../../types';
import SelectScope from './SelectScope/SelectScope';
import { Container } from './CreateIPO.style';
import Attachments from './Attachments/Attachments';
import Summary from './Summary/Summary';

const emptyGeneralInfo: GeneralInfoDetails = {
    projectId: null,
    projectName: null,
    poType: null,
    title: null,
    description: null,
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
    location: null
};

const initialParticipants: Participant[] = [
    {
        organization: 'Contractor',
        type: 'Functional role',
        externalEmail: null,
        person: null,
        role: null
    },
    {
        organization: 'Construction company',
        type: 'Functional role',
        externalEmail: null,
        person: null,
        role: null
    }
];

enum StepsEnum {
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

    const params = useParams<{projectId: any; commPkgNo: any}>();
    
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

    const changeCompletedStatus = (isValid: boolean, step: number): void => {
        setSteps(currentSteps => {
            const updatedSteps = [...currentSteps];
            updatedSteps[step - 1].isCompleted = isValid;
            return updatedSteps;
        });
    };

    useEffect(() => {
        if (generalInfo.poType && generalInfo.projectId && generalInfo.title && generalInfo.startDate && generalInfo.startTime && generalInfo.endDate && generalInfo.endTime) {
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

    return (<Container>
        <CreateIPOHeader
            steps={steps}
            currentStep={currentStep}
            canBeCreated={canCreate}
        />
        {currentStep == StepsEnum.GeneralInfo &&
            <GeneralInfo
                generalInfo={generalInfo}
                setGeneralInfo={setGeneralInfo}
                fromMain={fromMain}
                next={goToNextStep}
                isValid={steps[0].isCompleted}
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
                next={goToNextStep}
                previous={goToPreviousStep}
                isValid={steps[1].isCompleted}
                projectId={generalInfo.projectId}
                projectName={generalInfo.projectName}
            /> 
        }
        { currentStep == StepsEnum.Participants && 
            <Participants 
                next={goToNextStep}
                previous={goToPreviousStep}
                participants={participants}
                setParticipants={setParticipants}
                isValid={steps[2].isCompleted}
            />
        }
        { currentStep == StepsEnum.UploadAttachments && 
            <Attachments 
                next={goToNextStep}
                previous={goToPreviousStep}
                attachments={attachments}
                setAttachments={setAttachments}
            />
        }
        { currentStep == StepsEnum.SummaryAndCreate && 
            <Summary 
                previous={goToPreviousStep}
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
