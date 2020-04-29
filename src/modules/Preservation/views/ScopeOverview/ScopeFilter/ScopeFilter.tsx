import React, { useState, useEffect, useRef } from 'react';
import { Container, Header, Collapse, CollapseInfo, Link, Section } from './ScopeFilter.style';
import CloseIcon from '@material-ui/icons/Close';
import { Button, TextField, Typography } from '@equinor/eds-core-react';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { TagListFilter } from '../types';
import { tokens } from '@equinor/eds-tokens';
import CheckboxFilter from './CheckboxFilter';
import { usePreservationContext } from '../../../context/PreservationContext';
import { Canceler } from 'axios';
import { showSnackbarNotification } from '../../../../../core/services/NotificationService';
import RadioGroupFilter from './RadioGroupFilter';

interface ScopeFilterProps {
    onCloseRequest: () => void;
    tagListFilter: TagListFilter;
    setTagListFilter: (filter: TagListFilter) => void;
}

export interface CheckboxFilterValue {
    id: string;
    title: string;
}

export type TagListFilterParamType = 'modeIds' | 'journeyIds' | 'dueFilters' | 'requirementTypeIds' | 'tagFunctionCodes' | 'disciplineCodes';

const dueDates: CheckboxFilterValue[] =
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
    value: 'None',
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
    value: 'None'
},
{
    title: 'Open',
    value: 'HasOpen'
},
{
    title: 'Closed',
    value: 'HasClosed'
},
{
    title: 'Overdue',
    value: 'HasOverDue'
}];

const ScopeFilter = ({
    onCloseRequest,
    tagListFilter,
    setTagListFilter,
}: ScopeFilterProps): JSX.Element => {

    const [searchIsExpanded, setSearchIsExpanded] = useState<boolean>(false);
    const [localTagListFilter, setLocalTagListFilter] = useState<TagListFilter>({ ...tagListFilter });

    const [modes, setModes] = useState<CheckboxFilterValue[]>([]);
    const [journeys, setJourneys] = useState<CheckboxFilterValue[]>([]);
    const [requirements, setRequirements] = useState<CheckboxFilterValue[]>([]);
    const [tagFunctions, setTagFunctions] = useState<CheckboxFilterValue[]>([]);
    const [disciplines, setDisciplines] = useState<CheckboxFilterValue[]>([]);
    const containerRef = useRef<HTMLDivElement | null>(null);

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
        const newTagListFilter: TagListFilter = { tagNoStartsWith: null, commPkgNoStartsWith: null, mcPkgNoStartsWith: null, purchaseOrderNoStartsWith: null, storageAreaStartsWith: null, preservationStatus: null, actionStatus: null, journeyIds: [], modeIds: [], dueFilters: [], requirementTypeIds: [], tagFunctionCodes: [], disciplineCodes: [] };
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
        const filter = value === 'None' ? null : value;
        setLocalTagListFilter((old): TagListFilter => { return { ...old, preservationStatus: filter }; });
    };

    const onActionStatusFilterChanged = (value: string): void => {
        setLocalTagListFilter((old): TagListFilter => { return { ...old, actionStatus: value }; });
    };

    useEffect((): void => {
        console.log('ContainerRef: ', containerRef);
        triggerScopeListUpdate();
    }, [
        localTagListFilter.preservationStatus, localTagListFilter.actionStatus, localTagListFilter.dueFilters, localTagListFilter.journeyIds, localTagListFilter.modeIds,
        localTagListFilter.requirementTypeIds, localTagListFilter.disciplineCodes, localTagListFilter.tagFunctionCodes
    ]);

    return (
        <Container ref={containerRef}>
            <Header>
                <h1>Filter</h1>

                <Button variant='ghost' title='Close' onClick={(): void => { onCloseRequest(); }}>
                    <CloseIcon />
                </Button>
            </Header>
            <Section>
                <Link onClick={(): void => resetFilter()}>
                    <Typography style={{ color: tokens.colors.interactive.primary__resting.rgba }} variant='caption'>Reset filter</Typography>
                </Link>
            </Section>
            <Collapse isExpanded={searchIsExpanded} onClick={(): void => setSearchIsExpanded(!searchIsExpanded)}>
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

            <RadioGroupFilter options={PRESERVATION_STATUS} onChange={onPreservationStatusFilterChanged} value={tagListFilter.preservationStatus} label="Preservation status" />
            <RadioGroupFilter options={ACTION_STATUS} onChange={onActionStatusFilterChanged} value={tagListFilter.actionStatus} label="Preservation actions" />

            <CheckboxFilter title='Preservation Due Date' filterValues={dueDates} tagListFilterParam='dueFilters' onCheckboxFilterChange={onCheckboxFilterChange} itemsChecked={tagListFilter.dueFilters} />
            <CheckboxFilter title='Preserved Journeys' filterValues={journeys} tagListFilterParam='journeyIds' onCheckboxFilterChange={onCheckboxFilterChange} itemsChecked={tagListFilter.journeyIds} />
            <CheckboxFilter title='Preserved Modes' filterValues={modes} tagListFilterParam='modeIds' onCheckboxFilterChange={onCheckboxFilterChange} itemsChecked={tagListFilter.modeIds} />
            <CheckboxFilter title='Requirements' filterValues={requirements} tagListFilterParam='requirementTypeIds' onCheckboxFilterChange={onCheckboxFilterChange} itemsChecked={tagListFilter.requirementTypeIds} />
            <CheckboxFilter title='Tag Functions' filterValues={tagFunctions} tagListFilterParam='tagFunctionCodes' onCheckboxFilterChange={onCheckboxFilterChange} itemsChecked={tagListFilter.tagFunctionCodes} />
            <CheckboxFilter title='Discipline' filterValues={disciplines} tagListFilterParam='disciplineCodes' onCheckboxFilterChange={onCheckboxFilterChange} itemsChecked={tagListFilter.disciplineCodes} />

        </Container >
    );
};

export default ScopeFilter;
