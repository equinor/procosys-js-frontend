import React, { useState } from 'react';

import SelectTags from './SelectTags';
import SetTagProperties from './SetTagProperties';
import { Tag } from './types';

const AddScope = (): JSX.Element => {
    const [step, setStep] = useState(2);

    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

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
            return <SetTagProperties previousStep={goToPreviousStep} nextStep={goToNextStep} tags={selectedTags} />;
    }

    return <h1>Unknown step</h1>;
};

export default AddScope;
