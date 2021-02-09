import { Button, TextField, Typography } from '@equinor/eds-core-react';
import { Collapse, CollapseInfo, Container, Header, Link, Section } from './index.style';
import { IPOFilter, ProjectDetails } from '../types';
import React, { useEffect, useRef, useState } from 'react';

import CheckboxFilterWithDates from './CheckboxFilterWithDates';
import CloseIcon from '@material-ui/icons/Close';
import EdsIcon from '@procosys/components/EdsIcon';
import { IpoStatusEnum } from '../../enums';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import SelectFilter from './SelectFilter';
import { SelectItem } from '@procosys/components/Select';

interface InvitationsFilterProps {
    project: ProjectDetails | undefined;
    onCloseRequest: () => void;
    filter: IPOFilter;
    setFilter: (filter: IPOFilter) => void;
    roles: SelectItem[];
    numberOfIPOs: number | undefined;
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
    numberOfIPOs,
    roles,
}: InvitationsFilterProps): JSX.Element => {


    const [searchIsExpanded, setSearchIsExpanded] = useState<boolean>(false);
    const [localFilter, setLocalFilter] = useState<IPOFilter>({ ...filter });

    const isFirstRender = useRef<boolean>(true);
    const projectNameRef = useRef<string>(project ? project.name : '');
    const [filterActive, setFilterActive] = useState<boolean>(false);


    const KEYCODE_ENTER = 13;

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
                    <Button variant='ghost' title='Close' onClick={(): void => { onCloseRequest(); }}>
                        <CloseIcon />
                    </Button>
                </div>
            </Header>
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
            <SelectFilter headerLabel="Roles and persons"  onChange={onRolePersonChange} selectedItems={[localFilter.functionalRoleCode, localFilter.personOid]} roles={roles} icon={<EdsIcon name='person' />} />

        </Container >
    );
};

export default InvitationsFilter;

