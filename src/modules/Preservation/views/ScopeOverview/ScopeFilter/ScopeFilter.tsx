import { Button, TextField, Typography, Popover } from '@equinor/eds-core-react';
import { Collapse, CollapseInfo, Container, Header, Link, Section } from './ScopeFilter.style';
import React, { useEffect, useRef, useState } from 'react';
import { SavedTagListFilter, TagListFilter } from '../types';

// TODO: change popover to the Equinor one!
import AreaIcon from '@procosys/assets/icons/Area';
import { Canceler } from 'axios';
import CheckboxFilter from './CheckboxFilter';
import CloseIcon from '@material-ui/icons/Close';
import EdsIcon from '@procosys/components/EdsIcon';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import MultiSelectFilter from './MultiSelectFilter/MultiSelectFilter';
import RadioGroupFilter from './RadioGroupFilter';
import SavedFilters from './SavedFilters';
import SavedFiltersIcon from '@material-ui/icons/BookmarksOutlined';
import { showSnackbarNotification } from '../../../../../core/services/NotificationService';
import { usePreservationContext } from '../../../context/PreservationContext';

const ExcelIcon = <EdsIcon name='microsoft_excel' size={16} />;

const { PopoverAnchor } = Popover;

interface ScopeFilterProps {
    onCloseRequest: () => void;
    tagListFilter: TagListFilter;
    setTagListFilter: (filter: TagListFilter) => void;
    savedTagListFilters: SavedTagListFilter[];
    refreshSavedTagListFilters: () => void;
    selectedSavedFilterTitle: string | null;
    setSelectedSavedFilterTitle: (savedFilterTitle: string | null) => void;
    numberOfTags: number | undefined;
    exportTagsToExcel: () => void;
    triggerFilterValuesRefresh: number;
}

interface FilterInput {
    id: string;
    title: string;
}

export interface CheckboxFilterValue {
    id: string;
    title: string;
}

export type TagListFilterParamType = 'modeIds' | 'journeyIds' | 'dueFilters' | 'requirementTypeIds' | 'tagFunctionCodes' | 'disciplineCodes';

const dueDates: FilterInput[] =
    [
        {
            id: 'OverDue',
            title: 'Overdue',
        },
        {
            id: 'ThisWeek',
            title: 'This week',
        },
        {
            id: 'NextWeek',
            title: 'Next week',
        },
        {
            id: 'WeekPlusTwo',
            title: 'In 2 weeks',
        },
        {
            id: 'WeekPlusThree',
            title: 'In 3 weeks',
        }
    ];


const PRESERVATION_STATUS = [{
    title: 'All',
    value: 'no-filter',
    default: true
},
{
    title: 'Not started',
    value: 'NotStarted'
},
{
    title: 'Active',
    value: 'Active'
},
{
    title: 'Completed',
    value: 'Completed'
}];

const ACTION_STATUS = [{
    title: 'All',
    value: 'no-filter',
    default: true
},
{
    title: 'Open actions',
    value: 'HasOpen'
},
{
    title: 'Closed actions',
    value: 'HasClosed'
},
{
    title: 'Overdue actions',
    value: 'HasOverDue'
}];

const VOIDED = [{
    title: 'All',
    value: 'All',
},
{
    title: 'Not voided (default)',
    value: 'NotVoided',
    default: true
},
{
    title: 'Voided',
    value: 'Voided'
}];

const clearTagListFilter: TagListFilter = {
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

const ScopeFilter = ({
    onCloseRequest,
    tagListFilter,
    setTagListFilter,
    savedTagListFilters,
    refreshSavedTagListFilters,
    selectedSavedFilterTitle,
    setSelectedSavedFilterTitle,
    numberOfTags,
    exportTagsToExcel,
    triggerFilterValuesRefresh
}: ScopeFilterProps): JSX.Element => {

    const {
        project,
        apiClient,
        purchaseOrderNumber: purchaseOrderNumber
    } = usePreservationContext();

    const [searchIsExpanded, setSearchIsExpanded] = useState<boolean>(false);
    const [localTagListFilter, setLocalTagListFilter] = useState<TagListFilter>({ ...tagListFilter });

    const [modes, setModes] = useState<CheckboxFilterValue[]>([]);
    const [journeys, setJourneys] = useState<CheckboxFilterValue[]>([]);
    const [requirements, setRequirements] = useState<CheckboxFilterValue[]>([]);
    const [tagFunctions, setTagFunctions] = useState<CheckboxFilterValue[]>([]);
    const [disciplines, setDisciplines] = useState<CheckboxFilterValue[]>([]);
    const [responsibles, setResponsibles] = useState<FilterInput[]>([]);
    const [areas, setAreas] = useState<FilterInput[]>([]);
    const isFirstRender = useRef<boolean>(true);
    const projectNameRef = useRef<string>(project.name);
    const [filterActive, setFilterActive] = useState<boolean>(false);
    const [showSavedFilters, setShowSavedFilters] = useState<boolean>(false);
    const [anchorElement, setAnchorElement] = React.useState(null);

    const KEYCODE_ENTER = 13;

    useEffect(() => {
        let requestCancellor: Canceler;

        (async (): Promise<void> => {
            try {
                const journeys = await apiClient.getJourneyFilters(project.name, (cancel: Canceler) => requestCancellor = cancel);
                setJourneys(journeys);
            } catch (error) {
                !error.isCancel && showSnackbarNotification(error.message, 5000);
            }
        })();
        return (): void => requestCancellor && requestCancellor();
    }, [project, triggerFilterValuesRefresh]);

    useEffect(() => {
        let requestCancellor: Canceler;

        (async (): Promise<void> => {
            try {
                const response = await apiClient.getResponsiblesFilterForProject(project.name, (cancel: Canceler) => requestCancellor = cancel);
                setResponsibles(response.map(resp => { return { id: resp.id, title: resp.code }; }));
            } catch (error) {
                !error.isCancel && showSnackbarNotification(error.message, 5000);
            }
        })();
        return (): void => requestCancellor && requestCancellor();
    }, [project, triggerFilterValuesRefresh]);

    useEffect(() => {
        let requestCancellor: Canceler;

        (async (): Promise<void> => {
            try {
                const response = await apiClient.getAreaFilterForProject(project.name, (cancel: Canceler) => requestCancellor = cancel);
                setAreas(response.map(resp => { return { id: resp.code, title: resp.code }; }));
            } catch (error) {
                !error.isCancel && showSnackbarNotification(error.message, 5000);
            }
        })();
        return (): void => requestCancellor && requestCancellor();
    }, [project, triggerFilterValuesRefresh]);

    useEffect(() => {
        let requestCancellor: Canceler;

        (async (): Promise<void> => {
            try {
                const modes = await apiClient.getModeFilters(project.name, (cancel: Canceler) => requestCancellor = cancel);
                setModes(modes);
            } catch (error) {
                !error.isCancel && showSnackbarNotification(error.message, 5000);
            }
        })();
        return (): void => requestCancellor && requestCancellor();
    }, [project, triggerFilterValuesRefresh]);

    useEffect(() => {
        let requestCancellor: Canceler;

        (async (): Promise<void> => {
            try {
                const requirements = await apiClient.getRequirementTypeFilters(project.name, (cancel: Canceler) => requestCancellor = cancel);
                setRequirements(requirements);
            } catch (error) {
                !error.isCancel && showSnackbarNotification(error.message, 5000);
            }
        })();
        return (): void => requestCancellor && requestCancellor();
    }, [project, triggerFilterValuesRefresh]);

    useEffect(() => {
        let requestCancellor: Canceler;

        (async (): Promise<void> => {
            try {
                const tagFunctionResp = await apiClient.getTagFunctionFilters(project.name, (cancel: Canceler) => requestCancellor = cancel);
                const tagFunctions: CheckboxFilterValue[] = [];
                tagFunctionResp.map((item) => {
                    tagFunctions.push({ id: item.code, title: item.code });
                });
                setTagFunctions(tagFunctions);
            } catch (error) {
                !error.isCancel && showSnackbarNotification(error.message, 5000);
            }
        })();
        return (): void => requestCancellor && requestCancellor();
    }, [project, triggerFilterValuesRefresh]);

    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                const disciplineResp = await apiClient.getDisciplineFilters(project.name, (cancel: Canceler) => requestCancellor = cancel);
                const disciplines: CheckboxFilterValue[] = [];
                disciplineResp.map((item) => {
                    disciplines.push({ id: item.code, title: item.description ? item.description : item.code });
                });
                setDisciplines(disciplines);
            } catch (error) {
                !error.isCancel && showSnackbarNotification(error.message, 5000);
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, [project, triggerFilterValuesRefresh]);


    const triggerScopeListUpdate = (): void => {
        setTagListFilter(localTagListFilter);
    };

    const resetFilter = (): void => {
        const newTagListFilter = clearTagListFilter;
        setLocalTagListFilter(newTagListFilter);
        setTagListFilter(newTagListFilter);
    };

    useEffect(() => {
        // On project change - reset filters (triggers scope list update when filters were active)
        if (projectNameRef.current !== project.name) {
            resetFilter();
        }

        projectNameRef.current = project.name;
    }, [project]);

    const onCheckboxFilterChange = (tagListFilterParam: TagListFilterParamType, id: string, checked: boolean): void => {
        const newTagListFilter: TagListFilter = { ...localTagListFilter };
        if (checked) {
            newTagListFilter[tagListFilterParam] = [...localTagListFilter[tagListFilterParam], id];
        } else {
            newTagListFilter[tagListFilterParam] = [...localTagListFilter[tagListFilterParam].filter(item => item != id)];
        }
        setLocalTagListFilter(newTagListFilter);
    };

    const onPreservationStatusFilterChanged = (value: string): void => {
        const filter = value === 'no-filter' ? null : value;
        setLocalTagListFilter((old): TagListFilter => { return { ...old, preservationStatus: filter }; });
    };

    const onActionStatusFilterChanged = (value: string): void => {
        const filter = value === 'no-filter' ? null : value;
        setLocalTagListFilter((old): TagListFilter => { return { ...old, actionStatus: filter }; });
    };

    const onVoidedFilterChanged = (value: string): void => {
        setLocalTagListFilter((old): TagListFilter => { return { ...old, voidedFilter: value }; });
    };

    const responsibleFilterUpdated = (values: { id: string; title: string }[]): void => {
        setLocalTagListFilter((old): TagListFilter => { return { ...old, responsibleIds: values.map(itm => String(itm.id)) }; });
    };

    const areaFilterUpdated = (values: { id: string; title: string }[]): void => {
        setLocalTagListFilter((old): TagListFilter => { return { ...old, areaCodes: values.map(itm => String(itm.id)) }; });
    };

    //Handle changes in text field filters
    useEffect(() => {
        if (isFirstRender.current) return;

        const handleUpdate = async (): Promise<void> => {
            triggerScopeListUpdate();
            const activeFilters = Object.values(localTagListFilter).filter(v => v && JSON.stringify(v) != JSON.stringify([]));
            setFilterActive(activeFilters.length > 0);
        };

        const timer = setTimeout(() => {
            handleUpdate();
        }, 1000);

        return (): void => {
            clearTimeout(timer);
        };
    }, [localTagListFilter.tagNoStartsWith, localTagListFilter.callOffStartsWith, localTagListFilter.commPkgNoStartsWith, localTagListFilter.mcPkgNoStartsWith, localTagListFilter.purchaseOrderNoStartsWith, localTagListFilter.storageAreaStartsWith]);

    //Handle changes in all filters except text field filters
    useEffect((): void => {
        if (isFirstRender.current) return;
        triggerScopeListUpdate();
        const activeFilters = Object.values(localTagListFilter).filter(v => v && JSON.stringify(v) != JSON.stringify([]));
        setFilterActive(activeFilters.length > 0);
    }, [localTagListFilter.modeIds, localTagListFilter.actionStatus, localTagListFilter.areaCodes, localTagListFilter.disciplineCodes, localTagListFilter.dueFilters, localTagListFilter.journeyIds, localTagListFilter.preservationStatus, localTagListFilter.requirementTypeIds, localTagListFilter.responsibleIds, localTagListFilter.tagFunctionCodes, localTagListFilter.voidedFilter]);

    useEffect(() => {
        isFirstRender.current = false;
        const activeFilters = Object.values(localTagListFilter).filter(v => v && JSON.stringify(v) != JSON.stringify([]));
        setFilterActive(activeFilters.length > 0);
    }, []);

    const checkSearchFilter = (): boolean => {
        if (!localTagListFilter.tagNoStartsWith && !localTagListFilter.purchaseOrderNoStartsWith && !localTagListFilter.commPkgNoStartsWith && !localTagListFilter.mcPkgNoStartsWith && !localTagListFilter.storageAreaStartsWith) {
            return false;
        }
        return true;
    };

    return (
        <Container>
            <Header filterActive={filterActive}>
                <Typography variant="h1">Filter</Typography>
                <div style={{ display: 'flex' }}>
                    <Button variant='ghost' title='Export filtered tags to Excel' onClick={exportTagsToExcel}>
                        {ExcelIcon}
                    </Button>
                    <Popover 
                        placement="bottomRight"
                        id={'savedFilter-popover'}
                        onClose={(): void => setShowSavedFilters(false)}
                        open={showSavedFilters}
                    >
                        <PopoverAnchor>
                            <Button variant='ghost' title='Open saved filters' onClick={(event: any): void => {
                                setShowSavedFilters(!showSavedFilters);
                            }}>
                                <SavedFiltersIcon />
                            </Button>
                        </PopoverAnchor>
                        <SavedFilters
                            savedTagListFilters={savedTagListFilters}
                            refreshSavedTagListFilters={refreshSavedTagListFilters}
                            tagListFilter={tagListFilter}
                            selectedSavedFilterTitle={selectedSavedFilterTitle}
                            setSelectedSavedFilterTitle={setSelectedSavedFilterTitle}
                            setTagListFilter={setLocalTagListFilter}
                            onCloseRequest={(): void => setShowSavedFilters(false)} />
                    </Popover>
                    
                    <Button variant='ghost' title='Close' onClick={(): void => { onCloseRequest(); }}>
                        <CloseIcon />
                    </Button>
                </div>
            </Header>
            <Section>
                <Typography variant='caption'>{filterActive ? `Filter result ${numberOfTags} items` : 'No active filters'}</Typography>
                <Link onClick={(e): void => filterActive ? resetFilter() : e.preventDefault()} filterActive={filterActive}>
                    <Typography variant='caption'>Reset filter</Typography>
                </Link>
            </Section>
            <Collapse isExpanded={searchIsExpanded} onClick={(): void => setSearchIsExpanded(!searchIsExpanded)} filterActive={checkSearchFilter()}>
                <EdsIcon name='search' />
                <CollapseInfo>
                    Search
                </CollapseInfo>
                {
                    searchIsExpanded
                        ? <KeyboardArrowUpIcon />
                        : <KeyboardArrowDownIcon />
                }
            </Collapse>
            {
                searchIsExpanded && (
                    <>
                        <Section>
                            <TextField
                                id="tagNoSearch"
                                onChange={(e: any): void => {
                                    setLocalTagListFilter({ ...localTagListFilter, tagNoStartsWith: e.target.value });
                                }}
                                value={localTagListFilter.tagNoStartsWith || ''}
                                placeholder="Search tag number"
                                onKeyDown={(e: any): void => {
                                    e.keyCode === KEYCODE_ENTER && triggerScopeListUpdate();
                                }}
                            />
                        </Section>
                        <Section>
                            <TextField
                                id="poNoSearch"
                                placeholder="Search purchase order number"
                                onChange={(e: any): void => {
                                    setLocalTagListFilter({ ...localTagListFilter, purchaseOrderNoStartsWith: e.target.value });
                                }}
                                disabled={!!purchaseOrderNumber}
                                value={localTagListFilter.purchaseOrderNoStartsWith || ''}
                                onKeyDown={(e: any): void => {
                                    e.keyCode === KEYCODE_ENTER && triggerScopeListUpdate();
                                }}
                            />
                        </Section>
                        <Section>
                            <TextField
                                id="callOffNoSearch"
                                placeholder="Search call off number"
                                disabled={purchaseOrderNumber.includes('/')}
                                onChange={(e: any): void => {
                                    setLocalTagListFilter({ ...localTagListFilter, callOffStartsWith: e.target.value });
                                }}
                                value={localTagListFilter.callOffStartsWith || ''}
                                onKeyDown={(e: any): void => {
                                    e.keyCode === KEYCODE_ENTER && triggerScopeListUpdate();
                                }}
                            />
                        </Section>
                        <Section>
                            <TextField
                                id="commPgkNoSearch"
                                placeholder="Search comm. pkg. number"
                                onChange={(e: any): void => {
                                    setLocalTagListFilter({ ...localTagListFilter, commPkgNoStartsWith: e.target.value });
                                }}
                                value={localTagListFilter.commPkgNoStartsWith || ''}
                                onKeyDown={(e: any): void => {
                                    e.keyCode === KEYCODE_ENTER && triggerScopeListUpdate();
                                }}
                            />
                        </Section>
                        <Section>
                            <TextField
                                id="mcPgkNoSearch"
                                placeholder="Search mc. pkg. number"
                                onChange={(e: any): void => {
                                    setLocalTagListFilter({ ...localTagListFilter, mcPkgNoStartsWith: e.target.value });
                                }}
                                value={localTagListFilter.mcPkgNoStartsWith || ''}
                                onKeyDown={(e: any): void => {
                                    e.keyCode === KEYCODE_ENTER && triggerScopeListUpdate();
                                }}
                            />
                        </Section>
                        <Section>
                            <TextField
                                id="storageAreaSearch"
                                placeholder="Search storage area"
                                onChange={(e: any): void => {
                                    setLocalTagListFilter({ ...localTagListFilter, storageAreaStartsWith: e.target.value });
                                }}
                                value={localTagListFilter.storageAreaStartsWith || ''}
                                onKeyDown={(e: any): void => {
                                    e.keyCode === KEYCODE_ENTER && triggerScopeListUpdate();
                                }}
                            />
                        </Section>
                    </>
                )
            }

            <RadioGroupFilter options={PRESERVATION_STATUS} onChange={onPreservationStatusFilterChanged} value={tagListFilter.preservationStatus} label="Preservation status" icon={'calendar_today'} />
            <RadioGroupFilter options={ACTION_STATUS} onChange={onActionStatusFilterChanged} value={tagListFilter.actionStatus} label="Preservation actions" icon={'notifications'} />
            <RadioGroupFilter options={VOIDED} onChange={onVoidedFilterChanged} value={tagListFilter.voidedFilter} label="Voided/unvoided tags" icon={'delete_forever'} />

            <CheckboxFilter title='Preservation due date' filterValues={dueDates} tagListFilterParam='dueFilters' onCheckboxFilterChange={onCheckboxFilterChange} itemsChecked={tagListFilter.dueFilters} icon={'alarm_on'} />
            <CheckboxFilter title='Preservation journeys' filterValues={journeys} tagListFilterParam='journeyIds' onCheckboxFilterChange={onCheckboxFilterChange} itemsChecked={tagListFilter.journeyIds} icon={'world'} />
            <CheckboxFilter title='Preservation modes' filterValues={modes} tagListFilterParam='modeIds' onCheckboxFilterChange={onCheckboxFilterChange} itemsChecked={tagListFilter.modeIds} icon={'place'} />
            <CheckboxFilter title='Requirements' filterValues={requirements} tagListFilterParam='requirementTypeIds' onCheckboxFilterChange={onCheckboxFilterChange} itemsChecked={tagListFilter.requirementTypeIds} icon={'pressure'} />
            <CheckboxFilter title='Tag functions' filterValues={tagFunctions} tagListFilterParam='tagFunctionCodes' onCheckboxFilterChange={onCheckboxFilterChange} itemsChecked={tagListFilter.tagFunctionCodes} icon={'vertical_split'} />
            <CheckboxFilter title='Discipline' filterValues={disciplines} tagListFilterParam='disciplineCodes' onCheckboxFilterChange={onCheckboxFilterChange} itemsChecked={tagListFilter.disciplineCodes} icon={'category'} />
            <MultiSelectFilter headerLabel="Responsible" items={responsibles} onChange={responsibleFilterUpdated} selectedItems={localTagListFilter.responsibleIds} inputLabel="Responsible" inputPlaceholder="Select responsible" icon={<EdsIcon name='person' />} />
            <MultiSelectFilter headerLabel="Area (on-site)" items={areas} onChange={areaFilterUpdated} selectedItems={localTagListFilter.areaCodes} inputLabel="Area" inputPlaceholder="Select area" icon={<AreaIcon />} />

        </Container >
    );
};

export default ScopeFilter;
