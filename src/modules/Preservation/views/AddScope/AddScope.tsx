import React, { useEffect, useState } from 'react';

import SelectTags from './SelectTags';
import SetTagProperties from './SetTagProperties/SetTagProperties';
import TagDetails from './TagDetails';
import { Journey, Step } from '../../http/PreservationApiClient';
import { usePreservationContext } from '../../context/PreservationContext';
import { Tag, TagRow } from './types';
import { showSnackbarNotification } from './../../../../core/services/NotificationService';
import { PropertiesContainer, TagProperties, SelectedTags } from './AddScope.style';

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

    const removeSelectedTag = (tagNo: string): void => {
        const selectedIndex = selectedTags.findIndex(tag => tag.tagNo === tagNo);
        const tableDataIndex = scopeTableData.findIndex(tagRow => tagRow.tagNo === tagNo);

        // remove from selected tags array
        if (selectedIndex > -1) {
            const newSelectedTags = [
                ...selectedTags.slice(0, selectedIndex),
                ...selectedTags.slice(selectedIndex + 1)
            ];

            setSelectedTags(newSelectedTags);
        }

        // remove checked state from table data
        if (tableDataIndex > -1) {
            const newScopeTableData = [...scopeTableData];
            const tagToUncheck = newScopeTableData[tableDataIndex];

            if (tagToUncheck.tableData) {
                tagToUncheck.tableData.checked = false;
                setScopeTableData(newScopeTableData);
            }
        }
    };

    // const testTags = [
    //     {
    //         tagNo: '123456789',
    //         description: 'How much wood would a woodchuck chuck if a woodchuck could chuck wood?',
    //         mcPkgNo: '1904-U006'
    //     },     
    //     {
    //         tagNo: '112-123541-01',
    //         description: 'Guybrush Threepwood',
    //         mcPkgNo: '9987-X123'
    //     }
    // ];

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
            return (
                <PropertiesContainer>
                    <TagProperties>
                        <SetTagProperties journeys={journeys} steps={preservationSteps} previousStep={goToPreviousStep} nextStep={goToNextStep} />
                    </TagProperties>
                    <SelectedTags>
                        <TagDetails selectedTags={selectedTags} removeTag={removeSelectedTag} />
                    </SelectedTags>
                </PropertiesContainer>
            );
    }

    return <h1>Unknown step</h1>;
};

export default AddScope;
