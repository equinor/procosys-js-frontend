import { Button, TextField, Typography } from '@equinor/eds-core-react';
import {
    Collapse,
    CollapseInfo,
    Container,
    Header,
    Link,
    Section,
} from './index.style';
import { IPOFilter, ProjectDetails, SavedIPOFilter } from '../types';
import React, { useEffect, useRef, useState } from 'react';

import CheckboxFilterWithDates from './CheckboxFilterWithDates/CheckboxFilterWithDates';
import EdsIcon from '@procosys/components/EdsIcon';
import { IpoStatusEnum } from '../../enums';
import SavedFilters from './SavedFilters';
import SelectFilter from './SelectFilter/SelectFilter';
import { SelectItem } from '@procosys/components/Select';
import { isValidDate } from '@procosys/core/services/DateService';
import {
    BookmarksOutlined,
    Close,
    KeyboardArrowDown,
    KeyboardArrowUp,
} from '@mui/icons-material';
import { Popover } from '@mui/material';
import { Progress } from '@equinor/eds-core-react';

const ExcelIcon = <EdsIcon name="microsoft_excel" size={16} />;

interface InvitationsFilterProps {
    project: ProjectDetails | undefined;
    onCloseRequest: () => void;
    filter: IPOFilter;
    setFilter: (filter: IPOFilter) => void;
    savedFilters: SavedIPOFilter[] | null;
    refreshSavedFilters: () => void;
    selectedSavedFilterTitle: string | null;
    setSelectedSavedFilterTitle: (savedFilterTitle: string | null) => void;
    roles: SelectItem[];
    numberOfIPOs: number | undefined;
    exportInvitationsToExcel: () => void;
}

interface FilterInput {
    id: string;
    title: string;
}

export interface CheckboxFilterValue {
    id: string;
    title: string;
}

export type filterParamType = 'ipoStatuses' | 'punchOutDates';

export type dateFilterParamType =
    | 'punchOutDateFromUtc'
    | 'punchOutDateToUtc'
    | 'lastChangedAtFromUtc'
    | 'lastChangedAtToUtc';

export type rolePersonParamType = 'personOid' | 'functionalRoleCode';

const dueDates: FilterInput[] = [
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
];

const ipoStatuses: FilterInput[] = [
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
    },
    {
        id: IpoStatusEnum.SCOPEHANDEDOVER,
        title: 'Scope Handed Over',
    },
];

const punchOutDateFields: FilterInput[] = [
    {
        id: 'punchOutDateFromUtc',
        title: 'Punch out from',
    },
    {
        id: 'punchOutDateToUtc',
        title: 'Punch out to',
    },
];

const lastChangedDateFields: FilterInput[] = [
    {
        id: 'lastChangedAtFromUtc',
        title: 'Last changed from',
    },
    {
        id: 'lastChangedAtToUtc',
        title: 'Last changed to',
    },
];

const clearFilter: IPOFilter = {
    ipoStatuses: [],
    functionalRoleCode: '',
    personOid: '',
    ipoIdStartsWith: '',
    commPkgNoStartsWith: '',
    mcPkgNoStartsWith: '',
    titleStartsWith: '',
    punchOutDates: [],
};

const InvitationsFilter = ({
    project,
    onCloseRequest,
    filter,
    setFilter,
    savedFilters,
    refreshSavedFilters,
    selectedSavedFilterTitle,
    setSelectedSavedFilterTitle,
    numberOfIPOs,
    roles,
    exportInvitationsToExcel,
}: InvitationsFilterProps): JSX.Element => {
    const [searchIsExpanded, setSearchIsExpanded] = useState<boolean>(false);
    const [localFilter, setLocalFilter] = useState<IPOFilter>({ ...filter });

    const isFirstRender = useRef<boolean>(true);
    const [filterActive, setFilterActive] = useState<boolean>(false);
    const [showSavedFilters, setShowSavedFilters] = useState<boolean>(false);
    const [anchorElement, setAnchorElement] = React.useState(null);
    const [selectedFilterIndex, setSelectedFilterIndex] = useState<
        number | null
    >();
    const [isExporting, setIsExporting] = useState<boolean>(false);
    const { punchOutDateFromUtc, punchOutDateToUtc } = localFilter;

    const KEYCODE_ENTER = 13;

    const triggerIPOListUpdate = (): void => {
        setFilter(localFilter);
    };

    const resetFilter = (): void => {
        const newFilter = clearFilter;
        setLocalFilter(newFilter);
        setFilter(newFilter);
    };

    useEffect((): void => {
        setLocalFilter(filter);
    }, [filter]);

    useEffect((): void => {
        if (savedFilters && selectedSavedFilterTitle) {
            if (savedFilters.length != 0) {
                const filterIndex = savedFilters.findIndex(
                    (filter) => filter.title == selectedSavedFilterTitle
                );
                setSelectedFilterIndex(filterIndex);
                if (
                    JSON.stringify(localFilter) !=
                    savedFilters[filterIndex]?.criteria
                ) {
                    setSelectedSavedFilterTitle(null);
                    setSelectedFilterIndex(null);
                }
            } else {
                setSelectedSavedFilterTitle(null);
                setSelectedFilterIndex(null);
            }
        } else {
            setSelectedSavedFilterTitle(null);
            setSelectedFilterIndex(null);
        }
    }, [savedFilters, localFilter]);

    const onCheckboxFilterChange = (
        filterParam: filterParamType,
        id: string,
        checked: boolean
    ): void => {
        const newIPOFilter: IPOFilter = { ...localFilter };
        if (checked) {
            newIPOFilter[filterParam] = [...localFilter[filterParam], id];
        } else {
            newIPOFilter[filterParam] = [
                ...localFilter[filterParam].filter((item) => item != id),
            ];
        }
        setLocalFilter(newIPOFilter);
    };

    const onDateChange = (
        filterParam: dateFilterParamType,
        value: string
    ): void => {
        const date = new Date(value);

        const newIPOFilter: IPOFilter = { ...localFilter };
        newIPOFilter[filterParam] = isValidDate(date) ? date : undefined;
        setLocalFilter(newIPOFilter);
    };

    const onRolePersonChange = (
        filterParam: rolePersonParamType,
        value: string
    ): void => {
        const newIPOFilter: IPOFilter = { ...localFilter };
        newIPOFilter[filterParam] = value;
        setLocalFilter(newIPOFilter);
    };

    //Handle changes in text field filters
    useEffect(() => {
        if (isFirstRender.current) return;

        const handleUpdate = async (): Promise<void> => {
            triggerIPOListUpdate();
            const activeFilters = Object.values(localFilter).filter(
                (v) => v && JSON.stringify(v) != JSON.stringify([])
            );
            setFilterActive(activeFilters.length > 0);
        };

        const timer = setTimeout(() => {
            handleUpdate();
        }, 1000);

        return (): void => {
            clearTimeout(timer);
        };
    }, [
        localFilter.titleStartsWith,
        localFilter.commPkgNoStartsWith,
        localFilter.ipoIdStartsWith,
        localFilter.mcPkgNoStartsWith,
    ]);

    //Handle changes in all filters except text field filters
    useEffect((): void => {
        if (isFirstRender.current) return;
        triggerIPOListUpdate();
        const activeFilters = Object.values(localFilter).filter(
            (v) => v && JSON.stringify(v) != JSON.stringify([])
        );
        setFilterActive(activeFilters.length > 0);
    }, [
        localFilter.functionalRoleCode,
        localFilter.ipoStatuses,
        localFilter.lastChangedAtFromUtc,
        localFilter.lastChangedAtToUtc,
        localFilter.punchOutDateFromUtc,
        localFilter.punchOutDateToUtc,
        localFilter.punchOutDates,
        localFilter.personOid,
    ]);

    useEffect(() => {
        isFirstRender.current = false;
        const activeFilters = Object.values(localFilter).filter(
            (v) => v && JSON.stringify(v) != JSON.stringify([])
        );
        setFilterActive(activeFilters.length > 0);
    }, []);

    const checkSearchFilter = (): boolean => {
        if (
            !localFilter.ipoIdStartsWith &&
            !localFilter.titleStartsWith &&
            !localFilter.commPkgNoStartsWith &&
            !localFilter.mcPkgNoStartsWith
        ) {
            return false;
        }
        return true;
    };

    const handleExportToExcel = async () => {
        setIsExporting(true);
        try {
            await exportInvitationsToExcel();
        } catch (error) {
            console.error('Error exporting IPOs:', error);
        } finally {
            setIsExporting(false);
        }
    };

    const isButtonDisabled = () => {
        if (punchOutDateFromUtc && !punchOutDateToUtc) {
            return true;
        }
        if (punchOutDateFromUtc && punchOutDateToUtc) {
            return new Date(punchOutDateFromUtc) > new Date(punchOutDateToUtc);
        }
        return false;
    };

    return (
        <Container>
            <Header filterActive={filterActive}>
                <Typography variant="h1">Filter</Typography>
                <div style={{ display: 'flex' }}>
                    <Button
                        variant="ghost"
                        title="Export filtered IPOs to Excel"
                        onClick={handleExportToExcel}
                        disabled={isExporting || isButtonDisabled()}
                        aria-disabled={
                            isExporting || isButtonDisabled() ? true : false
                        }
                        aria-label={isExporting ? 'loading data' : null}
                    >
                        {isExporting ? (
                            <Progress.Circular size={16} color="primary" />
                        ) : (
                            ExcelIcon
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        title="Open saved filters"
                        onClick={(event: any): void => {
                            showSavedFilters
                                ? setShowSavedFilters(false)
                                : setShowSavedFilters(true);
                            setAnchorElement(event.currentTarget);
                        }}
                    >
                        <BookmarksOutlined />
                    </Button>
                    <Button
                        variant="ghost"
                        title="Close"
                        onClick={(): void => {
                            onCloseRequest();
                        }}
                    >
                        <Close />
                    </Button>
                </div>
            </Header>
            <Popover
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
                    project={project}
                    savedIPOFilters={savedFilters}
                    refreshSavedIPOFilters={refreshSavedFilters}
                    ipoFilter={filter}
                    selectedSavedFilterTitle={selectedSavedFilterTitle}
                    setSelectedSavedFilterTitle={setSelectedSavedFilterTitle}
                    setIPOFilter={setLocalFilter}
                    onCloseRequest={(): void => setShowSavedFilters(false)}
                    selectedFilterIndex={selectedFilterIndex}
                    setSelectedFilterIndex={setSelectedFilterIndex}
                />
            </Popover>
            <Section>
                <Typography variant="caption">
                    {filterActive
                        ? `Filter result ${numberOfIPOs} items`
                        : 'No active filters'}
                </Typography>
                <Link
                    onClick={(e): void =>
                        filterActive ? resetFilter() : e.preventDefault()
                    }
                    filterActive={filterActive}
                >
                    <Typography variant="caption">Reset filter</Typography>
                </Link>
            </Section>
            <Collapse
                data-testid={'search-fields'}
                isExpanded={searchIsExpanded}
                onClick={(): void => setSearchIsExpanded(!searchIsExpanded)}
                filterActive={checkSearchFilter()}
            >
                <EdsIcon name="search" />
                <CollapseInfo>Search</CollapseInfo>
                {searchIsExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </Collapse>
            {searchIsExpanded && (
                <>
                    <Section>
                        <TextField
                            id="ipoIdSearch"
                            onChange={(e: any): void => {
                                setLocalFilter({
                                    ...localFilter,
                                    ipoIdStartsWith: e.target.value,
                                });
                            }}
                            value={localFilter.ipoIdStartsWith || ''}
                            placeholder="Search IPO number"
                            onKeyDown={(e: any): void => {
                                e.keyCode === KEYCODE_ENTER &&
                                    triggerIPOListUpdate();
                            }}
                        />
                    </Section>
                    <Section>
                        <TextField
                            id="ipoTitleSearch"
                            placeholder="Search IPO title"
                            onChange={(e: any): void => {
                                setLocalFilter({
                                    ...localFilter,
                                    titleStartsWith: e.target.value,
                                });
                            }}
                            value={localFilter.titleStartsWith || ''}
                            onKeyDown={(e: any): void => {
                                e.keyCode === KEYCODE_ENTER &&
                                    triggerIPOListUpdate();
                            }}
                        />
                    </Section>
                    <Section>
                        <TextField
                            id="commPkgNoSearch"
                            placeholder="Search comm pkg"
                            onChange={(e: any): void => {
                                setLocalFilter({
                                    ...localFilter,
                                    commPkgNoStartsWith: e.target.value,
                                });
                            }}
                            value={localFilter.commPkgNoStartsWith || ''}
                            onKeyDown={(e: any): void => {
                                e.keyCode === KEYCODE_ENTER &&
                                    triggerIPOListUpdate();
                            }}
                        />
                    </Section>
                    <Section>
                        <TextField
                            id="mcPgkNoSearch"
                            placeholder="Search mc pkg"
                            onChange={(e: any): void => {
                                setLocalFilter({
                                    ...localFilter,
                                    mcPkgNoStartsWith: e.target.value,
                                });
                            }}
                            value={localFilter.mcPkgNoStartsWith || ''}
                            onKeyDown={(e: any): void => {
                                e.keyCode === KEYCODE_ENTER &&
                                    triggerIPOListUpdate();
                            }}
                        />
                    </Section>
                </>
            )}

            <CheckboxFilterWithDates
                title="Punch-out date"
                filterValues={dueDates}
                filterParam="punchOutDates"
                dateFields={punchOutDateFields}
                dateValues={[
                    localFilter.punchOutDateFromUtc,
                    localFilter.punchOutDateToUtc,
                ]}
                onDateChange={onDateChange}
                onCheckboxFilterChange={onCheckboxFilterChange}
                itemsChecked={[
                    ...filter.punchOutDates,
                    filter.punchOutDateFromUtc,
                    filter.punchOutDateToUtc,
                ]}
                icon={'alarm_on'}
            />
            <CheckboxFilterWithDates
                title="Current IPO status"
                filterValues={ipoStatuses}
                filterParam="ipoStatuses"
                dateFields={lastChangedDateFields}
                dateValues={[
                    localFilter.lastChangedAtFromUtc,
                    localFilter.lastChangedAtToUtc,
                ]}
                onDateChange={onDateChange}
                onCheckboxFilterChange={onCheckboxFilterChange}
                itemsChecked={[
                    ...filter.ipoStatuses,
                    filter.lastChangedAtFromUtc,
                    filter.lastChangedAtToUtc,
                ]}
                icon={'world'}
            />
            <SelectFilter
                headerLabel="Roles and persons"
                onChange={onRolePersonChange}
                selectedItems={[
                    localFilter.functionalRoleCode,
                    localFilter.personOid,
                ]}
                roles={roles}
                icon={<EdsIcon name="person" />}
            />
        </Container>
    );
};

export default InvitationsFilter;
