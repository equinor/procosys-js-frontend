import React, { useEffect, useState } from 'react';

import { Container } from './index.style';
import GeneralInfo from './GeneralInfo';
import Scope from './Scope';
import { Step } from '../../types';
import { Tabs } from '@equinor/eds-core-react';
import ViewIPOHeader from './ViewIPOHeader';
import { generalInfo } from '../ViewIPO/GeneralInfo/dummyData';
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

    const handleChange = (index: number): void => {
        setActiveTab(index);
    };

    return (<Container>
        <ViewIPOHeader 
            steps={steps}
            currentStep={currentStep}
            title='Test title'
        />
        <Tabs className='tabs' activeTab={activeTab} onChange={handleChange}>
            <TabList>
                <Tab>General</Tab>
                <Tab>Scope</Tab>
                <Tab>Attachments</Tab>
                <Tab>Log</Tab>
                <Tab className='emptyTab'>{''}</Tab>
            </TabList>
            <TabPanels>
                <TabPanel><GeneralInfo /></TabPanel>
                <TabPanel><Scope type={generalInfo.type} /></TabPanel>
                <TabPanel>Attachments</TabPanel>
                <TabPanel>Log</TabPanel>
            </TabPanels>
        </Tabs>
    </Container>);
};

export default ViewIPO;
