import { Container, ContentContainer, DropdownItem, FilterContainer, Header, HeaderContainer, IconBar, OldPreservationLink, StyledButton, TooltipText } from './ScopeOverview.style';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { PreservedTag, PreservedTags, Requirement, SavedTagListFilter, TagListFilter } from './types';
import React, { useEffect, useRef, useState } from 'react';

import { Button } from '@equinor/eds-core-react';
import CacheService from '@procosys/core/CacheService';
import { Canceler } from '@procosys/http/HttpClient';
import CompleteDialog from './CompleteDialog';
import Dropdown from '../../../../components/Dropdown';
import EdsIcon from '../../../../components/EdsIcon';
import Flyout from './../../../../components/Flyout';
import OptionsDropdown from '../../../../components/OptionsDropdown';
import PreservedDialog from './PreservedDialog';
import { ProjectDetails } from '../../types';
import Qs from 'qs';
import RemoveDialog from './RemoveDialog';
import ScopeFilter from './ScopeFilter/ScopeFilter';
import ScopeTable from './ScopeTable';
import StartPreservationDialog from './StartPreservationDialog';
import TagFlyout from './TagFlyout/TagFlyout';
import { Tooltip } from '@material-ui/core';
import TransferDialog from './TransferDialog';
import { Typography } from '@equinor/eds-core-react';
import VoidDialog from './VoidDialog';
import { showModalDialog } from '../../../../core/services/ModalDialogService';
import { showSnackbarNotification } from '../../../../core/services/NotificationService';
import { tokens } from '@equinor/eds-tokens';
import { useAnalytics } from '@procosys/core/services/Analytics/AnalyticsContext';
import { usePreservationContext } from '../../context/PreservationContext';

export const getFirstUpcomingRequirement = (tag: PreservedTag): Requirement | null => {
    if (!tag.requirements || tag.requirements.length === 0) {
        return null;
    }

    return tag.requirements[0];
};

export const isTagOverdue = (tag: PreservedTag): boolean => {
    const requirement = getFirstUpcomingRequirement(tag);
    return requirement ? requirement.nextDueWeeks < 0 : false;
};

export const isTagVoided = (tag: PreservedTag): boolean => {
    return tag.isVoided;
};

const ScopeOverviewCache = new CacheService('ScopeOverview');

function getCachedFilter(projectId: number): TagListFilter | null {
    try {
        const cacheItem = ScopeOverviewCache.getCache(projectId + '-filter');
        if (cacheItem) {
            return cacheItem.data;
        }
    } catch (error) {
        showSnackbarNotification('An error occured retrieving default filter values');
        console.error('Error while retrieving cached filter values: ', error);
    }
    return null;
}

function setCachedFilter(projectId: number, filter: TagListFilter): void {
    try {
        ScopeOverviewCache.setCache(projectId + '-filter', filter);
    } catch (error) {
        showSnackbarNotification('An error occured when saving default filter values');
        console.error('Error while caching filter values: ', error);
    }
}

function deleteCachedFilter(projectId: number): void {
    ScopeOverviewCache.delete(projectId + '-filter');
}
const emptyTagListFilter: TagListFilter = {
    tagNoStartsWith: null,
    commPkgNoStartsWith: null,
    mcPkgNoStartsWith: null,
    purchaseOrderNoStartsWith: null,
    callOffStartsWith: null,
    storageAreaStartsWith: null,
    preservationStatus: null,
    actionStatus: null,
    voidedFilter: null,
    journeyIds: [],
    modeIds: [],
    dueFilters: [],
    requirementTypeIds: [],
    tagFunctionCodes: [],
    disciplineCodes: [],
    responsibleIds: [],
    areaCodes: []
};

interface SupportedQueryStringFilters {
    [index: string]: string | null;
    pono: string | null;
    calloff: string | null;
}

const backToListButton = 'Back to list';

const ScopeOverview: React.FC = (): JSX.Element => {

    const {
        project,
        availableProjects,
        setCurrentProject,
        apiClient,
        purchaseOrderNumber: purchaseOrderNumber,
        setCurrentPurchaseOrderNumber: setCurrentPurchaseOrderNumber
    } = usePreservationContext();

    const [selectedTags, setSelectedTags] = useState<PreservedTag[]>([]);
    const [displayFlyout, setDisplayFlyout] = useState<boolean>(false);
    const [displayFilter, setDisplayFilter] = useState<boolean>(false);
    const [flyoutTagId, setFlyoutTagId] = useState<number>(0);
    const [scopeIsDirty, setScopeIsDirty] = useState<boolean>(false);
    const [pageSize, setPageSize] = useState<number>(50);
    const [tagListFilter, setTagListFilter] = useState<TagListFilter>({ ...emptyTagListFilter });

    const [numberOfTags, setNumberOfTags] = useState<number>();
    const [voidedTagsSelected, setVoidedTagsSelected] = useState<boolean>();
    const [unvoidedTagsSelected, setUnvoidedTagsSelected] = useState<boolean>();
    const [completableTagsSelected, setCompletableTagsSelected] = useState<boolean>();
    const [preservableTagsSelected, setPreservableTagsSelected] = useState<boolean>();
    const [startableTagsSelected, setStartableTagsSelected] = useState<boolean>();
    const [transferableTagsSelected, setTransferableTagsSelected] = useState<boolean>();
    const [selectedTagId, setSelectedTagId] = useState<string | number>();
    const [resetTablePaging, setResetTablePaging] = useState<boolean>(false);
    const [filterForProjects, setFilterForProjects] = useState<string>('');
    const [filteredProjects, setFilteredProjects] = useState<ProjectDetails[]>(availableProjects);
    const [orderDirection, setOrderDirection] = useState<string | null>(null);
    const [orderByField, setOrderByField] = useState<string | null>(null);
    const [selectedSavedFilterTitle, setSelectedSavedFilterTitle] = useState<string | null>(null);
    const [savedTagListFilters, setSavedTagListFilters] = useState<SavedTagListFilter[] | null>(null);
    const [triggerFilterValuesRefresh, setTriggerFilterValuesRefresh] = useState<number>(0); //increment to trigger filter values to update

    const history = useHistory();
    const location = useLocation();
    const analytics = useAnalytics();

    const numberOfFilters: number = Object.values(tagListFilter).filter(v => v && JSON.stringify(v) != '[]').length;

    const refreshScopeListCallback = useRef<() => void>();
    const isFirstRender = useRef<boolean>(true);

    const moduleContainerRef = useRef<HTMLDivElement>(null);
    const [moduleAreaHeight, setModuleAreaHeight] = useState<number>(500);

    const updateSavedTagListFilters = async (): Promise<void> => {
        try {
            const response = await apiClient.getSavedTagListFilters(project.name);
            setSavedTagListFilters(response);
        } catch (error) {
            console.error('Get saved filters failed: ', error.message, error.data);
            showSnackbarNotification(error.message, 5000);
        }
    };

    useEffect((): void => {
        if (project) {
            updateSavedTagListFilters();
        }
    }, [project]);

    useEffect((): void => {
        const previousFilter = getCachedFilter(project.id);
        if (previousFilter) {
            setTagListFilter({
                ...previousFilter
            });
        } else if (savedTagListFilters) {
            const defaultFilter = getDefaultFilter();
            if (defaultFilter) {
                setTagListFilter({
                    ...defaultFilter
                });
            }
        };
    }, [savedTagListFilters, project]);

    const getDefaultFilter = (): TagListFilter | null => {
        if (savedTagListFilters) {
            const defaultFilter = savedTagListFilters.find((filter) => filter.defaultFilter);
            if (defaultFilter) {
                try {
                    return JSON.parse(defaultFilter.criteria);
                } catch (error) {
                    console.error('Failed to parse default filter');
                    analytics.trackException(error);
                }
            }
        };
        return null;
    };

    const updateModuleAreaHeightReference = (): void => {
        if (!moduleContainerRef.current) return;
        setModuleAreaHeight(moduleContainerRef.current.clientHeight);
    };

    useEffect(() => {
        updateModuleAreaHeightReference();
        window.addEventListener('resize', updateModuleAreaHeightReference);

        return (): void => {
            window.removeEventListener('resize', updateModuleAreaHeightReference);
        };

    }, [moduleContainerRef, displayFilter]);

    const refreshScopeList = (): void => {
        refreshScopeListCallback.current && refreshScopeListCallback.current();
    };

    useEffect(() => {
        // filter project dropdown
        if (filterForProjects.length <= 0) {
            setFilteredProjects(availableProjects);
            return;
        }

        setFilteredProjects(availableProjects.filter((p: ProjectDetails) => {
            return p.name.toLowerCase().indexOf(filterForProjects.toLowerCase()) > -1 ||
                p.description.toLowerCase().indexOf(filterForProjects.toLowerCase()) > -1;
        }));
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
        setVoidedTagsSelected(selectedTags.find(t => t.isVoided) ? true : false);
        setUnvoidedTagsSelected(selectedTags.find(t => !t.isVoided) ? true : false);
        setCompletableTagsSelected(selectedTags.find(t => t.readyToBeCompleted && !t.isVoided) ? true : false);
        setPreservableTagsSelected(selectedTags.find(t => t.readyToBePreserved && !t.isVoided) ? true : false);
        setStartableTagsSelected(selectedTags.find(t => t.readyToBeStarted && !t.isVoided) ? true : false);
        setTransferableTagsSelected(selectedTags.find(t => t.readyToBeTransferred && !t.isVoided) ? true : false);
        if (selectedTags.length == 1) {
            setSelectedTagId(selectedTags[0].id);
        } else {
            setSelectedTagId('');
        }
    }, [selectedTags]);

    const setRefreshScopeListCallback = (callback: () => void): void => {
        refreshScopeListCallback.current = callback;
    };

    const cancelerRef = useRef<Canceler | null>();

    const getTags = async (page: number, pageSize: number, orderBy: string | null, orderDirection: string | null): Promise<PreservedTags> => {
        if (savedTagListFilters) {  //to avoid getting tags before we have set previous-/default filter
            try {
                cancelerRef.current && cancelerRef.current();
                return await apiClient.getPreservedTags(project.name, page, pageSize, orderBy, orderDirection, tagListFilter, (c) => { cancelerRef.current = c; }).then(
                    (response) => {
                        setNumberOfTags(response.maxAvailable);
                        setSelectedTags([]);
                        return response;
                    }
                );
            } catch (error) {
                console.error('Get tags failed: ', error.message, error.data);
                if (!error.isCancel) {
                    showSnackbarNotification(error.message);
                }
            }
        };
        setSelectedTags([]);
        return { maxAvailable: 0, tags: [] };
    };

    const exportTagsToExcel = async (): Promise<void> => {
        try {
            showSnackbarNotification('Exporting filtered tags to Excel...');
            await apiClient.exportTagsToExcel(project.name, orderByField, orderDirection, tagListFilter).then(
                (response) => {
                    const outputFilename = `Preservation tags-${project.name}.xlsx`;
                    const tempUrl = window.URL.createObjectURL(new Blob([response]));
                    const tempLink = document.createElement('a');
                    tempLink.style.display = 'none';
                    tempLink.href = tempUrl;
                    tempLink.setAttribute('download', outputFilename);
                    document.body.appendChild(tempLink);
                    tempLink.click();
                    tempLink.remove();
                }
            );
            showSnackbarNotification('Filtered tags are exported to Excel');
        } catch (error) {
            console.error('Export tags to excel failed: ', error.message, error.data);
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

    let transferableTags: PreservedTag[];
    let nonTransferableTags: PreservedTag[];

    const transfer = async (): Promise<void> => {
        try {
            await apiClient.transfer(transferableTags.map(t => ({
                id: t.id,
                rowVersion: t.rowVersion
            })));
            refreshScopeList();
            refreshFilterValues();
            showSnackbarNotification(`${transferableTags.length} tag(s) have been successfully transferred.`);
        } catch (error) {
            console.error('Transfer failed: ', error.message, error.data);
            showSnackbarNotification(error.message);
        }
        return Promise.resolve();
    };

    const transferDialog = (): void => {
        //Tag-objects must be cloned to avoid issues with data in scope table
        transferableTags = [];
        nonTransferableTags = [];

        selectedTags.map((tag) => {
            const newTag: PreservedTag = { ...tag };
            if (tag.readyToBeTransferred && !tag.isVoided) {
                transferableTags.push(newTag);
            } else {
                nonTransferableTags.push(newTag);
            }
        });

        const transferButton = transferableTags.length > 0 ? 'Transfer' : null;
        const transferFunc = transferableTags.length > 0 ? transfer : null;

        showModalDialog(
            'Transferring',
            <TransferDialog transferableTags={transferableTags} nonTransferableTags={nonTransferableTags} />,
            '80vw',
            backToListButton,
            null,
            transferButton,
            transferFunc);
    };

    let startableTags: PreservedTag[];
    let nonStartableTags: PreservedTag[];

    const startPreservation = async (): Promise<void> => {
        try {
            await apiClient.startPreservation(startableTags.map(t => t.id));
            refreshScopeList();
            refreshFilterValues();
            showSnackbarNotification('Status was set to \'Active\' for selected tag(s).');
        } catch (error) {
            console.error('Start preservation failed: ', error.message, error.data);
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

        const startButton = startableTags.length > 0 ? 'Start preservation' : null;
        const startFunc = startableTags.length > 0 ? startPreservation : null;

        showModalDialog(
            'Start preservation',
            <StartPreservationDialog startableTags={startableTags} nonStartableTags={nonStartableTags} />,
            '80vw',
            backToListButton,
            null,
            startButton,
            startFunc);
    };

    let preservableTags: PreservedTag[];
    let nonPreservableTags: PreservedTag[];

    const preservedThisWeek = async (): Promise<void> => {
        try {
            await apiClient.preserve(preservableTags.map(t => t.id));
            refreshScopeList();
            showSnackbarNotification('Selected tag(s) have been preserved for this week.');
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

        const preservedButton = preservableTags.length > 0 ? 'Preserved this week' : null;
        const preservedFunc = preservableTags.length > 0 ? preservedThisWeek : null;

        showModalDialog(
            'Preserved this week',
            <PreservedDialog preservableTags={preservableTags} nonPreservableTags={nonPreservableTags} />,
            '80vw',
            backToListButton,
            null,
            preservedButton,
            preservedFunc);
    };

    let completableTags: PreservedTag[] = [];
    let nonCompletableTags: PreservedTag[] = [];

    const complete = async (): Promise<void> => {
        try {
            const tags = selectedTags.filter(tag => tag.readyToBeCompleted);
            await apiClient.complete(tags.map(t => ({
                id: t.id,
                rowVersion: t.rowVersion
            })));
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
            <CompleteDialog completableTags={completableTags} nonCompletableTags={nonCompletableTags} />,
            '80vw',
            backToListButton,
            null,
            completeButton,
            completeFunc);
    };

    const remove = async (removableTags: PreservedTag[]): Promise<void> => {
        try {
            await apiClient.remove(removableTags.map(t => ({
                id: t.id,
                rowVersion: t.rowVersion
            })));
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
        const removeFunc = removableTags.length > 0 ? (): Promise<void> => remove(removableTags) : null;

        showModalDialog(
            'Complete preservation',
            <RemoveDialog removableTags={removableTags} nonRemovableTags={nonRemovableTags} />,
            '80vw',
            backToListButton,
            null,
            removeButton,
            removeFunc);
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
        const voidTitle = voiding ? 'Voiding following tags' : 'Unvoiding following tags';

        showModalDialog(
            voidTitle,
            <VoidDialog voidableTags={voidableTags} unvoidableTags={unvoidableTags} voiding={voiding} />,
            '80vw',
            backToListButton,
            null,
            voidButton,
            voidFunc);
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
        const qsParameters = Qs.parse(location.search, { ignoreQueryPrefix: true });

        // get "project" from querystring (mandatory in order to use other filters)
        const projectName = qsParameters['project'] as string;

        if (projectName && projectName !== '') {
            const project = filteredProjects.find(p => p.name === projectName);

            if (project) {
                // set as current project
                setCurrentProject(project.id);

                // get and apply supported tag filters
                let filtersUsed = 0;
                const supportedFilters: SupportedQueryStringFilters = {
                    pono: null,
                    calloff: null
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
                showSnackbarNotification(`The requested project ${projectName} is not available`);
            }
        }
        // clear parameters in browser url
        history.replace('/');

    }, [location]);

    const navigateToOldPreservation = (): void => {
        analytics.trackUserAction('Btn_SwitchToOldPreservation', { module: 'preservation' });
        window.location.href = './OldPreservation';
    };

    return (
        <Container ref={moduleContainerRef}>
            <ContentContainer withSidePanel={displayFilter}>
                <OldPreservationLink>
                    {!purchaseOrderNumber &&
                        <Typography variant="caption">
                            <Tooltip title='To work on preservation scope not yet migrated.' enterDelay={200} enterNextDelay={100} arrow={true}>
                                <Button variant="ghost" onClick={navigateToOldPreservation}>Switch to old system</Button>
                            </Tooltip>
                        </Typography>
                    }
                </OldPreservationLink>
                <HeaderContainer>
                    <Header>
                        <Typography variant="h1">Preservation tags</Typography>
                        <Dropdown
                            maxHeight='300px'
                            text={project.name}
                            onFilter={setFilterForProjects}
                        >
                            {filteredProjects.map((projectItem, index) => {
                                return (
                                    <DropdownItem
                                        key={index}
                                        onClick={(event): void => changeProject(event, index)}
                                    >
                                        <div>{projectItem.description}</div>
                                        <div style={{ fontSize: '12px' }}>{projectItem.name}</div>
                                    </DropdownItem>
                                );
                            })}
                        </Dropdown>
                        {purchaseOrderNumber &&
                            <div style={{ marginLeft: 'calc(var(--grid-unit) * 2)', marginRight: 'calc(var(--grid-unit) * 4)' }}>PO number: {purchaseOrderNumber}</div>
                        }
                        <Dropdown text="Add scope">
                            <Link to={'/AddScope/selectTagsManual'}>
                                <DropdownItem>
                                    Add tags manually
                                </DropdownItem>
                            </Link>
                            <Link to={'/AddScope/selectTagsAutoscope'}>
                                <DropdownItem>
                                    Autoscope by tag function
                                </DropdownItem>
                            </Link>
                            <Link to={'/AddScope/createDummyTag'}>
                                <DropdownItem>
                                    Create dummy tag
                                </DropdownItem>
                            </Link>
                            <Link to={'/AddScope/selectMigrateTags'}>
                                <DropdownItem>
                                    Migrate tags from old (temporary)
                                </DropdownItem>
                            </Link>
                        </Dropdown>
                    </Header>
                    <IconBar>
                        <Button
                            onClick={preservedDialog}
                            disabled={!preservableTagsSelected}>Preserved this week
                        </Button>
                        <StyledButton
                            variant='ghost'
                            title='Start preservation for selected tag(s)'
                            onClick={startPreservationDialog}
                            disabled={!startableTagsSelected}>
                            <EdsIcon name='play' color={!startableTagsSelected ? tokens.colors.interactive.disabled__border.rgba : ''} />
                        Start
                        </StyledButton>
                        <StyledButton
                            variant='ghost'
                            title="Transfer selected tag(s)"
                            onClick={transferDialog}
                            disabled={!transferableTagsSelected}>
                            <EdsIcon name='fast_forward' color={!transferableTagsSelected ? tokens.colors.interactive.disabled__border.rgba : ''} />
                        Transfer
                        </StyledButton>
                        <StyledButton
                            variant='ghost'
                            title="Complete selected tag(s)"
                            onClick={showCompleteDialog}
                            disabled={!completableTagsSelected}>
                            <EdsIcon name='done_all' color={!completableTagsSelected ? tokens.colors.interactive.disabled__border.rgba : ''} />
                        Complete
                        </StyledButton>
                        <OptionsDropdown
                            text="More options"
                            icon='more_verticle'
                            variant='ghost'>
                            <DropdownItem
                                disabled={selectedTags.length != 1 || voidedTagsSelected}
                                onClick={(): void => history.push(`/EditTagProperties/${selectedTagId}`)}>
                                <EdsIcon name='edit_text' color={selectedTags.length != 1 || voidedTagsSelected ? tokens.colors.interactive.disabled__border.rgba : tokens.colors.text.static_icons__tertiary.rgba} />
                                Edit
                            </DropdownItem>
                            <DropdownItem
                                disabled={selectedTags.length === 0}
                                onClick={(): void => showRemoveDialog()}>
                                <EdsIcon name='delete_to_trash' color={!unvoidedTagsSelected ? tokens.colors.interactive.disabled__border.rgba : tokens.colors.text.static_icons__tertiary.rgba} />
                                Remove
                            </DropdownItem>
                            <DropdownItem
                                disabled={!unvoidedTagsSelected}
                                onClick={(): void => showVoidDialog(true)}>
                                <EdsIcon name='delete_forever' color={!unvoidedTagsSelected ? tokens.colors.interactive.disabled__border.rgba : tokens.colors.text.static_icons__tertiary.rgba} />
                                Void
                            </DropdownItem>
                            <DropdownItem
                                disabled={!voidedTagsSelected}
                                onClick={(): void => showVoidDialog(false)}>
                                <EdsIcon name='restore_from_trash' color={!voidedTagsSelected ? tokens.colors.interactive.disabled__border.rgba : tokens.colors.text.static_icons__tertiary.rgba} />
                                Unvoid
                            </DropdownItem>
                        </OptionsDropdown>
                        <Tooltip title={<TooltipText><p>{numberOfFilters} active filter(s)</p><p>Filter result {numberOfTags} items</p></TooltipText>} disableHoverListener={numberOfFilters < 1} arrow={true} style={{ textAlign: 'center' }}>
                            <div>
                                <StyledButton
                                    id='filterButton'
                                    variant={numberOfFilters > 0 ? 'contained' : 'ghost'}
                                    onClick={(): void => {
                                        toggleFilter();
                                    }}
                                >
                                    <EdsIcon name='filter_list' />
                                </StyledButton>
                            </div>
                        </Tooltip>
                    </IconBar>
                </HeaderContainer>

                <ScopeTable
                    getTags={getTags}
                    data-testId='scopeTable'
                    setSelectedTags={setSelectedTags}
                    showTagDetails={openFlyout}
                    setRefreshScopeListCallback={setRefreshScopeListCallback}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    shouldSelectFirstPage={resetTablePaging}
                    setFirstPageSelected={(): void => setResetTablePaging(false)}
                    setOrderByField={setOrderByField}
                    setOrderDirection={setOrderDirection}
                    maxHeight={moduleAreaHeight}
                />
                {
                    displayFlyout && (
                        <Flyout
                            close={closeFlyout}>
                            <TagFlyout
                                tagId={flyoutTagId}
                                close={closeFlyout}
                                setDirty={(): void => setScopeIsDirty(true)}
                            />
                        </Flyout>
                    )
                }

            </ContentContainer >
            {
                displayFilter && savedTagListFilters && (
                    <FilterContainer maxHeight={moduleAreaHeight}>
                        <ScopeFilter
                            triggerFilterValuesRefresh={triggerFilterValuesRefresh}
                            onCloseRequest={(): void => {
                                setDisplayFilter(false);
                            }}
                            tagListFilter={tagListFilter} setTagListFilter={setTagListFilter}
                            savedTagListFilters={savedTagListFilters}
                            refreshSavedTagListFilters={updateSavedTagListFilters}
                            setSelectedSavedFilterTitle={setSelectedSavedFilterTitle}
                            selectedSavedFilterTitle={selectedSavedFilterTitle}
                            numberOfTags={numberOfTags}
                            exportTagsToExcel={exportTagsToExcel} />
                    </FilterContainer>
                )
            }
        </Container >
    );
};

export default ScopeOverview;
