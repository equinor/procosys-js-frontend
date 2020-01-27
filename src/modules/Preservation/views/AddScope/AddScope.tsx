import { Journey, Step } from '../../http/PreservationApiClient';
import React, { useEffect, useState } from 'react';
import { Tag, TagRow } from './types';

import SelectTags from './SelectTags';
import SetTagProperties from './SetTagProperties/SetTagProperties';
import { showSnackbarNotification } from './../../../../core/services/NotificationService';
import { usePreservationContext } from '../../context/PreservationContext';

const AddScope = (): JSX.Element => {

    const { apiClient, project } = usePreservationContext();

    const [step, setStep] = useState(1);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [scopeTableData, setScopeTableData] = useState<TagRow[]>([]);
    const [journeys, setJourneys] = useState<Journey[]>([]);
    const [preservationSteps, setPreservationSteps] = useState<Step[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        (async (): Promise<void> => {
            const data = await apiClient.getPreservationJourneys();
            setJourneys(data);
        })();
    }, []);

    useEffect(() => {
        (async (): Promise<void> => {
            const data = await apiClient.getPreservationSteps();
            setPreservationSteps(data);
        })();
    }, []);

    const goToNextStep = (): void => {
        setStep(currentStep => {
            if (currentStep >= 2) {
                return currentStep;
            }
            return currentStep + 1;
        });
    };

    const goToPreviousStep = (): void => {
        setStep(currentStep => {
            if (currentStep >= 2) {
                return currentStep - 1;
            }
            return currentStep;
        });
    };

    const searchTags = async (tagNo: string | null): Promise<void> => {
        setIsLoading(true);
        let result: TagRow[] = [];

        if (tagNo && tagNo.length > 0) {
            result = await apiClient.getTagsForAddPreservationScope(project.name, tagNo);

            if (result.length === 0) {
                showSnackbarNotification(`No tag number starting with "${tagNo}" found`, 5000);
            }
        }

        setIsLoading(false);
        setSelectedTags([]);
        setScopeTableData(result);
    };

    switch (step) {
        case 1:
            return <SelectTags
                nextStep={goToNextStep}
                setSelectedTags={setSelectedTags}
                searchTags={searchTags}
                selectedTags={selectedTags}
                scopeTableData={scopeTableData}
                isLoading={isLoading}
            />;
        case 2:
            return <SetTagProperties journeys={journeys} steps={preservationSteps} previousStep={goToPreviousStep} nextStep={goToNextStep} />;
    }

    return <h1>Unknown step</h1>;
};

export default AddScope;
