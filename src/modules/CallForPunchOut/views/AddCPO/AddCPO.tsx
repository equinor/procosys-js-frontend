import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SelectItem } from '../../../../components/Select';
import GeneralInfo from './GeneralInfo/GeneralInfo';

const AddCPO = (): JSX.Element => {
    const [poType, setPoType] = useState<SelectItem | undefined>();
    const [description, setDescription] = useState<string | null>();
    const [title, setTitle] = useState<string>();
    const [fromMain, setFromMain] = useState<boolean>(false);
    const [projectId, setProjectId] = useState<number>();
    const [location, setLocation] = useState<string | null>();
    const [startDate, setStartDate] = useState<string | null>();
    const [endDate, setEndDate] = useState<string | null>();
    const [startTime, setStartTime] = useState<string | null>();
    const [endTime, setEndTime] = useState<string | null>();

    const params = useParams<{projectId: any; commPkgId: any}>();

    
    useEffect(() => {
        if(params.projectId && params.commPkgId) {
            setFromMain(true);
        }
    });

    return (<>
        <GeneralInfo
            setPoType={setPoType}
            poType={poType}
            setDescription={setDescription}
            setTitle={setTitle}
            setProjectId={setProjectId}
            setLocation={setLocation}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setStartTime={setStartTime}
            setEndTime={setEndTime}
            description={description}
            fromMain={fromMain}
            title={title}
            projectId={projectId}
            location={location}
            startDate={startDate}
            endDate={endDate}
            startTime={startTime}
            endTime={endTime}
        />
    </>);
};

export default AddCPO;
