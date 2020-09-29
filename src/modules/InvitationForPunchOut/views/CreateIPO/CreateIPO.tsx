import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GeneralInfo from './GeneralInfo/GeneralInfo';
import Participants from './Participants/Participants';
import CreateIPOHeader from './CreateIPOHeader';
import { GeneralInfoDetails, CommPkgRow, ProgressBarSteps, McScope, Participant } from '../../types';
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
        person: null,
        role: null
    },
    {
        organization: 'Construction company',
        type: 'Functional role',
        person: null,
        role: null
    }
];

export enum CreateStepEnum {
    GeneralInfo = 'General info',
    Scope = 'Scope',
    Participants = 'Participants',
    UploadAttachments = 'Upload attachments',
    SummaryAndCreate = 'Summary & create'
};

const initialSteps: ProgressBarSteps[] = [
    {title: CreateStepEnum.GeneralInfo, isCompleted: false},
    {title: CreateStepEnum.Scope, isCompleted: false},
    {title: CreateStepEnum.Participants, isCompleted: false},
    {title: CreateStepEnum.UploadAttachments, isCompleted: false},
    {title: CreateStepEnum.SummaryAndCreate, isCompleted: false}
];

const CreateIPO = (): JSX.Element => {
    const [fromMain, setFromMain] = useState<boolean>(false);
    const [generalInfo, setGeneralInfo] = useState<GeneralInfoDetails>(emptyGeneralInfo);
    const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [selectedCommPkgScope, setSelectedCommPkgScope] = useState<CommPkgRow[]>([]);
    const [selectedMcPkgScope, setSelectedMcPkgScope] = useState<McScope>({
        commPkgNoParent: null, 
        multipleDisciplines: false, 
        selected: []
    });
    const [steps, setSteps] = useState<ProgressBarSteps[]>(initialSteps);
    const [canCreate, setCanCreate] = useState<boolean>(false);

    const params = useParams<{projectId: any; commPkgNo: any}>();
    
    useEffect(() => {
        if (params.projectId && params.commPkgNo) {
            setFromMain(true);
            setGeneralInfo(gi => {return {...gi, projectId: params.projectId};});
        }
    }, [fromMain]);

    const goToNextStep = (): void => {
        if(currentStep > 3) {
            changeCompletedStatus(true, currentStep);
            if(currentStep == 4) {
                changeCompletedStatus(true, 5);
            }
        }
        setCurrentStep(currentStep => {
            if (currentStep >= 5) {
                return currentStep;
            }
            return currentStep + 1;
        });
    };

    const goToPreviousStep = (): void => {
        setCurrentStep(currentStep => {
            if (currentStep >= 2) {
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
            changeCompletedStatus(true, 1);
        } else {
            changeCompletedStatus(false, 1);
        }
    }, [generalInfo]);

    useEffect(() => {
        if (selectedCommPkgScope.length > 0 || selectedMcPkgScope.selected.length > 0) {
            changeCompletedStatus(true, 2);
        } else {
            changeCompletedStatus(false, 2);
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
        const incompleteParticipantRows = participants.filter(p => !p.organization || (!p.role && !p.person));
        if (incompleteParticipantRows.length > 0) {
            changeCompletedStatus(false, 3);
        } else {
            changeCompletedStatus(true, 3);
        }
    }, [participants]);

    return (<Container>
        <CreateIPOHeader
            steps={steps}
            currentStep={currentStep}
            canBeCreated={canCreate}
        />
        {currentStep == 1 &&
            <GeneralInfo
                generalInfo={generalInfo}
                setGeneralInfo={setGeneralInfo}
                fromMain={fromMain}
                next={goToNextStep}
                isValid={steps[0].isCompleted}
                clearScope={clearScope}
            /> 
        } 
        { (currentStep == 2 && generalInfo.poType != null && generalInfo.projectId != null && generalInfo.projectName != null) &&
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
        { currentStep == 3 && 
            <Participants 
                next={goToNextStep}
                previous={goToPreviousStep}
                participants={participants}
                setParticipants={setParticipants}
                isValid={steps[2].isCompleted}
            />
        }
        { currentStep == 4 && 
            <Attachments 
                next={goToNextStep}
                previous={goToPreviousStep}
            />
        }
        { currentStep == 5 && 
            <Summary 
                previous={goToPreviousStep}
                generalInfo={generalInfo}
                mcPkgScope={selectedMcPkgScope.selected}
                commPkgScope={selectedCommPkgScope}
                participants={participants}
            />
        }
    </Container>);
};

export default CreateIPO;
