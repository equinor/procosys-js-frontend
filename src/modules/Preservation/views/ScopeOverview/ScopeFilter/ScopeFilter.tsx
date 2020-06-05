import React, { useState, useEffect, useRef } from 'react';
import { Container, Header, Collapse, CollapseInfo, Link, Section } from './ScopeFilter.style';
import CloseIcon from '@material-ui/icons/Close';
import { Button, TextField, Typography } from '@equinor/eds-core-react';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { TagListFilter } from '../types';
import CheckboxFilter from './CheckboxFilter';
import { usePreservationContext } from '../../../context/PreservationContext';
import { Canceler } from 'axios';
import { showSnackbarNotification } from '../../../../../core/services/NotificationService';
import RadioGroupFilter from './RadioGroupFilter';
import MultiSelectFilter from './MultiSelectFilter/MultiSelectFilter';
import EdsIcon from '@procosys/components/EdsIcon';
import AreaIcon from '@procosys/assets/icons/Area';

interface ScopeFilterProps {
    onCloseRequest: () => void;
    tagListFilter: TagListFilter;
    setTagListFilter: (filter: TagListFilter) => void;
    setNumberOfFilters: (activeFilters: number) => void;
    numberOfTags: number | undefined;
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
            title: 'This Week',
        },
        {
            id: 'NextWeek',
            title: 'Next Week',
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

const clearTagListFilter: TagListFilter = {
    tagNoStartsWith: null,
    commPkgNoStartsWith: null,
    mcPkgNoStartsWith: null,
    purchaseOrderNoStartsWith: null,
    storageAreaStartsWith: null,
    preservationStatus: null,
    actionStatus: null,
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
    setNumberOfFilters,
    numberOfTags
}: ScopeFilterProps): JSX.Element => {

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
    const [filterActive, setFilterActive] = useState<boolean>(false);

    const KEYCODE_ENTER = 13;

    const {
        project,
        apiClient,
    } = usePreservationContext();

    useEffect(() => {
        let requestCancellor: Canceler;

        (async (): Promise<void> => {
            try {
                const journeys = await apiClient.getJourneyFilters(project.name, (cancel: Canceler) => requestCancellor = cancel);
                setJourneys(journeys);
            } catch (error) {
                showSnackbarNotification(error.message, 5000);
            }})();
        return (): void => requestCancellor && requestCancellor();
    },[]);

    useEffect(() => {
        let requestCancellor: Canceler;

        (async (): Promise<void> => {
            try {
                const response = await apiClient.getResponsiblesFilterForProject(project.name,(cancel: Canceler) => requestCancellor = cancel);
                setResponsibles(response.map(resp => {return {id: resp.id, title: resp.code};}));
            } catch (error) {
                showSnackbarNotification(error.message, 5000);
            }})();
        return (): void => requestCancellor && requestCancellor();
    },[]);

    useEffect(() => {
        let requestCancellor: Canceler;

        (async (): Promise<void> => {
            try {
                const response = await apiClient.getAreaFilterForProject(project.name,(cancel: Canceler) => requestCancellor = cancel);
                setAreas(response.map(resp => {return {id: resp.code, title: resp.code};}));
            } catch (error) {
                showSnackbarNotification(error.message, 5000);
            }})();
        return (): void => requestCancellor && requestCancellor();
    },[]);

    useEffect(() => {
        let requestCancellor: Canceler;

        (async (): Promise<void> => {
            try {
                const modes = await apiClient.getModeFilters(project.name, (cancel: Canceler) => requestCancellor = cancel);
                setModes(modes);
            } catch (error) {
                showSnackbarNotification(error.message, 5000);
            }})();
        return (): void => requestCancellor && requestCancellor();
    },[]);

    useEffect(() => {
        let requestCancellor: Canceler;

        (async (): Promise<void> => {
            try {
                const requirements = await apiClient.getRequirementTypeFilters(project.name, (cancel: Canceler) => requestCancellor = cancel);
                setRequirements(requirements);
            } catch (error) {
                showSnackbarNotification(error.message, 5000);
            }})();
        return (): void => requestCancellor && requestCancellor();
    },[]);

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
                showSnackbarNotification(error.message, 5000);
            }})();
        return (): void => requestCancellor && requestCancellor();
    },[]);

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
                showSnackbarNotification(error.message, 5000);
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, []);


    const triggerScopeListUpdate = (): void => {
        setTagListFilter(localTagListFilter);
    };

    const resetFilter = (): void => {
        const newTagListFilter = clearTagListFilter;
        setLocalTagListFilter(newTagListFilter);
        setTagListFilter(newTagListFilter);
    };

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

    const responsibleFilterUpdated = (values: {id: string; title: string}[]): void => {
        setLocalTagListFilter((old): TagListFilter => {return {...old, responsibleIds: values.map(itm => itm.id)};});
    };

    const areaFilterUpdated = (values: {id: string; title: string}[]): void => {
        setLocalTagListFilter((old): TagListFilter => {return {...old, areaCodes: values.map(itm => itm.id)};});
    };

    useEffect((): void => {
        if (isFirstRender.current) return;
        triggerScopeListUpdate();
        const activeFilters = Object.values(localTagListFilter).filter(v => v && JSON.stringify(v) != JSON.stringify([]));
        setFilterActive(activeFilters.length > 0);
        setNumberOfFilters(activeFilters.length);
    }, [localTagListFilter]);

    useEffect(() => {
        isFirstRender.current = false;
    },[]);

    const checkSearchFilter = (): boolean => {
        if(!localTagListFilter.tagNoStartsWith && !localTagListFilter.purchaseOrderNoStartsWith && !localTagListFilter.commPkgNoStartsWith && !localTagListFilter.mcPkgNoStartsWith && !localTagListFilter.storageAreaStartsWith) {
            return false;
        }
        return true;
    };

    return (
        <Container>
            <Header filterActive={filterActive}>
                <h1>Filter</h1>
                <Button variant='ghost' title='Close' onClick={(): void => { onCloseRequest(); }}>
                    <CloseIcon />
                </Button>
            </Header>
            <Section>
                <Typography variant='caption'>{filterActive ? `Filter result ${numberOfTags} items` : 'No active filters'}</Typography>
                <Link onClick={(e): void => filterActive ? resetFilter() : e.preventDefault() } filterActive={filterActive}>
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
                                value={localTagListFilter.purchaseOrderNoStartsWith || ''}
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

            <CheckboxFilter title='Preservation Due Date' filterValues={dueDates} tagListFilterParam='dueFilters' onCheckboxFilterChange={onCheckboxFilterChange} itemsChecked={tagListFilter.dueFilters} icon={'alarm_on'} />
            <CheckboxFilter title='Preserved Journeys' filterValues={journeys} tagListFilterParam='journeyIds' onCheckboxFilterChange={onCheckboxFilterChange} itemsChecked={tagListFilter.journeyIds} icon={'world'} />
            <CheckboxFilter title='Preserved Modes' filterValues={modes} tagListFilterParam='modeIds' onCheckboxFilterChange={onCheckboxFilterChange} itemsChecked={tagListFilter.modeIds} icon={'place'} />
            <CheckboxFilter title='Requirements' filterValues={requirements} tagListFilterParam='requirementTypeIds' onCheckboxFilterChange={onCheckboxFilterChange} itemsChecked={tagListFilter.requirementTypeIds} icon={'pressure'}/>
            <CheckboxFilter title='Tag Functions' filterValues={tagFunctions} tagListFilterParam='tagFunctionCodes' onCheckboxFilterChange={onCheckboxFilterChange} itemsChecked={tagListFilter.tagFunctionCodes} icon={'verticle_split'}/>
            <CheckboxFilter title='Discipline' filterValues={disciplines} tagListFilterParam='disciplineCodes' onCheckboxFilterChange={onCheckboxFilterChange} itemsChecked={tagListFilter.disciplineCodes} icon={'category'} />
            <MultiSelectFilter headerLabel="Responsible" items={responsibles} onChange={responsibleFilterUpdated} inputLabel="Responsible" inputPlaceholder="Select responsible" icon={<EdsIcon name='person' />} />
            <MultiSelectFilter headerLabel="Area (on-site)" items={areas} onChange={areaFilterUpdated} inputLabel="Area" inputPlaceholder="Select area" icon={<AreaIcon />}  />

        </Container >
    );
};

export default ScopeFilter;
