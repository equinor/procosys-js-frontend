import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GeneralInfo from './GeneralInfo/GeneralInfo';
import { GeneralInfoDetails } from '../../types';

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

    const params = useParams<{projectId: any; commPkgId: any}>();
    
    useEffect(() => {
        if(params.projectId && params.commPkgId) {
            setFromMain(true);
            setGeneralInfo(gi => {return {...gi, projectId: params.projectId};});
        }
    }, [fromMain]);

    return (<>
        <GeneralInfo
            generalInfo={generalInfo}
            setGeneralInfo={setGeneralInfo}
            fromMain={fromMain}
        />
    </>);
};

export default AddCPO;
