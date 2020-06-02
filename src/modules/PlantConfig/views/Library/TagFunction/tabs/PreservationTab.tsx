import React, {useState, useEffect, useMemo} from 'react';
import {RequirementType} from './types';
import PreservationApiClient from '@procosys/modules/Preservation/http/PreservationApiClient';
import { useProcosysContext } from '@procosys/core/ProcosysContext';
import { useCurrentPlant } from '@procosys/core/PlantContext';
import { Canceler, AxiosResponse } from 'axios';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import RequirementsWidget from '../../../../../Preservation/components/RequirementsSelector/RequirementsSelector';
import { Button } from '@equinor/eds-core-react';
import { hot } from 'react-hot-loader';
import { LeftSection, Container, RightSection, ActionContainer } from './PreservationTab.style';

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

    const [unsavedRequirements, setUnsavedRequirements] = useState<RequirementFormInput[]|null>(null);

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

    const submitChanges = async (): Promise<void> => {
        const changes = unsavedRequirements || [];
        try {
            await apiClient.updateTagFunction(props.tagFunctionCode, props.registerCode, changes, tagFunctionDetails && tagFunctionDetails.rowVersion);
            setUnsavedRequirements(null);
            updateTagFunctionDetails();
            showSnackbarNotification('Tag function requirements saved');

        } catch (err) {
            console.error('Error when syncing requirements', err.message, err.data);
            showSnackbarNotification('Failed to update tagfunction requirements: ' + err.message);
        }
    };

    const voidTagFunction = async (): Promise<void> => {
        if (!tagFunctionDetails) return;
        try {
            await apiClient.voidUnvoidTagFunction(tagFunctionDetails.code, tagFunctionDetails.registerCode, 'VOID', tagFunctionDetails.rowVersion);
            showSnackbarNotification('Tag function voided');
        } catch (err) {
            console.error('Error when voiding tag function', err.message, err.data);
            showSnackbarNotification('Failed to void tagfunction: ' + err.message);

        }
    };

    const unvoidTagFunction = async (): Promise<void> => {
        if (!tagFunctionDetails) return;
        try {
            await apiClient.voidUnvoidTagFunction(tagFunctionDetails.code, tagFunctionDetails.registerCode, 'UNVOID', tagFunctionDetails.rowVersion);
            showSnackbarNotification('Tag function voided');
        } catch (err) {
            console.error('Error when unvoiding tag function', err.message, err.data);
            showSnackbarNotification('Failed to void tagfunction: ' + err.message);
        }
    };

    const onRequirementsChanged = (req: RequirementFormInput[]): void => {
        setUnsavedRequirements(req);
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

    let requirements: RequirementFormInput[] = tagFunctionDetails && tagFunctionDetails.requirements || [];
    if (unsavedRequirements) {
        requirements = unsavedRequirements;
    }

    const isVoided = tagFunctionDetails && tagFunctionDetails.isVoided;
    return (<Container>
        <LeftSection>
            <RequirementsWidget requirementTypes={requirementTypes} requirements={requirements} onChange={onRequirementsChanged} />
        </LeftSection>
        <RightSection>
            <ActionContainer>
                {isVoided && (<Button variant="outlined" onClick={unvoidTagFunction}>Unvoid</Button>)}
                {!isVoided && (<Button variant="outlined" onClick={voidTagFunction}>Void</Button>)}

                <Button disabled={!unsavedRequirements} onClick={submitChanges}>Save</Button>
            </ActionContainer>
        </RightSection>
    </Container>);
};

export default hot(module)(PreservationTab);
