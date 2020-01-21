import { Journey, Step } from '../../http/PreservationApiClient';
import React, { useEffect, useState } from 'react';

import SelectTags from './SelectTags';
import SetTagProperties from './SetTagProperties/SetTagProperties';
import { Tag } from './types';
import { usePreservationContext } from '../../context/PreservationContext';

const AddScope = (): JSX.Element => {

    const { apiClient } = usePreservationContext();
    const [step, setStep] = useState(2);

    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
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


    switch (step) {
        case 1:
            return <SelectTags nextStep={goToNextStep} setSelectedTags={setSelectedTagsFromComponent} tags={selectedTags} />;
        case 2:
            return <SetTagProperties journeys={journeys} steps={preservationSteps} previousStep={goToPreviousStep} nextStep={goToNextStep} />;
    }

    return <h1>Unknown step</h1>;
};

export default AddScope;
