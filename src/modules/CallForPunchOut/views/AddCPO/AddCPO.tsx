import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GeneralInfo from './GeneralInfo/GeneralInfo';
import { GeneralInfoDetails, CommPkgRow } from '../../types';
import SelectScope from './SelectScope/SelectScope';

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

export enum CreateStepEnum {
    GeneralInfo = 'General info',
    Scope = 'Scope ',
    Participants = 'Participants',
    UploadAttachments = 'Upload attachments',
    SummaryAndCreate = 'Summary & create'
}

const AddCPO = (): JSX.Element => {
    const [fromMain, setFromMain] = useState<boolean>(false);
    const [generalInfo, setGeneralInfo] = useState<GeneralInfoDetails>(emptyGeneralInfo);
    const [currentStep] = useState<CreateStepEnum>(CreateStepEnum.Scope);
    const [selectedScope, setSelectedScope] = useState<CommPkgRow[]>([]);

    const params = useParams<{projectId: any; commPkgId: any}>();
    
    useEffect(() => {
        if(params.projectId && params.commPkgId) {
            setFromMain(true);
            setGeneralInfo(gi => {return {...gi, projectId: params.projectId};});
        }
    }, [fromMain]);

    return (<>
        { currentStep == CreateStepEnum.GeneralInfo &&
        <GeneralInfo
            generalInfo={generalInfo}
            setGeneralInfo={setGeneralInfo}
            fromMain={fromMain}
        /> }
        { currentStep == CreateStepEnum.Scope &&
        <SelectScope 
            //projectId={generalInfo.projectId }
            //fromMain={fromMain}
            selectedScope={selectedScope}
            setSelectedScope={setSelectedScope}
        /> }
    </>);
};

export default AddCPO;
