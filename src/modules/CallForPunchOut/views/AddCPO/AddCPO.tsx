import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GeneralInfo from './GeneralInfo/GeneralInfo';
import AddCPOHeader from './AddCPOHeader';
import { ProgressBarSteps, GeneralInfoDetails } from '../../types';

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

const AddCPO = (): JSX.Element => {
    const [fromMain, setFromMain] = useState<boolean>(false);
    const [generalInfo, setGeneralInfo] = useState<GeneralInfoDetails>(emptyGeneralInfo);

    const steps: ProgressBarSteps[] = [ //TODO: will make steps correct when more components area ready
        {title: CreateStepEnum.GeneralInfo, isCompleted: true, isCurrent: false},
        {title: CreateStepEnum.Scope, isCompleted: true, isCurrent: false},
        {title: CreateStepEnum.Participants, isCompleted: false, isCurrent: true},
        {title: CreateStepEnum.UploadAttachments, isCompleted: false, isCurrent: false},
        {title: CreateStepEnum.SummaryAndCreate, isCompleted: false, isCurrent: false}
    ];

    const params = useParams<{projectId: any; commPkgId: any}>();
    
    useEffect(() => {
        if (params.projectId && params.commPkgId) {
            setFromMain(true);
            setGeneralInfo(gi => {return {...gi, projectId: params.projectId};});
        }
    }, [fromMain]);

    return (<>
        <AddCPOHeader
            steps={steps}
            canBeCreated={false}
        />
        <GeneralInfo
            generalInfo={generalInfo}
            setGeneralInfo={setGeneralInfo}
            fromMain={fromMain}
        />
    </>);
};

export default AddCPO;
