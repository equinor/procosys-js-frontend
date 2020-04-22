import { Divider, PropertiesContainer, SelectedTags, TagProperties } from './AddScope.style';
import { Journey, Requirement, RequirementType, Tag, TagRow, Discipline, Area } from './types';
import React, { useEffect, useState } from 'react';

import { Canceler } from 'axios';
import SelectTags from './SelectTags/SelectTags';
import SetTagProperties from './SetTagProperties/SetTagProperties';
import CreateAreaTag from './CreateAreaTag/CreateAreaTag';
import Spinner from '../../../../components/Spinner';
import TagDetails from './TagDetails/TagDetails';
import { showSnackbarNotification } from './../../../../core/services/NotificationService';
import { useHistory } from 'react-router-dom';
import { usePreservationContext } from '../../context/PreservationContext';
import { SelectItem } from '../../../../components/Select';

type AddScopeProps = {
    match: any;
};

const AddScope = (props: AddScopeProps): JSX.Element => {

    const { apiClient, project } = usePreservationContext();
    const history = useHistory();

    enum AddScopeMethod {
        AddTagsManually,
        CreateAreaTag,
        Unknown
    }

    const [step, setStep] = useState(1);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [scopeTableData, setScopeTableData] = useState<TagRow[]>([]);
    const [journeys, setJourneys] = useState<Journey[]>([]);
    const [requirementTypes, setRequirementTypes] = useState<RequirementType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [areaType, setAreaType] = useState<SelectItem | undefined>();
    const [areaTagDiscipline, setAreaTagDiscipline] = useState<Discipline | undefined>();
    const [areaTagArea, setAreaTagArea] = useState<Area | undefined>();
    const [areaTagDescription, setAreaTagDescription] = useState<string | undefined>();
    const [areaTagSuffix, setAreaTagSuffix] = useState<string | undefined>();

    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                const data = await apiClient.getJourneys((cancel: Canceler) => requestCancellor = cancel);
                setJourneys(data);
            } catch (error) {
                console.error('Get Journeys failed: ', error.messsage, error.data);
                showSnackbarNotification(error.message, 5000);
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                const response = await apiClient.getRequirementTypes(false, (cancel: Canceler) => { requestCancellor = cancel; });
                setRequirementTypes(response.data);
            } catch (error) {
                console.error('Get Requirement Types failed: ', error.messsage, error.data);
                showSnackbarNotification(error.message, 5000);
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);

    /**
     * Prevent step 2 from showing if user decides to remove all selected tags when in step 2.
     */
    useEffect(() => {
        if (selectedTags.length <= 0 && step === 2) {
            setStep(1);
        }

    }, [selectedTags]);

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

    const submitAddTagsManually = async (stepId: number, requirements: Requirement[], remark?: string, storageArea?: string): Promise<void> => {
        try {
            const listOfTagNo = selectedTags.map(t => t.tagNo);
            await apiClient.preserveTags(listOfTagNo, stepId, requirements, project.name, remark, storageArea);
            showSnackbarNotification(`${listOfTagNo.length} tags successfully added to scope`, 5000);
            history.push('/');
        } catch (error) {
            console.error('Tag preservation failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message, 5000);
        }
        return Promise.resolve();
    };

    const submitCreateAreaTag = async (stepId: number, requirements: Requirement[], remark?: string, storageArea?: string): Promise<void> => {
        try {
            const tagNo = selectedTags[0].tagNo;
            await apiClient.preserveNewAreaTag(areaType && areaType.value, stepId, requirements, project.name, areaTagDiscipline && areaTagDiscipline.code, areaTagArea && areaTagArea.code, areaTagSuffix, areaTagDescription, remark, storageArea);
            showSnackbarNotification(`The area tag ${tagNo} was successfully added to scope`, 5000);
            history.push('/');
        } catch (error) {
            console.error('Tag preservation failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message, 5000);
        }
        return Promise.resolve();
    };

    const searchTags = async (tagNo: string | null): Promise<void> => {
        setIsLoading(true);
        try {
            let result: TagRow[] = [];
            if (tagNo && tagNo.length > 0) {
                result = await apiClient.getTagsForAddPreservationScope(project.name, tagNo);

                if (result.length === 0) {
                    showSnackbarNotification(`No tag number starting with "${tagNo}" found`, 5000);
                }
            }
            setSelectedTags([]);
            setScopeTableData(result);
        } catch (error) {
            console.error('Search tags failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message, 5000);
        }
        setIsLoading(false);
    };

    const removeSelectedTag = (tagNo: string): void => {
        const selectedIndex = selectedTags.findIndex(tag => tag.tagNo === tagNo);
        const tableDataIndex = scopeTableData.findIndex(tag => tag.tagNo === tagNo);

        if (selectedIndex > -1 && tableDataIndex > -1) {
            // remove from selected tags
            setSelectedTags(() => {
                return [
                    ...selectedTags.slice(0, selectedIndex),
                    ...selectedTags.slice(selectedIndex + 1)
                ];
            });

            // remove checked state from table data (needed to reflect change when navigating to "previous" step)
            const newScopeTableData = [...scopeTableData];
            const tagToUncheck = newScopeTableData[tableDataIndex];

            if (tagToUncheck.tableData) {
                tagToUncheck.tableData.checked = false;
                setScopeTableData(newScopeTableData);
            }

            showSnackbarNotification(`Tag ${tagNo} has been removed from selection`, 5000);
        }
    };

    const getAddScopeMethod = (): AddScopeMethod => {
        switch (props.match.params.method) {
            case 'selectTags':
                return AddScopeMethod.AddTagsManually;
            case 'createAreaTag':
                return AddScopeMethod.CreateAreaTag;
            default:
                return AddScopeMethod.Unknown;
        }
    };

    const addScopeMethod = getAddScopeMethod();

    switch (step) {
        case 1:
            if (addScopeMethod === AddScopeMethod.AddTagsManually) {
                return <SelectTags
                    nextStep={goToNextStep}
                    setSelectedTags={setSelectedTags}
                    searchTags={searchTags}
                    selectedTags={selectedTags}
                    scopeTableData={scopeTableData}
                    isLoading={isLoading}
                />;
            } else if (addScopeMethod === AddScopeMethod.CreateAreaTag) {
                return <CreateAreaTag
                    nextStep={goToNextStep}
                    setSelectedTags={setSelectedTags}
                    areaType={areaType}
                    setAreaType={setAreaType}
                    discipline={areaTagDiscipline}
                    setDiscipline={setAreaTagDiscipline}
                    area={areaTagArea}
                    setArea={setAreaTagArea}
                    suffix={areaTagSuffix}
                    setSuffix={setAreaTagSuffix}
                    description={areaTagDescription}
                    setDescription={setAreaTagDescription}
                />;
            }
            break;
        case 2:
            if (isLoading) {
                return <Spinner large />;
            }
            return (
                <PropertiesContainer>
                    <TagProperties>
                        <SetTagProperties
                            journeys={journeys}
                            requirementTypes={requirementTypes}
                            previousStep={goToPreviousStep}
                            submitForm={addScopeMethod === AddScopeMethod.AddTagsManually ? submitAddTagsManually : submitCreateAreaTag}
                        />
                    </TagProperties>
                    <Divider />
                    <SelectedTags>
                        <TagDetails selectedTags={selectedTags} removeTag={removeSelectedTag} />
                    </SelectedTags>
                </PropertiesContainer>
            );
    }

    return <h1>Unknown step</h1>;
};

export default AddScope;
