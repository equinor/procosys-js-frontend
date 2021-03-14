import { Area, Discipline, Journey, PurchaseOrder, Requirement, RequirementType, Tag, TagMigrationRow, TagRow } from './types';
import { Container, Divider, LargerComponent, SelectedTags } from './AddScope.style';
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Canceler } from 'axios';
import CreateDummyTag from './CreateDummyTag/CreateDummyTag';
import { SelectItem } from '../../../../components/Select';
import SelectMigrateTags from './SelectMigrateTags/SelectMigrateTags';
import SelectTags from './SelectTags/SelectTags';
import SetTagProperties from './SetTagProperties/SetTagProperties';
import Spinner from '../../../../components/Spinner';
import TagDetails from './TagDetails/TagDetails';
import { Typography } from '@equinor/eds-core-react';
import { showSnackbarNotification } from './../../../../core/services/NotificationService';
import { usePreservationContext } from '../../context/PreservationContext';
import { useProcosysContext } from '@procosys/core/ProcosysContext';

export enum AddScopeMethod {
    AddTagsManually = 'AddTagsManually',
    AddTagsAutoscope = 'AddTagsAutoscope',
    CreateDummyTag = 'CreateDummyTag',
    DuplicateDummyTag = 'DuplicateDummyTag',
    MigrateTags = 'MigrateTags',
    Unknown = 'Unknown'
}

const AddScope = (): JSX.Element => {
    const { apiClient, project, purchaseOrderNumber } = usePreservationContext();
    const { procosysApiClient } = useProcosysContext();
    const history = useHistory();
    const { method, duplicateTagId } = useParams() as any;

    const addScopeMethod = useMemo((): AddScopeMethod => {
        switch (method) {
            case 'selectTagsManual':
                return (AddScopeMethod.AddTagsManually);
            case 'selectTagsAutoscope':
                return (AddScopeMethod.AddTagsAutoscope);
            case 'createDummyTag':
                return (AddScopeMethod.CreateDummyTag);
            case 'duplicateDummyTag':
                return (AddScopeMethod.DuplicateDummyTag);
            case 'selectMigrateTags':
                return (AddScopeMethod.MigrateTags);
            default:
                return (AddScopeMethod.Unknown);
        }
    }, [method]);

    const [step, setStep] = useState(1);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [selectedTableRows, setSelectedTableRows] = useState<Record<string, boolean>>({});
    const [scopeTableData, setScopeTableData] = useState<TagRow[]>([]);
    const [migrationTableData, setMigrationTableData] = useState<TagMigrationRow[]>([]);
    const [journeys, setJourneys] = useState<Journey[]>([]);
    const [requirementTypes, setRequirementTypes] = useState<RequirementType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [areaType, setAreaType] = useState<SelectItem | undefined>();
    const [areaTagDiscipline, setAreaTagDiscipline] = useState<Discipline | undefined>();
    const [areaTagArea, setAreaTagArea] = useState<Area | null>();
    const [pO, setPO] = useState<PurchaseOrder | null>();
    const [areaTagDescription, setAreaTagDescription] = useState<string | undefined>();
    const [areaTagSuffix, setAreaTagSuffix] = useState<string | undefined>();
    const [isSubmittingScope, setIsSubmittingScope] = useState(false);

    const filterOnPurchaseOrderNumber = (tags: any[]): any[] => {
        return tags.filter((r) => !purchaseOrderNumber || purchaseOrderNumber == r.purchaseOrderTitle);
    };

    const getTagsForAutoscoping = async (): Promise<void> => {
        setIsLoading(true);
        try {
            let result: TagRow[] = [];
            result = await apiClient.getTagsByTagFunctionForAddPreservationScope(project.name);

            const filteredTags = filterOnPurchaseOrderNumber(result);

            if (filteredTags.length === 0) {
                showSnackbarNotification('No tags for autoscoping was found.', 5000);
            }
            setSelectedTags([]);
            setScopeTableData(filteredTags);
        } catch (error) {
            console.error('Search tags for autoscoping failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
        }
        setIsLoading(false);
    };

    const getTagsForMigration = async (): Promise<void> => {
        setIsLoading(true);
        try {
            let result: TagMigrationRow[] = [];
            result = await apiClient.getTagsForMigration(project.name);

            const filteredTags = filterOnPurchaseOrderNumber(result);

            if (filteredTags.length === 0) {
                showSnackbarNotification('No tags for migration was found.', 5000);
            }
            setSelectedTags([]);
            setMigrationTableData(filteredTags);
        } catch (error) {
            console.error('Fetching tags for migration failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        (async (): Promise<void> => {
            if (addScopeMethod === AddScopeMethod.CreateDummyTag) {
                setSelectedTags([{
                    tagNo: 'type-discipline-area/PO-suffix',
                    description: ''
                }]);
            }
        })();
    }, []);

    /**
     * For autoscoping based on tag functions, we will fetch all relevant tags upfront.
     */
    useEffect(() => {
        if (addScopeMethod === AddScopeMethod.AddTagsAutoscope) {
            getTagsForAutoscoping();
        } else if (addScopeMethod === AddScopeMethod.MigrateTags) {
            getTagsForMigration();
        }
    }, [addScopeMethod]);

    /**
     * Get Journeys
     */
    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                const data = await apiClient.getJourneys(false, (cancel: Canceler) => requestCancellor = cancel);
                setJourneys(data);
            } catch (error) {
                console.error('Get journeys failed: ', error.message, error.data);
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
                    setRequirementTypes(response);
                } catch (error) {
                    console.error('Get requirement types failed: ', error.message, error.data);
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

    const submit = async (stepId?: number, requirements?: Requirement[], remark?: string | null, storageArea?: string): Promise<void> => {
        setIsSubmittingScope(true);
        try {
            const listOfTagNo = selectedTags.map(t => t.tagNo);

            if (addScopeMethod == AddScopeMethod.DuplicateDummyTag) {
                await apiClient.duplicateAreaTagAndAddToScope(Number(duplicateTagId), areaType && areaType.value, areaTagDiscipline && areaTagDiscipline.code, areaTagArea && areaTagArea.code, areaTagSuffix, areaTagDescription);
                showSnackbarNotification('Tag is successfully added to scope', 5000);
                history.push('/');
            } else {
                if (stepId && requirements) {
                    switch (addScopeMethod) {
                        case AddScopeMethod.AddTagsManually:
                            await apiClient.addTagsToScope(listOfTagNo, stepId, requirements, project.name, remark, storageArea);
                            break;
                        case AddScopeMethod.AddTagsAutoscope:
                            await apiClient.addTagsToScopeByAutoscoping(listOfTagNo, stepId, project.name, remark, storageArea);
                            break;
                        case AddScopeMethod.CreateDummyTag:
                            await apiClient.createNewAreaTagAndAddToScope(areaType && areaType.value, stepId, requirements, project.name, areaTagDiscipline && areaTagDiscipline.code, areaTagArea && areaTagArea.code, pO && pO.title, areaTagSuffix, areaTagDescription, remark, storageArea);
                            break;
                        case AddScopeMethod.MigrateTags:
                            await apiClient.migrateTagsToScope(listOfTagNo, stepId, requirements, project.name, remark, storageArea);
                            break;
                    }
                    showSnackbarNotification(`${listOfTagNo.length} tag(s) successfully added to scope`, 5000);
                    history.push('/');
                } else {
                    showSnackbarNotification('Error occured. Step or requirement is missing.', 5000);
                }
            }
        } catch (error) {
            console.error('Tag preservation failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
        }
        setIsSubmittingScope(false);
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
            const filteredTags = filterOnPurchaseOrderNumber(result).map((r): TagRow => {
                return {
                    tagNo: r.tagNo,
                    description: r.description,
                    purchaseOrderTitle: r.purchaseOrderTitle,
                    commPkgNo: r.commPkgNo,
                    mcPkgNo: r.mcPkgNo,
                    mccrResponsibleCodes: r.mccrResponsibleCodes,
                    tagFunctionCode: r.tagFunctionCode,
                    isPreserved: r.isPreserved,
                    tableData: { checked: selectedTags.findIndex(tag => tag.tagNo === r.tagNo) > -1 }
                };
            });
            setScopeTableData(filteredTags);
        } catch (error) {
            console.error('Search tags failed: ', error.message, error.data);
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

    const removeFromMigrationScope = async (): Promise<void> => {
        try {
            const tags: number[] = [];
            selectedTags.map(t => {
                if (t.tagId) {
                    tags.push(t.tagId);
                }
            });
            await procosysApiClient.markTagsAsMigrated(project.name, tags);
            setSelectedTags([]);
            getTagsForMigration();
            showSnackbarNotification('Tags are removed from migration scope.', 5000);
        } catch (error) {
            console.error('Fetching tags for migration failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
        }
    };

    const removeSelectedTagMigration = (tagNo: string): void => {
        const selectedIndex = selectedTags.findIndex(tag => tag.tagNo === tagNo);
        const tableDataIndex = migrationTableData.findIndex(tag => tag.tagNo === tagNo);
        if (selectedIndex > -1) {
            // remove from selected tags
            setSelectedTags(() => {
                return [
                    ...selectedTags.slice(0, selectedIndex),
                    ...selectedTags.slice(selectedIndex + 1)
                ];
            });

            // remove checked state from table data (needed to reflect change when navigating to "previous" step)
            const newMigrationTableData = [...migrationTableData];
            if (tableDataIndex > -1) {
                const tagToUncheck = newMigrationTableData[tableDataIndex];
                if (tagToUncheck.tableData) {
                    tagToUncheck.tableData.checked = false;
                    setMigrationTableData(newMigrationTableData);
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
                        selectedTableRows={selectedTableRows}
                        setSelectedTableRows={setSelectedTableRows}
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
                        setSelectedTableRows={setSelectedTableRows}
                        selectedTableRows={selectedTableRows}
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
            } else if (addScopeMethod === AddScopeMethod.CreateDummyTag) {
                return (<Container>
                    <LargerComponent>
                        <CreateDummyTag
                            nextStep={goToNextStep}
                            setSelectedTags={setSelectedTags}
                            areaType={areaType}
                            setAreaType={setAreaType}
                            discipline={areaTagDiscipline}
                            setDiscipline={setAreaTagDiscipline}
                            area={areaTagArea}
                            setArea={setAreaTagArea}
                            purchaseOrder={pO}
                            setPurchaseOrder={setPO}
                            suffix={areaTagSuffix}
                            setSuffix={setAreaTagSuffix}
                            description={areaTagDescription}
                            setDescription={setAreaTagDescription}
                            selectedTags={selectedTags}
                            isSubmittingScope={isSubmittingScope}
                        />
                    </LargerComponent>
                    <Divider />
                    <SelectedTags>
                        <TagDetails selectedTags={selectedTags} showMCPkg={false} collapsed={false} />
                    </SelectedTags>
                </Container>);
            } else if (addScopeMethod === AddScopeMethod.DuplicateDummyTag) {
                return (<Container>
                    <LargerComponent>
                        <CreateDummyTag
                            submit={submit}
                            setSelectedTags={setSelectedTags}
                            areaType={areaType}
                            setAreaType={setAreaType}
                            discipline={areaTagDiscipline}
                            setDiscipline={setAreaTagDiscipline}
                            area={areaTagArea}
                            setArea={setAreaTagArea}
                            purchaseOrder={pO}
                            setPurchaseOrder={setPO}
                            suffix={areaTagSuffix}
                            setSuffix={setAreaTagSuffix}
                            description={areaTagDescription}
                            setDescription={setAreaTagDescription}
                            selectedTags={selectedTags}
                            duplicateTagId={duplicateTagId}
                            isSubmittingScope={isSubmittingScope}
                        />
                    </LargerComponent>
                    <Divider />
                    <SelectedTags>
                        <TagDetails selectedTags={selectedTags} showMCPkg={false} collapsed={false} />
                    </SelectedTags>
                </Container>);
            } else if (addScopeMethod === AddScopeMethod.MigrateTags) {
                return (<Container>
                    <SelectMigrateTags
                        nextStep={goToNextStep}
                        setSelectedTableRows={setSelectedTableRows}
                        setSelectedTags={setSelectedTags}
                        searchTags={searchTags}
                        selectedTags={selectedTags}
                        migrationTableData={migrationTableData}
                        isLoading={isLoading}
                        addScopeMethod={addScopeMethod}
                        removeTag={removeSelectedTagMigration}
                        removeFromMigrationScope={removeFromMigrationScope}
                    />
                    <Divider />
                    <SelectedTags>
                        <TagDetails selectedTags={selectedTags} showMCPkg={false} removeTag={removeSelectedTagMigration} />
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
                            areaType={areaType ? areaType.value : null}
                            journeys={journeys}
                            requirementTypes={requirementTypes}
                            previousStep={goToPreviousStep}
                            submitForm={submit}
                            addScopeMethod={addScopeMethod}
                            isLoading={isSubmittingScope}
                        />
                    </LargerComponent>
                    <Divider />
                    <SelectedTags>
                        <TagDetails
                            selectedTags={selectedTags}
                            removeTag={addScopeMethod != AddScopeMethod.CreateDummyTag && removeSelectedTag || null}
                            showMCPkg={addScopeMethod != AddScopeMethod.CreateDummyTag}
                            collapsed={addScopeMethod != AddScopeMethod.CreateDummyTag} />
                    </SelectedTags>
                </Container>
            );
    }

    return <Typography variant="h1">Unknown step</Typography>;
};

export default AddScope;
