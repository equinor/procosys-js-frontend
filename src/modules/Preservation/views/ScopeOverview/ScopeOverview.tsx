import {
    ActionsContainer,
    Container,
    ContentContainer,
    DropdownItem,
    FilterContainer,
    Header,
    HeaderContainer,
    IconBar,
    LeftPartOfHeader,
    OldPreservationLink,
    StyledButton,
    TooltipText,
} from './ScopeOverview.style';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    PreservedTag,
    PreservedTags,
    SavedTagListFilter,
    TagListFilter,
} from './types';
import React, { useEffect, useRef, useState } from 'react';

import { Button } from '@equinor/eds-core-react';
import { Canceler } from '@procosys/http/HttpClient';
import CompleteDialog from './Dialogs/CompleteDialog';
import Dropdown from '../../../../components/Dropdown';
import EdsIcon from '../../../../components/EdsIcon';
import Flyout from './../../../../components/Flyout';
import OptionsDropdown from '../../../../components/OptionsDropdown';
import PreservedDialog from './Dialogs/PreservedDialog';
import { ProjectDetails } from '../../types';
import Qs from 'qs';
import RemoveDialog from './Dialogs/RemoveDialog';
import RescheduleDialog from './Dialogs/RescheduleDialog';
import ScopeFilter from './ScopeFilter/ScopeFilter';
import Spinner from '@procosys/components/Spinner';
import StartPreservationDialog from './Dialogs/StartPreservationDialog';
import TagFlyout from './TagFlyout/TagFlyout';
import TransferDialog from './Dialogs/TransferDialog';
import { Typography } from '@equinor/eds-core-react';
import VoidDialog from './Dialogs/VoidDialog';
import { showModalDialog } from '../../../../core/services/ModalDialogService';
import { showSnackbarNotification } from '../../../../core/services/NotificationService';
import { tokens } from '@equinor/eds-tokens';
import { useAnalytics } from '@procosys/core/services/Analytics/AnalyticsContext';
import { useCurrentPlant } from '@procosys/core/PlantContext';
import { usePreservationContext } from '../../context/PreservationContext';
import ScopeOverviewTable from './ScopeOverviewTable';
import UndoStartPreservationDialog from './Dialogs/UndoStartPreservationDialog';
import UpdateRequirementsDialog from './Dialogs/UpdateRequirementsDialog';
import UpdateJourneyDialog from './Dialogs/UpdateJourneyDialog';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import { Tooltip } from '@equinor/eds-core-react';
import { updateSavedTagListFilters } from './apiCalls';
import { showInServiceDialog } from './dialogsAndModals';
import {
    getCachedFilter,
    setCachedFilter,
    deleteCachedFilter,
} from './preservationHelpers';
import { MemoryRouter as Router } from 'react-router-dom';

const emptyTagListFilter: TagListFilter = {
    tagNoStartsWith: null,
    commPkgNoStartsWith: null,
    mcPkgNoStartsWith: null,
    purchaseOrderNoStartsWith: null,
    callOffStartsWith: null,
    storageAreaStartsWith: null,
    preservationStatus: [],
    actionStatus: [],
    voidedFilter: null,
    journeyIds: [],
    modeIds: [],
    dueFilters: [],
    requirementTypeIds: [],
    tagFunctionCodes: [],
    disciplineCodes: [],
    responsibleIds: [],
    areaCodes: [],
};
interface SupportedQueryStringFilters {
    [index: string]: string | null;
    pono: string | null;
    calloff: string | null;
}

export const backToListButton = 'Back to list';

const ScopeOverview: React.FC = (): JSX.Element => {
    const {
        project,
        availableProjects,
        setCurrentProject,
        apiClient,
        purchaseOrderNumber: purchaseOrderNumber,
        setCurrentPurchaseOrderNumber: setCurrentPurchaseOrderNumber,
    } = usePreservationContext();

    const [selectedTags, setSelectedTags] = useState<PreservedTag[]>([]);
    const [displayFlyout, setDisplayFlyout] = useState<boolean>(false);
    const [displayFilter, setDisplayFilter] = useState<boolean>(false);
    const [flyoutTagId, setFlyoutTagId] = useState<number>(0);
    const [scopeIsDirty, setScopeIsDirty] = useState<boolean>(false);
    const [pageSize, setPageSize] = useState<number>(50);
    const [pageIndex, setPageIndex] = useState<number>(0);
    const [tagListFilter, setTagListFilter] = useState<TagListFilter>({
        ...emptyTagListFilter,
    });

    const [numberOfTags, setNumberOfTags] = useState<number>();
    const [voidedTagsSelected, setVoidedTagsSelected] = useState<boolean>();
    const [unvoidedTagsSelected, setUnvoidedTagsSelected] = useState<boolean>();
    const [completableTagsSelected, setCompletableTagsSelected] =
        useState<boolean>();
    const [preservableTagsSelected, setPreservableTagsSelected] =
        useState<boolean>();
    const [startableTagsSelected, setStartableTagsSelected] =
        useState<boolean>();
    const [inServiceTagsSelected, setInServiceTagsSelected] =
        useState<boolean>();
    const [transferableTagsSelected, setTransferableTagsSelected] =
        useState<boolean>();
    const [duplicatableTagSelected, setDuplicatableTagSelected] =
        useState<boolean>();
    const [unStartableTagsSelected, setUnstartableTagsSelected] =
        useState<boolean>();
    const [editableTagSelected, setEditableTagSelected] = useState<boolean>();
    const [selectedTagId, setSelectedTagId] = useState<number>();
    const [resetTablePaging, setResetTablePaging] = useState<boolean>(false);
    const [filterForProjects, setFilterForProjects] = useState<string>('');
    const [filteredProjects, setFilteredProjects] =
        useState<ProjectDetails[]>(availableProjects);
    const [orderDirection, setOrderDirection] = useState<string | null>(null);
    const [orderByField, setOrderByField] = useState<string | null>(null);
    const [selectedSavedFilterTitle, setSelectedSavedFilterTitle] = useState<
        string | null
    >(null);
    const [savedTagListFilters, setSavedTagListFilters] = useState<
        SavedTagListFilter[] | null
    >(null);
    const [triggerFilterValuesRefresh, setTriggerFilterValuesRefresh] =
        useState<number>(0); //increment to trigger filter values to update
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showTagRescheduleDialog, setShowTagRescheduleDialog] =
        useState<boolean>(false);
    const [showActions, setShowActions] = useState<boolean>(false);
    const [showEditTagJourneyDialog, setShowEditTagJourneyDialog] =
        useState<boolean>(false);
    const [showEditRequirementsDialog, setShowEditRequirementsDialog] =
        useState<boolean>(false);

    const navigate = useNavigate();
    const location = useLocation();
    const analytics = useAnalytics();
    const { plant, permissions } = useCurrentPlant();

    const numberOfFilters: number = Object.values(tagListFilter).filter(
        (v) => v && JSON.stringify(v) != '[]'
    ).length;

    const refreshScopeListCallback =
        useRef<(maxHeight: number, refreshOnResize?: boolean) => void>();
    const isFirstRender = useRef<boolean>(true);

    const moduleHeaderContainerRef = useRef<HTMLDivElement>(null);
    const [moduleHeaderHeight, setModuleHeaderHeight] = useState<number>(250);

    const moduleContainerRef = useRef<HTMLDivElement>(null);
    const [moduleAreaHeight, setModuleAreaHeight] = useState<number>(700);

    const [transferableTags, setTransferableTags] = useState<PreservedTag[]>(
        []
    );
    const [nonTransferableTags, setNonTransferableTags] = useState<
        PreservedTag[]
    >([]);

    useEffect((): void => {
        if (project && project.id != -1) {
            updateSavedTagListFilters({
                setIsLoading,
                setSavedTagListFilters,
                project,
                apiClient,
                showSnackbarNotification,
            });
        }
    }, [project]);

    useEffect((): void => {
        if (project && project.id === -1) return;

        const previousFilter = getCachedFilter(project.id);
        if (previousFilter) {
            setTagListFilter({
                ...previousFilter,
            });
        } else if (savedTagListFilters) {
            const defaultFilter = getDefaultFilter();
            if (defaultFilter) {
                setTagListFilter({
                    ...defaultFilter,
                });
            } else {
                refreshScopeList();
            }
        }
    }, [savedTagListFilters, project]);

    const getDefaultFilter = (): TagListFilter | null => {
        if (savedTagListFilters) {
            const defaultFilter = savedTagListFilters.find(
                (filter) => filter.defaultFilter
            );
            if (defaultFilter) {
                try {
                    return JSON.parse(defaultFilter.criteria);
                } catch (error) {
                    console.error('Failed to parse default filter');
                    analytics.trackException(error);
                }
            }
        }
        return null;
    };

    const updateModuleAreaHeightReference = (): void => {
        if (!moduleContainerRef.current) return;
        setModuleAreaHeight(moduleContainerRef.current.clientHeight);
    };

    /** Update module area height on module resize */
    useEffect(() => {
        updateModuleAreaHeightReference();
    }, [moduleContainerRef, displayFilter]);

    useEffect(() => {
        window.addEventListener('resize', updateModuleAreaHeightReference);

        return (): void => {
            window.removeEventListener(
                'resize',
                updateModuleAreaHeightReference
            );
        };
    }, []);

    const updateModuleHeaderHeightReference = (): void => {
        if (!moduleHeaderContainerRef.current) return;
        setModuleHeaderHeight(moduleHeaderContainerRef.current.clientHeight);
    };

    /** Update module header height on module header resize */
    useEffect(() => {
        updateModuleHeaderHeightReference();
    }, [moduleHeaderContainerRef, displayFilter, showActions]);

    useEffect(() => {
        window.addEventListener('resize', updateModuleHeaderHeightReference);

        return (): void => {
            window.removeEventListener(
                'resize',
                updateModuleHeaderHeightReference
            );
        };
    }, []);

    const refreshScopeList = (refreshOnResize?: boolean): void => {
        refreshScopeListCallback.current &&
            refreshScopeListCallback.current(
                moduleAreaHeight - moduleHeaderHeight - 115,
                refreshOnResize
            );
    };

    useEffect(() => {
        // filter project dropdown
        if (filterForProjects.length <= 0) {
            setFilteredProjects(availableProjects);
            return;
        }

        setFilteredProjects(
            availableProjects.filter((p: ProjectDetails) => {
                return (
                    p.name
                        .toLowerCase()
                        .indexOf(filterForProjects.toLowerCase()) > -1 ||
                    p.description
                        .toLowerCase()
                        .indexOf(filterForProjects.toLowerCase()) > -1
                );
            })
        );
    }, [filterForProjects]);

    useEffect(() => {
        if (isFirstRender.current) {
            // skip refreshing scope list on first render, when default/empty filters are set
            return;
        }
        setCachedFilter(project.id, tagListFilter);

        setResetTablePaging(true);
        refreshScopeList();
    }, [tagListFilter]);

    useEffect(() => {
        setInServiceTagsSelected(
            selectedTags.find((t) => t.readyToBeSetInService) ? true : false
        );
        setVoidedTagsSelected(
            selectedTags.find((t) => t.isVoided) ? true : false
        );
        setUnvoidedTagsSelected(
            selectedTags.find((t) => !t.isVoided) ? true : false
        );
        setCompletableTagsSelected(
            selectedTags.find((t) => t.readyToBeCompleted && !t.isVoided)
                ? true
                : false
        );
        setPreservableTagsSelected(
            selectedTags.find((t) => t.readyToBePreserved && !t.isVoided)
                ? true
                : false
        );
        setStartableTagsSelected(
            selectedTags.find((t) => t.readyToBeStarted && !t.isVoided)
                ? true
                : false
        );
        setTransferableTagsSelected(
            selectedTags.find((t) => t.readyToBeTransferred && !t.isVoided)
                ? true
                : false
        );
        setDuplicatableTagSelected(
            selectedTags.length == 1 && selectedTags[0].readyToBeDuplicated
                ? true
                : false
        );
        setUnstartableTagsSelected(
            selectedTags.find((t) => t.readyToUndoStarted && !t.isVoided)
                ? true
                : false
        );
        setEditableTagSelected(
            selectedTags.find((t) => t.readyToBeEdited && !t.isVoided)
                ? true
                : false
        );

        if (selectedTags.length == 1) {
            setSelectedTagId(selectedTags[0].id);
        } else {
            setSelectedTagId(-1);
        }
    }, [selectedTags]);

    const setRefreshScopeListCallback = (
        callback: (maxHeight: number, refreshOnResize?: boolean) => void
    ): void => {
        refreshScopeListCallback.current = callback;
    };

    const cancelerRef = useRef<Canceler | null>();

    const getTags = async (
        page: number,
        pageSize: number,
        orderBy: string | null,
        orderDirection: string | null
    ): Promise<PreservedTags | undefined> => {
        if (savedTagListFilters) {
            //to avoid getting tags before we have set previous-/default filter
            try {
                cancelerRef.current && cancelerRef.current();
                return await apiClient
                    .getPreservedTags(
                        project.name,
                        page,
                        pageSize,
                        orderBy,
                        orderDirection,
                        tagListFilter,
                        (c) => {
                            cancelerRef.current = c;
                        }
                    )
                    .then((response) => {
                        setPageIndex(0);
                        setNumberOfTags(response.maxAvailable);
                        return response;
                    });
            } catch (error) {
                console.error('Get tags failed: ', error.message, error.data);
                if (!error.isCancel) {
                    showSnackbarNotification(error.message);
                }
            }
        }
        return undefined;
    };

    const exportTagsToExcel = async (withHistory: boolean): Promise<void> => {
        try {
            showSnackbarNotification('Exporting filtered tags to Excel...');
            await apiClient
                .exportTagsWithHistoryToExcel(
                    project.name,
                    orderByField,
                    orderDirection,
                    tagListFilter,
                    withHistory
                )
                .then((response) => {
                    const outputFilename = `Preservation tags-${project.name}.xlsx`;
                    const tempUrl = window.URL.createObjectURL(
                        new Blob([response])
                    );
                    const tempLink = document.createElement('a');
                    tempLink.style.display = 'none';
                    tempLink.href = tempUrl;
                    tempLink.setAttribute('download', outputFilename);
                    document.body.appendChild(tempLink);
                    tempLink.click();
                    tempLink.remove();
                });
            showSnackbarNotification('Filtered tags are exported to Excel');
        } catch (error) {
            console.error(
                'Export tags to excel failed: ',
                error.message,
                error.data
            );
            if (!error.isCancel) {
                showSnackbarNotification(error.message);
            }
        }
    };

    const changeProject = (event: React.MouseEvent, index: number): void => {
        event.preventDefault();

        setCurrentProject(filteredProjects[index].id);
        setResetTablePaging(true);
        deleteCachedFilter(project.id);

        if (numberOfFilters > 0) {
            // Reset filters on project change:
            // When the filter is hidden, we reset the selected filters here, which further triggers a refresh of the scope list.
            // When the filter is displayed, the filter reset and scope list refresh is handled by the filter component.

            if (!displayFilter) {
                setTagListFilter({ ...emptyTagListFilter });
            }
        } else {
            // No filters, regular scope list refresh.
            refreshScopeList();
        }
    };

    const refreshFilterValues = (): void => {
        setTriggerFilterValuesRefresh(triggerFilterValuesRefresh + 1);
    };

    const setInService = async (tags: PreservedTag[]): Promise<void> => {
        try {
            await apiClient.setInService(
                tags.map((t) => ({
                    id: t.id,
                    rowVersion: t.rowVersion,
                }))
            );
            refreshScopeList();
            refreshFilterValues();
            showSnackbarNotification(
                `${tags.length} tag(s) have been successfully set in service.`
            );
        } catch (error) {
            console.error('Transfer failed: ', error.message, error.data);
            showSnackbarNotification(error.message);
        }
        return Promise.resolve();
    };

    const transfer = async (tagsToTransfer: PreservedTag[]): Promise<void> => {
        try {
            await apiClient.transfer(
                tagsToTransfer.map((t) => ({
                    id: t.id,
                    rowVersion: t.rowVersion,
                }))
            );
            refreshScopeList();
            refreshFilterValues();
            showSnackbarNotification(
                `${tagsToTransfer.length} tag(s) have been successfully transferred.`
            );
        } catch (error) {
            console.error('Transfer failed: ', error.message, error.data);
            showSnackbarNotification(error.message);
        }
        return Promise.resolve();
    };

    const transferDialog = (): void => {
        const newTransferableTags: PreservedTag[] = [];
        const newNonTransferableTags: PreservedTag[] = [];

        selectedTags.forEach((tag) => {
            const newTag = { ...tag };
            if (tag.readyToBeTransferred && !tag.isVoided) {
                newTransferableTags.push(newTag);
            } else {
                newNonTransferableTags.push(newTag);
            }
        });

        const transferButton =
            newTransferableTags.length > 0 ? 'Transfer' : null;

        setTransferableTags(newTransferableTags);

        showModalDialog(
            'Transferring',
            <Router>
                <TransferDialog
                    transferableTags={newTransferableTags}
                    nonTransferableTags={newNonTransferableTags}
                />
            </Router>,
            '80vw',
            backToListButton,
            null,
            transferButton,
            newTransferableTags.length > 0
                ? () => transfer(newTransferableTags)
                : null
        );
    };

    let startableTags: PreservedTag[];
    let nonStartableTags: PreservedTag[];

    const startPreservation = async (): Promise<void> => {
        try {
            await apiClient.startPreservation(startableTags.map((t) => t.id));
            refreshScopeList();
            refreshFilterValues();
            showSnackbarNotification(
                "Status was set to 'Active' for selected tag(s)."
            );
        } catch (error) {
            console.error(
                'Start preservation failed: ',
                error.message,
                error.data
            );
            showSnackbarNotification(error.message);
        }
        return Promise.resolve();
    };

    const startPreservationDialog = (): void => {
        startableTags = [];
        nonStartableTags = [];
        selectedTags.map((tag) => {
            const newTag: PreservedTag = { ...tag };
            if (tag.readyToBeStarted && !tag.isVoided) {
                startableTags.push(newTag);
            } else {
                nonStartableTags.push(newTag);
            }
        });

        const startButton =
            startableTags.length > 0 ? 'Start preservation' : null;
        const startFunc = startableTags.length > 0 ? startPreservation : null;

        showModalDialog(
            'Start preservation',
            <Router>
                <StartPreservationDialog
                    startableTags={startableTags}
                    nonStartableTags={nonStartableTags}
                />
            </Router>,
            '80vw',
            backToListButton,
            null,
            startButton,
            startFunc
        );
    };

    let preservableTags: PreservedTag[];
    let nonPreservableTags: PreservedTag[];

    const preservedThisWeek = async (): Promise<void> => {
        try {
            await apiClient.preserve(preservableTags.map((t) => t.id));
            refreshScopeList();
            showSnackbarNotification(
                'Selected tag(s) have been preserved for this week.'
            );
        } catch (error) {
            console.error('Preserve failed: ', error.message, error.data);
            showSnackbarNotification(error.message);
        }
        return Promise.resolve();
    };

    const preservedDialog = (): void => {
        preservableTags = [];
        nonPreservableTags = [];

        selectedTags.map((tag) => {
            const newTag: PreservedTag = { ...tag };
            if (tag.readyToBePreserved) {
                preservableTags.push(newTag);
            } else {
                nonPreservableTags.push(newTag);
            }
        });

        const preservedButton =
            preservableTags.length > 0 ? 'Preserved this week' : null;
        const preservedFunc =
            preservableTags.length > 0 ? preservedThisWeek : null;

        showModalDialog(
            'Preserved this week',
            <Router>
                <PreservedDialog
                    preservableTags={preservableTags}
                    nonPreservableTags={nonPreservableTags}
                />
            </Router>,
            '80vw',
            backToListButton,
            null,
            preservedButton,
            preservedFunc
        );
    };

    let completableTags: PreservedTag[] = [];
    let nonCompletableTags: PreservedTag[] = [];

    const complete = async (): Promise<void> => {
        try {
            const tags = selectedTags.filter((tag) => tag.readyToBeCompleted);
            await apiClient.complete(
                tags.map((t) => ({
                    id: t.id,
                    rowVersion: t.rowVersion,
                }))
            );
            refreshScopeList();
            refreshFilterValues();
            showSnackbarNotification('Selected tag(s) have been completed.');
        } catch (error) {
            console.error('Complete failed: ', error.message, error.data);
            showSnackbarNotification(error.message);
        }
        return Promise.resolve();
    };

    const showCompleteDialog = (): void => {
        completableTags = [];
        nonCompletableTags = [];

        selectedTags.map((tag) => {
            const newTag: PreservedTag = { ...tag };
            if (tag.readyToBeCompleted && !tag.isVoided) {
                completableTags.push(newTag);
            } else {
                nonCompletableTags.push(newTag);
            }
        });
        const completeButton = completableTags.length > 0 ? 'Complete' : null;
        const completeFunc = completableTags.length > 0 ? complete : null;

        showModalDialog(
            'Complete preservation',
            <Router>
                <CompleteDialog
                    completableTags={completableTags}
                    nonCompletableTags={nonCompletableTags}
                />
            </Router>,
            '80vw',
            backToListButton,
            null,
            completeButton,
            completeFunc
        );
    };

    const remove = async (removableTags: PreservedTag[]): Promise<void> => {
        try {
            await apiClient.remove(
                removableTags.map((t) => ({
                    id: t.id,
                    rowVersion: t.rowVersion,
                }))
            );
            refreshScopeList();
            refreshFilterValues();
            showSnackbarNotification('Selected tag(s) have been removed.');
        } catch (error) {
            console.error('Remove failed: ', error.message, error.data);
            showSnackbarNotification(error.message);
        }
    };

    const showRemoveDialog = (): void => {
        const removableTags: PreservedTag[] = [];
        const nonRemovableTags: PreservedTag[] = [];

        selectedTags.map((tag) => {
            const newTag: PreservedTag = { ...tag };
            if (tag.isVoided && !tag.isInUse) {
                removableTags.push(newTag);
            } else {
                nonRemovableTags.push(newTag);
            }
        });
        const removeButton = removableTags.length > 0 ? 'Remove' : null;
        const removeFunc =
            removableTags.length > 0
                ? (): Promise<void> => remove(removableTags)
                : null;

        showModalDialog(
            'Complete preservation',
            <Router>
                <RemoveDialog
                    removableTags={removableTags}
                    nonRemovableTags={nonRemovableTags}
                />
            </Router>,
            '80vw',
            backToListButton,
            null,
            removeButton,
            removeFunc
        );
    };

    let voidableTags: PreservedTag[] = [];
    let unvoidableTags: PreservedTag[] = [];

    const voidTags = async (): Promise<void> => {
        try {
            for (const tag of voidableTags) {
                await apiClient.voidTag(tag.id, tag.rowVersion);
            }
            refreshScopeList();
            showSnackbarNotification('Selected tag(s) have been voided.');
        } catch (error) {
            console.error('Voiding failed: ', error.message, error.data);
            showSnackbarNotification(error.message);
        }
        return Promise.resolve();
    };

    const unVoidTags = async (): Promise<void> => {
        try {
            for (const tag of unvoidableTags) {
                await apiClient.unvoidTag(tag.id, tag.rowVersion);
            }
            refreshScopeList();
            showSnackbarNotification('Selected tag(s) have been unvoided.');
        } catch (error) {
            console.error('Unvoid failed: ', error.message, error.data);
            showSnackbarNotification(error.message);
        }
        return Promise.resolve();
    };

    const showVoidDialog = (voiding: boolean): void => {
        voidableTags = [];
        unvoidableTags = [];
        // selectedTags.map((tag) => {
        //     const newTag: PreservedTag = { ...tag };
        //     if (!tag.isVoided && voiding) {
        //         voidableTags.push(newTag);
        //     } else if (tag.isVoided && !voiding) {
        //         unvoidableTags.push(newTag);
        //     }
        // });
        // const voidButton = voidableTags.length > 0 ? 'Void' : 'Unvoid';
        // const voidFunc = voidableTags.length > 0 ? voidTags : unVoidTags;
        // const voidTitle = voidableTags.length > 0 ? 'Voiding following tags' : 'Unvoiding following tags';
        selectedTags.map((tag) => {
            const newTag: PreservedTag = { ...tag };
            if (!tag.isVoided) {
                voidableTags.push(newTag);
            } else {
                unvoidableTags.push(newTag);
            }
        });
        const voidButton = voiding ? 'Void' : 'Unvoid';
        const voidFunc = voiding ? voidTags : unVoidTags;
        const voidTitle = voiding
            ? 'Voiding following tags'
            : 'Unvoiding following tags';

        showModalDialog(
            voidTitle,
            <Router>
                <VoidDialog
                    voidableTags={voidableTags}
                    unvoidableTags={unvoidableTags}
                    voiding={voiding}
                />
            </Router>,
            '80vw',
            backToListButton,
            null,
            voidButton,
            voidFunc
        );
    };

    let unstartableTags: PreservedTag[];
    let nonUnstartableTags: PreservedTag[];

    const unStartPreservation = async (): Promise<void> => {
        try {
            await apiClient.undoStartPreservation(unstartableTags);
            refreshScopeList();
            refreshFilterValues();
            showSnackbarNotification(
                "Status was set to 'Not started' for selected tag(s)."
            );
        } catch (error) {
            console.error(
                'Undo start preservation failed: ',
                error.message,
                error.data
            );
            showSnackbarNotification(error.message);
        }
        return Promise.resolve();
    };

    const undoStartPreservationDialog = (): void => {
        unstartableTags = [];
        nonUnstartableTags = [];
        selectedTags.map((tag) => {
            const newTag: PreservedTag = { ...tag };
            if (tag.readyToUndoStarted && !tag.isVoided) {
                unstartableTags.push(newTag);
            } else {
                nonUnstartableTags.push(newTag);
            }
        });

        const undoStartButton =
            unstartableTags.length > 0 ? 'Undo "start preservation"' : null;
        const undoStartFunc =
            unstartableTags.length > 0 ? unStartPreservation : null;

        showModalDialog(
            'Undo "start preservation"',
            <Router>
                <UndoStartPreservationDialog
                    unstartableTags={unstartableTags}
                    nonUnstartableTags={nonUnstartableTags}
                />
            </Router>,
            '80vw',
            backToListButton,
            null,
            undoStartButton,
            undoStartFunc
        );
    };

    const openFlyout = (tag: PreservedTag): void => {
        setFlyoutTagId(tag.id);
        setDisplayFlyout(true);
    };

    const closeFlyout = (): void => {
        setDisplayFlyout(false);

        // refresh scope list when flyout has updated a tag
        if (scopeIsDirty) {
            refreshScopeList();
            setScopeIsDirty(false);
        }
    };

    const toggleFilter = (): void => {
        setDisplayFilter(!displayFilter);
    };

    /** Handle url on the format ...?project=<projectid>&pono=<purchase order no>&calloff=<call off no>*/
    useEffect((): void => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
        }

        if (location.search === '') {
            // querystring is empty
            return;
        }

        // parse querystring
        const qsParameters = Qs.parse(location.search, {
            ignoreQueryPrefix: true,
        });

        // get "project" from querystring (mandatory in order to use other filters)
        const projectName = qsParameters['project'] as string;

        if (projectName && projectName !== '') {
            const project = filteredProjects.find(
                (p) => p.name === projectName
            );

            if (project) {
                // set as current project
                setCurrentProject(project.id);

                // get and apply supported tag filters
                let filtersUsed = 0;
                const supportedFilters: SupportedQueryStringFilters = {
                    pono: null,
                    calloff: null,
                };

                for (const f in supportedFilters) {
                    const qsParam = qsParameters[f];

                    if (qsParam) {
                        supportedFilters[f] = qsParam as string;
                        filtersUsed++;
                    }
                }

                if (filtersUsed > 0) {
                    const tagFilter = { ...emptyTagListFilter };
                    tagFilter.purchaseOrderNoStartsWith = supportedFilters.pono;
                    tagFilter.callOffStartsWith = supportedFilters.calloff;

                    //Set supplier modus if POno is set
                    if (supportedFilters.pono) {
                        let pono = supportedFilters.pono;
                        if (supportedFilters.calloff) {
                            pono = pono.concat(`/${supportedFilters.calloff}`);
                        }
                        setCurrentPurchaseOrderNumber(pono);
                    }

                    setTagListFilter(tagFilter);
                    toggleFilter();
                }
            } else {
                showSnackbarNotification(
                    `The requested project ${projectName} is not available`
                );
            }
        }
    }, [location]);

    const navigateToOldPreservation = (): void => {
        analytics.trackUserAction('Btn_SwitchToOldPreservation', {
            module: 'preservation',
        });
        window.location.href = '/' + plant.pathId + '/OldPreservation';
    };

    const closeReschededuleDialog = (): void => {
        setShowTagRescheduleDialog(false);
        refreshScopeList();
    };

    return (
        <Container ref={moduleContainerRef}>
            <ContentContainer withSidePanel={displayFilter}>
                <HeaderContainer ref={moduleHeaderContainerRef}>
                    <LeftPartOfHeader>
                        <Header>
                            <Typography variant="h1">Preservation</Typography>
                            <StyledButton
                                className="showOnlyOnTablet"
                                variant="ghost"
                                onClick={(): void =>
                                    setShowActions(!showActions)
                                }
                            >
                                {!showActions && (
                                    <>
                                        Show actions <KeyboardArrowUp />
                                    </>
                                )}
                                {showActions && (
                                    <>
                                        Hide actions <KeyboardArrowDown />
                                    </>
                                )}
                            </StyledButton>
                        </Header>
                        <ActionsContainer showActions={showActions}>
                            <Dropdown
                                disabled={project.id === -1}
                                maxHeight="300px"
                                text={project.name}
                                onFilter={setFilterForProjects}
                            >
                                {filteredProjects.map((projectItem, index) => {
                                    return (
                                        <DropdownItem
                                            key={index}
                                            onClick={(event): void =>
                                                changeProject(event, index)
                                            }
                                        >
                                            <div>{projectItem.description}</div>
                                            <div style={{ fontSize: '12px' }}>
                                                {projectItem.name}
                                            </div>
                                        </DropdownItem>
                                    );
                                })}
                            </Dropdown>
                            {purchaseOrderNumber && (
                                <div
                                    style={{
                                        marginLeft:
                                            'calc(var(--grid-unit) * 2)',
                                        marginRight:
                                            'calc(var(--grid-unit) * 4)',
                                    }}
                                >
                                    PO number: {purchaseOrderNumber}
                                </div>
                            )}

                            <Tooltip
                                title={
                                    !permissions.includes(
                                        'PRESERVATION_PLAN/CREATE'
                                    )
                                        ? 'You do not have permission to add scope'
                                        : ''
                                }
                            >
                                <div>
                                    <Dropdown
                                        disabled={
                                            project.id === -1 ||
                                            !permissions.includes(
                                                'PRESERVATION_PLAN/CREATE'
                                            )
                                        }
                                        text="Add scope"
                                    >
                                        <Link to={`AddScope/selectTagsManual`}>
                                            <DropdownItem>
                                                Add tags manually
                                            </DropdownItem>
                                        </Link>
                                        <Link
                                            to={'AddScope/selectTagsAutoscope'}
                                        >
                                            <DropdownItem>
                                                Autoscope by tag function
                                            </DropdownItem>
                                        </Link>
                                        <Link to={'AddScope/createDummyTag'}>
                                            <DropdownItem>
                                                Create dummy tag
                                            </DropdownItem>
                                        </Link>
                                        <Link
                                            to={
                                                duplicatableTagSelected
                                                    ? 'AddScope/duplicateDummyTag/' +
                                                      (selectedTags.length == 1
                                                          ? selectedTags[0].id.toString()
                                                          : '')
                                                    : ''
                                            }
                                        >
                                            <DropdownItem
                                                disabled={
                                                    !duplicatableTagSelected
                                                }
                                            >
                                                Duplicate dummy tag
                                            </DropdownItem>
                                        </Link>
                                        <Link to={'AddScope/selectMigrateTags'}>
                                            <DropdownItem>
                                                Migrate tags from old
                                                (temporary)
                                            </DropdownItem>
                                        </Link>
                                    </Dropdown>
                                </div>
                            </Tooltip>

                            <IconBar className="showOnlyOnTablet">
                                <Button
                                    onClick={preservedDialog}
                                    disabled={!preservableTagsSelected}
                                >
                                    Preserved this week
                                </Button>
                            </IconBar>
                        </ActionsContainer>
                    </LeftPartOfHeader>
                    <ActionsContainer showActions={showActions}>
                        <IconBar>
                            <StyledButton
                                className="hideOnTablet"
                                onClick={preservedDialog}
                                disabled={!preservableTagsSelected}
                            >
                                Preserved this week
                            </StyledButton>
                            <StyledButton
                                variant="ghost"
                                title="Start preservation for selected tag(s)"
                                onClick={startPreservationDialog}
                                disabled={!startableTagsSelected}
                            >
                                <EdsIcon
                                    name="play"
                                    color={
                                        !startableTagsSelected
                                            ? tokens.colors.interactive
                                                  .disabled__border.rgba
                                            : ''
                                    }
                                />
                                Start
                            </StyledButton>
                            <StyledButton
                                variant="ghost"
                                title="Transfer selected tag(s)"
                                onClick={transferDialog}
                                disabled={!transferableTagsSelected}
                            >
                                <EdsIcon
                                    name="fast_forward"
                                    color={
                                        !transferableTagsSelected
                                            ? tokens.colors.interactive
                                                  .disabled__border.rgba
                                            : ''
                                    }
                                />
                                Transfer
                            </StyledButton>
                            <StyledButton
                                variant="ghost"
                                title="Complete selected tag(s)"
                                onClick={showCompleteDialog}
                                disabled={!completableTagsSelected}
                            >
                                <EdsIcon
                                    name="done_all"
                                    color={
                                        !completableTagsSelected
                                            ? tokens.colors.interactive
                                                  .disabled__border.rgba
                                            : ''
                                    }
                                />
                                Complete
                            </StyledButton>
                            <OptionsDropdown
                                text="More options"
                                icon="more_vertical"
                                variant="ghost"
                            >
                                <DropdownItem
                                    disabled={
                                        selectedTags.length != 1 ||
                                        !editableTagSelected
                                    }
                                    onClick={(): void =>
                                        setShowEditRequirementsDialog(true)
                                    }
                                >
                                    <EdsIcon
                                        name="edit_text"
                                        color={
                                            selectedTags.length != 1 ||
                                            !editableTagSelected
                                                ? tokens.colors.interactive
                                                      .disabled__border.rgba
                                                : tokens.colors.text
                                                      .static_icons__tertiary
                                                      .rgba
                                        }
                                    />
                                    Update Requirements
                                </DropdownItem>
                                <DropdownItem
                                    disabled={!editableTagSelected}
                                    onClick={(): void =>
                                        setShowEditTagJourneyDialog(true)
                                    }
                                >
                                    <EdsIcon
                                        name="edit_text"
                                        color={
                                            !editableTagSelected
                                                ? tokens.colors.interactive
                                                      .disabled__border.rgba
                                                : tokens.colors.text
                                                      .static_icons__tertiary
                                                      .rgba
                                        }
                                    />
                                    Update Journey
                                </DropdownItem>
                                <DropdownItem
                                    disabled={selectedTags.length === 0}
                                    onClick={(): void =>
                                        setShowTagRescheduleDialog(true)
                                    }
                                >
                                    <EdsIcon
                                        name="calendar_date_range"
                                        color={
                                            !unvoidedTagsSelected
                                                ? tokens.colors.interactive
                                                      .disabled__border.rgba
                                                : tokens.colors.text
                                                      .static_icons__tertiary
                                                      .rgba
                                        }
                                    />
                                    Reschedule
                                </DropdownItem>
                                <DropdownItem
                                    disabled={selectedTags.length === 0}
                                    onClick={(): void =>
                                        showInServiceDialog({
                                            selectedTags,
                                            setInService,
                                        })
                                    }
                                >
                                    <EdsIcon
                                        name="edit_text"
                                        color={
                                            !editableTagSelected
                                                ? tokens.colors.interactive
                                                      .disabled__border.rgba
                                                : tokens.colors.text
                                                      .static_icons__tertiary
                                                      .rgba
                                        }
                                    />
                                    Set in service
                                </DropdownItem>
                                <DropdownItem
                                    disabled={!voidedTagsSelected}
                                    onClick={(): void => showRemoveDialog()}
                                >
                                    <EdsIcon
                                        name="delete_to_trash"
                                        color={
                                            !voidedTagsSelected
                                                ? tokens.colors.interactive
                                                      .disabled__border.rgba
                                                : tokens.colors.text
                                                      .static_icons__tertiary
                                                      .rgba
                                        }
                                    />
                                    Remove
                                </DropdownItem>
                                <DropdownItem
                                    disabled={!unvoidedTagsSelected}
                                    onClick={(): void => showVoidDialog(true)}
                                >
                                    <EdsIcon
                                        name="delete_forever"
                                        color={
                                            !unvoidedTagsSelected
                                                ? tokens.colors.interactive
                                                      .disabled__border.rgba
                                                : tokens.colors.text
                                                      .static_icons__tertiary
                                                      .rgba
                                        }
                                    />
                                    Void
                                </DropdownItem>
                                <DropdownItem
                                    disabled={!voidedTagsSelected}
                                    onClick={(): void => showVoidDialog(false)}
                                >
                                    <EdsIcon
                                        name="restore_from_trash"
                                        color={
                                            !voidedTagsSelected
                                                ? tokens.colors.interactive
                                                      .disabled__border.rgba
                                                : tokens.colors.text
                                                      .static_icons__tertiary
                                                      .rgba
                                        }
                                    />
                                    Unvoid
                                </DropdownItem>
                                <DropdownItem
                                    disabled={!unStartableTagsSelected}
                                    onClick={undoStartPreservationDialog}
                                >
                                    <EdsIcon
                                        name="edit_text"
                                        color={
                                            !unStartableTagsSelected
                                                ? tokens.colors.interactive
                                                      .disabled__border.rgba
                                                : tokens.colors.text
                                                      .static_icons__tertiary
                                                      .rgba
                                        }
                                    />
                                    Undo start
                                </DropdownItem>
                            </OptionsDropdown>
                            <Tooltip
                                title={
                                    <TooltipText>
                                        <p>
                                            {numberOfFilters} active filter(s)
                                        </p>
                                        <p>
                                            Filter result {numberOfTags} items
                                        </p>
                                    </TooltipText>
                                }
                                disableHoverListener={numberOfFilters < 1}
                                arrow={true}
                                style={{ textAlign: 'center' }}
                            >
                                <div>
                                    <StyledButton
                                        id="filterButton"
                                        variant={
                                            numberOfFilters > 0
                                                ? 'contained'
                                                : 'ghost'
                                        }
                                        onClick={(): void => {
                                            toggleFilter();
                                        }}
                                    >
                                        <EdsIcon name="filter_list" />
                                    </StyledButton>
                                </div>
                            </Tooltip>
                        </IconBar>
                        <OldPreservationLink>
                            {!purchaseOrderNumber && (
                                <Typography variant="caption">
                                    <Tooltip
                                        title="To work on preservation scope not yet migrated."
                                        enterDelay={200}
                                        enterNextDelay={100}
                                        arrow={true}
                                    >
                                        <Button
                                            variant="ghost"
                                            onClick={navigateToOldPreservation}
                                        >
                                            Switch to old system
                                        </Button>
                                    </Tooltip>
                                </Typography>
                            )}
                        </OldPreservationLink>
                    </ActionsContainer>
                </HeaderContainer>
                {isLoading && (
                    <div style={{ margin: 'calc(var(--grid-unit) * 5) auto' }}>
                        <Spinner large />
                    </div>
                )}
                {savedTagListFilters && (
                    <ScopeOverviewTable
                        setOrderDirection={setOrderDirection}
                        setOrderByField={setOrderByField}
                        selectedTags={selectedTags}
                        setSelectedTags={setSelectedTags}
                        showTagDetails={openFlyout}
                        getData={getTags}
                        pageSize={pageSize}
                        pageIndex={pageIndex}
                        setRefreshScopeListCallback={
                            setRefreshScopeListCallback
                        }
                    />
                )}
                {displayFlyout && (
                    <Flyout close={closeFlyout}>
                        <TagFlyout
                            tagId={flyoutTagId}
                            close={closeFlyout}
                            setDirty={(): void => setScopeIsDirty(true)}
                        />
                    </Flyout>
                )}
            </ContentContainer>
            {displayFilter && savedTagListFilters && (
                <FilterContainer maxHeight={moduleAreaHeight}>
                    <ScopeFilter
                        triggerFilterValuesRefresh={triggerFilterValuesRefresh}
                        onCloseRequest={(): void => {
                            setDisplayFilter(false);
                        }}
                        tagListFilter={tagListFilter}
                        setTagListFilter={setTagListFilter}
                        savedTagListFilters={savedTagListFilters}
                        refreshSavedTagListFilters={() =>
                            updateSavedTagListFilters({
                                setIsLoading,
                                setSavedTagListFilters,
                                project,
                                apiClient,
                                showSnackbarNotification,
                            })
                        }
                        setSelectedSavedFilterTitle={
                            setSelectedSavedFilterTitle
                        }
                        selectedSavedFilterTitle={selectedSavedFilterTitle}
                        numberOfTags={numberOfTags}
                        exportTagsToExcel={exportTagsToExcel}
                    />
                </FilterContainer>
            )}
            <RescheduleDialog
                open={showTagRescheduleDialog}
                tags={selectedTags}
                onClose={closeReschededuleDialog}
            />
            <UpdateRequirementsDialog
                open={showEditRequirementsDialog}
                onClose={(): void => {
                    setShowEditRequirementsDialog(false);
                    refreshScopeList();
                }}
                tagId={selectedTagId}
            />
            <UpdateJourneyDialog
                tags={selectedTags}
                open={showEditTagJourneyDialog}
                onClose={(): void => {
                    setShowEditTagJourneyDialog(false);
                    refreshScopeList();
                }}
            />
        </Container>
    );
};

export default ScopeOverview;
