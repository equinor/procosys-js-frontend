import { Divider, Container, SelectedTags, LargerComponent } from './AddScope.style';
import { Journey, Requirement, RequirementType, Tag, TagRow, Discipline, Area } from './types';
import React, { useEffect, useState, useMemo } from 'react';

import { Canceler } from 'axios';
import SelectTags from './SelectTags/SelectTags';
import SetTagProperties from './SetTagProperties/SetTagProperties';
import CreateAreaTag from './CreateAreaTag/CreateAreaTag';
import Spinner from '../../../../components/Spinner';
import TagDetails from './TagDetails/TagDetails';
import { showSnackbarNotification } from './../../../../core/services/NotificationService';
import { useParams } from 'react-router-dom';
import { usePreservationContext } from '../../context/PreservationContext';
import { SelectItem } from '../../../../components/Select';

export enum AddScopeMethod {
    AddTagsManually = 'AddTagsManually',
    AddTagsAutoscope = 'AddTagsAutoscope',
    CreateAreaTag = 'CreateAreaTag',
    Unknown = 'Unknown'
}

const AddScope = (): JSX.Element => {
    const { apiClient, project } = usePreservationContext();
    const { method } = useParams();

    const addScopeMethod = useMemo((): AddScopeMethod => {
        switch (method) {
            case 'selectTagsManual':
                return (AddScopeMethod.AddTagsManually);
            case 'selectTagsAutoscope':
                return (AddScopeMethod.AddTagsAutoscope);
            case 'createAreaTag':
                return (AddScopeMethod.CreateAreaTag);
            default:
                return (AddScopeMethod.Unknown);
        }
    }, [method]);

    const [step, setStep] = useState(1);
    const [selectedTags, setSelectedTags] = useState<Tag[]>((): Tag[] => {
        if (addScopeMethod === AddScopeMethod.CreateAreaTag) {
            return [{
                tagNo: 'type-discipline-area-suffix',
                description: ''
            }];
        }
        return [];
    });
    const [scopeTableData, setScopeTableData] = useState<TagRow[]>([]);
    const [journeys, setJourneys] = useState<Journey[]>([]);
    const [requirementTypes, setRequirementTypes] = useState<RequirementType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [areaType, setAreaType] = useState<SelectItem | undefined>();
    const [areaTagDiscipline, setAreaTagDiscipline] = useState<Discipline | undefined>();
    const [areaTagArea, setAreaTagArea] = useState<Area | null>();
    const [areaTagDescription, setAreaTagDescription] = useState<string | undefined>();
    const [areaTagSuffix, setAreaTagSuffix] = useState<string | undefined>();



    const getTagsForAutoscoping = async (): Promise<void> => {
        setIsLoading(true);
        try {
            let result: TagRow[] = [];
            result = await apiClient.getTagsByTagFunctionForAddPreservationScope(project.name);

            if (result.length === 0) {
                showSnackbarNotification('No tags for autoscoping was found.', 5000);
            }
            setSelectedTags([]);
            setScopeTableData(result);
        } catch (error) {
            console.error('Search tags for autoscoping failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message, 5000);
        }
        setIsLoading(false);
    };

    /**
     * For autoscoping based on tag functions, we will fetch all relevant tags upfront.
     */
    useEffect(() => {
        if (addScopeMethod === AddScopeMethod.AddTagsAutoscope) {
            getTagsForAutoscoping();
        }
    }, [addScopeMethod]);

    /**
     * Get Journeys
     */
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

    /**
     * Get Requirement types
     */
    useEffect(() => {
        if (addScopeMethod !== AddScopeMethod.AddTagsAutoscope) {

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
        }
    }, [addScopeMethod]);

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

    const submit = async (stepId: number, requirements: Requirement[], remark?: string | null, storageArea?: string): Promise<void> => {
        try {
            const listOfTagNo = selectedTags.map(t => t.tagNo);

            switch (addScopeMethod) {
                case AddScopeMethod.AddTagsManually:
                    await apiClient.addTagsToScope(listOfTagNo, stepId, requirements, project.name, remark, storageArea);
                    break;
                case AddScopeMethod.AddTagsAutoscope:
                    await apiClient.addTagsToScopeByAutoscoping(listOfTagNo, stepId, project.name, remark, storageArea);
                    break;
                case AddScopeMethod.CreateAreaTag:
                    await apiClient.createNewAreaTagAndAddToScope(areaType && areaType.value, stepId, requirements, project.name, areaTagDiscipline && areaTagDiscipline.code, areaTagArea && areaTagArea.code, areaTagSuffix, areaTagDescription, remark, storageArea);
                    break;
            }

            showSnackbarNotification(`${listOfTagNo.length} tag(s) successfully added to scope`, 5000);
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
            const res = result.map((r): TagRow => {
                return {
                    tagNo: r.tagNo,
                    description: r.description,
                    purchaseOrderNumber: r.purchaseOrderNumber,
                    commPkgNo: r.commPkgNo,
                    mcPkgNo: r.mcPkgNo,
                    mccrResponsibleCodes: r.mccrResponsibleCodes,
                    tagFunctionCode: r.tagFunctionCode,
                    isPreserved: r.isPreserved,
                    tableData: { checked: selectedTags.findIndex(tag => tag.tagNo === r.tagNo) > -1 }
                };
            });
            setScopeTableData(res);
        } catch (error) {
            console.error('Search tags failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message, 5000);
        }
        setIsLoading(false);
    };

    const removeSelectedTag = (tagNo: string): void => {
        const selectedIndex = selectedTags.findIndex(tag => tag.tagNo === tagNo);
        const tableDataIndex = scopeTableData.findIndex(tag => tag.tagNo === tagNo);
        if (selectedIndex > -1) {
            // remove from selected tags
            setSelectedTags(() => {
                return [
                    ...selectedTags.slice(0, selectedIndex),
                    ...selectedTags.slice(selectedIndex + 1)
                ];
            });

            // remove checked state from table data (needed to reflect change when navigating to "previous" step)
            const newScopeTableData = [...scopeTableData];
            if (tableDataIndex > -1) {
                const tagToUncheck = newScopeTableData[tableDataIndex];
                if (tagToUncheck.tableData) {
                    tagToUncheck.tableData.checked = false;
                    setScopeTableData(newScopeTableData);
                }
            }

            showSnackbarNotification(`Tag ${tagNo} has been removed from selection`, 5000);
        }
    };

    switch (step) {
        case 1:
            if (addScopeMethod === AddScopeMethod.AddTagsManually) {
                return (<Container>
                    <SelectTags
                        nextStep={goToNextStep}
                        setSelectedTags={setSelectedTags}
                        searchTags={searchTags}
                        selectedTags={selectedTags}
                        scopeTableData={scopeTableData}
                        isLoading={isLoading}
                        addScopeMethod={addScopeMethod}
                        removeTag={removeSelectedTag}
                    />
                    <Divider />
                    <SelectedTags>
                        <TagDetails selectedTags={selectedTags} removeTag={removeSelectedTag} />
                    </SelectedTags>
                </Container>);
            } else if (addScopeMethod === AddScopeMethod.AddTagsAutoscope) {
                return (<Container>
                    <SelectTags
                        nextStep={goToNextStep}
                        setSelectedTags={setSelectedTags}
                        searchTags={searchTags}
                        selectedTags={selectedTags}
                        scopeTableData={scopeTableData}
                        isLoading={isLoading}
                        addScopeMethod={addScopeMethod}
                        removeTag={removeSelectedTag}
                    />
                    <Divider />
                    <SelectedTags>
                        <TagDetails selectedTags={selectedTags} removeTag={removeSelectedTag} />
                    </SelectedTags>
                </Container>);
            } else if (addScopeMethod === AddScopeMethod.CreateAreaTag) {
                return (<Container>
                    <LargerComponent>
                        <CreateAreaTag
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
                            selectedTags={selectedTags}
                        />
                    </LargerComponent>
                    <Divider />
                    <SelectedTags>
                        <TagDetails selectedTags={selectedTags} showMCPkg={false} collapsed={false} />
                    </SelectedTags>
                </Container>);
            }
            break;
        case 2:
            if (isLoading) {
                return <Spinner large />;
            }
            return (
                <Container>
                    <LargerComponent>
                        <SetTagProperties
                            journeys={journeys}
                            requirementTypes={requirementTypes}
                            previousStep={goToPreviousStep}
                            submitForm={submit}
                            addScopeMethod={addScopeMethod}
                        />
                    </LargerComponent>
                    <Divider />
                    <SelectedTags>
                        <TagDetails
                            selectedTags={selectedTags}
                            removeTag={addScopeMethod != AddScopeMethod.CreateAreaTag && removeSelectedTag || null}
                            showMCPkg={addScopeMethod != AddScopeMethod.CreateAreaTag}
                            collapsed={addScopeMethod != AddScopeMethod.CreateAreaTag} />
                    </SelectedTags>
                </Container>
            );
    }

    return <h1>Unknown step</h1>;
};

export default AddScope;
