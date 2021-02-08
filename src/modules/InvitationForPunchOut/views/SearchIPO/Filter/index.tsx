import { Button, TextField, Typography } from '@equinor/eds-core-react';
import { Collapse, CollapseInfo, Container, Header, Link, Section } from './index.style';
import { IPOFilter, ProjectDetails } from '../types';
import React, { useEffect, useRef, useState } from 'react';

// import AreaIcon from '@procosys/assets/icons/Area';
// import { Canceler } from 'axios';
import CheckboxFilterWithDates from './CheckboxFilterWithDates';
import CloseIcon from '@material-ui/icons/Close';
import EdsIcon from '@procosys/components/EdsIcon';
import { IpoStatusEnum } from '../../enums';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import SelectFilter from './SelectFilter';

// import Popover from '@material-ui/core/Popover';
// import RadioGroupFilter from './RadioGroupFilter';
// import SavedFilters from './SavedFilters';
// import SavedFiltersIcon from '@material-ui/icons/BookmarksOutlined';
// import { showSnackbarNotification } from '../../../../../core/services/NotificationService';
// import { useInvitationForPunchOutContext } from '@procosys/modules/InvitationForPunchOut/context/InvitationForPunchOutContext';

// const ExcelIcon = <EdsIcon name='microsoft_excel' size={16} />;

interface InvitationsFilterProps {
    project: ProjectDetails | undefined;
    onCloseRequest: () => void;
    filter: IPOFilter;
    setFilter: (filter: IPOFilter) => void;
    // savedFilters: SavedIPOFilter[];
    // refreshSavedFilters: () => void;
    // selectedSavedFilterTitle: string | null;
    // setSelectedSavedFilterTitle: (savedFilterTitle: string | null) => void;
    numberOfIPOs: number | undefined;
    // exportIPOsToExcel: () => void;
    // triggerFilterValuesRefresh: number;
}

interface FilterInput {
    id: string;
    title: string;
}

export interface CheckboxFilterValue {
    id: string;
    title: string;
}

export type filterParamType = 
    'ipoStatuses' |
    'punchOutDates';

export type dateFilterParamType = 
    'punchOutDateFromUtc' |
    'punchOutDateToUtc' |
    'lastChangedAtFromUtc' |
    'lastChangedAtToUtc';

export type rolePersonParamType = 
    'personOid' |
    'functionalRoleCode';

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
            id: 'Custom',
            title: 'Custom',
        }
    ];

const ipoStatuses: FilterInput[] =
    [
        {
            id: IpoStatusEnum.CANCELED,
            title: 'Canceled',
        },
        {
            id: IpoStatusEnum.PLANNED,
            title: 'Planned',
        },
        {
            id: IpoStatusEnum.COMPLETED,
            title: 'Completed',
        },
        {
            id: IpoStatusEnum.ACCEPTED,
            title: 'Accepted',
        }
    ];

const punchOutDateFields: FilterInput[] =
    [
        {
            id: 'punchOutDateFromUtc',
            title: 'Punch out from',
        },
        {
            id: 'punchOutDateToUtc',
            title: 'Punch out to'
        }
    ];

const lastChangedDateFields: FilterInput[] =
    [
        {
            id: 'lastChangedAtFromUtc',
            title: 'Last changed from'
        },
        {
            id: 'lastChangedAtToUtc',
            title: 'Last changed to'
        }
    ];


// const ACTION_STATUS = [{
//     title: 'All',
//     value: 'no-filter',
//     default: true
// },
// {
//     title: 'Open actions',
//     value: 'HasOpen'
// },
// {
//     title: 'Closed actions',
//     value: 'HasClosed'
// },
// {
//     title: 'Overdue actions',
//     value: 'HasOverDue'
// }];

// const VOIDED = [{
//     title: 'All',
//     value: 'All',
// },
// {
//     title: 'Not voided (default)',
//     value: 'NotVoided',
//     default: true
// },
// {
//     title: 'Voided',
//     value: 'Voided'
// }];

const clearFilter: IPOFilter = {
    ipoStatuses: [],
    functionalRoleCode: '',
    personOid: '',
    ipoIdStartsWith: '',
    commPkgNoStartsWith: '',
    mcPkgNoStartsWith: '',
    titleStartsWith: '',
    punchOutDates: []
};

const InvitationsFilter = ({
    project,
    onCloseRequest,
    filter,
    setFilter,
    // savedFilters,
    // refreshSavedFilters,
    // selectedSavedFilterTitle,
    // setSelectedSavedFilterTitle,
    numberOfIPOs,
    // exportIPOsToExcel,
    // triggerFilterValuesRefresh
}: InvitationsFilterProps): JSX.Element => {


    const [searchIsExpanded, setSearchIsExpanded] = useState<boolean>(false);
    const [localFilter, setLocalFilter] = useState<IPOFilter>({ ...filter });

    // const [modes, setModes] = useState<CheckboxFilterValue[]>([]);
    // const [journeys, setJourneys] = useState<CheckboxFilterValue[]>([]);
    // const [requirements, setRequirements] = useState<CheckboxFilterValue[]>([]);
    // const [tagFunctions, setTagFunctions] = useState<CheckboxFilterValue[]>([]);
    // const [disciplines, setDisciplines] = useState<CheckboxFilterValue[]>([]);
    // const [responsibles, setResponsibles] = useState<FilterInput[]>([]);
    // const [areas, setAreas] = useState<FilterInput[]>([]);
    const isFirstRender = useRef<boolean>(true);
    const projectNameRef = useRef<string>(project ? project.name : '');
    const [filterActive, setFilterActive] = useState<boolean>(false);
    // const [showSavedFilters, setShowSavedFilters] = useState<boolean>(false);
    // const [anchorElement, setAnchorElement] = React.useState(null);

    // const { apiClient } = useInvitationForPunchOutContext();

    const KEYCODE_ENTER = 13;

    // useEffect(() => {
    //     let requestCancellor: Canceler;

    //     (async (): Promise<void> => {
    //         try {
    //             const journeys = await apiClient.getIPOFilters(project.name, (cancel: Canceler) => requestCancellor = cancel);
    //             setJourneys(journeys);
    //         } catch (error) {
    //             !error.isCancel && showSnackbarNotification(error.message, 5000);
    //         }
    //     })();
    //     return (): void => requestCancellor && requestCancellor();
    // }, [project, triggerFilterValuesRefresh]);

    // useEffect(() => {
    //     let requestCancellor: Canceler;

    //     (async (): Promise<void> => {
    //         try {
    //             const response = await apiClient.getResponsiblesFilterForProject(project.name, (cancel: Canceler) => requestCancellor = cancel);
    //             setResponsibles(response.map(resp => { return { id: resp.id, title: resp.code }; }));
    //         } catch (error) {
    //             !error.isCancel && showSnackbarNotification(error.message, 5000);
    //         }
    //     })();
    //     return (): void => requestCancellor && requestCancellor();
    // }, [project, triggerFilterValuesRefresh]);

    // useEffect(() => {
    //     let requestCancellor: Canceler;

    //     (async (): Promise<void> => {
    //         try {
    //             const response = await apiClient.getAreaFilterForProject(project.name, (cancel: Canceler) => requestCancellor = cancel);
    //             setAreas(response.map(resp => { return { id: resp.code, title: resp.code }; }));
    //         } catch (error) {
    //             !error.isCancel && showSnackbarNotification(error.message, 5000);
    //         }
    //     })();
    //     return (): void => requestCancellor && requestCancellor();
    // }, [project, triggerFilterValuesRefresh]);

    // useEffect(() => {
    //     let requestCancellor: Canceler;

    //     (async (): Promise<void> => {
    //         try {
    //             const modes = await apiClient.getModeFilters(project.name, (cancel: Canceler) => requestCancellor = cancel);
    //             setModes(modes);
    //         } catch (error) {
    //             !error.isCancel && showSnackbarNotification(error.message, 5000);
    //         }
    //     })();
    //     return (): void => requestCancellor && requestCancellor();
    // }, [project, triggerFilterValuesRefresh]);

    // useEffect(() => {
    //     let requestCancellor: Canceler;

    //     (async (): Promise<void> => {
    //         try {
    //             const requirements = await apiClient.getRequirementTypeFilters(project.name, (cancel: Canceler) => requestCancellor = cancel);
    //             setRequirements(requirements);
    //         } catch (error) {
    //             !error.isCancel && showSnackbarNotification(error.message, 5000);
    //         }
    //     })();
    //     return (): void => requestCancellor && requestCancellor();
    // }, [project, triggerFilterValuesRefresh]);

    // useEffect(() => {
    //     let requestCancellor: Canceler;

    //     (async (): Promise<void> => {
    //         try {
    //             const tagFunctionResp = await apiClient.getTagFunctionFilters(project.name, (cancel: Canceler) => requestCancellor = cancel);
    //             const tagFunctions: CheckboxFilterValue[] = [];
    //             tagFunctionResp.map((item) => {
    //                 tagFunctions.push({ id: item.code, title: item.code });
    //             });
    //             setTagFunctions(tagFunctions);
    //         } catch (error) {
    //             !error.isCancel && showSnackbarNotification(error.message, 5000);
    //         }
    //     })();
    //     return (): void => requestCancellor && requestCancellor();
    // }, [project, triggerFilterValuesRefresh]);

    // useEffect(() => {
    //     let requestCancellor: Canceler | null = null;
    //     (async (): Promise<void> => {
    //         try {
    //             const disciplineResp = await apiClient.getDisciplineFilters(project.name, (cancel: Canceler) => requestCancellor = cancel);
    //             const disciplines: CheckboxFilterValue[] = [];
    //             disciplineResp.map((item) => {
    //                 disciplines.push({ id: item.code, title: item.description ? item.description : item.code });
    //             });
    //             setDisciplines(disciplines);
    //         } catch (error) {
    //             !error.isCancel && showSnackbarNotification(error.message, 5000);
    //         }
    //     })();

    //     return (): void => {
    //         requestCancellor && requestCancellor();
    //     };
    // }, [project, triggerFilterValuesRefresh]);


    const triggerIPOListUpdate = (): void => {
        setFilter(localFilter);
    };

    const resetFilter = (): void => {
        const newFilter = clearFilter;
        setLocalFilter(newFilter);
        setFilter(newFilter);
    };

    useEffect(() => {
        // On project change - reset filters (triggers scope list update when filters were active)
        if (project) {
            if (projectNameRef.current !== project.name) {
                resetFilter();
            }

            projectNameRef.current = project.name;
        }
    }, [project]);

    // TODO: check these function to IPOFilter type

    const onCheckboxFilterChange = (filterParam: filterParamType, id: string, checked: boolean): void => {
        const newIPOFilter: IPOFilter = { ...localFilter };
        if (checked) {
            newIPOFilter[filterParam] = [...localFilter[filterParam], id];
        } else {
            newIPOFilter[filterParam] = [...localFilter[filterParam].filter(item => item != id)];
        }
        setLocalFilter(newIPOFilter);
    };

    const onDateChange = (filterParam: dateFilterParamType, value: Date): void => {
        const newIPOFilter: IPOFilter = { ...localFilter };
        newIPOFilter[filterParam] = value;
        setLocalFilter(newIPOFilter);
    };

    // const onPreservationStatusFilterChanged = (value: string): void => {
    //     const filter = value === 'no-filter' ? null : value;
    //     setLocalFilter((old): IPOFilter => { return { ...old, preservationStatus: filter }; });
    // };

    // const onActionStatusFilterChanged = (value: string): void => {
    //     const filter = value === 'no-filter' ? null : value;
    //     setLocalTagListFilter((old): TagListFilter => { return { ...old, actionStatus: filter }; });
    // };

    // const onVoidedFilterChanged = (value: string): void => {
    //     setLocalTagListFilter((old): TagListFilter => { return { ...old, voidedFilter: value }; });
    // };

    // const responsibleFilterUpdated = (values: { id: string; title: string }[]): void => {
    //     setLocalTagListFilter((old): TagListFilter => { return { ...old, responsibleIds: values.map(itm => String(itm.id)) }; });
    // };

    // const areaFilterUpdated = (values: { id: string; title: string }[]): void => {
    //     setLocalTagListFilter((old): TagListFilter => { return { ...old, areaCodes: values.map(itm => String(itm.id)) }; });
    // };
    const onRolePersonChange = (filterParam: rolePersonParamType, value: string): void => {
        const newIPOFilter: IPOFilter = { ...localFilter };
        newIPOFilter[filterParam] = value;
        setLocalFilter(newIPOFilter);
    };



    //Handle changes in text field filters
    useEffect(() => {
        if (isFirstRender.current) return;

        const handleUpdate = async (): Promise<void> => {
            triggerIPOListUpdate();
            const activeFilters = Object.values(localFilter).filter(v => v && JSON.stringify(v) != JSON.stringify([]));
            setFilterActive(activeFilters.length > 0);
        };

        const timer = setTimeout(() => {
            handleUpdate();
        }, 1000);

        return (): void => {
            clearTimeout(timer);
        };
    }, [localFilter.titleStartsWith, localFilter.commPkgNoStartsWith, localFilter.ipoIdStartsWith, localFilter.mcPkgNoStartsWith]);

    //Handle changes in all filters except text field filters
    useEffect((): void => {
        if (isFirstRender.current) return;
        triggerIPOListUpdate();
        const activeFilters = Object.values(localFilter).filter(v => v && JSON.stringify(v) != JSON.stringify([]));
        setFilterActive(activeFilters.length > 0);
    }, [localFilter.functionalRoleCode, localFilter.ipoStatuses, localFilter.lastChangedAtFromUtc, localFilter.lastChangedAtToUtc, localFilter.punchOutDateFromUtc, localFilter.punchOutDateToUtc, localFilter.punchOutDates, localFilter.personOid]);

    useEffect(() => {
        isFirstRender.current = false;
        const activeFilters = Object.values(localFilter).filter(v => v && JSON.stringify(v) != JSON.stringify([]));
        setFilterActive(activeFilters.length > 0);
    }, []);

    const checkSearchFilter = (): boolean => {
        if (!localFilter.ipoIdStartsWith && !localFilter.titleStartsWith && !localFilter.commPkgNoStartsWith && !localFilter.mcPkgNoStartsWith ) {
            return false;
        }
        return true;
    };

    return (
        <Container>
            <Header filterActive={filterActive}>
                <Typography variant="h1">Filter</Typography>
                <div style={{ display: 'flex' }}>
                    {/* <Button variant='ghost' title='Export filtered tags to Excel' onClick={exportIPOsToExcel}>
                        {ExcelIcon}
                    </Button>
                    <Button variant='ghost' title='Open saved filters' onClick={(event: any): void => {
                        showSavedFilters ? setShowSavedFilters(false) : setShowSavedFilters(true);
                        setAnchorElement(event.currentTarget);
                    }}>
                        <SavedFiltersIcon />
                    </Button> */}
                    <Button variant='ghost' title='Close' onClick={(): void => { onCloseRequest(); }}>
                        <CloseIcon />
                    </Button>
                </div>
            </Header>
            {/* <Popover
                id={'savedFilter-popover'}
                open={showSavedFilters}
                anchorEl={anchorElement}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                onClose={(): void => setShowSavedFilters(false)}
            >
                <SavedFilters
                    savedFilters={savedFilters}
                    refreshSavedFilters={refreshSavedFilters}
                    filter={filter}
                    selectedSavedFilterTitle={selectedSavedFilterTitle}
                    setSelectedSavedFilterTitle={setSelectedSavedFilterTitle}
                    setFilter={setLocalFilter}
                    onCloseRequest={(): void => setShowSavedFilters(false)} />
            </Popover > */}
            <Section>
                <Typography variant='caption'>{filterActive ? `Filter result ${numberOfIPOs} items` : 'No active filters'}</Typography>
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
                                id="ipoIdSearch"
                                onChange={(e: any): void => {
                                    setLocalFilter({ ...localFilter, ipoIdStartsWith: e.target.value });
                                }}
                                value={localFilter.ipoIdStartsWith || ''}
                                placeholder="Search IPO number"
                                onKeyDown={(e: any): void => {
                                    e.keyCode === KEYCODE_ENTER && triggerIPOListUpdate();
                                }}
                            />
                        </Section>
                        <Section>
                            <TextField
                                id="ipoTitleSearch"
                                placeholder="Search IPO title"
                                onChange={(e: any): void => {
                                    setLocalFilter({ ...localFilter, titleStartsWith: e.target.value });
                                }}
                                value={localFilter.titleStartsWith || ''}
                                onKeyDown={(e: any): void => {
                                    e.keyCode === KEYCODE_ENTER && triggerIPOListUpdate();
                                }}
                            />
                        </Section>
                        <Section>
                            <TextField
                                id="commPkgNoSearch"
                                placeholder="Search comm pkg"
                                onChange={(e: any): void => {
                                    setLocalFilter({ ...localFilter, commPkgNoStartsWith: e.target.value });
                                }}
                                value={localFilter.commPkgNoStartsWith || ''}
                                onKeyDown={(e: any): void => {
                                    e.keyCode === KEYCODE_ENTER && triggerIPOListUpdate();
                                }}
                            />
                        </Section>
                        <Section>
                            <TextField
                                id="mcPgkNoSearch"
                                placeholder="Search mc pkg"
                                onChange={(e: any): void => {
                                    setLocalFilter({ ...localFilter, mcPkgNoStartsWith: e.target.value });
                                }}
                                value={localFilter.mcPkgNoStartsWith || ''}
                                onKeyDown={(e: any): void => {
                                    e.keyCode === KEYCODE_ENTER && triggerIPOListUpdate();
                                }}
                            />
                        </Section>
                    </>
                )
            }


            <CheckboxFilterWithDates title='Punch out date' filterValues={dueDates} filterParam='punchOutDates' dateFields={punchOutDateFields} dateValues={[localFilter.punchOutDateFromUtc, localFilter.punchOutDateToUtc]} onDateChange={onDateChange} onCheckboxFilterChange={onCheckboxFilterChange} itemsChecked={filter.punchOutDates} icon={'alarm_on'} />
            <CheckboxFilterWithDates title='Current IPO status' filterValues={ipoStatuses} filterParam='ipoStatuses' dateFields={lastChangedDateFields} dateValues={[localFilter.lastChangedAtFromUtc, localFilter.lastChangedAtToUtc]} onDateChange={onDateChange} onCheckboxFilterChange={onCheckboxFilterChange} itemsChecked={filter.ipoStatuses} icon={'world'} />
            <SelectFilter headerLabel="Roles and persons"  onChange={onRolePersonChange} selectedItems={[localFilter.functionalRoleCode, localFilter.personOid]} icon={<EdsIcon name='person' />} />

        </Container >
    );
};

export default InvitationsFilter;

