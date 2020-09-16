import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GeneralInfo from './GeneralInfo/GeneralInfo';
import { ProgressBarSteps, GeneralInfoDetails, Participant } from '../../types';
import Participants from './Participants/Participants';
import { SelectItem } from '@procosys/components/Select';
import CreateIPOHeader from './CreateIPOHeader';

export enum CreateStepEnum {
    GeneralInfo = 'General info',
    Scope = 'Scope ',
    Participants = 'Participants',
    UploadAttachments = 'Upload attachments',
    SummaryAndCreate = 'Summary & create'
};

const emptyGeneralInfo: GeneralInfoDetails = {
    projectId: null,
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
        person: null,
        role: null
    },
    {
        organization: 'Construction company',
        person: null,
        role: null
    }
];

const CreateIPO = (): JSX.Element => {
    const [fromMain, setFromMain] = useState<boolean>(false);
    const [generalInfo, setGeneralInfo] = useState<GeneralInfoDetails>(emptyGeneralInfo);
    const [currentStep, setCurrentStep] = useState<number>(3);
    const [participants, setParticipants] = useState<Participant[]>(initialParticipants);

    const steps: ProgressBarSteps[] = [
        {title: CreateStepEnum.GeneralInfo, isCompleted: false},
        {title: CreateStepEnum.Scope, isCompleted: false},
        {title: CreateStepEnum.Participants, isCompleted: false},
        {title: CreateStepEnum.UploadAttachments, isCompleted: false},
        {title: CreateStepEnum.SummaryAndCreate, isCompleted: false}
    ];

    const params = useParams<{projectId: any; commPkgId: any}>();
    
    useEffect(() => {
        if (params.projectId && params.commPkgId) {
            setFromMain(true);
            setGeneralInfo(gi => {return {...gi, projectId: params.projectId};});
        }
    }, [fromMain]);

    return (<>
        <CreateIPOHeader
            steps={steps}
            canBeCreated={false}
            currentStep={currentStep}
        />
        {/* <GeneralInfo
            generalInfo={generalInfo}
            setGeneralInfo={setGeneralInfo}
            fromMain={fromMain}
        /> */}
        <Participants 
            participants={participants}
            setParticipants={setParticipants}
            isValid={false}
        />
    </>);
};

export default CreateIPO;
