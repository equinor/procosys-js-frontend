import { CenterContainer, Container } from './index.style';
import React, { useCallback, useEffect, useState } from 'react';
import { Tabs, Typography } from '@equinor/eds-core-react';

import Attachments from './Attachments';
import { Canceler } from 'axios';
import GeneralInfo from './GeneralInfo';
import { InvitationResponse } from '../../http/InvitationForPunchOutApiClient';
import Spinner from '@procosys/components/Spinner';
import { Step } from '../../types';
import ViewIPOHeader from './ViewIPOHeader';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useInvitationForPunchOutContext } from '../../context/InvitationForPunchOutContext';
import { useParams } from 'react-router-dom';

const { TabList, Tab, TabPanels, TabPanel } = Tabs;

const initialSteps: Step[] = [
    {title: 'Invitation for puch out sent', isCompleted: true},
    {title: 'Punch out completed', isCompleted: false},
    {title: 'Punch out accepted by company', isCompleted: false}
];

enum StepsEnum {
    Sent = 1,
    Completed = 2,
    Accepted = 3
};


const ViewIPO = (): JSX.Element => {
    const params = useParams<{ipoId: any}>();
    const [steps, setSteps] = useState<Step[]>(initialSteps);
    const [currentStep, setCurrentStep] = useState<number>(StepsEnum.Sent);
    const [activeTab, setActiveTab] = useState(0);
    const { apiClient } = useInvitationForPunchOutContext();
    const [invitation, setInvitation] = useState<InvitationResponse>();
    const [loading, setLoading] = useState<boolean>(false);

    const getInvitation = useCallback(async (requestCanceller?: (cancelCallback: Canceler) => void): Promise<void> => {
        try {
            const response = await apiClient.getIPO(params.ipoId, requestCanceller);
            setInvitation(response);
        } catch (error) {
            console.error(error.message, error.data);
            showSnackbarNotification(error.message);
        }
    }, [params.ipoId]);

    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            setLoading(true);
            await getInvitation((cancel: Canceler) => { requestCancellor = cancel; });
            await getInvitation();
            setLoading(false);
        })();
        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    const handleChange = (index: number): void => {
        setActiveTab(index);
    };


    return (<Container>
        <ViewIPOHeader 
            steps={steps}
            currentStep={currentStep}
            title='Test title'
        />
        { loading ? (
            <CenterContainer>
                <Spinner large />
            </CenterContainer>
        ) :
            invitation ? (
                <Tabs className='tabs' activeTab={activeTab} onChange={handleChange}>
                    <TabList>
                        <Tab>General</Tab>
                        <Tab>Scope</Tab>
                        <Tab>Attachments</Tab>
                        <Tab>Log</Tab>
                        <Tab className='emptyTab'>{''}</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel><GeneralInfo invitation={invitation} /></TabPanel>
                        <TabPanel>Scope</TabPanel>
                        <TabPanel><Attachments ipoId={params.ipoId}/></TabPanel>
                        <TabPanel>Log</TabPanel>
                    </TabPanels>
                </Tabs>
            ) : (
                <Typography>No invitation found</Typography>
            )
        }
    </Container>);
};

export default ViewIPO;
