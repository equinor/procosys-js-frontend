import { CenterContainer, Container } from './index.style';
import React, { useCallback, useEffect, useState } from 'react';
import { Tabs, Typography } from '@equinor/eds-core-react';

import Attachments from './Attachments';
import { Canceler } from 'axios';
import GeneralInfo from './GeneralInfo';
import { Invitation } from './types';
import Scope from './Scope';
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
    Planned = 1,
    Completed = 2,
    Accepted = 3
};

const ViewIPO = (): JSX.Element => {
    const params = useParams<{ipoId: any}>();
    const [currentStep, setCurrentStep] = useState<number>(StepsEnum.Planned);
    const [activeTab, setActiveTab] = useState(0);
    const { apiClient } = useInvitationForPunchOutContext();
    const [invitation, setInvitation] = useState<Invitation>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (invitation) {
            switch (invitation.status) {
                case StepsEnum[1]:
                    setCurrentStep(StepsEnum.Planned);
                    break;
                case StepsEnum[2]:
                    setCurrentStep(StepsEnum.Completed);
                    break;
                case StepsEnum[3]:
                    setCurrentStep(StepsEnum.Accepted);
                    break;
                default:
                    setCurrentStep(StepsEnum.Planned);
            }
        }
    }, [invitation]);

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
            steps={initialSteps}
            currentStep={currentStep}
            title={invitation ? `${invitation.title}` : ''}
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
                        <TabPanel>
                            <Scope mcPkgScope={invitation.mcPkgScope} commPkgScope={invitation.commPkgScope} projectName={invitation.projectName}/>
                        </TabPanel>
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
