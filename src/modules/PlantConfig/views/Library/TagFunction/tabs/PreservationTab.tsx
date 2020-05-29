import React, {useState, useEffect, useMemo} from 'react';
import {RequirementType} from './types';
import PreservationApiClient from '@procosys/modules/Preservation/http/PreservationApiClient';
import { useProcosysContext } from '@procosys/core/ProcosysContext';
import { useCurrentPlant } from '@procosys/core/PlantContext';
import { Canceler, AxiosResponse } from 'axios';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import RequirementsWidget from './RequirementsWidget';
import { hot } from 'react-hot-loader';

interface TagFunction {
    id: number;
    code: string;
    description: string;
    registerCode: string;
    isVoided: boolean;
    requirements: {
        id: number;
        requirementDefinitionId: number;
        intervalWeeks: number;
    }[];
    rowVersion: string;
}

type PreservationTabProps = {
    registerCode: string;
    tagFunctionCode: string;
}

interface RequirementFormInput {
    requirementDefinitionId: number;
    intervalWeeks: number;
}

const PreservationTab = (props: PreservationTabProps): JSX.Element => {


    const [requirementTypes, setRequirementTypes] = useState<RequirementType[]>([]);

    const [tagFunctionDetails, setTagFunctionDetails] = useState<TagFunction>();

    const {auth} = useProcosysContext();
    const {plant} = useCurrentPlant();

    const apiClient = useMemo(() => {
        const client = new PreservationApiClient(auth);
        client.setCurrentPlant(plant.id);
        return client;
    },[plant]);

    const updateTagFunctionDetails = async (requestCanceller?: (cancelCallback: Canceler) => void): Promise<void> => {
        try {
            const response = await apiClient.getTagFunction(props.tagFunctionCode, props.registerCode,requestCanceller);
            setTagFunctionDetails(response);
        } catch (error) {
            if (error && error.data) {
                const serverError = error.data as AxiosResponse;
                if (serverError.status !== 404) {
                    console.error('Failed to get tag function details: ', error.messsage, error.data);
                    showSnackbarNotification(error.message);
                }
            }
        }
    };

    const requirementsChanged = async (req: RequirementFormInput[]): Promise<void> => {
        try {
            await apiClient.updateTagFunction(props.tagFunctionCode, props.registerCode, req, tagFunctionDetails && tagFunctionDetails.rowVersion);
            updateTagFunctionDetails();
        } catch (err) {
            console.error('Error when syncing requirements', err.message, err.data);
        }
    };

    /**
     * Get all requirement types
     */
    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                const response = await apiClient.getRequirementTypes(false, (cancel: Canceler) => { requestCancellor = cancel; });
                setRequirementTypes(response.data);
            } catch (error) {
                console.error('Get Requirement Types failed: ', error.messsage, error.data);
                showSnackbarNotification(error.message);
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    /**
     * Get Tag Function details
     */
    useEffect(() => {
        let requestCancellor: Canceler | null = null;

        (async (): Promise<void> => {
            await updateTagFunctionDetails((cancel: Canceler) => { requestCancellor = cancel; });
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    const requirements = tagFunctionDetails && tagFunctionDetails.requirements || [];


    return (<div style={{margin: 8}}>
        <h1>Hello</h1>
        <RequirementsWidget requirementTypes={requirementTypes} requirements={requirements} onChange={requirementsChanged} />
    </div>);
};

export default hot(module)(PreservationTab);
