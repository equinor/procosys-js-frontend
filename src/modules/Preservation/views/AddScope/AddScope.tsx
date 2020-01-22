import React, { useState } from 'react';

import SelectTags from './SelectTags';
import SetTagProperties from './SetTagProperties/SetTagProperties';
import { Tag, TagRow } from './types';

const testData: TagRow[] = [
    { tagId: 10, tagNo: 'Tag 1', description: 'desc 1', tableData: { checked: false } },
    { tagId: 20, tagNo: 'Tag 2', description: 'desc 2', tableData: { checked: false } },
    { tagId: 30, tagNo: 'Tag 3', description: 'desc 3', tableData: { checked: false } },
    { tagId: 40, tagNo: 'Tag 4', description: 'desc 4', tableData: { checked: false } },
    { tagId: 50, tagNo: 'Tag 5', description: 'desc 5', tableData: { checked: false } },
    { tagId: 60, tagNo: 'Tag 6', description: 'desc 6', tableData: { checked: false } },
    { tagId: 70, tagNo: 'Tag 7', description: 'desc 7', tableData: { checked: false } }
];

const AddScope = (): JSX.Element => {
    const [step, setStep] = useState(1);

    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

    const [scopeTableData, setScopeTableData] = useState<TagRow[]>([]);

    const getTableData = (): TagRow[] => {
        // TODO: replace with API call to fetch data
        const tagData = testData;

        tagData.forEach((t) => {
            t.tableData.checked = false;
        });

        return tagData;
    };

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

    const searchTagsFromComponent = (tagNo: string | null): void => {
        let result: TagRow[] = [];

        if (tagNo && tagNo.length > 0) {
            // TODO: pass tagNo parameter
            result = getTableData();

            // TODO: temp filtering while testing
            result = result.filter(
                tagRow => tagRow.tagNo.toLowerCase().startsWith(tagNo.toLowerCase())
            );

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
            return <SetTagProperties previousStep={goToPreviousStep} nextStep={goToNextStep} tags={selectedTags} />;
    }

    return <h1>Unknown step</h1>;
};

export default AddScope;
