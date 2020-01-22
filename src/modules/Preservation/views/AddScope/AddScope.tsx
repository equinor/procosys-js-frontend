import React, { useEffect, useState } from 'react';

import SelectTags from './SelectTags';
import SetTagProperties from './SetTagProperties/SetTagProperties';
import { Journey, Step } from '../../http/PreservationApiClient';
import { usePreservationContext } from '../../context/PreservationContext';
import { Tag, TagRow } from './types';

const AddScope = (): JSX.Element => {

    const { apiClient } = usePreservationContext();

    const [step, setStep] = useState(1);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [scopeTableData, setScopeTableData] = useState<TagRow[]>([]);
    const [journeys, setJourneys] = useState<Journey[]>([]);
    const [preservationSteps, setPreservationSteps] = useState<Step[]>([]);

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

    const setSelectedTagsFromComponent = (tags: Tag[]): void => {
        setSelectedTags(tags);
    };

    const searchTagsFromComponent = async (tagNo: string | null): Promise<void> => {
        let result: TagRow[] = [];

        if (tagNo && tagNo.length > 0) {
            result = await apiClient.getTagsForAddPreservationScope(tagNo);

            if (result.length === 0) {
                // TODO: replace with Notification
                alert(`No tags starting with "${tagNo}" found.`);
            }
        }

        setSelectedTags([]);
        setScopeTableData(result);
    };

    switch (step) {
        case 1:
            return <SelectTags 
                nextStep={goToNextStep} 
                setSelectedTags={setSelectedTagsFromComponent} 
                searchTags={searchTagsFromComponent}
                selectedTags={selectedTags} 
                scopeTableData={scopeTableData} 
            />;
        case 2:
            return <SetTagProperties journeys={journeys} steps={preservationSteps} previousStep={goToPreviousStep} nextStep={goToNextStep} />;
    }

    return <h1>Unknown step</h1>;
};

export default AddScope;
